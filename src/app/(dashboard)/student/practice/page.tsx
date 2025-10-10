import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import WrongAnswerPracticeClient from "@/components/WrongAnswerPracticeClient";

const WrongAnswerPracticePage = async () => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "student" || !userId) {
		redirect("/");
	}

	// Fetch all wrong answers for this student
	const wrongAnswers = await prisma.wrongAnswer.findMany({
		where: {
			studentId: userId,
			isResolved: false,
		},
		include: {
			question: {
				include: {
					test: {
						select: {
							id: true,
							title: true,
							subject: { select: { name: true } },
						},
					},
				},
			},
		},
		orderBy: {
			attemptCount: "asc", // Practice questions with fewer attempts first
		},
	});

	// Group by subject
	const groupedBySubject = wrongAnswers.reduce((acc, wa) => {
		const subject = wa.question.test.subject.name;
		if (!acc[subject]) {
			acc[subject] = [];
		}
		acc[subject].push(wa);
		return acc;
	}, {} as Record<string, typeof wrongAnswers>);

	const totalWrongAnswers = wrongAnswers.length;
	const subjects = Object.keys(groupedBySubject);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					🎯 Wrong Answer Practice
				</h1>
				<p className="text-gray-600">
					Practice questions you got wrong to improve your understanding
				</p>
			</div>

			{/* Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
					<p className="text-sm opacity-90 mb-1">Questions to Practice</p>
					<p className="text-4xl font-bold">{totalWrongAnswers}</p>
				</div>
				<div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
					<p className="text-sm opacity-90 mb-1">Subjects</p>
					<p className="text-4xl font-bold">{subjects.length}</p>
				</div>
				<div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
					<p className="text-sm opacity-90 mb-1">Average Attempts</p>
					<p className="text-4xl font-bold">
						{totalWrongAnswers > 0
							? (
									wrongAnswers.reduce((sum, wa) => sum + wa.attemptCount, 0) /
									totalWrongAnswers
							  ).toFixed(1)
							: 0}
					</p>
				</div>
			</div>

			{totalWrongAnswers === 0 ? (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">🎉</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Great job!</h2>
					<p className="text-gray-600 mb-6">
						You don&apos;t have any questions to practice right now.
					</p>
					<Link
						href="/list/mcq-tests"
						className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
					>
						Take More Tests
					</Link>
				</div>
			) : (
				<>
					{/* Subject Tabs */}
					<div className="bg-white border rounded-lg">
						<div className="bg-gray-50 px-6 py-4 border-b">
							<h3 className="font-semibold text-gray-700">
								Questions by Subject
							</h3>
						</div>

						<div className="p-6">
							{subjects.map((subject) => (
								<div key={subject} className="mb-6 last:mb-0">
									<div className="flex items-center justify-between mb-4">
										<h4 className="text-lg font-semibold text-gray-800">
											{subject}
										</h4>
										<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
											{groupedBySubject[subject].length} questions
										</span>
									</div>

									<div className="space-y-3">
										{groupedBySubject[subject].map((wa) => (
											<div
												key={wa.id}
												className="border rounded-lg p-4 hover:bg-gray-50"
											>
												<div className="flex justify-between items-start mb-2">
													<div className="flex-1">
														<p className="text-sm text-gray-600 mb-1">
															From: {wa.question.test.title}
														</p>
														<p className="font-medium text-gray-800 mb-2">
															{wa.question.questionText}
														</p>
														<div className="flex gap-2">
															<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
																{wa.question.questionType.replace("_", " ")}
															</span>
															<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
																{wa.question.points} points
															</span>
															<span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
																Attempted: {wa.attemptCount} times
															</span>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Practice Button */}
					<div className="mt-6 text-center">
						<WrongAnswerPracticeClient wrongAnswers={wrongAnswers} />
					</div>
				</>
			)}
		</div>
	);
};

export default WrongAnswerPracticePage;
