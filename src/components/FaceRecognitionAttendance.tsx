"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Image from "next/image";

type Student = {
	id: string;
	name: string;
	surname: string;
	img: string | null;
};

type FaceRecognitionAttendanceProps = {
	students: Student[];
	classId: number;
	onAttendanceMarked: (studentIds: string[], date: Date) => void;
};

const FaceRecognitionAttendance = ({
	students,
	classId,
	onAttendanceMarked,
}: FaceRecognitionAttendanceProps) => {
	const [modelsLoaded, setModelsLoaded] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [detectedStudents, setDetectedStudents] = useState<Set<string>>(
		new Set()
	);
	const [persistedDetectedStudents, setPersistedDetectedStudents] = useState<
		Set<string>
	>(new Set());
	const [faceMatcher, setFaceMatcher] = useState<any>(null);
	const [error, setError] = useState<string>("");
	const [cameraActive, setCameraActive] = useState(false);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split("T")[0]
	);
	const [facingMode, setFacingMode] = useState<"user" | "environment">("user"); // user = front, environment = back
	const [autoSubmitTimer, setAutoSubmitTimer] = useState<NodeJS.Timeout | null>(
		null
	);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Load face-api.js models
	useEffect(() => {
		const loadModels = async () => {
			try {
				setLoadingProgress(10);
				const MODEL_URL = "/models"; // We'll need to add models to public folder

				await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
				setLoadingProgress(30);

				await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
				setLoadingProgress(50);

				await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
				setLoadingProgress(70);

				setModelsLoaded(true);
				setLoadingProgress(100);
			} catch (err) {
				console.error("Error loading models:", err);
				setError(
					"Failed to load face recognition models. Please refresh the page."
				);
			}
		};

		loadModels();
	}, []);

	// Load reference faces from student images
	useEffect(() => {
		if (!modelsLoaded) return;

		const loadReferenceFaces = async () => {
			try {
				const labeledDescriptors: any[] = [];

				for (const student of students) {
					if (!student.img) continue;

					try {
						// Load image from Cloudinary
						const img = await faceapi.fetchImage(student.img);

						// Detect face and compute descriptor
						const detection = await faceapi
							.detectSingleFace(img)
							.withFaceLandmarks()
							.withFaceDescriptor();

						if (detection) {
							labeledDescriptors.push(
								new faceapi.LabeledFaceDescriptors(student.id, [
									detection.descriptor,
								])
							);
						}
					} catch (err) {
						console.error(`Error loading face for ${student.name}:`, err);
					}
				}

				if (labeledDescriptors.length > 0) {
					const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
					setFaceMatcher(matcher);
				} else {
					setError(
						"No student faces could be loaded. Please ensure students have profile pictures."
					);
				}
			} catch (err) {
				console.error("Error creating face matcher:", err);
				setError("Failed to process student faces.");
			}
		};

		loadReferenceFaces();
	}, [modelsLoaded, students]);

	// Start webcam
	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: 720,
					height: 560,
					facingMode: facingMode,
				},
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				setCameraActive(true);
			}
		} catch (err) {
			console.error("Error accessing camera:", err);
			setError("Failed to access camera. Please grant camera permissions.");
		}
	};

	// Stop webcam
	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			videoRef.current.srcObject = null;
			setCameraActive(false);
		}
	};

	// Switch camera between front and back
	const switchCamera = async () => {
		// Stop current camera
		stopCamera();

		// Toggle facing mode
		const newFacingMode = facingMode === "user" ? "environment" : "user";
		setFacingMode(newFacingMode);

		// Restart camera with new facing mode
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: 720,
					height: 560,
					facingMode: newFacingMode,
				},
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				setCameraActive(true);
			}
		} catch (err) {
			console.error("Error switching camera:", err);
			setError("Failed to switch camera. Please try again.");
		}
	};

	// Detect faces in video stream
	const detectFaces = async () => {
		if (!videoRef.current || !canvasRef.current || !faceMatcher) return;

		setIsProcessing(true);

		const video = videoRef.current;
		const canvas = canvasRef.current;

		const displaySize = { width: video.width, height: video.height };
		faceapi.matchDimensions(canvas, displaySize);

		const detections = await faceapi
			.detectAllFaces(video)
			.withFaceLandmarks()
			.withFaceDescriptors();

		const resizedDetections = faceapi.resizeResults(detections, displaySize);

		// Clear previous drawings
		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		// Draw detections
		faceapi.draw.drawDetections(canvas, resizedDetections);

		// Match faces and mark attendance
		const newDetected = new Set(detectedStudents);
		const newlyDetectedStudents: string[] = [];

		resizedDetections.forEach((detection) => {
			const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

			if (bestMatch.label !== "unknown") {
				// Add to current detected set (for real-time display)
				newDetected.add(bestMatch.label);

				// Add to persisted set (permanent until manual removal or submit)
				if (!persistedDetectedStudents.has(bestMatch.label)) {
					newlyDetectedStudents.push(bestMatch.label);
				}

				// Draw label on canvas
				const box = detection.detection.box;
				const drawBox = new faceapi.draw.DrawBox(box, {
					label: getStudentName(bestMatch.label),
					boxColor: "green",
				});
				drawBox.draw(canvas);
			}
		});

		setDetectedStudents(newDetected);

		// Add newly detected students to persisted set
		if (newlyDetectedStudents.length > 0) {
			setPersistedDetectedStudents((prev) => {
				const updated = new Set(prev);
				newlyDetectedStudents.forEach((id) => updated.add(id));
				return updated;
			});

			// Clear any existing auto-submit timer
			if (autoSubmitTimer) {
				clearTimeout(autoSubmitTimer);
			}

			// Set new auto-submit timer (1 second after detection)
			const timer = setTimeout(() => {
				// Auto-submit if we have detected students
				const currentPersisted = new Set(persistedDetectedStudents);
				newlyDetectedStudents.forEach((id) => currentPersisted.add(id));

				if (currentPersisted.size > 0) {
					handleAutoSubmitAttendance(currentPersisted);
				}
			}, 1000);

			setAutoSubmitTimer(timer);
		}

		setIsProcessing(false);
	};

	// Get student name by ID
	const getStudentName = (studentId: string) => {
		const student = students.find((s) => s.id === studentId);
		return student ? `${student.name} ${student.surname}` : "Unknown";
	};

	// Handle continuous detection
	useEffect(() => {
		if (!cameraActive || !faceMatcher) return;

		const interval = setInterval(() => {
			detectFaces();
		}, 1000); // Detect every second

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cameraActive, faceMatcher]);

	// Submit attendance
	const handleSubmitAttendance = () => {
		const studentIds = Array.from(persistedDetectedStudents);
		const attendanceDate = new Date(selectedDate);
		onAttendanceMarked(studentIds, attendanceDate);
		stopCamera();
		// Clear persisted students after submission
		setPersistedDetectedStudents(new Set());
	};

	// Auto-submit attendance (called by timer)
	const handleAutoSubmitAttendance = (studentsSet: Set<string>) => {
		const studentIds = Array.from(studentsSet);
		const attendanceDate = new Date(selectedDate);
		onAttendanceMarked(studentIds, attendanceDate);
		stopCamera();
		// Clear persisted students after submission
		setPersistedDetectedStudents(new Set());
	};

	// Remove a student from detected list
	const removeDetectedStudent = (studentId: string) => {
		setPersistedDetectedStudents((prev) => {
			const updated = new Set(prev);
			updated.delete(studentId);
			return updated;
		});
	};

	// Clear all detected students
	const clearAllDetected = () => {
		setPersistedDetectedStudents(new Set());
		if (autoSubmitTimer) {
			clearTimeout(autoSubmitTimer);
			setAutoSubmitTimer(null);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold">Face Recognition Attendance</h2>
				{modelsLoaded && faceMatcher && (
					<span className="text-sm text-green-600">
						✓ {students.filter((s) => s.img).length} faces loaded
					</span>
				)}
			</div>

			{/* Date Selection */}
			<div className="bg-white p-4 rounded-lg border border-gray-200">
				<div className="flex items-center gap-4 flex-wrap">
					<div className="flex-1 min-w-[200px]">
						<label
							htmlFor="attendance-date"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Select Attendance Date
						</label>
						<input
							id="attendance-date"
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							max={new Date().toISOString().split("T")[0]}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaPurple"
						/>
					</div>
					<div className="flex items-end gap-2">
						<button
							onClick={() =>
								setSelectedDate(new Date().toISOString().split("T")[0])
							}
							className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
						>
							Today
						</button>
						<button
							onClick={() => {
								const yesterday = new Date();
								yesterday.setDate(yesterday.getDate() - 1);
								setSelectedDate(yesterday.toISOString().split("T")[0]);
							}}
							className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
						>
							Yesterday
						</button>
					</div>
				</div>
				<p className="text-xs text-gray-500 mt-2">
					📅 Marking attendance for:{" "}
					<span className="font-semibold text-gray-700">
						{new Date(selectedDate).toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</p>
			</div>

			{/* Loading Progress */}
			{!modelsLoaded && (
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-lamaPurple h-2 rounded-full transition-all duration-300"
						style={{ width: `${loadingProgress}%` }}
					/>
					<p className="text-sm text-gray-600 mt-2">
						Loading face recognition models... {loadingProgress}%
					</p>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}

			{/* Camera Controls */}
			{modelsLoaded && faceMatcher && (
				<div className="flex gap-2 flex-wrap">
					{!cameraActive ? (
						<button
							onClick={startCamera}
							className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
						>
							<span className="flex items-center gap-2">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
								Start Camera
							</span>
						</button>
					) : (
						<>
							<button
								onClick={stopCamera}
								className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
							>
								Stop Camera
							</button>
							<button
								onClick={switchCamera}
								className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
								title={`Switch to ${
									facingMode === "user" ? "back" : "front"
								} camera`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
								{facingMode === "user" ? "Switch to Back" : "Switch to Front"}
							</button>
						</>
					)}

					{persistedDetectedStudents.size > 0 && (
						<>
							<button
								onClick={handleSubmitAttendance}
								className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors font-semibold flex items-center gap-2"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Submit Attendance ({persistedDetectedStudents.size} students)
							</button>
							<button
								onClick={clearAllDetected}
								className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
								title="Clear all detected students"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
								Clear All
							</button>
						</>
					)}
				</div>
			)}

			{/* Video Feed */}
			<div className="relative bg-black rounded-lg overflow-hidden">
				<video
					ref={videoRef}
					autoPlay
					muted
					width="720"
					height="560"
					className="w-full h-auto"
					onLoadedMetadata={() => {
						if (videoRef.current) {
							videoRef.current.width = 720;
							videoRef.current.height = 560;
						}
					}}
				/>
				<canvas
					ref={canvasRef}
					className="absolute top-0 left-0 w-full h-full"
				/>

				{!cameraActive && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
						<p className="text-white text-lg">Camera not active</p>
					</div>
				)}
			</div>

			{/* Detected Students List */}
			{persistedDetectedStudents.size > 0 && (
				<div className="bg-white p-4 rounded-lg border border-green-200">
					<div className="flex items-center justify-between mb-3">
						<h3 className="font-semibold text-green-700">
							✓ Detected Students ({persistedDetectedStudents.size})
						</h3>
						<span className="text-xs text-gray-500">
							Auto-submitting in 1 second after detection...
						</span>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
						{Array.from(persistedDetectedStudents).map((studentId) => {
							const student = students.find((s) => s.id === studentId);
							return (
								student && (
									<div
										key={studentId}
										className="flex items-center justify-between gap-2 p-2 bg-green-50 rounded border border-green-200"
									>
										<div className="flex items-center gap-2 flex-1">
											{student.img && (
												<Image
													src={student.img}
													alt={student.name}
													width={32}
													height={32}
													className="rounded-full"
												/>
											)}
											<span className="text-sm font-medium">
												{student.name} {student.surname}
											</span>
										</div>
										<button
											onClick={() => removeDetectedStudent(studentId)}
											className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100"
											title="Remove from attendance"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</button>
									</div>
								)
							);
						})}
					</div>
				</div>
			)}

			{/* Instructions */}
			<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
				<h4 className="font-semibold mb-2 text-blue-900">Instructions:</h4>
				<ul className="text-sm text-blue-800 space-y-1">
					<li>1. Click &quot;Start Camera&quot; to begin face detection</li>
					<li>
						2. Ensure students face the camera clearly (one at a time works
						best)
					</li>
					<li>
						3. Detected students will be highlighted with a green box and name
					</li>
					<li>
						4. Click &quot;Submit Attendance&quot; when all students are
						detected
					</li>
				</ul>
			</div>
		</div>
	);
};

export default FaceRecognitionAttendance;
