import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import FormContainer from "@/components/FormContainer";
import { publishMCQTest } from "@/lib/actions";
import PublishTestButton from "@/components/PublishTestButton";

const TestDetailPage = async ({ params }: { params: { testId: string } }) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "teacher" && role !== "admin") {
		redirect("/");
	}

	const testId = parseInt(params.testId);

	// Fetch test with all details
	const test = await prisma.mCQTest.findUnique({
		where: { id: testId },
		include: {
			subject: { select: { name: true } },
			class: { select: { name: true } },
			teacher: { select: { name: true, surname: true } },
			questions: {
				orderBy: { order: "asc" },
			},
			_count: {
				select: {
					attempts: true,
				},
			},
		},
	});

	if (!test) {
		redirect("/list/mcq-tests");
	}

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<Link
							href="/list/mcq-tests"
							className="text-blue-600 hover:underline text-sm"
						>
							← Back to Tests
						</Link>
					</div>
					<h1 className="text-2xl font-bold text-gray-800">{test.title}</h1>
					<p className="text-sm text-gray-600 mt-1">{test.description}</p>
				</div>
				<div className="flex gap-2">
					<PublishTestButton testId={test.id} isPublished={test.isPublished} />
					<FormContainer table="mcqTest" type="update" data={test} />
				</div>
			</div>

			{/* Test Info Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-blue-50 p-4 rounded-lg">
					<p className="text-sm text-gray-600 mb-1">Subject</p>
					<p className="text-lg font-semibold text-blue-700">
						{test.subject.name}
					</p>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg">
					<p className="text-sm text-gray-600 mb-1">Class</p>
					<p className="text-lg font-semibold text-purple-700">
						{test.class.name}
					</p>
				</div>
				<div className="bg-green-50 p-4 rounded-lg">
					<p className="text-sm text-gray-600 mb-1">Duration</p>
					<p className="text-lg font-semibold text-green-700">
						{test.duration} min
					</p>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg">
					<p className="text-sm text-gray-600 mb-1">Total Points</p>
					<p className="text-lg font-semibold text-yellow-700">
						{test.totalPoints}
					</p>
				</div>
			</div>

			{/* Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="bg-white border rounded-lg p-4">
					<p className="text-sm text-gray-600 mb-1">Questions</p>
					<p className="text-3xl font-bold text-gray-800">
						{test.questions.length}
					</p>
				</div>
				<div className="bg-white border rounded-lg p-4">
					<p className="text-sm text-gray-600 mb-1">Attempts</p>
					<p className="text-3xl font-bold text-gray-800">
						{test._count.attempts}
					</p>
				</div>
				<div className="bg-white border rounded-lg p-4">
					<p className="text-sm text-gray-600 mb-1">Status</p>
					<span
						className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
							test.isPublished
								? "bg-green-100 text-green-700"
								: "bg-yellow-100 text-yellow-700"
						}`}
					>
						{test.isPublished ? "Published" : "Draft"}
					</span>
				</div>
			</div>

			{/* Settings */}
			<div className="bg-gray-50 rounded-lg p-4 mb-6">
				<h2 className="font-semibold text-gray-700 mb-3">Test Settings</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<span className="text-gray-600">Deadline:</span>{" "}
						<span className="font-medium">
							{new Intl.DateTimeFormat("en-US", {
								dateStyle: "full",
								timeStyle: "short",
							}).format(test.deadline)}
						</span>
					</div>
					<div>
						<span className="text-gray-600">Passing Score:</span>{" "}
						<span className="font-medium">{test.passingScore || 70}%</span>
					</div>
					<div>
						<span className="text-gray-600">Shuffle Questions:</span>{" "}
						<span className="font-medium">
							{test.shuffleQuestions ? "✓ Yes" : "✗ No"}
						</span>
					</div>
					<div>
						<span className="text-gray-600">Shuffle Options:</span>{" "}
						<span className="font-medium">
							{test.shuffleOptions ? "✓ Yes" : "✗ No"}
						</span>
					</div>
				</div>
			</div>

			{/* Questions Section */}
			<div className="bg-white border rounded-lg">
				<div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
					<h2 className="font-semibold text-gray-700">Questions</h2>
					<FormContainer
						table="mcqQuestion"
						type="create"
						data={{ testId: test.id }}
					/>
				</div>

				{test.questions.length === 0 ? (
					<div className="p-8 text-center text-gray-500">
						<p className="mb-4">No questions added yet.</p>
						<FormContainer
							table="mcqQuestion"
							type="create"
							data={{ testId: test.id }}
						/>
					</div>
				) : (
					<div className="divide-y">
						{test.questions.map((question, index) => (
							<div key={question.id} className="p-6 hover:bg-gray-50">
								<div className="flex justify-between items-start mb-3">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
												Q{index + 1}
											</span>
											<span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
												{question.questionType.replace("_", " ")}
											</span>
											<span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
												{question.points} pts
											</span>
											{question.negativeMarking > 0 && (
												<span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
													-{question.negativeMarking} penalty
												</span>
											)}
										</div>
										<p className="text-gray-800 font-medium mb-2">
											{question.questionText}
										</p>
										{/* Show options preview */}
										{question.options &&
											(() => {
												try {
													const options =
														typeof question.options === "string"
															? JSON.parse(question.options)
															: question.options;

													return (
														<div className="ml-4 mt-2 text-sm text-gray-600">
															{question.questionType === "MATCH_FOLLOWING" ? (
																<div className="space-y-1">
																	{options.map((pair: any, i: number) => (
																		<div key={i} className="flex gap-2">
																			<span>
																				{pair.left} ↔ {pair.right}
																			</span>
																		</div>
																	))}
																</div>
															) : (
																<ul className="list-disc ml-5 space-y-1">
																	{options.map((opt: string, i: number) => (
																		<li key={i}>{opt}</li>
																	))}
																</ul>
															)}
														</div>
													);
												} catch (error) {
													console.error(
														"Error parsing options:",
														error,
														question.options
													);
													return (
														<div className="ml-4 mt-2 text-sm text-red-600">
															Invalid options format
														</div>
													);
												}
											})()}{" "}
										{question.explanation && (
											<div className="mt-2 text-sm text-gray-600 italic">
												💡 {question.explanation}
											</div>
										)}
									</div>

									<div className="flex gap-2 ml-4">
										<FormContainer
											table="mcqQuestion"
											type="update"
											data={question}
										/>
										<FormContainer
											table="mcqQuestion"
											type="delete"
											id={question.id}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* View Results Button */}
			{test._count.attempts > 0 && (
				<div className="mt-6 flex gap-4 justify-center">
					<Link
						href={`/list/mcq-tests/${test.id}/analytics`}
						className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
					>
						📊 View Analytics
					</Link>
					<Link
						href={`/list/mcq-tests/${test.id}/results`}
						className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-semibold"
					>
						📝 View All Results ({test._count.attempts})
					</Link>
				</div>
			)}
		</div>
	);
};

export default TestDetailPage;
