"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

type ChallengeType = "blink" | "turnLeft" | "turnRight" | "nodUp" | "nodDown";

interface Challenge {
	type: ChallengeType;
	text: string;
	requiredCount: number;
}

interface LivenessChallengeProps {
	videoRef: React.RefObject<HTMLVideoElement>;
	onChallengeComplete: () => void;
	onChallengeFailed: (reason: string) => void;
}

const CHALLENGES: Challenge[] = [
	{ type: "blink", text: "Blink 3 times", requiredCount: 3 },
	{ type: "turnLeft", text: "Turn your head left", requiredCount: 1 },
	{ type: "turnRight", text: "Turn your head right", requiredCount: 1 },
	{ type: "nodUp", text: "Nod your head up", requiredCount: 1 },
	{ type: "nodDown", text: "Nod your head down", requiredCount: 1 },
];

const BLINK_THRESHOLD = 0.25;
const HEAD_MOVEMENT_THRESHOLD = 15; // pixels
const CHALLENGE_TIMEOUT = 15000; // 15 seconds

const LivenessChallenge = ({
	videoRef,
	onChallengeComplete,
	onChallengeFailed,
}: LivenessChallengeProps) => {
	const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
		null
	);
	const [progress, setProgress] = useState(0);
	const [detectedCount, setDetectedCount] = useState(0);
	const [timeRemaining, setTimeRemaining] = useState(15);
	const [isChecking, setIsChecking] = useState(false);

	const previousNosePosition = useRef<{ x: number; y: number } | null>(null);
	const previousEyeState = useRef<"open" | "closed">("open");
	const blinkCount = useRef(0);
	const challengeStartTime = useRef<number | null>(null);
	const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Select random challenge on mount
	useEffect(() => {
		const randomChallenge =
			CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
		setCurrentChallenge(randomChallenge);
		challengeStartTime.current = Date.now();
		setIsChecking(true);

		// Countdown timer
		const countdownInterval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(countdownInterval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		// Challenge timeout
		const timeout = setTimeout(() => {
			clearInterval(countdownInterval);
			onChallengeFailed("Time's up! Please try again.");
		}, CHALLENGE_TIMEOUT);

		timeoutRef.current = timeout;

		return () => {
			clearInterval(countdownInterval);
			clearTimeout(timeout);
		};
	}, [onChallengeFailed]);

	// Calculate Eye Aspect Ratio (EAR)
	const calculateEAR = (eyeLandmarks: faceapi.Point[]) => {
		const vertical1 = Math.sqrt(
			Math.pow(eyeLandmarks[1].x - eyeLandmarks[5].x, 2) +
				Math.pow(eyeLandmarks[1].y - eyeLandmarks[5].y, 2)
		);
		const vertical2 = Math.sqrt(
			Math.pow(eyeLandmarks[2].x - eyeLandmarks[4].x, 2) +
				Math.pow(eyeLandmarks[2].y - eyeLandmarks[4].y, 2)
		);
		const horizontal = Math.sqrt(
			Math.pow(eyeLandmarks[0].x - eyeLandmarks[3].x, 2) +
				Math.pow(eyeLandmarks[0].y - eyeLandmarks[3].y, 2)
		);

		return (vertical1 + vertical2) / (2 * horizontal);
	};

	// Detect challenge action
	const checkChallenge = async () => {
		if (!videoRef.current || !currentChallenge || !isChecking) return;

		try {
			const detections = await faceapi
				.detectSingleFace(videoRef.current)
				.withFaceLandmarks();

			if (!detections) return;

			const landmarks = detections.landmarks;

			switch (currentChallenge.type) {
				case "blink": {
					const leftEye = landmarks.getLeftEye();
					const rightEye = landmarks.getRightEye();

					const leftEAR = calculateEAR(leftEye);
					const rightEAR = calculateEAR(rightEye);
					const avgEAR = (leftEAR + rightEAR) / 2;

					const currentEyeState = avgEAR < BLINK_THRESHOLD ? "closed" : "open";

					// Detect blink: open -> closed -> open
					if (
						previousEyeState.current === "open" &&
						currentEyeState === "closed"
					) {
						previousEyeState.current = "closed";
					} else if (
						previousEyeState.current === "closed" &&
						currentEyeState === "open"
					) {
						blinkCount.current += 1;
						setDetectedCount(blinkCount.current);
						previousEyeState.current = "open";

						if (blinkCount.current >= currentChallenge.requiredCount) {
							completeChallenge();
						}
					}
					break;
				}

				case "turnLeft":
				case "turnRight": {
					const nose = landmarks.getNose()[3]; // Nose tip

					if (previousNosePosition.current) {
						const deltaX = nose.x - previousNosePosition.current.x;

						if (
							currentChallenge.type === "turnLeft" &&
							deltaX < -HEAD_MOVEMENT_THRESHOLD
						) {
							completeChallenge();
						} else if (
							currentChallenge.type === "turnRight" &&
							deltaX > HEAD_MOVEMENT_THRESHOLD
						) {
							completeChallenge();
						}
					}

					previousNosePosition.current = { x: nose.x, y: nose.y };
					break;
				}

				case "nodUp":
				case "nodDown": {
					const nose = landmarks.getNose()[3]; // Nose tip

					if (previousNosePosition.current) {
						const deltaY = nose.y - previousNosePosition.current.y;

						if (
							currentChallenge.type === "nodUp" &&
							deltaY < -HEAD_MOVEMENT_THRESHOLD
						) {
							completeChallenge();
						} else if (
							currentChallenge.type === "nodDown" &&
							deltaY > HEAD_MOVEMENT_THRESHOLD
						) {
							completeChallenge();
						}
					}

					previousNosePosition.current = { x: nose.x, y: nose.y };
					break;
				}
			}
		} catch (error) {
			console.error("Error checking challenge:", error);
		}
	};

	const completeChallenge = () => {
		setIsChecking(false);
		setProgress(100);
		if (checkIntervalRef.current) {
			clearInterval(checkIntervalRef.current);
		}
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setTimeout(() => {
			onChallengeComplete();
		}, 500);
	};

	// Start checking when challenge is set
	useEffect(() => {
		if (currentChallenge && isChecking) {
			checkIntervalRef.current = setInterval(checkChallenge, 100); // Check every 100ms

			return () => {
				if (checkIntervalRef.current) {
					clearInterval(checkIntervalRef.current);
				}
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentChallenge, isChecking]);

	// Update progress based on detected count
	useEffect(() => {
		if (currentChallenge && currentChallenge.type === "blink") {
			const progressPercent =
				(detectedCount / currentChallenge.requiredCount) * 100;
			setProgress(Math.min(progressPercent, 100));
		}
	}, [detectedCount, currentChallenge]);

	if (!currentChallenge) return null;

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20 flex items-center justify-center z-10 rounded-lg">
			<div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-white border-opacity-30">
				<div className="text-center">
					{/* Icon */}
					<div className="mb-4 flex justify-center">
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
							<svg
								className="w-8 h-8 text-blue-600"
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
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
						</div>
					</div>

					{/* Challenge Text */}
					<h3 className="text-2xl font-bold text-gray-900 mb-2 drop-shadow-lg">
						Liveness Check
					</h3>
					<p className="text-lg text-gray-900 font-semibold mb-4 drop-shadow-md">
						{currentChallenge.text}
					</p>

					{/* Progress */}
					{currentChallenge.type === "blink" && (
						<div className="mb-4">
							<p className="text-sm text-gray-900 font-semibold mb-2 drop-shadow-md">
								Detected: {detectedCount} / {currentChallenge.requiredCount}
							</p>
						</div>
					)}

					{/* Progress Bar */}
					<div className="w-full bg-white bg-opacity-40 rounded-full h-3 mb-4 overflow-hidden border border-white border-opacity-50">
						<div
							className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>

					{/* Timer */}
					<div className="flex items-center justify-center gap-2 text-sm text-gray-900 font-semibold drop-shadow-md">
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
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Time remaining: {timeRemaining}s</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LivenessChallenge;
