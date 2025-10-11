import TakeTestClient from "@/components/TakeTestClient";
import { startMCQAttempt } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const TakeTestPage = async ({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: { attemptId?: string };
}) => {
	const { userId } = auth();

	// Fetch the test with questions
	const test = await prisma.mCQTest.findUnique({
		where: { id: params.id },
		include: {
			questions: {
				orderBy: { orderIndex: "asc" },
			},
			subject: { select: { name: true } },
			class: { select: { name: true } },
			teacher: { select: { name: true, surname: true } },
		},
	});

	if (!test) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold">Test Not Found</h1>
				<p className="text-gray-500 mt-4">
					The test you are looking for does not exist.
				</p>
				<Link
					href="/student/mcq-tests"
					className="text-lamaPurple hover:underline mt-2 inline-block"
				>
					Back to Tests
				</Link>
			</div>
		);
	}

	if (test.questions.length === 0) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold">{test.title}</h1>
				<p className="text-gray-500 mt-4">
					This test has no questions yet. Please check back later.
				</p>
				<Link
					href="/student/mcq-tests"
					className="text-lamaPurple hover:underline mt-2 inline-block"
				>
					Back to Tests
				</Link>
			</div>
		);
	}

	// Check if student belongs to the test's class
	const student = await prisma.student.findUnique({
		where: { id: userId! },
		select: { classId: true },
	});

	if (!student || student.classId !== test.classId) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold">Access Denied</h1>
				<p className="text-gray-500 mt-4">
					This test is not available for your class.
				</p>
				<Link
					href="/student/mcq-tests"
					className="text-lamaPurple hover:underline mt-2 inline-block"
				>
					Back to Tests
				</Link>
			</div>
		);
	}

	let attemptId = searchParams.attemptId;

	// If no attemptId, check for existing incomplete attempt or create new one
	if (!attemptId) {
		const existingAttempt = await prisma.mCQAttempt.findFirst({
			where: {
				testId: params.id,
				studentId: userId!,
				completedAt: null,
			},
		});

		if (existingAttempt) {
			attemptId = existingAttempt.id;
		} else {
			// Get the student
			const student = await prisma.student.findUnique({
				where: { id: userId! },
			});

			if (!student) {
				return (
					<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
						<h1 className="text-lg font-semibold">Error</h1>
						<p className="text-gray-500 mt-4">Student not found.</p>
						<Link
							href="/student/mcq-tests"
							className="text-lamaPurple hover:underline mt-2 inline-block"
						>
							Back to Tests
						</Link>
					</div>
				);
			}

			// Create new attempt using server action
			const result = await startMCQAttempt(
				{ success: false, error: false },
				{
					testId: params.id,
					studentId: userId!,
					totalQuestions: test.questions.length,
				}
			);

			if (result.success && result.message) {
				attemptId = result.message;
			} else {
				return (
					<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
						<h1 className="text-lg font-semibold">Error</h1>
						<p className="text-gray-500 mt-4">Failed to start test attempt.</p>
						<Link
							href="/student/mcq-tests"
							className="text-lamaPurple hover:underline mt-2 inline-block"
						>
							Back to Tests
						</Link>
					</div>
				);
			}
		}
	}

	// Fetch student's answers for this attempt
	const studentAnswers = await prisma.studentAnswer.findMany({
		where: { attemptId },
		select: {
			questionId: true,
			userAnswer: true,
			isCorrect: true,
		},
	});

	const answersMap = new Map(studentAnswers.map((a) => [a.questionId, a]));

	const questionsWithAnswers = test.questions.map((q) => ({
		...q,
		studentAnswer: answersMap.get(q.id) || null,
	}));

	return (
		<div className="flex-1 p-4 flex flex-col gap-4">
			{/* Header */}
			<div className="bg-white p-6 rounded-md">
				<div className="flex items-center justify-between">
					<div>
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
					<Link href="/student/mcq-tests">
						<button className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
							Exit Test
						</button>
					</Link>
				</div>
			</div>

			{/* Test Content */}
			<TakeTestClient
				testId={params.id}
				attemptId={attemptId}
				questions={questionsWithAnswers}
				testTitle={test.title}
			/>
		</div>
	);
};

export default TakeTestPage;
