import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import GradeAnswerForm from "@/components/GradeAnswerForm";

const GradePage = async ({ params }: { params: { id: string } }) => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Fetch the test
	const test = await prisma.mCQTest.findUnique({
		where: { id: params.id },
		include: {
			subject: { select: { name: true } },
			class: { select: { name: true } },
			teacher: { select: { name: true, surname: true } },
		},
	});

	if (!test) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold">Test Not Found</h1>
				<Link
					href="/list/mcq-tests"
					className="text-lamaPurple hover:underline mt-2 inline-block"
				>
					Back to Tests
				</Link>
			</div>
		);
	}

	// Check access - only test creator or admin can grade
	if (role !== "admin" && test.teacherId !== userId) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold">Access Denied</h1>
				<p className="text-gray-500 mt-4">
					You can only grade answers for your own tests.
				</p>
				<Link
					href="/list/mcq-tests"
					className="text-lamaPurple hover:underline mt-2 inline-block"
				>
					Back to Tests
				</Link>
			</div>
		);
	}

	// Fetch all pending answers (open-ended questions with isCorrect = null)
	const pendingAnswers = await prisma.studentAnswer.findMany({
		where: {
			attempt: {
				testId: params.id,
			},
			isCorrect: null, // Only ungraded answers
			question: {
				questionType: "OPEN_ENDED",
			},
		},
		include: {
			question: {
				select: {
					question: true,
					answer: true,
					explanation: true,
					orderIndex: true,
				},
			},
			attempt: {
				include: {
					student: {
						select: {
							name: true,
							surname: true,
							username: true,
						},
					},
				},
			},
		},
		orderBy: [
			{ attempt: { student: { name: "asc" } } },
			{ question: { orderIndex: "asc" } },
		],
	});

	// Fetch graded answers for reference
	const gradedAnswers = await prisma.studentAnswer.findMany({
		where: {
			attempt: {
				testId: params.id,
			},
			isCorrect: { not: null },
			question: {
				questionType: "OPEN_ENDED",
			},
		},
		include: {
			question: {
				select: {
					question: true,
					answer: true,
					orderIndex: true,
				},
			},
			attempt: {
				include: {
					student: {
						select: {
							name: true,
							surname: true,
						},
					},
				},
			},
			grader: {
				select: {
					name: true,
					surname: true,
				},
			},
		},
		orderBy: { gradedAt: "desc" },
		take: 10,
	});

	return (
		<div className="flex-1 p-4 flex flex-col gap-4">
			{/* Header */}
			<div className="bg-white p-6 rounded-md">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">Grade Open-Ended Answers</h1>
						<h2 className="text-lg text-gray-600 mt-1">{test.title}</h2>
						<div className="flex gap-4 mt-2 text-sm text-gray-500">
							{test.subject && <span>Subject: {test.subject.name}</span>}
							{test.class && <span>Class: {test.class.name}</span>}
						</div>
					</div>
					<Link href={`/list/mcq-tests/${params.id}`}>
						<button className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
							Back to Test
						</button>
					</Link>
				</div>
			</div>

			{/* Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white p-6 rounded-md">
					<h3 className="text-gray-500 text-sm font-medium">Pending Review</h3>
					<p className="text-3xl font-bold text-yellow-600 mt-2">
						{pendingAnswers.length}
					</p>
				</div>
				<div className="bg-white p-6 rounded-md">
					<h3 className="text-gray-500 text-sm font-medium">Recently Graded</h3>
					<p className="text-3xl font-bold text-green-600 mt-2">
						{gradedAnswers.length}
					</p>
				</div>
				<div className="bg-white p-6 rounded-md">
					<h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
					<p className="text-3xl font-bold text-lamaPurple mt-2">
						{new Set(pendingAnswers.map((a) => a.attempt.studentId)).size +
							new Set(gradedAnswers.map((a) => a.attempt.studentId)).size}
					</p>
				</div>
			</div>

			{/* Pending Answers */}
			{pendingAnswers.length > 0 ? (
				<div className="bg-white p-6 rounded-md">
					<h2 className="text-xl font-bold mb-4">Answers Awaiting Review</h2>
					<div className="space-y-6">
						{pendingAnswers.map((answer) => (
							<div
								key={answer.id}
								className="p-6 border-2 border-yellow-200 rounded-lg bg-yellow-50"
							>
								<div className="flex items-start justify-between mb-4">
									<div>
										<h3 className="font-semibold text-lg">
											{answer.attempt.student.name}{" "}
											{answer.attempt.student.surname}
										</h3>
										<p className="text-sm text-gray-500">
											@{answer.attempt.student.username} • Submitted:{" "}
											{answer.answeredAt.toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
									<span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
										Pending
									</span>
								</div>

								<div className="mb-4">
									<h4 className="font-semibold text-gray-700 mb-2">
										Question:
									</h4>
									<p className="text-gray-800">{answer.question.question}</p>
								</div>

								<div className="mb-4">
									<h4 className="font-semibold text-gray-700 mb-2">
										Student&apos;s Answer:
									</h4>
									<div className="p-4 bg-white rounded-lg border border-gray-200">
										<p className="text-gray-800 whitespace-pre-wrap">
											{answer.userAnswer}
										</p>
									</div>
								</div>

								<div className="mb-4">
									<h4 className="font-semibold text-gray-700 mb-2">
										Expected Answer:
									</h4>
									<div className="p-4 bg-lamaSkyLight rounded-lg">
										<p className="text-gray-800">{answer.question.answer}</p>
									</div>
								</div>

								{answer.question.explanation && (
									<div className="mb-4">
										<h4 className="font-semibold text-gray-700 mb-2">
											Explanation:
										</h4>
										<p className="text-gray-600 text-sm">
											{answer.question.explanation}
										</p>
									</div>
								)}

								<GradeAnswerForm answerId={answer.id} />
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="bg-white p-6 rounded-md text-center">
					<div className="py-12">
						<Image
							src="/noData.png"
							alt="No pending answers"
							width={200}
							height={200}
							className="mx-auto opacity-50"
						/>
						<h3 className="text-xl font-semibold text-gray-600 mt-4">
							No Pending Answers
						</h3>
						<p className="text-gray-500 mt-2">
							All open-ended answers have been graded!
						</p>
					</div>
				</div>
			)}

			{/* Recently Graded */}
			{gradedAnswers.length > 0 && (
				<div className="bg-white p-6 rounded-md">
					<h2 className="text-xl font-bold mb-4">Recently Graded (Last 10)</h2>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4">Student</th>
									<th className="text-left py-3 px-4">Question</th>
									<th className="text-left py-3 px-4">Result</th>
									<th className="text-left py-3 px-4">Graded By</th>
									<th className="text-left py-3 px-4">Date</th>
								</tr>
							</thead>
							<tbody>
								{gradedAnswers.map((answer) => (
									<tr
										key={answer.id}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-3 px-4">
											{answer.attempt.student.name}{" "}
											{answer.attempt.student.surname}
										</td>
										<td className="py-3 px-4 text-sm text-gray-600">
											{answer.question.question.substring(0, 50)}...
										</td>
										<td className="py-3 px-4">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													answer.isCorrect
														? "bg-green-100 text-green-700"
														: "bg-red-100 text-red-700"
												}`}
											>
												{answer.isCorrect ? "Correct" : "Incorrect"}
											</span>
										</td>
										<td className="py-3 px-4 text-sm">
											{answer.grader
												? `${answer.grader.name} ${answer.grader.surname}`
												: "-"}
										</td>
										<td className="py-3 px-4 text-sm text-gray-600">
											{answer.gradedAt?.toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default GradePage;
