"use client";

import { submitMCQAnswer, recordCheatingViolation } from "@/lib/actions";
import { MCQQuestion } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";

type TakeTestClientProps = {
	testId: string;
	attemptId: string;
	questions: (MCQQuestion & {
		studentAnswer?: {
			userAnswer: string;
			isCorrect: boolean | null;
		} | null;
	})[];
	testTitle: string;
	currentViolations?: number;
};

type ViolationType =
	| "TAB_SWITCH"
	| "WINDOW_BLUR"
	| "RIGHT_CLICK"
	| "COPY_PASTE"
	| "DEVTOOLS"
	| "EXIT_FULLSCREEN";

const VIOLATION_MESSAGES = {
	TAB_SWITCH: "⚠️ Tab switching detected!",
	WINDOW_BLUR: "⚠️ Window minimized or switched!",
	RIGHT_CLICK: "⚠️ Right-click is disabled during tests!",
	COPY_PASTE: "⚠️ Copy/Paste is disabled during tests!",
	DEVTOOLS: "⚠️ Developer tools detected!",
	EXIT_FULLSCREEN: "⚠️ Please stay in fullscreen mode!",
};

const PENALTY_CONFIG = {
	1: { penalty: 10, message: "1st Warning: -10% score penalty" },
	2: { penalty: 25, message: "2nd Violation: -25% score penalty" },
	3: {
		penalty: 50,
		message: "FINAL WARNING: -50% penalty, test will auto-submit!",
	},
};

const AntiCheatingTestClient = ({
	testId,
	attemptId,
	questions,
	testTitle,
	currentViolations = 0,
}: TakeTestClientProps) => {
	const router = useRouter();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [violations, setViolations] = useState(currentViolations);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showViolationWarning, setShowViolationWarning] = useState(false);
	const [lastViolationType, setLastViolationType] =
		useState<ViolationType | null>(null);
	const [isTerminated, setIsTerminated] = useState(false);

	const tabSwitchCountRef = useRef(0);
	const lastViolationTimeRef = useRef(0);
	const devToolsCheckIntervalRef = useRef<NodeJS.Timeout>();

	const currentQuestion = questions[currentQuestionIndex];
	const totalQuestions = questions.length;
	const answeredCount = questions.filter((q) => q.studentAnswer).length;
	const isAnswered = !!currentQuestion.studentAnswer;
	const savedAnswer = currentQuestion.studentAnswer?.userAnswer || "";

	// Calculate current penalty
	const calculatePenalty = (violationCount: number): number => {
		if (violationCount === 0) return 0;
		if (violationCount === 1) return 10;
		if (violationCount === 2) return 25;
		if (violationCount >= 3) return 50;
		return 0;
	};

	const currentPenalty = calculatePenalty(violations);

	// Handle force finish when test is terminated
	const handleForceFinish = useCallback(async () => {
		toast.error("Test terminated due to repeated cheating violations!", {
			autoClose: 8000,
		});

		setTimeout(() => {
			router.push(
				`/student/mcq-tests/${testId}/results?complete=true&attemptId=${attemptId}&terminated=true`
			);
		}, 3000);
	}, [router, testId, attemptId]);

	// Record violation to database
	const recordViolation = useCallback(
		async (type: ViolationType) => {
			const now = Date.now();
			// Prevent spam violations (minimum 2 seconds between violations)
			if (now - lastViolationTimeRef.current < 2000) return;

			lastViolationTimeRef.current = now;
			setLastViolationType(type);

			const newViolationCount = violations + 1;
			setViolations(newViolationCount);
			setShowViolationWarning(true);

			// Record to database
			await recordCheatingViolation(
				{ success: false, error: false },
				{
					attemptId,
					violationType: type,
					timestamp: new Date().toISOString(),
				}
			);

			// Show toast notification
			const config =
				PENALTY_CONFIG[newViolationCount as keyof typeof PENALTY_CONFIG];
			if (config) {
				toast.error(config.message, { autoClose: 5000 });
			}

			// Auto-hide warning after 4 seconds
			setTimeout(() => setShowViolationWarning(false), 4000);

			// Terminate test on 3rd violation
			if (newViolationCount >= 3) {
				setTimeout(() => {
					setIsTerminated(true);
					handleForceFinish();
				}, 3000);
			}
		},
		[violations, attemptId, handleForceFinish]
	);

	// Visibility Change Detection (Tab Switching)
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				tabSwitchCountRef.current += 1;
				recordViolation("TAB_SWITCH");
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () =>
			document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [recordViolation]);

	// Window Blur Detection (Minimize/Switch)
	useEffect(() => {
		const handleBlur = () => {
			recordViolation("WINDOW_BLUR");
		};

		window.addEventListener("blur", handleBlur);
		return () => window.removeEventListener("blur", handleBlur);
	}, [recordViolation]);

	// Prevent Right Click
	useEffect(() => {
		const handleContextMenu = (e: MouseEvent) => {
			e.preventDefault();
			recordViolation("RIGHT_CLICK");
			return false;
		};

		document.addEventListener("contextmenu", handleContextMenu);
		return () => document.removeEventListener("contextmenu", handleContextMenu);
	}, [recordViolation]);

	// Prevent Copy/Paste
	useEffect(() => {
		const handleCopy = (e: ClipboardEvent) => {
			e.preventDefault();
			recordViolation("COPY_PASTE");
		};

		const handlePaste = (e: ClipboardEvent) => {
			e.preventDefault();
			recordViolation("COPY_PASTE");
		};

		document.addEventListener("copy", handleCopy);
		document.addEventListener("paste", handlePaste);

		return () => {
			document.removeEventListener("copy", handleCopy);
			document.removeEventListener("paste", handlePaste);
		};
	}, [recordViolation]);

	// DevTools Detection
	useEffect(() => {
		const checkDevTools = () => {
			const widthThreshold = window.outerWidth - window.innerWidth > 160;
			const heightThreshold = window.outerHeight - window.innerHeight > 160;

			if (widthThreshold || heightThreshold) {
				recordViolation("DEVTOOLS");
			}
		};

		devToolsCheckIntervalRef.current = setInterval(checkDevTools, 3000);

		return () => {
			if (devToolsCheckIntervalRef.current) {
				clearInterval(devToolsCheckIntervalRef.current);
			}
		};
	}, [recordViolation]);

	// Fullscreen Management
	useEffect(() => {
		const enterFullscreen = async () => {
			try {
				await document.documentElement.requestFullscreen();
				setIsFullscreen(true);
			} catch (err) {
				console.error("Fullscreen error:", err);
				toast.warning("Please allow fullscreen for better test experience");
			}
		};

		const handleFullscreenChange = () => {
			const isCurrentlyFullscreen = !!document.fullscreenElement;
			setIsFullscreen(isCurrentlyFullscreen);

			if (!isCurrentlyFullscreen && !isTerminated) {
				recordViolation("EXIT_FULLSCREEN");
				// Try to re-enter fullscreen
				setTimeout(enterFullscreen, 1000);
			}
		};

		// Enter fullscreen on mount
		enterFullscreen();

		document.addEventListener("fullscreenchange", handleFullscreenChange);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
			if (document.fullscreenElement) {
				document.exitFullscreen().catch(() => {});
			}
		};
	}, [recordViolation, isTerminated]);

	// Prevent browser back button
	useEffect(() => {
		const preventBack = (e: PopStateEvent) => {
			e.preventDefault();
			window.history.pushState(null, "", window.location.href);
			toast.warning("Please use the test navigation buttons");
		};

		window.history.pushState(null, "", window.location.href);
		window.addEventListener("popstate", preventBack);

		return () => window.removeEventListener("popstate", preventBack);
	}, []);

	const handleAnswerSubmit = async () => {
		if (!selectedAnswer && !isAnswered) {
			toast.error("Please select an answer");
			return;
		}

		if (isAnswered) {
			if (currentQuestionIndex < totalQuestions - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setSelectedAnswer("");
			}
			return;
		}

		setIsSubmitting(true);

		const result = await submitMCQAnswer(
			{ success: false, error: false },
			{
				attemptId,
				questionId: currentQuestion.id,
				userAnswer: selectedAnswer,
			}
		);

		setIsSubmitting(false);

		if (result.success) {
			toast.success("Answer submitted!");
			router.refresh();
			if (currentQuestionIndex < totalQuestions - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setSelectedAnswer("");
			}
		} else {
			toast.error("Failed to submit answer");
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
			setSelectedAnswer("");
		}
	};

	const handleNext = () => {
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
			setSelectedAnswer("");
		}
	};

	const handleFinishTest = async () => {
		if (answeredCount < totalQuestions) {
			const confirmFinish = window.confirm(
				`You have only answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to finish?`
			);
			if (!confirmFinish) return;
		}

		router.push(
			`/student/mcq-tests/${testId}/results?complete=true&attemptId=${attemptId}`
		);
	};

	const options = currentQuestion.options as string[];

	if (isTerminated) {
		return (
			<div className="flex-1 p-4">
				<div className="bg-red-50 border-4 border-red-500 p-8 rounded-lg text-center">
					<div className="text-6xl mb-4">🚫</div>
					<h2 className="text-2xl font-bold text-red-600 mb-4">
						Test Terminated
					</h2>
					<p className="text-gray-700 mb-2">
						This test has been terminated due to repeated cheating violations.
					</p>
					<p className="text-gray-600 mb-6">
						Your test will be auto-submitted with a 50% score penalty.
					</p>
					<div className="bg-white p-4 rounded-md">
						<p className="font-semibold text-red-600">
							Total Violations: {violations}
						</p>
						<p className="text-sm text-gray-600 mt-2">
							Redirecting to results...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Violation Warning Banner */}
			{showViolationWarning && (
				<div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md animate-pulse">
					<div className="flex items-center gap-3">
						<span className="text-3xl">⚠️</span>
						<div className="flex-1">
							<h3 className="font-bold text-red-800">
								{lastViolationType && VIOLATION_MESSAGES[lastViolationType]}
							</h3>
							<p className="text-red-700 text-sm mt-1">
								Violation #{violations} - Current Penalty:{" "}
								<span className="font-bold">-{currentPenalty}%</span>
							</p>
							{violations >= 3 && (
								<p className="text-red-900 font-bold text-sm mt-2">
									🚫 FINAL WARNING: Test will be auto-submitted!
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Security Status Bar */}
			<div className="bg-gray-800 text-white p-3 rounded-md flex items-center justify-between text-sm">
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-2">
						<span className={isFullscreen ? "text-green-400" : "text-red-400"}>
							{isFullscreen ? "✓" : "✗"}
						</span>
						Fullscreen
					</span>
					<span className="flex items-center gap-2">
						<span className="text-yellow-400">🔒</span>
						Proctored Mode Active
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-gray-300">Violations: {violations}/3</span>
					{currentPenalty > 0 && (
						<span className="bg-red-500 px-2 py-1 rounded text-xs font-bold">
							Penalty: -{currentPenalty}%
						</span>
					)}
				</div>
			</div>

			{/* Progress Bar */}
			<div className="bg-white p-4 rounded-md">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-gray-600">
						Question {currentQuestionIndex + 1} of {totalQuestions}
					</span>
					<span className="text-sm text-gray-600">
						Answered: {answeredCount}/{totalQuestions}
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-lamaPurple h-2 rounded-full transition-all duration-300"
						style={{
							width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
						}}
					></div>
				</div>
			</div>

			{/* Question Card */}
			<div className="bg-white p-6 rounded-md select-none">
				<div className="flex items-center gap-2 mb-4">
					<span className="px-3 py-1 rounded-full bg-lamaPurpleLight text-lamaPurple text-sm font-medium">
						{currentQuestion.questionType.replace("_", " ")}
					</span>
					{isAnswered && currentQuestion.studentAnswer?.isCorrect !== null && (
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${
								currentQuestion.studentAnswer?.isCorrect
									? "bg-green-100 text-green-600"
									: "bg-red-100 text-red-600"
							}`}
						>
							{currentQuestion.studentAnswer?.isCorrect
								? "Correct"
								: "Incorrect"}
						</span>
					)}
					{isAnswered && currentQuestion.studentAnswer?.isCorrect === null && (
						<span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-sm font-medium">
							Pending Review
						</span>
					)}
				</div>

				<h2 className="text-xl font-semibold mb-6">
					{currentQuestion.question}
				</h2>

				{/* Open-Ended Question - Text Area */}
				{currentQuestion.questionType === "OPEN_ENDED" ? (
					<div className="space-y-3">
						<textarea
							value={isAnswered ? savedAnswer : selectedAnswer}
							onChange={(e) => !isAnswered && setSelectedAnswer(e.target.value)}
							disabled={isAnswered || isSubmitting}
							placeholder="Type your answer here..."
							rows={6}
							className={`w-full p-4 rounded-lg border-2 transition-all resize-none ${
								isAnswered
									? "border-gray-300 bg-gray-50 cursor-not-allowed"
									: "border-gray-200 focus:border-lamaPurple focus:outline-none"
							}`}
							onCopy={(e) => e.preventDefault()}
							onPaste={(e) => e.preventDefault()}
						/>
						{isAnswered && (
							<div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
								<p className="text-yellow-700 font-medium">
									⏳ Your answer has been submitted and is waiting for teacher
									review.
								</p>
							</div>
						)}
					</div>
				) : (
					/* Multiple Choice / True False - Options */
					<div className="space-y-3">
						{options.map((option, index) => {
							const isSelected = isAnswered
								? savedAnswer === option
								: selectedAnswer === option;
							const isCorrect = isAnswered && option === currentQuestion.answer;
							const isWrong =
								isAnswered &&
								savedAnswer === option &&
								!currentQuestion.studentAnswer?.isCorrect;

							return (
								<button
									key={index}
									onClick={() => !isAnswered && setSelectedAnswer(option)}
									disabled={isAnswered || isSubmitting}
									className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
										isCorrect
											? "border-green-500 bg-green-50"
											: isWrong
											? "border-red-500 bg-red-50"
											: isSelected
											? "border-lamaPurple bg-lamaPurpleLight"
											: "border-gray-200 hover:border-lamaPurple hover:bg-gray-50"
									} ${
										isAnswered || isSubmitting
											? "cursor-not-allowed"
											: "cursor-pointer"
									}`}
								>
									<div className="flex items-center gap-3">
										<div
											className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
												isCorrect
													? "border-green-500 bg-green-500"
													: isWrong
													? "border-red-500 bg-red-500"
													: isSelected
													? "border-lamaPurple bg-lamaPurple"
													: "border-gray-300"
											}`}
										>
											{(isSelected || isCorrect) && (
												<div className="w-3 h-3 bg-white rounded-full"></div>
											)}
										</div>
										<span className="font-medium select-none">{option}</span>
									</div>
								</button>
							);
						})}
					</div>
				)}

				{/* Explanation (shown after answering) */}
				{isAnswered && currentQuestion.explanation && (
					<div className="mt-6 p-4 bg-lamaSkyLight rounded-lg">
						<h3 className="font-semibold text-lamaSky mb-2">Explanation:</h3>
						<p className="text-gray-700 select-none">
							{currentQuestion.explanation}
						</p>
					</div>
				)}
			</div>

			{/* Navigation Buttons */}
			<div className="flex items-center justify-between gap-4">
				<button
					onClick={handlePrevious}
					disabled={currentQuestionIndex === 0}
					className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
				>
					Previous
				</button>

				<div className="flex gap-2">
					{!isAnswered ? (
						<button
							onClick={handleAnswerSubmit}
							disabled={isSubmitting || !selectedAnswer}
							className="px-6 py-2 rounded-md bg-lamaPurple text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
						>
							{isSubmitting ? "Submitting..." : "Submit Answer"}
						</button>
					) : currentQuestionIndex === totalQuestions - 1 ? (
						<button
							onClick={handleFinishTest}
							className="px-6 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
						>
							Finish Test
						</button>
					) : (
						<button
							onClick={handleNext}
							className="px-6 py-2 rounded-md bg-lamaPurple text-white font-medium hover:bg-purple-600 transition-colors"
						>
							Next Question
						</button>
					)}
				</div>
			</div>

			{/* Question Navigator */}
			<div className="bg-white p-4 rounded-md">
				<h3 className="font-semibold mb-3">Question Navigator</h3>
				<div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
					{questions.map((q, index) => {
						const isPending =
							q.studentAnswer && q.studentAnswer.isCorrect === null;
						const isCorrect =
							q.studentAnswer && q.studentAnswer.isCorrect === true;
						const isIncorrect =
							q.studentAnswer && q.studentAnswer.isCorrect === false;

						return (
							<button
								key={q.id}
								onClick={() => {
									setCurrentQuestionIndex(index);
									setSelectedAnswer("");
								}}
								className={`w-10 h-10 rounded-md font-medium text-sm transition-colors ${
									index === currentQuestionIndex
										? "bg-lamaPurple text-white"
										: isPending
										? "bg-yellow-100 text-yellow-600"
										: isCorrect
										? "bg-green-100 text-green-600"
										: isIncorrect
										? "bg-red-100 text-red-600"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								{index + 1}
							</button>
						);
					})}
				</div>
			</div>

			{/* Finish Early Button */}
			{answeredCount > 0 && (
				<button
					onClick={handleFinishTest}
					className="w-full py-3 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
				>
					Finish Test ({answeredCount}/{totalQuestions} answered)
				</button>
			)}

			{/* Anti-Cheating Notice */}
			<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md text-sm">
				<p className="font-semibold text-yellow-800 mb-1">
					🛡️ Proctored Test Notice:
				</p>
				<ul className="text-yellow-700 space-y-1 ml-4 list-disc">
					<li>
						Tab switching, window minimizing, or exiting fullscreen will trigger
						penalties
					</li>
					<li>Right-click, copy/paste, and developer tools are disabled</li>
					<li>
						1st violation: -10% penalty | 2nd: -25% | 3rd: Auto-submit with -50%
					</li>
					<li>Multiple violations may result in test bans</li>
				</ul>
			</div>
		</div>
	);
};

export default AntiCheatingTestClient;
