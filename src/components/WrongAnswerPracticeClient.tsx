"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const WrongAnswerPracticeClient = ({
	wrongAnswers,
}: {
	wrongAnswers: any[];
}) => {
	const router = useRouter();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
	const [showExplanation, setShowExplanation] = useState(false);
	const [practicingMode, setPracticingMode] = useState(false);

	if (!practicingMode) {
		return (
			<button
				onClick={() => setPracticingMode(true)}
				className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-lg"
			>
				🚀 Start Practice Session
			</button>
		);
	}

	if (currentIndex >= wrongAnswers.length) {
		return (
			<div className="text-center py-8">
				<div className="text-6xl mb-4">🎉</div>
				<h2 className="text-2xl font-bold text-gray-800 mb-2">
					Practice Session Complete!
				</h2>
				<p className="text-gray-600 mb-6">
					Great job! Keep practicing to master these concepts.
				</p>
				<button
					onClick={() => router.refresh()}
					className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
				>
					Refresh Questions
				</button>
			</div>
		);
	}

	const current = wrongAnswers[currentIndex];
	const question = current.question;
	const options =
		question.options && typeof question.options === "string"
			? JSON.parse(question.options)
			: [];
	const correctAnswers =
		question.correctAnswers && typeof question.correctAnswers === "string"
			? JSON.parse(question.correctAnswers)
			: [];

	const handleAnswer = (answer: any) => {
		setSelectedAnswer(answer);
		setShowExplanation(true);

		// Check if correct
		let isCorrect = false;
		if (
			question.questionType === "MCQ" ||
			question.questionType === "TRUE_FALSE"
		) {
			isCorrect = answer === correctAnswers[0];
		} else if (question.questionType === "MULTI_SELECT") {
			isCorrect =
				JSON.stringify(answer.sort()) === JSON.stringify(correctAnswers.sort());
		}

		if (isCorrect) {
			toast.success("Correct! 🎉");
			// Mark as resolved after 3 correct attempts (simplified)
			setTimeout(() => {
				handleNext();
			}, 2000);
		} else {
			toast.error("Try again!");
		}
	};

	const handleNext = () => {
		setCurrentIndex(currentIndex + 1);
		setSelectedAnswer(null);
		setShowExplanation(false);
	};

	const handleSkip = () => {
		handleNext();
	};

	return (
		<div className="max-w-4xl mx-auto">
			{/* Progress Bar */}
			<div className="mb-6">
				<div className="flex justify-between text-sm text-gray-600 mb-2">
					<span>
						Question {currentIndex + 1} of {wrongAnswers.length}
					</span>
					<span>
						{((currentIndex / wrongAnswers.length) * 100).toFixed(0)}% Complete
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3">
					<div
						className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
						style={{
							width: `${(currentIndex / wrongAnswers.length) * 100}%`,
						}}
					></div>
				</div>
			</div>

			{/* Question Card */}
			<div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg">
				<div className="mb-6">
					<div className="flex gap-2 mb-4">
						<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
							{question.test.subject.name}
						</span>
						<span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
							{question.questionType.replace("_", " ")}
						</span>
						<span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
							Attempts: {current.attemptCount}
						</span>
					</div>
					<h3 className="text-xl font-bold text-gray-800 mb-2">
						{question.questionText}
					</h3>
					<p className="text-sm text-gray-600">From: {question.test.title}</p>
				</div>

				{/* Options */}
				{question.questionType === "MCQ" ||
				question.questionType === "TRUE_FALSE" ? (
					<div className="space-y-3 mb-6">
						{options.map((option: string, idx: number) => {
							const isSelected = selectedAnswer === option;
							const isCorrect = correctAnswers[0] === option;
							const showCorrect = showExplanation && isCorrect;
							const showWrong = showExplanation && isSelected && !isCorrect;

							return (
								<button
									key={idx}
									onClick={() => !showExplanation && handleAnswer(option)}
									disabled={showExplanation}
									className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
										showCorrect
											? "border-green-500 bg-green-50"
											: showWrong
											? "border-red-500 bg-red-50"
											: isSelected
											? "border-blue-500 bg-blue-50"
											: "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
									} ${
										showExplanation ? "cursor-not-allowed" : "cursor-pointer"
									}`}
								>
									<div className="flex justify-between items-center">
										<span className="font-medium">{option}</span>
										{showCorrect && (
											<span className="text-green-600 text-xl">✓</span>
										)}
										{showWrong && (
											<span className="text-red-600 text-xl">✗</span>
										)}
									</div>
								</button>
							);
						})}
					</div>
				) : question.questionType === "FILL_IN_BLANK" ? (
					<div className="mb-6">
						<input
							type="text"
							placeholder="Type your answer..."
							className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
							onKeyDown={(e) => {
								if (e.key === "Enter" && !showExplanation) {
									handleAnswer(e.currentTarget.value);
								}
							}}
							disabled={showExplanation}
						/>
					</div>
				) : null}

				{/* Explanation */}
				{showExplanation && question.explanation && (
					<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
						<p className="text-sm font-semibold text-blue-800 mb-1">
							💡 Explanation:
						</p>
						<p className="text-sm text-blue-900">{question.explanation}</p>
					</div>
				)}

				{/* Actions */}
				<div className="flex gap-3">
					{!showExplanation ? (
						<button
							onClick={handleSkip}
							className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
						>
							Skip
						</button>
					) : (
						<button
							onClick={handleNext}
							className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
						>
							Next Question →
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default WrongAnswerPracticeClient;
