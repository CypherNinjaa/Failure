import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Confetti from "@/components/Confetti";

const TestResultPage = async ({ params }: { params: { testId: string } }) => {
	const { sessionClaims, userId } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;
	const studentId = userId as string;

	if (role !== "student" || !studentId) {
		redirect("/");
	}

	const testId = parseInt(params.testId);

	// Fetch attempt
	const attempt = await prisma.mCQAttempt.findUnique({
		where: {
			testId_studentId: {
				testId,
				studentId,
			},
		},
		include: {
			test: {
				include: {
					subject: { select: { name: true } },
					class: { select: { name: true } },
				},
			},
		},
	});

	if (!attempt) {
		redirect("/list/mcq-tests");
	}

	const passed = attempt.percentageScore >= (attempt.test.passingScore || 70);

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			{passed && <Confetti />}
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-md p-8 mb-4">
					<div className="text-center mb-6">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							{attempt.test.title}
						</h1>
						<p className="text-gray-600">
							{attempt.test.subject.name} • {attempt.test.class.name}
						</p>
					</div>

					{/* Result Badge */}
					<div className="flex justify-center mb-6">
						{passed ? (
							<div className="bg-green-100 border-2 border-green-500 rounded-full px-8 py-4">
								<p className="text-green-700 text-2xl font-bold">
									🎉 Passed! 🎉
								</p>
							</div>
						) : (
							<div className="bg-yellow-100 border-2 border-yellow-500 rounded-full px-8 py-4">
								<p className="text-yellow-700 text-2xl font-bold">
									Keep Practicing!
								</p>
							</div>
						)}
					</div>

					{/* Score Display */}
					<div className="grid grid-cols-2 gap-4 mb-6">
						<div className="bg-blue-50 p-6 rounded-lg text-center">
							<p className="text-sm text-gray-600 mb-2">Your Score</p>
							<p className="text-4xl font-bold text-blue-600">
								{attempt.score} / {attempt.totalPoints}
							</p>
						</div>
						<div className="bg-purple-50 p-6 rounded-lg text-center">
							<p className="text-sm text-gray-600 mb-2">Percentage</p>
							<p className="text-4xl font-bold text-purple-600">
								{attempt.percentageScore.toFixed(2)}%
							</p>
						</div>
					</div>

					{/* Statistics */}
					<div className="grid grid-cols-3 gap-4 mb-6">
						<div className="bg-green-50 p-4 rounded-lg text-center">
							<p className="text-sm text-gray-600 mb-1">Correct</p>
							<p className="text-2xl font-bold text-green-600">
								{attempt.correctAnswers}
							</p>
						</div>
						<div className="bg-red-50 p-4 rounded-lg text-center">
							<p className="text-sm text-gray-600 mb-1">Wrong</p>
							<p className="text-2xl font-bold text-red-600">
								{attempt.wrongAnswers}
							</p>
						</div>
						<div className="bg-gray-50 p-4 rounded-lg text-center">
							<p className="text-sm text-gray-600 mb-1">Unanswered</p>
							<p className="text-2xl font-bold text-gray-600">
								{attempt.unanswered}
							</p>
						</div>
					</div>

					{/* Time Spent */}
					<div className="bg-gray-100 p-4 rounded-lg text-center mb-6">
						<p className="text-sm text-gray-600 mb-1">Time Spent</p>
						<p className="text-xl font-semibold text-gray-800">
							{Math.floor(attempt.timeSpent / 60)} min {attempt.timeSpent % 60}{" "}
							sec
						</p>
					</div>

					{/* Warning Messages */}
					{(attempt.tabSwitches > 0 || attempt.copyPasteAttempts > 0) && (
						<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
							<p className="font-semibold text-yellow-800 mb-2">
								⚠️ Suspicious Activity Detected
							</p>
							{attempt.tabSwitches > 0 && (
								<p className="text-yellow-700 text-sm">
									• {attempt.tabSwitches} tab switch
									{attempt.tabSwitches > 1 ? "es" : ""}
								</p>
							)}
							{attempt.copyPasteAttempts > 0 && (
								<p className="text-yellow-700 text-sm">
									• {attempt.copyPasteAttempts} copy-paste attempt
									{attempt.copyPasteAttempts > 1 ? "s" : ""}
								</p>
							)}
						</div>
					)}

					{attempt.isFlagged && (
						<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
							<p className="font-semibold text-red-800">
								🚫 This attempt has been flagged for review by your teacher.
							</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-4 justify-center">
						<Link
							href="/list/mcq-tests"
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
						>
							Back to Tests
						</Link>
						<Link
							href="/student/leaderboard"
							className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
						>
							View Leaderboard
						</Link>
					</div>
				</div>

				{/* Motivational Message */}
				<div className="bg-white rounded-lg shadow-md p-6 text-center">
					{passed ? (
						<p className="text-lg text-gray-700">
							Excellent work! You&apos;ve mastered this topic. Keep up the great
							effort! 🌟
						</p>
					) : (
						<p className="text-lg text-gray-700">
							Don&apos;t give up! Review the material and try practice questions
							to improve your score. You&apos;ve got this! 💪
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default TestResultPage;
