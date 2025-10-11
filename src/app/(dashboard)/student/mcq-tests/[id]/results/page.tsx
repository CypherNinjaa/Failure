import { completeMCQAttempt } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const ResultsPage = async ({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: { complete?: string; attemptId?: string };
}) => {
	const { userId } = auth();

	// If complete flag is set, complete the attempt first
	if (searchParams.complete === "true" && searchParams.attemptId) {
		await completeMCQAttempt(searchParams.attemptId);
		redirect(`/student/mcq-tests/${params.id}/results`);
	}

	// Fetch the test
	const test = await prisma.mCQTest.findUnique({
		where: { id: params.id },
		include: {
			subject: { select: { name: true } },
			class: { select: { name: true } },
			teacher: { select: { name: true, surname: true } },
			_count: { select: { questions: true } },
		},
	});

	if (!test) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold">Test Not Found</h1>
				<Link
					href="/student/mcq-tests"
					className="text-lamaPurple hover:underline mt-2 inline-block"
				>
					Back to Tests
				</Link>
			</div>
		);
	}

	// Fetch all completed attempts for this student and test
	const attempts = await prisma.mCQAttempt.findMany({
		where: {
			testId: params.id,
			studentId: userId!,
			completedAt: { not: null },
		},
		include: {
			answers: {
				include: {
					question: {
						select: {
							question: true,
							answer: true,
							explanation: true,
							questionType: true,
							options: true,
						},
					},
				},
			},
		},
		orderBy: { completedAt: "desc" },
	});

	if (attempts.length === 0) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold">{test.title}</h1>
				<p className="text-gray-500 mt-4">
					You haven&apos;t completed this test yet.
				</p>
				<div className="flex gap-4 mt-4">
					<Link href={`/student/mcq-tests/${params.id}/take`}>
						<button className="px-4 py-2 rounded-md bg-lamaPurple text-white hover:bg-purple-600">
							Take Test
						</button>
					</Link>
					<Link href="/student/mcq-tests">
						<button className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
							Back to Tests
						</button>
					</Link>
				</div>
			</div>
		);
	}

	const latestAttempt = attempts[0];
	const totalQuestions = test._count.questions;
	const correctAnswers = latestAttempt.answers.filter(
		(a) => a.isCorrect
	).length;
	const score = latestAttempt.score || 0;

	// Calculate statistics across all attempts
	const allScores = attempts.map((a) => a.score || 0);
	const bestScore = Math.max(...allScores);
	const averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

	return (
		<div className="flex-1 p-4 flex flex-col gap-4">
			{/* Header */}
			<div className="bg-white p-6 rounded-md">
				<h1 className="text-2xl font-bold">{test.title}</h1>
				{test.description && (
					<p className="text-gray-600 mt-2">{test.description}</p>
				)}
				<div className="flex gap-4 mt-3 text-sm text-gray-500">
					{test.subject && <span>Subject: {test.subject.name}</span>}
					{test.class && <span>Class: {test.class.name}</span>}
					<span>
						Teacher: {test.teacher.name} {test.teacher.surname}
					</span>
				</div>
			</div>

			{/* Overall Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-6 rounded-md">
					<h3 className="text-gray-500 text-sm font-medium">Latest Score</h3>
					<p className="text-3xl font-bold text-lamaPurple mt-2">
						{score.toFixed(1)}%
					</p>
					<p className="text-sm text-gray-500 mt-1">
						{correctAnswers}/{totalQuestions} correct
					</p>
				</div>
				<div className="bg-white p-6 rounded-md">
					<h3 className="text-gray-500 text-sm font-medium">Best Score</h3>
					<p className="text-3xl font-bold text-green-600 mt-2">
						{bestScore.toFixed(1)}%
					</p>
				</div>
				<div className="bg-white p-6 rounded-md">
					<h3 className="text-gray-500 text-sm font-medium">Average Score</h3>
					<p className="text-3xl font-bold text-lamaSky mt-2">
						{averageScore.toFixed(1)}%
					</p>
				</div>
				<div className="bg-white p-6 rounded-md">
					<h3 className="text-gray-500 text-sm font-medium">Attempts</h3>
					<p className="text-3xl font-bold text-gray-700 mt-2">
						{attempts.length}
					</p>
				</div>
			</div>

			{/* Latest Attempt Details */}
			<div className="bg-white p-6 rounded-md">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold">Latest Attempt Details</h2>
					<span className="text-sm text-gray-500">
						Completed:{" "}
						{latestAttempt.completedAt?.toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</div>

				<div className="space-y-6">
					{latestAttempt.answers.map((answer, index) => {
						const options = answer.question.options as string[];
						const isPending = answer.isCorrect === null;
						const isOpenEnded = answer.question.questionType === "OPEN_ENDED";

						return (
							<div
								key={answer.id}
								className={`p-4 rounded-lg border-2 ${
									isPending
										? "border-yellow-200 bg-yellow-50"
										: answer.isCorrect
										? "border-green-200 bg-green-50"
										: "border-red-200 bg-red-50"
								}`}
							>
								<div className="flex items-start gap-3">
									<div
										className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
											isPending
												? "bg-yellow-500 text-white"
												: answer.isCorrect
												? "bg-green-500 text-white"
												: "bg-red-500 text-white"
										}`}
									>
										{index + 1}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<span className="px-2 py-1 rounded-full bg-white text-xs font-medium">
												{answer.question.questionType.replace("_", " ")}
											</span>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													isPending
														? "bg-yellow-100 text-yellow-700"
														: answer.isCorrect
														? "bg-green-100 text-green-700"
														: "bg-red-100 text-red-700"
												}`}
											>
												{isPending
													? "Pending Review"
													: answer.isCorrect
													? "Correct"
													: "Incorrect"}
											</span>
										</div>
										<h3 className="font-semibold text-lg mb-3">
											{answer.question.question}
										</h3>

										{/* Open-Ended Question Display */}
										{isOpenEnded ? (
											<div className="space-y-3">
												<div className="p-4 bg-white rounded-lg border-2 border-gray-200">
													<h4 className="text-sm font-medium text-gray-600 mb-2">
														Your Answer:
													</h4>
													<p className="text-gray-800 whitespace-pre-wrap">
														{answer.userAnswer}
													</p>
												</div>

												{isPending ? (
													<div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
														<p className="text-yellow-700 font-medium">
															⏳ This answer is pending teacher review.
														</p>
													</div>
												) : (
													<div className="p-4 bg-white rounded-lg border-2 border-gray-200">
														<h4 className="text-sm font-medium text-gray-600 mb-2">
															Teacher&apos;s Expected Answer:
														</h4>
														<p className="text-gray-800">
															{answer.question.answer}
														</p>
													</div>
												)}
											</div>
										) : (
											/* Multiple Choice / True False Display */
											<div className="space-y-2 mb-3">
												{options.map((option, optIndex) => {
													const isCorrect = option === answer.question.answer;
													const isSelected = option === answer.userAnswer;

													return (
														<div
															key={optIndex}
															className={`p-3 rounded-lg ${
																isCorrect
																	? "bg-green-100 border-2 border-green-500"
																	: isSelected
																	? "bg-red-100 border-2 border-red-500"
																	: "bg-white border border-gray-200"
															}`}
														>
															<div className="flex items-center gap-2">
																{isCorrect && (
																	<span className="text-green-600 font-bold">
																		✓
																	</span>
																)}
																{isSelected && !isCorrect && (
																	<span className="text-red-600 font-bold">
																		✗
																	</span>
																)}
																<span
																	className={
																		isCorrect || isSelected ? "font-medium" : ""
																	}
																>
																	{option}
																</span>
																{isCorrect && (
																	<span className="ml-auto text-xs text-green-600 font-medium">
																		Correct Answer
																	</span>
																)}
																{isSelected && !isCorrect && (
																	<span className="ml-auto text-xs text-red-600 font-medium">
																		Your Answer
																	</span>
																)}
															</div>
														</div>
													);
												})}
											</div>
										)}

										{answer.question.explanation && !isPending && (
											<div className="p-3 bg-lamaSkyLight rounded-lg mt-3">
												<h4 className="font-semibold text-lamaSky mb-1">
													Explanation:
												</h4>
												<p className="text-gray-700 text-sm">
													{answer.question.explanation}
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* All Attempts History */}
			{attempts.length > 1 && (
				<div className="bg-white p-6 rounded-md">
					<h2 className="text-xl font-bold mb-4">Attempt History</h2>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4">Attempt</th>
									<th className="text-left py-3 px-4">Date</th>
									<th className="text-left py-3 px-4">Score</th>
									<th className="text-left py-3 px-4">Correct Answers</th>
								</tr>
							</thead>
							<tbody>
								{attempts.map((attempt, index) => {
									const correct = attempt.answers.filter(
										(a) => a.isCorrect
									).length;
									return (
										<tr
											key={attempt.id}
											className="border-b border-gray-100 hover:bg-gray-50"
										>
											<td className="py-3 px-4 font-medium">
												#{attempts.length - index}
											</td>
											<td className="py-3 px-4 text-sm text-gray-600">
												{attempt.completedAt?.toLocaleDateString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</td>
											<td className="py-3 px-4">
												<span
													className={`font-bold ${
														(attempt.score || 0) >= 70
															? "text-green-600"
															: (attempt.score || 0) >= 50
															? "text-yellow-600"
															: "text-red-600"
													}`}
												>
													{attempt.score?.toFixed(1)}%
												</span>
											</td>
											<td className="py-3 px-4 text-sm text-gray-600">
												{correct}/{totalQuestions}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex gap-4">
				<Link href={`/student/mcq-tests/${params.id}/take`}>
					<button className="px-6 py-3 rounded-md bg-lamaPurple text-white font-semibold hover:bg-purple-600 transition-colors">
						Take Test Again
					</button>
				</Link>
				<Link href="/student/mcq-tests">
					<button className="px-6 py-3 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors">
						Back to Tests
					</button>
				</Link>
			</div>
		</div>
	);
};

export default ResultsPage;
