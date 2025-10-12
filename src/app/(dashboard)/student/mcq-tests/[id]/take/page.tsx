import AntiCheatingTestClient from "@/components/AntiCheatingTestClient";
import { startMCQAttempt, checkStudentSuspension } from "@/lib/actions";
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

	// Check if student is suspended
	const suspensionCheck = await checkStudentSuspension(userId!);

	if (suspensionCheck.isSuspended && suspensionCheck.suspension) {
		const suspension = suspensionCheck.suspension;
		const daysRemaining = Math.ceil(
			(new Date(suspension.suspendedUntil).getTime() - Date.now()) /
				(1000 * 60 * 60 * 24)
		);

		return (
			<div className="bg-white p-8 rounded-md flex-1 m-4 mt-0 max-w-2xl mx-auto">
				<div className="text-center">
					<div className="text-6xl mb-4">🚫</div>
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Account Suspended
					</h1>
					<div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg mb-6">
						<p className="text-gray-700 mb-3">
							<span className="font-semibold">Reason:</span> {suspension.reason}
						</p>
						<p className="text-gray-700 mb-3">
							<span className="font-semibold">Total Violations:</span>{" "}
							{suspension.violationCount}
						</p>
						<p className="text-gray-700">
							<span className="font-semibold">Suspended Until:</span>{" "}
							{new Date(suspension.suspendedUntil).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
						<p className="text-red-600 font-bold mt-4">
							{daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
						</p>
					</div>
					<p className="text-gray-600 mb-6">
						You cannot take tests during this suspension period due to repeated
						cheating violations.
					</p>
					<Link
						href="/student"
						className="inline-block px-6 py-3 bg-lamaPurple text-white rounded-md hover:bg-purple-600"
					>
						Back to Dashboard
					</Link>
				</div>
			</div>
		);
	}

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
			<AntiCheatingTestClient
				testId={params.id}
				attemptId={attemptId}
				questions={questionsWithAnswers}
				testTitle={test.title}
				currentViolations={await prisma.mCQAttempt
					.findUnique({
						where: { id: attemptId },
						select: { cheatingViolations: true },
					})
					.then((a) => a?.cheatingViolations || 0)}
			/>
		</div>
	);
};

export default TakeTestPage;
