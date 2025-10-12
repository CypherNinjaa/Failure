"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Image from "next/image";
import LivenessChallenge from "./LivenessChallenge";
import LocationVerification from "./LocationVerification";

// Face matching threshold - minimum 75% match required
const FACE_MATCH_THRESHOLD = 75;

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
	const [isWithinTimeWindow, setIsWithinTimeWindow] = useState(true);
	const [timeWindowMessage, setTimeWindowMessage] = useState("");

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
	const [autoSubmitting, setAutoSubmitting] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const detectionInProgressRef = useRef(false); // Prevent overlapping detections

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

	// Check time window
	useEffect(() => {
		const checkTimeWindow = async () => {
			try {
				const response = await fetch("/api/attendance-settings");
				const result = await response.json();

				if (result.success && result.data && result.data.isActive) {
					const settings = result.data;
					const now = new Date();
					const currentTime =
						now.getHours().toString().padStart(2, "0") +
						":" +
						now.getMinutes().toString().padStart(2, "0");

					const [startHour, startMin] = settings.startTime
						.split(":")
						.map(Number);
					const [endHour, endMin] = settings.endTime.split(":").map(Number);
					const currentMinutes = now.getHours() * 60 + now.getMinutes();
					const startMinutes = startHour * 60 + startMin;
					const endMinutes = endHour * 60 + endMin;

					if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
						setIsWithinTimeWindow(true);
						setTimeWindowMessage("");
					} else {
						setIsWithinTimeWindow(false);
						if (currentMinutes < startMinutes) {
							setTimeWindowMessage(
								`Attendance opens at ${settings.startTime}. Please come back later.`
							);
						} else {
							setTimeWindowMessage(
								`Attendance closed at ${settings.endTime}. Too late to mark attendance today.`
							);
						}
					}
				} else {
					// No time restriction
					setIsWithinTimeWindow(true);
					setTimeWindowMessage("");
				}
			} catch (error) {
				console.error("Error checking time window:", error);
				// On error, allow attendance
				setIsWithinTimeWindow(true);
			}
		};

		checkTimeWindow();
		// Recheck every minute
		const interval = setInterval(checkTimeWindow, 60000);
		return () => clearInterval(interval);
	}, []);

	// Request location permission on component mount
	useEffect(() => {
		const requestLocationPermission = async () => {
			if ("geolocation" in navigator) {
				try {
					// Request permission by getting current position
					await new Promise<GeolocationPosition>((resolve, reject) => {
						navigator.geolocation.getCurrentPosition(
							(position) => {
								console.log("Location permission granted");
								resolve(position);
							},
							(error) => {
								console.error("Location permission denied:", error);
								reject(error);
							},
							{
								enableHighAccuracy: true,
								timeout: 10000,
								maximumAge: 0,
							}
						);
					});
				} catch (error) {
					console.error("Failed to get location permission:", error);
				}
			}
		};

		// Request location permission when component loads
		requestLocationPermission();
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
	const startAttendanceProcess = async () => {
		setError("");

		// Request location permission before showing location check
		if ("geolocation" in navigator) {
			try {
				await new Promise<GeolocationPosition>((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							console.log("Location permission granted, starting verification");
							resolve(position);
						},
						(error) => {
							console.error("Location permission error:", error);
							reject(error);
						},
						{
							enableHighAccuracy: true,
							timeout: 10000,
							maximumAge: 0,
						}
					);
				});
				// Permission granted, show location check
				setShowLocationCheck(true);
			} catch (error) {
				setError(
					"Location permission denied. Please enable location access in your browser settings."
				);
			}
		} else {
			setError("Geolocation is not supported by your browser.");
		}
	};

	const handleLocationVerified = async (
		locationId: number,
		coords: GeolocationCoordinates
	) => {
		setLocationVerified(true);
		setVerifiedLocationId(locationId);
		setVerifiedCoords(coords);
		setShowLocationCheck(false);

		// Start camera first, then show liveness check
		await startCamera();
		setShowLivenessCheck(true);
	};

	const handleLocationFailed = (reason: string) => {
		setShowLocationCheck(false);
		setError(reason);
	};

	const handleLivenessComplete = () => {
		setLivenessVerified(true);
		setShowLivenessCheck(false);
		// Camera is already running, no need to start again
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
					width: { ideal: 640 }, // Reduced from 720 for better performance
					height: { ideal: 480 }, // Reduced from 560 for better performance
					facingMode: "user", // Front camera only for self-attendance
					frameRate: { ideal: 24, max: 30 }, // Lower framerate
				},
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;

				// Ensure video plays
				await videoRef.current.play().catch((err) => {
					console.error("Error playing video:", err);
				});

				setCameraActive(true);
			}
		} catch (err) {
			console.error("Error accessing camera:", err);
			setError("Failed to access camera. Please grant camera permissions.");
		}
	}; // Stop camera
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
		// Skip if detection is already in progress
		if (detectionInProgressRef.current) return;
		if (!videoRef.current || !canvasRef.current || !faceMatcher) return;

		// Set detection in progress flag
		detectionInProgressRef.current = true;

		try {
			const video = videoRef.current;
			const canvas = canvasRef.current;

			// Check if video is ready
			if (video.readyState !== video.HAVE_ENOUGH_DATA) {
				detectionInProgressRef.current = false;
				return;
			}

			const displaySize = { width: video.width, height: video.height };
			faceapi.matchDimensions(canvas, displaySize);

			// Use TinyFaceDetectorOptions for better performance
			const detection = await faceapi
				.detectSingleFace(
					video,
					new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
				)
				.withFaceLandmarks()
				.withFaceDescriptor();

			// Use requestAnimationFrame for smoother canvas updates
			requestAnimationFrame(() => {
				// Clear canvas
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
				}

				if (detection) {
					const resizedDetection = faceapi.resizeResults(
						detection,
						displaySize
					);

					// Draw detection
					faceapi.draw.drawDetections(canvas, [resizedDetection]);

					// Match face
					const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

					if (bestMatch.label === teacher.id) {
						const confidence = Math.round((1 - bestMatch.distance) * 100);

						// Check if confidence meets the minimum threshold
						if (confidence >= FACE_MATCH_THRESHOLD) {
							// Only update state if not already matched (prevent re-renders)
							if (!faceMatched) {
								setFaceDetected(true);
								setFaceMatched(true);
								setMatchConfidence(confidence);
							}

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
							// Face recognized but confidence too low
							setFaceDetected(true);
							setFaceMatched(false);
							setMatchConfidence(confidence);

							const drawBox = new faceapi.draw.DrawBox(
								resizedDetection.detection.box,
								{
									label: `Low confidence: ${confidence}% (Need ${FACE_MATCH_THRESHOLD}%)`,
									boxColor: "orange",
									lineWidth: 2,
								}
							);
							drawBox.draw(canvas);
						}
					} else {
						setFaceDetected(true);
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
			});
		} catch (err) {
			console.error("Error during face detection:", err);
		} finally {
			// Reset detection flag
			detectionInProgressRef.current = false;
		}
	};

	// Continuous detection
	useEffect(() => {
		if (cameraActive && faceMatcher && !faceMatched) {
			// Only run detection if face is not yet matched
			const interval = setInterval(() => {
				detectFace();
			}, 1500); // Reduced frequency to 1.5 seconds to prevent video freezing

			return () => clearInterval(interval);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cameraActive, faceMatcher, faceMatched]);

	// Auto-submit attendance when all conditions are met
	useEffect(() => {
		const autoSubmitAttendance = async () => {
			// Check if all conditions are met and not already submitting
			if (
				faceMatched &&
				locationVerified &&
				livenessVerified &&
				isWithinTimeWindow &&
				verifiedLocationId &&
				verifiedCoords &&
				cameraActive &&
				!autoSubmitting
			) {
				setAutoSubmitting(true);

				// Wait 2 seconds before auto-submitting to show success state
				await new Promise((resolve) => setTimeout(resolve, 2000));

				// Double-check conditions are still met after delay
				if (
					faceMatched &&
					locationVerified &&
					livenessVerified &&
					isWithinTimeWindow
				) {
					handleSubmitAttendance();
				} else {
					setAutoSubmitting(false);
				}
			}
		};

		autoSubmitAttendance();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		faceMatched,
		locationVerified,
		livenessVerified,
		isWithinTimeWindow,
		verifiedLocationId,
		verifiedCoords,
		cameraActive,
	]);

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

		if (!isWithinTimeWindow) {
			setError("Cannot submit attendance outside allowed hours.");
			return;
		}

		// Always use today's date
		const attendanceDate = new Date();
		attendanceDate.setHours(0, 0, 0, 0);

		onAttendanceMarked(
			teacher.id,
			attendanceDate,
			verifiedLocationId,
			verifiedCoords
		);
		stopCamera();
	};

	// Retry verification process
	const retryVerification = () => {
		// Reset all states
		setError("");
		setLocationVerified(false);
		setLivenessVerified(false);
		setFaceDetected(false);
		setFaceMatched(false);
		setMatchConfidence(0);
		setVerifiedLocationId(null);
		setVerifiedCoords(null);
		setShowLocationCheck(false);
		setShowLivenessCheck(false);

		// Stop camera if running
		if (cameraActive) {
			stopCamera();
		}
	};

	const today = new Date().toISOString().split("T")[0];
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
			{/* Time Window Restriction Message */}
			{!isWithinTimeWindow && timeWindowMessage && (
				<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<svg
							className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<h3 className="font-semibold text-red-900 mb-1">
								Outside Attendance Hours
							</h3>
							<p className="text-sm text-red-800">{timeWindowMessage}</p>
						</div>
					</div>
				</div>
			)}
			{/* Error Display */}
			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-start gap-3 flex-1">
							<svg
								className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p className="text-red-800 text-sm">{error}</p>
						</div>
						<button
							onClick={retryVerification}
							className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center gap-2 flex-shrink-0"
						>
							<svg
								className="w-4 h-4"
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
							Retry
						</button>
					</div>
				</div>
			)}{" "}
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
									{faceMatched
										? `${matchConfidence}% ✓ (Required: ${FACE_MATCH_THRESHOLD}%)`
										: matchConfidence > 0
										? `${matchConfidence}% (Need ${FACE_MATCH_THRESHOLD}%)`
										: "Pending"}
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
							disabled={!isWithinTimeWindow}
							className={`px-6 py-3 rounded-lg font-medium transition-colors ${
								isWithinTimeWindow
									? "bg-lamaPurple text-white hover:bg-opacity-90"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}
						>
							{isWithinTimeWindow
								? "Start Verification"
								: "Outside Attendance Hours"}
						</button>
					)}

					{locationVerified && !livenessVerified && !cameraActive && (
						<button
							onClick={async () => {
								setError("");
								await startCamera();
								setShowLivenessCheck(true);
							}}
							className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
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
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Retry Liveness Check
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
			)}{" "}
			{/* Video Feed */}
			<div className="relative bg-black rounded-lg overflow-hidden">
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					width="640"
					height="480"
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
