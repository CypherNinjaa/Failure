import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import TestAnalyticsCharts from "@/components/TestAnalyticsCharts";

const TestAnalyticsPage = async ({
	params,
}: {
	params: { testId: string };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "teacher" && role !== "admin") {
		redirect("/");
	}

	const testId = parseInt(params.testId);

	// Fetch test with all analytics data
	const test = await prisma.mCQTest.findUnique({
		where: { id: testId },
		include: {
			subject: { select: { name: true } },
			class: { select: { name: true } },
			questions: {
				select: {
					id: true,
					questionText: true,
					points: true,
					questionType: true,
				},
			},
			attempts: {
				include: {
					student: {
						select: {
							name: true,
							surname: true,
							img: true,
						},
					},
				},
				orderBy: {
					submittedAt: "desc",
				},
			},
		},
	});

	if (!test) {
		redirect("/list/mcq-tests");
	}

	// Fetch wrong answers separately for question difficulty analysis
	const wrongAnswersData = await prisma.wrongAnswer.findMany({
		where: {
			question: {
				testId: testId,
			},
		},
		select: {
			questionId: true,
			attemptCount: true,
		},
	});

	// Calculate analytics
	const totalAttempts = test.attempts.length;
	const completedAttempts = test.attempts.filter((a) => a.submittedAt).length;
	const averageScore =
		completedAttempts > 0
			? test.attempts.reduce((sum, a) => sum + a.score, 0) / completedAttempts
			: 0;
	const averagePercentage =
		test.totalPoints > 0 ? (averageScore / test.totalPoints) * 100 : 0;
	const passedCount = test.attempts.filter(
		(a) => (a.score / test.totalPoints) * 100 >= (test.passingScore || 70)
	).length;
	const passRate =
		completedAttempts > 0 ? (passedCount / completedAttempts) * 100 : 0;
	const flaggedCount = test.attempts.filter((a) => a.isFlagged).length;

	// Score distribution (0-20, 21-40, 41-60, 61-80, 81-100)
	const scoreRanges = [
		{ range: "0-20%", count: 0 },
		{ range: "21-40%", count: 0 },
		{ range: "41-60%", count: 0 },
		{ range: "61-80%", count: 0 },
		{ range: "81-100%", count: 0 },
	];

	test.attempts.forEach((attempt) => {
		const percentage = (attempt.score / test.totalPoints) * 100;
		if (percentage <= 20) scoreRanges[0].count++;
		else if (percentage <= 40) scoreRanges[1].count++;
		else if (percentage <= 60) scoreRanges[2].count++;
		else if (percentage <= 80) scoreRanges[3].count++;
		else scoreRanges[4].count++;
	});

	// Question difficulty analysis
	const questionStats = test.questions.map((q) => {
		// Count wrong answers from the wrongAnswersData
		const wrongCount = wrongAnswersData.filter(
			(wa) => wa.questionId === q.id
		).length;
		const correctCount = Math.max(0, totalAttempts - wrongCount);
		const correctPercentage =
			totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;

		return {
			id: q.id,
			text: q.questionText,
			type: q.questionType,
			points: q.points,
			correctPercentage,
			wrongCount,
			correctCount,
			difficulty:
				correctPercentage >= 80
					? "Easy"
					: correctPercentage >= 50
					? "Medium"
					: "Hard",
		};
	});

	// Time spent analysis (average)
	const averageTimeSpent =
		completedAttempts > 0
			? test.attempts.reduce((sum, a) => {
					if (a.submittedAt && a.startedAt) {
						return (
							sum +
							(new Date(a.submittedAt).getTime() -
								new Date(a.startedAt).getTime()) /
								60000
						);
					}
					return sum;
			  }, 0) / completedAttempts
			: 0;

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<Link
							href={`/list/mcq-tests/${testId}`}
							className="text-blue-600 hover:underline text-sm"
						>
							← Back to Test
						</Link>
					</div>
					<h1 className="text-2xl font-bold text-gray-800">
						📊 Test Analytics: {test.title}
					</h1>
					<p className="text-sm text-gray-600 mt-1">
						{test.subject.name} • {test.class.name}
					</p>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
					<p className="text-sm opacity-90 mb-1">Total Attempts</p>
					<p className="text-4xl font-bold">{totalAttempts}</p>
				</div>
				<div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
					<p className="text-sm opacity-90 mb-1">Average Score</p>
					<p className="text-4xl font-bold">{averagePercentage.toFixed(1)}%</p>
					<p className="text-xs opacity-75">
						{averageScore.toFixed(1)} / {test.totalPoints} points
					</p>
				</div>
				<div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
					<p className="text-sm opacity-90 mb-1">Pass Rate</p>
					<p className="text-4xl font-bold">{passRate.toFixed(1)}%</p>
					<p className="text-xs opacity-75">
						{passedCount} / {completedAttempts} passed
					</p>
				</div>
				<div
					className={`bg-gradient-to-br ${
						flaggedCount > 0
							? "from-red-500 to-red-600"
							: "from-gray-500 to-gray-600"
					} text-white p-6 rounded-lg shadow-lg`}
				>
					<p className="text-sm opacity-90 mb-1">Flagged Attempts</p>
					<p className="text-4xl font-bold">{flaggedCount}</p>
					<p className="text-xs opacity-75">Suspicious activity</p>
				</div>
			</div>

			{/* Charts */}
			<TestAnalyticsCharts
				scoreRanges={scoreRanges}
				questionStats={questionStats}
			/>

			{/* Detailed Statistics */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Question Difficulty Analysis */}
				<div className="bg-white border rounded-lg p-6">
					<h3 className="font-semibold text-gray-700 mb-4">
						Question Difficulty
					</h3>
					<div className="space-y-3">
						{questionStats.map((q, idx) => (
							<div key={q.id} className="border-b pb-3 last:border-0">
								<div className="flex justify-between items-start mb-2">
									<div className="flex-1">
										<span className="text-sm font-medium text-gray-700">
											Q{idx + 1}. {q.text.substring(0, 50)}
											{q.text.length > 50 ? "..." : ""}
										</span>
										<div className="flex gap-2 mt-1">
											<span
												className={`text-xs px-2 py-1 rounded ${
													q.difficulty === "Easy"
														? "bg-green-100 text-green-700"
														: q.difficulty === "Medium"
														? "bg-yellow-100 text-yellow-700"
														: "bg-red-100 text-red-700"
												}`}
											>
												{q.difficulty}
											</span>
											<span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
												{q.type.replace("_", " ")}
											</span>
										</div>
									</div>
									<span className="text-lg font-bold text-green-600 ml-2">
										{q.correctPercentage.toFixed(0)}%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className={`h-2 rounded-full ${
											q.correctPercentage >= 80
												? "bg-green-500"
												: q.correctPercentage >= 50
												? "bg-yellow-500"
												: "bg-red-500"
										}`}
										style={{ width: `${q.correctPercentage}%` }}
									></div>
								</div>
								<p className="text-xs text-gray-600 mt-1">
									✓ {q.correctCount} correct • ✗ {q.wrongCount} wrong
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Additional Metrics */}
				<div className="space-y-6">
					{/* Time Spent */}
					<div className="bg-white border rounded-lg p-6">
						<h3 className="font-semibold text-gray-700 mb-4">Time Analysis</h3>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-gray-600">Average Time Spent:</span>
								<span className="font-semibold">
									{averageTimeSpent.toFixed(1)} min
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Allocated Time:</span>
								<span className="font-semibold">{test.duration} min</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Time Utilization:</span>
								<span className="font-semibold">
									{((averageTimeSpent / test.duration) * 100).toFixed(0)}%
								</span>
							</div>
						</div>
					</div>

					{/* Completion Status */}
					<div className="bg-white border rounded-lg p-6">
						<h3 className="font-semibold text-gray-700 mb-4">
							Completion Status
						</h3>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-gray-600">Completed:</span>
								<span className="font-semibold text-green-600">
									{completedAttempts}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">In Progress:</span>
								<span className="font-semibold text-yellow-600">
									{totalAttempts - completedAttempts}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Completion Rate:</span>
								<span className="font-semibold">
									{totalAttempts > 0
										? ((completedAttempts / totalAttempts) * 100).toFixed(0)
										: 0}
									%
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Attempts Table */}
			<div className="bg-white border rounded-lg">
				<div className="bg-gray-50 px-6 py-4 border-b">
					<h3 className="font-semibold text-gray-700">Recent Attempts</h3>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-gray-50 text-left text-sm text-gray-600">
								<th className="px-6 py-3">Student</th>
								<th className="px-6 py-3">Score</th>
								<th className="px-6 py-3">Percentage</th>
								<th className="px-6 py-3">Status</th>
								<th className="px-6 py-3">Time Spent</th>
								<th className="px-6 py-3">Submitted At</th>
							</tr>
						</thead>
						<tbody>
							{test.attempts.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-8 text-center text-gray-500"
									>
										No attempts yet
									</td>
								</tr>
							) : (
								test.attempts.slice(0, 10).map((attempt) => {
									const percentage = (attempt.score / test.totalPoints) * 100;
									const passed = percentage >= (test.passingScore || 70);
									const timeSpent =
										attempt.submittedAt && attempt.startedAt
											? (
													(new Date(attempt.submittedAt).getTime() -
														new Date(attempt.startedAt).getTime()) /
													60000
											  ).toFixed(1)
											: "N/A";

									return (
										<tr
											key={attempt.id}
											className={`border-b hover:bg-gray-50 ${
												attempt.isFlagged ? "bg-red-50" : ""
											}`}
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{attempt.student.name} {attempt.student.surname}
													</span>
													{attempt.isFlagged && (
														<span className="text-red-600 text-xs">
															🚩 Flagged
														</span>
													)}
												</div>
											</td>
											<td className="px-6 py-4 font-semibold">
												{attempt.score} / {test.totalPoints}
											</td>
											<td className="px-6 py-4">
												<span
													className={`font-semibold ${
														passed ? "text-green-600" : "text-red-600"
													}`}
												>
													{percentage.toFixed(1)}%
												</span>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														passed
															? "bg-green-100 text-green-700"
															: "bg-red-100 text-red-700"
													}`}
												>
													{passed ? "Passed" : "Failed"}
												</span>
											</td>
											<td className="px-6 py-4 text-gray-600">
												{timeSpent} min
											</td>
											<td className="px-6 py-4 text-sm text-gray-600">
												{attempt.submittedAt
													? new Date(attempt.submittedAt).toLocaleString()
													: "In progress"}
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default TestAnalyticsPage;
