"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { submitMCQAttempt } from "@/lib/actions";
import Image from "next/image";

type TestAttemptClientProps = {
	test: any;
	studentId: string;
	existingAttempt: any;
};

const TestAttemptClient = ({
	test,
	studentId,
	existingAttempt,
}: TestAttemptClientProps) => {
	const router = useRouter();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<{ [key: number]: any }>({});
	const [timeLeft, setTimeLeft] = useState(test.duration * 60); // Convert minutes to seconds
	const [tabSwitches, setTabSwitches] = useState(0);
	const [copyPasteAttempts, setCopyPasteAttempts] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [fullscreenExits, setFullscreenExits] = useState(0);
	const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
	const startTime = useRef(Date.now());

	// Shuffle questions ONCE on mount and store in state
	const [shuffledQuestions] = useState(() => {
		return test.shuffleQuestions
			? [...test.questions].sort(() => Math.random() - 0.5)
			: test.questions;
	});

	// Request fullscreen on mount
	useEffect(() => {
		const requestFullscreen = () => {
			const elem = document.documentElement;
			if (elem.requestFullscreen) {
				elem.requestFullscreen().catch((err) => {
					console.log("Fullscreen error:", err);
					toast.info("Please allow fullscreen mode for better test experience");
				});
			}
		};

		requestFullscreen();

		// Detect fullscreen exit
		const handleFullscreenChange = () => {
			if (!document.fullscreenElement) {
				setFullscreenExits((prev) => prev + 1);
				setShowFullscreenWarning(true);
				toast.error("⚠️ Please return to fullscreen mode!");
			} else {
				setShowFullscreenWarning(false);
			}
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
			if (document.fullscreenElement) {
				document.exitFullscreen();
			}
		};
	}, []);

	// Timer
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					handleSubmit();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Tab switch detection
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				setTabSwitches((prev) => prev + 1);
				toast.warning("⚠️ Tab switch detected!");
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	// Copy-paste prevention
	useEffect(() => {
		const preventCopyPaste = (e: ClipboardEvent) => {
			e.preventDefault();
			setCopyPasteAttempts((prev) => prev + 1);
			toast.error("❌ Copy-paste is disabled!");
		};

		const preventContextMenu = (e: MouseEvent) => {
			e.preventDefault();
			toast.error("❌ Right-click is disabled!");
		};

		document.addEventListener("copy", preventCopyPaste);
		document.addEventListener("paste", preventCopyPaste);
		document.addEventListener("cut", preventCopyPaste);
		document.addEventListener("contextmenu", preventContextMenu);

		return () => {
			document.removeEventListener("copy", preventCopyPaste);
			document.removeEventListener("paste", preventCopyPaste);
			document.removeEventListener("cut", preventCopyPaste);
			document.removeEventListener("contextmenu", preventContextMenu);
		};
	}, []);

	const currentQuestion = shuffledQuestions[currentQuestionIndex];

	// Memoize shuffled options for each question (only shuffle once)
	const [shuffledOptionsCache] = useState<{ [key: string | number]: any }>(
		() => {
			const cache: { [key: string | number]: any } = {};
			if (test.shuffleOptions) {
				shuffledQuestions.forEach((question: any) => {
					if (question.options) {
						try {
							// Handle both string and object options
							const options =
								typeof question.options === "string"
									? JSON.parse(question.options)
									: question.options;

							if (
								question.questionType === "MATCH_FOLLOWING" &&
								Array.isArray(options)
							) {
								// For MATCH_FOLLOWING, shuffle right-side items and store mapping
								const rightItems = options.map((p: any) => p.right);
								const shuffledRight = [...rightItems].sort(
									() => Math.random() - 0.5
								);
								// Store the shuffled right items
								cache[`match_${question.id}`] = shuffledRight;
							} else if (Array.isArray(options)) {
								// For other question types, shuffle options normally
								cache[question.id] = [...options].sort(
									() => Math.random() - 0.5
								);
							}
						} catch (error) {
							console.error("Error parsing question options:", error);
							// Store original if parsing fails
							cache[question.id] =
								typeof question.options === "string"
									? question.options
									: question.options;
						}
					}
				});
			}
			return cache;
		}
	);

	// Get shuffled options for a question (from cache or original)
	const getShuffledOptions = (question: any) => {
		if (!test.shuffleOptions || !question.options) {
			try {
				return typeof question.options === "string"
					? JSON.parse(question.options)
					: question.options;
			} catch {
				return question.options;
			}
		}
		return shuffledOptionsCache[question.id] || question.options;
	};

	const handleAnswer = (questionId: number, answer: any) => {
		setAnswers((prev) => ({ ...prev, [questionId]: answer }));
	};

	const handleMultiSelect = (questionId: number, optionIndex: number) => {
		setAnswers((prev) => {
			const current = prev[questionId] || [];
			const newAnswer = current.includes(optionIndex)
				? current.filter((i: number) => i !== optionIndex)
				: [...current, optionIndex];
			return { ...prev, [questionId]: newAnswer };
		});
	};

	const handleSubmit = async () => {
		if (isSubmitting) return;

		setIsSubmitting(true);
		const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);

		try {
			// Frontend only sends the raw answers - no processing needed
			// Backend is the single source of truth for verification
			const result = await submitMCQAttempt(
				{ success: false, error: false, message: "" },
				{
					testId: test.id,
					studentId,
					answers: JSON.stringify(answers),
					timeSpent,
					tabSwitches,
					copyPasteAttempts,
				}
			);

			if (result.success && result.data) {
				// Show celebration if passed
				const passed = result.data.percentageScore >= (test.passingScore || 70);
				if (passed) {
					toast.success("🎉 Congratulations! You passed the test!");
				} else {
					toast.info("Test submitted. Keep practicing!");
				}

				// Redirect to results
				router.push(`/student/test/${test.id}/result`);
			} else {
				toast.error(result.message || "Failed to submit test");
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred while submitting");
			setIsSubmitting(false);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const renderQuestionInput = () => {
		const question = currentQuestion;
		const questionId = question.id;

		switch (question.questionType) {
			case "MULTIPLE_CHOICE":
				const mcOptions = getShuffledOptions(question);
				return (
					<div className="flex flex-col gap-3">
						{mcOptions.map((option: string, index: number) => (
							<label
								key={index}
								className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition"
							>
								<input
									type="radio"
									name={`question-${questionId}`}
									value={index}
									checked={answers[questionId] === index}
									onChange={() => handleAnswer(questionId, index)}
									className="w-5 h-5"
								/>
								<span className="text-base">{option}</span>
							</label>
						))}
					</div>
				);

			case "MULTI_SELECT":
				const msOptions = getShuffledOptions(question);
				return (
					<div className="flex flex-col gap-3">
						{msOptions.map((option: string, index: number) => (
							<label
								key={index}
								className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition"
							>
								<input
									type="checkbox"
									checked={(answers[questionId] || []).includes(index)}
									onChange={() => handleMultiSelect(questionId, index)}
									className="w-5 h-5"
								/>
								<span className="text-base">{option}</span>
							</label>
						))}
					</div>
				);

			case "TRUE_FALSE":
				return (
					<div className="flex flex-col gap-3">
						<label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
							<input
								type="radio"
								name={`question-${questionId}`}
								value="true"
								checked={answers[questionId] === "true"}
								onChange={() => handleAnswer(questionId, "true")}
								className="w-5 h-5"
							/>
							<span className="text-base">True</span>
						</label>
						<label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
							<input
								type="radio"
								name={`question-${questionId}`}
								value="false"
								checked={answers[questionId] === "false"}
								onChange={() => handleAnswer(questionId, "false")}
								className="w-5 h-5"
							/>
							<span className="text-base">False</span>
						</label>
					</div>
				);

			case "FILL_BLANK":
				return (
					<input
						type="text"
						value={answers[questionId] || ""}
						onChange={(e) => handleAnswer(questionId, e.target.value)}
						className="w-full p-4 border rounded-lg text-base"
						placeholder="Type your answer here..."
					/>
				);

			case "MATCH_FOLLOWING":
				try {
					if (!question.options) {
						throw new Error("No options provided for MATCH_FOLLOWING question");
					}

					const pairs =
						typeof question.options === "string"
							? JSON.parse(question.options)
							: question.options;

					if (!Array.isArray(pairs) || pairs.length === 0) {
						throw new Error("Invalid pairs format");
					}

					// Get shuffled right items from cache or use original order
					const cacheKey = `match_${question.id}`;
					const rightItems =
						shuffledOptionsCache[cacheKey] || pairs.map((p: any) => p.right);

					return (
						<div className="flex flex-col gap-3">
							<p className="text-sm text-gray-600 mb-2">
								Match the items by entering the corresponding number:
							</p>
							{pairs.map((pair: any, index: number) => (
								<div key={index} className="flex items-center gap-4">
									<span className="w-1/2 p-3 bg-gray-100 rounded-lg">
										{pair.left}
									</span>
									<span>↔</span>
									<input
										type="text"
										value={(answers[questionId] || [])[index] || ""}
										onChange={(e) => {
											const current = answers[questionId] || [];
											current[index] = e.target.value;
											handleAnswer(questionId, [...current]);
										}}
										className="w-20 p-2 border rounded text-center"
										placeholder="?"
									/>
								</div>
							))}
							<div className="mt-4 border-t pt-4">
								<p className="text-sm text-gray-600 mb-2 font-semibold">
									Options:
								</p>
								<div className="flex flex-col gap-2">
									{rightItems.map((item: string, idx: number) => (
										<span
											key={idx}
											className="p-2 bg-blue-50 rounded-lg text-sm"
										>
											{idx + 1}. {item}
										</span>
									))}
								</div>
							</div>
						</div>
					);
				} catch (error) {
					console.error("Error loading match pairs:", error);
					console.error("Question data:", question);
					return (
						<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-600 font-semibold mb-2">
								Error loading match pairs
							</p>
							<p className="text-sm text-red-500">
								This question has invalid data. Please contact the teacher to
								fix this question.
							</p>
							<details className="mt-2">
								<summary className="text-xs text-red-400 cursor-pointer">
									Technical details
								</summary>
								<pre className="text-xs mt-2 p-2 bg-white rounded">
									{JSON.stringify(
										{
											questionId: question.id,
											options: question.options,
											error:
												error instanceof Error ? error.message : String(error),
										},
										null,
										2
									)}
								</pre>
							</details>
						</div>
					);
				}

			default:
				return <p>Unsupported question type</p>;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			{/* Fullscreen Warning Modal */}
			{showFullscreenWarning && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-8 max-w-md">
						<div className="text-center">
							<div className="text-6xl mb-4">⚠️</div>
							<h3 className="text-2xl font-bold text-gray-800 mb-2">
								Return to Fullscreen
							</h3>
							<p className="text-gray-600 mb-6">
								Please return to fullscreen mode to continue the test. Exiting
								fullscreen is being tracked.
							</p>
							<button
								onClick={() => {
									const elem = document.documentElement;
									if (elem.requestFullscreen) {
										elem.requestFullscreen();
									}
								}}
								className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold w-full"
							>
								Return to Fullscreen
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Header */}
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-4">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">{test.title}</h1>
						<p className="text-sm text-gray-600">
							{test.subject.name} • {test.class.name}
						</p>
					</div>
					<div
						className={`text-3xl font-bold ${
							timeLeft < 300 ? "text-red-600" : "text-blue-600"
						}`}
					>
						⏱️ {formatTime(timeLeft)}
					</div>
				</div>

				{/* Warning indicators */}
				<div className="mt-4 flex gap-4 flex-wrap">
					{tabSwitches > 0 && (
						<div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
							⚠️ Tab switches: {tabSwitches}
						</div>
					)}
					{copyPasteAttempts > 0 && (
						<div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
							❌ Copy-paste attempts: {copyPasteAttempts}
						</div>
					)}
					{fullscreenExits > 0 && (
						<div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
							🔄 Fullscreen exits: {fullscreenExits}
						</div>
					)}
				</div>
			</div>

			{/* Question Card */}
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
				<div className="mb-6">
					<div className="flex justify-between items-center mb-4">
						<span className="text-sm text-gray-600">
							Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
						</span>
						<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
							{currentQuestion.points} point
							{currentQuestion.points > 1 ? "s" : ""}
						</span>
					</div>
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						{currentQuestion.questionText}
					</h2>
					{currentQuestion.imageUrl && (
						<Image
							src={currentQuestion.imageUrl}
							alt="Question"
							width={800}
							height={400}
							className="max-w-full h-auto rounded-lg mb-4"
						/>
					)}
				</div>

				{renderQuestionInput()}

				{/* Navigation */}
				<div className="flex justify-between mt-8">
					<button
						onClick={() =>
							setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
						}
						disabled={currentQuestionIndex === 0}
						className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
					>
						← Previous
					</button>
					{currentQuestionIndex < shuffledQuestions.length - 1 ? (
						<button
							onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
							className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
						>
							Next →
						</button>
					) : (
						<button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-semibold"
						>
							{isSubmitting ? "Submitting..." : "Submit Test"}
						</button>
					)}
				</div>
			</div>

			{/* Question Navigation Panel */}
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-4">
				<h3 className="text-lg font-semibold mb-4">Question Overview</h3>
				<div className="grid grid-cols-10 gap-2">
					{shuffledQuestions.map((q: any, index: number) => (
						<button
							key={q.id}
							onClick={() => setCurrentQuestionIndex(index)}
							className={`w-10 h-10 rounded-md font-semibold ${
								index === currentQuestionIndex
									? "bg-blue-600 text-white"
									: answers[q.id] !== undefined && answers[q.id] !== ""
									? "bg-green-500 text-white"
									: "bg-gray-200 text-gray-700"
							}`}
						>
							{index + 1}
						</button>
					))}
				</div>
				<div className="flex gap-4 mt-4 text-sm">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-blue-600 rounded"></div>
						<span>Current</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-green-500 rounded"></div>
						<span>Answered</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-gray-200 rounded"></div>
						<span>Unanswered</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TestAttemptClient;
