import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TestAttemptClient from "@/components/TestAttemptClient";

const TestAttemptPage = async ({ params }: { params: { testId: string } }) => {
	const { sessionClaims, userId } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;
	const studentId = userId as string;

	// Only students can attempt tests
	if (role !== "student" || !studentId) {
		redirect("/");
	}

	const testId = parseInt(params.testId);

	// Fetch test with questions
	const test = await prisma.mCQTest.findUnique({
		where: { id: testId },
		include: {
			questions: {
				orderBy: { order: "asc" },
			},
			subject: { select: { name: true } },
			class: { select: { name: true } },
		},
	});

	if (!test) {
		redirect("/list/mcq-tests");
	}

	// Check if test is published
	if (!test.isPublished) {
		redirect("/list/mcq-tests");
	}

	// Check if deadline has passed
	if (new Date() > test.deadline) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="bg-white p-8 rounded-lg shadow-lg text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Test Deadline Passed
					</h1>
					<p className="text-gray-600 mb-4">
						The deadline for this test was{" "}
						{new Intl.DateTimeFormat("en-US", {
							dateStyle: "full",
							timeStyle: "short",
						}).format(test.deadline)}
					</p>
					<a
						href="/list/mcq-tests"
						className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
					>
						Back to Tests
					</a>
				</div>
			</div>
		);
	}

	// Check if student already attempted
	const existingAttempt = await prisma.mCQAttempt.findUnique({
		where: {
			testId_studentId: {
				testId,
				studentId,
			},
		},
	});

	if (existingAttempt && existingAttempt.isCompleted) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="bg-white p-8 rounded-lg shadow-lg text-center">
					<h1 className="text-2xl font-bold text-yellow-600 mb-4">
						Test Already Attempted
					</h1>
					<p className="text-gray-600 mb-4">
						You have already completed this test.
					</p>
					<div className="bg-gray-100 p-4 rounded-md mb-4">
						<p className="text-lg">
							Your Score:{" "}
							<span className="font-bold">{existingAttempt.score}</span> /{" "}
							{existingAttempt.totalPoints}
						</p>
						<p className="text-lg">
							Percentage:{" "}
							<span className="font-bold">
								{existingAttempt.percentageScore.toFixed(2)}%
							</span>
						</p>
					</div>
					<a
						href="/list/mcq-tests"
						className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
					>
						Back to Tests
					</a>
				</div>
			</div>
		);
	}

	return (
		<TestAttemptClient
			test={test}
			studentId={studentId}
			existingAttempt={existingAttempt}
		/>
	);
};

export default TestAttemptPage;
