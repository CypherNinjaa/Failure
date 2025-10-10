"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Image from "next/image";
import LivenessChallenge from "./LivenessChallenge";
import LocationVerification from "./LocationVerification";

type Teacher = {
	id: string;
	name: string;
	surname: string;
	img: string | null;
};

type TeacherFaceAttendanceProps = {
	teacher: Teacher;
	onAttendanceMarked: (
		teacherId: string,
		date: Date,
		locationId: number,
		coords: GeolocationCoordinates
	) => void;
};

const TeacherFaceAttendance = ({
	teacher,
	onAttendanceMarked,
}: TeacherFaceAttendanceProps) => {
	const [modelsLoaded, setModelsLoaded] = useState(false);
	const [cameraActive, setCameraActive] = useState(false);
	const [faceMatcher, setFaceMatcher] = useState<any>(null);
	const [error, setError] = useState<string>("");
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split("T")[0]
	);

	// Liveness and location states
	const [showLocationCheck, setShowLocationCheck] = useState(false);
	const [showLivenessCheck, setShowLivenessCheck] = useState(false);
	const [locationVerified, setLocationVerified] = useState(false);
	const [livenessVerified, setLivenessVerified] = useState(false);
	const [verifiedLocationId, setVerifiedLocationId] = useState<number | null>(
		null
	);
	const [verifiedCoords, setVerifiedCoords] =
		useState<GeolocationCoordinates | null>(null);

	// Face detection states
	const [faceDetected, setFaceDetected] = useState(false);
	const [faceMatched, setFaceMatched] = useState(false);
	const [matchConfidence, setMatchConfidence] = useState(0);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Load face-api.js models
	useEffect(() => {
		const loadModels = async () => {
			try {
				setLoadingProgress(10);
				const MODEL_URL = "/models";

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

	// Load teacher's face
	useEffect(() => {
		if (!modelsLoaded || !teacher.img) return;

		const loadTeacherFace = async () => {
			try {
				if (!teacher.img) {
					setError(
						"No profile photo found. Please upload a photo to use face recognition."
					);
					return;
				}

				const img = await faceapi.fetchImage(teacher.img);
				const detection = await faceapi
					.detectSingleFace(img)
					.withFaceLandmarks()
					.withFaceDescriptor();

				if (detection) {
					const labeledDescriptor = new faceapi.LabeledFaceDescriptors(
						teacher.id,
						[detection.descriptor]
					);
					const matcher = new faceapi.FaceMatcher([labeledDescriptor], 0.6);
					setFaceMatcher(matcher);
				} else {
					setError(
						"Could not detect face in your profile photo. Please upload a clear photo."
					);
				}
			} catch (err) {
				console.error("Error loading teacher face:", err);
				setError("Failed to load your face data. Please try again.");
			}
		};

		loadTeacherFace();
	}, [modelsLoaded, teacher]);

	// Start process: Location → Liveness → Camera
	const startAttendanceProcess = () => {
		setError("");
		setShowLocationCheck(true);
	};

	const handleLocationVerified = (
		locationId: number,
		coords: GeolocationCoordinates
	) => {
		setLocationVerified(true);
		setVerifiedLocationId(locationId);
		setVerifiedCoords(coords);
		setShowLocationCheck(false);
		setShowLivenessCheck(true);
	};

	const handleLocationFailed = (reason: string) => {
		setShowLocationCheck(false);
		setError(reason);
	};

	const handleLivenessComplete = () => {
		setLivenessVerified(true);
		setShowLivenessCheck(false);
		startCamera();
	};

	const handleLivenessFailed = (reason: string) => {
		setShowLivenessCheck(false);
		setError(reason);
	};

	// Start camera
	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: 720,
					height: 560,
					facingMode: "user", // Front camera only for self-attendance
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

	// Stop camera
	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			videoRef.current.srcObject = null;
			setCameraActive(false);
		}
	};

	// Detect face
	const detectFace = async () => {
		if (!videoRef.current || !canvasRef.current || !faceMatcher) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;

		const displaySize = { width: video.width, height: video.height };
		faceapi.matchDimensions(canvas, displaySize);

		const detection = await faceapi
			.detectSingleFace(video)
			.withFaceLandmarks()
			.withFaceDescriptor();

		// Clear canvas
		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		if (detection) {
			setFaceDetected(true);

			const resizedDetection = faceapi.resizeResults(detection, displaySize);

			// Draw detection
			faceapi.draw.drawDetections(canvas, [resizedDetection]);

			// Match face
			const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

			if (bestMatch.label === teacher.id) {
				const confidence = Math.round((1 - bestMatch.distance) * 100);
				setMatchConfidence(confidence);
				setFaceMatched(true);

				// Draw match result
				const drawBox = new faceapi.draw.DrawBox(
					resizedDetection.detection.box,
					{
						label: `${teacher.name} ${teacher.surname} (${confidence}%)`,
						boxColor: "green",
						lineWidth: 2,
					}
				);
				drawBox.draw(canvas);
			} else {
				setFaceMatched(false);
				setMatchConfidence(0);

				// Draw no match
				const drawBox = new faceapi.draw.DrawBox(
					resizedDetection.detection.box,
					{
						label: "Face not recognized",
						boxColor: "red",
						lineWidth: 2,
					}
				);
				drawBox.draw(canvas);
			}
		} else {
			setFaceDetected(false);
			setFaceMatched(false);
			setMatchConfidence(0);
		}
	};

	// Continuous detection
	useEffect(() => {
		if (cameraActive && faceMatcher) {
			const interval = setInterval(() => {
				detectFace();
			}, 1000);

			return () => clearInterval(interval);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cameraActive, faceMatcher]);

	// Submit attendance
	const handleSubmitAttendance = () => {
		if (!faceMatched || !locationVerified || !livenessVerified) {
			setError("Please complete all verification steps.");
			return;
		}

		if (!verifiedLocationId || !verifiedCoords) {
			setError("Location data missing. Please try again.");
			return;
		}

		const attendanceDate = new Date(selectedDate);
		onAttendanceMarked(
			teacher.id,
			attendanceDate,
			verifiedLocationId,
			verifiedCoords
		);
		stopCamera();
	};

	const today = new Date().toISOString().split("T")[0];
	const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					Teacher Self-Attendance
				</h1>
				<p className="text-gray-600 mt-1">
					Mark your attendance using face recognition
				</p>
			</div>

			{/* Date Selection */}
			<div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Select Attendance Date
				</label>
				<div className="flex flex-col md:flex-row gap-3">
					<input
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						max={today}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent"
					/>
					<button
						onClick={() => setSelectedDate(today)}
						className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
					>
						Today
					</button>
					<button
						onClick={() => setSelectedDate(yesterday)}
						className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
					>
						Yesterday
					</button>
				</div>
				<div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
					<span className="text-2xl">📅</span>
					<span className="font-medium">
						Marking attendance for:{" "}
						{new Date(selectedDate).toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-red-800 text-sm">{error}</p>
				</div>
			)}

			{/* Loading Progress */}
			{!modelsLoaded && (
				<div className="mb-6">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-700">
							Loading AI Models...
						</span>
						<span className="text-sm font-medium text-gray-700">
							{loadingProgress}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2.5">
						<div
							className="bg-lamaPurple h-2.5 rounded-full transition-all duration-300"
							style={{ width: `${loadingProgress}%` }}
						></div>
					</div>
				</div>
			)}

			{/* Status Cards */}
			{modelsLoaded && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{/* Location Status */}
					<div
						className={`p-4 rounded-lg border-2 ${
							locationVerified
								? "bg-green-50 border-green-500"
								: "bg-gray-50 border-gray-300"
						}`}
					>
						<div className="flex items-center gap-3">
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center ${
									locationVerified ? "bg-green-500" : "bg-gray-300"
								}`}
							>
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-sm font-semibold text-gray-700">Location</p>
								<p className="text-xs text-gray-500">
									{locationVerified ? "Verified ✓" : "Pending"}
								</p>
							</div>
						</div>
					</div>

					{/* Liveness Status */}
					<div
						className={`p-4 rounded-lg border-2 ${
							livenessVerified
								? "bg-green-50 border-green-500"
								: "bg-gray-50 border-gray-300"
						}`}
					>
						<div className="flex items-center gap-3">
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center ${
									livenessVerified ? "bg-green-500" : "bg-gray-300"
								}`}
							>
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-sm font-semibold text-gray-700">Liveness</p>
								<p className="text-xs text-gray-500">
									{livenessVerified ? "Verified ✓" : "Pending"}
								</p>
							</div>
						</div>
					</div>

					{/* Face Match Status */}
					<div
						className={`p-4 rounded-lg border-2 ${
							faceMatched
								? "bg-green-50 border-green-500"
								: "bg-gray-50 border-gray-300"
						}`}
					>
						<div className="flex items-center gap-3">
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center ${
									faceMatched ? "bg-green-500" : "bg-gray-300"
								}`}
							>
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<p className="text-sm font-semibold text-gray-700">
									Face Match
								</p>
								<p className="text-xs text-gray-500">
									{faceMatched ? `${matchConfidence}% ✓` : "Pending"}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Action Buttons */}
			{modelsLoaded && faceMatcher && (
				<div className="flex flex-wrap gap-3 mb-6">
					{!locationVerified && (
						<button
							onClick={startAttendanceProcess}
							className="bg-lamaPurple text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
						>
							Start Verification
						</button>
					)}

					{cameraActive && (
						<>
							<button
								onClick={stopCamera}
								className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
							>
								Stop Camera
							</button>

							{faceMatched && locationVerified && livenessVerified && (
								<button
									onClick={handleSubmitAttendance}
									className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
								>
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
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Submit Attendance ({matchConfidence}% match)
								</button>
							)}
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
				/>
				<canvas
					ref={canvasRef}
					className="absolute top-0 left-0 w-full h-auto"
				/>

				{/* Overlays */}
				{showLocationCheck && (
					<LocationVerification
						onLocationVerified={handleLocationVerified}
						onLocationFailed={handleLocationFailed}
					/>
				)}

				{showLivenessCheck && (
					<LivenessChallenge
						videoRef={videoRef}
						onChallengeComplete={handleLivenessComplete}
						onChallengeFailed={handleLivenessFailed}
					/>
				)}

				{!cameraActive && !showLocationCheck && !showLivenessCheck && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-800">
						<p className="text-white text-center">
							{modelsLoaded && faceMatcher
								? "Click 'Start Verification' to begin"
								: "Loading..."}
						</p>
					</div>
				)}
			</div>

			{/* Instructions */}
			{modelsLoaded && faceMatcher && (
				<div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h3 className="font-semibold text-blue-900 mb-2">📝 How it works:</h3>
					<ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
						<li>Click &quot;Start Verification&quot;</li>
						<li>Location will be verified automatically</li>
						<li>Complete the liveness challenge (blink or head movement)</li>
						<li>Camera will start and detect your face</li>
						<li>
							When your face matches and all checks pass, submit attendance
						</li>
					</ol>
				</div>
			)}
		</div>
	);
};

export default TeacherFaceAttendance;
