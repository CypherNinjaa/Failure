"use client";

import { submitMCQAnswer } from "@/lib/actions";
import { MCQQuestion } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
};

const TakeTestClient = ({
	testId,
	attemptId,
	questions,
	testTitle,
}: TakeTestClientProps) => {
	const router = useRouter();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const currentQuestion = questions[currentQuestionIndex];
	const totalQuestions = questions.length;
	const answeredCount = questions.filter((q) => q.studentAnswer).length;

	// Check if current question is already answered
	const isAnswered = !!currentQuestion.studentAnswer;
	const savedAnswer = currentQuestion.studentAnswer?.userAnswer || "";

	const handleAnswerSubmit = async () => {
		if (!selectedAnswer && !isAnswered) {
			toast.error("Please select an answer");
			return;
		}

		if (isAnswered) {
			// Already answered, just move to next
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
			// Move to next question or refresh to show result
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

	return (
		<div className="flex flex-col gap-6">
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
			<div className="bg-white p-6 rounded-md">
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
										<span className="font-medium">{option}</span>
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
						<p className="text-gray-700">{currentQuestion.explanation}</p>
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
		</div>
	);
};

export default TakeTestClient;
