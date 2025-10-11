import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { MCQQuestion, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

type MCQQuestionList = MCQQuestion;

const MCQTestDetailPage = async ({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: { [key: string]: string | undefined };
}) => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Fetch test details
	const test = await prisma.mCQTest.findUnique({
		where: { id: params.id },
		include: {
			subject: true,
			class: true,
			teacher: true,
			_count: {
				select: {
					questions: true,
					attempts: true,
				},
			},
		},
	});

	if (!test) {
		notFound();
	}

	// Count pending open-ended answers for grading
	const pendingAnswersCount = await prisma.studentAnswer.count({
		where: {
			attempt: {
				testId: params.id,
			},
			question: {
				questionType: "OPEN_ENDED",
			},
			isCorrect: null as any, // Pending grading (nullable boolean field)
		},
	});

	// Check permissions
	if (role === "teacher" && test.teacherId !== userId) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold text-red-500">Access Denied</h1>
				<p>You do not have permission to view this test.</p>
			</div>
		);
	}

	const columns = [
		{
			header: "Order",
			accessor: "order",
		},
		{
			header: "Question",
			accessor: "question",
		},
		{
			header: "Type",
			accessor: "type",
			className: "hidden md:table-cell",
		},
		{
			header: "Options",
			accessor: "options",
			className: "hidden lg:table-cell",
		},
		{
			header: "Answer",
			accessor: "answer",
			className: "hidden md:table-cell",
		},
		...(role === "admin" || role === "teacher"
			? [
					{
						header: "Actions",
						accessor: "action",
					},
			  ]
			: []),
	];

	const renderRow = (item: MCQQuestionList) => {
		const options = item.options as string[];
		return (
			<tr
				key={item.id}
				className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
			>
				<td className="p-4">
					<span className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaSkyLight text-xs font-semibold">
						{item.orderIndex}
					</span>
				</td>
				<td className="max-w-md">
					<p className="line-clamp-2">{item.question}</p>
				</td>
				<td className="hidden md:table-cell">
					<span className="px-2 py-1 rounded-full bg-lamaYellowLight text-xs">
						{item.questionType.replace("_", " ")}
					</span>
				</td>
				<td className="hidden lg:table-cell">
					<span className="text-xs text-gray-500">
						{options.length} options
					</span>
				</td>
				<td className="hidden md:table-cell">
					<span className="font-semibold text-green-600">{item.answer}</span>
				</td>
				<td>
					<div className="flex items-center gap-2">
						{(role === "admin" || role === "teacher") && (
							<>
								<FormContainer
									table="mcqQuestion"
									type="update"
									data={{ ...item, testId: params.id }}
								/>
								<FormContainer table="mcqQuestion" type="delete" id={item.id} />
							</>
						)}
					</div>
				</td>
			</tr>
		);
	};

	const { page } = searchParams;
	const p = page ? parseInt(page) : 1;

	const query: Prisma.MCQQuestionWhereInput = {
		testId: params.id,
	};

	const [questions, count] = await prisma.$transaction([
		prisma.mCQQuestion.findMany({
			where: query,
			orderBy: {
				orderIndex: "asc",
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.mCQQuestion.count({ where: query }),
	]);

	return (
		<div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
			{/* LEFT */}
			<div className="w-full xl:w-2/3">
				<div className="bg-white p-4 rounded-md">
					{/* TOP */}
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-4">
							<Link href="/list/mcq-tests">
								<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaPurpleLight">
									<Image src="/back.png" alt="" width={16} height={16} />
								</button>
							</Link>
							<h1 className="text-lg font-semibold">Manage Questions</h1>
						</div>
						<div className="flex items-center gap-2">
							{(role === "admin" || role === "teacher") &&
								pendingAnswersCount > 0 && (
									<Link href={`/list/mcq-tests/${params.id}/grade`}>
										<button className="flex items-center gap-2 px-4 py-2 bg-lamaYellow text-black rounded-md hover:bg-lamaYellowLight transition-colors">
											<Image src="/edit.png" alt="" width={16} height={16} />
											<span className="text-sm font-medium">
												Grade Answers ({pendingAnswersCount})
											</span>
										</button>
									</Link>
								)}
							{(role === "admin" || role === "teacher") && (
								<FormContainer
									table="mcqQuestion"
									type="create"
									data={{ testId: params.id, orderIndex: count + 1 }}
								/>
							)}
						</div>
					</div>
					{/* LIST */}
					<Table columns={columns} renderRow={renderRow} data={questions} />
					{/* PAGINATION */}
					<Pagination page={p} count={count} />
				</div>
			</div>

			{/* RIGHT */}
			<div className="w-full xl:w-1/3 flex flex-col gap-4">
				{/* TEST INFO CARD */}
				<div className="bg-white p-4 rounded-md">
					<h2 className="text-xl font-semibold mb-4">{test.title}</h2>
					{test.description && (
						<p className="text-sm text-gray-600 mb-4">{test.description}</p>
					)}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500">Subject:</span>
							<span className="font-medium">{test.subject?.name || "N/A"}</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500">Class:</span>
							<span className="font-medium">{test.class?.name || "N/A"}</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500">Teacher:</span>
							<span className="font-medium">
								{test.teacher.name} {test.teacher.surname}
							</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500">Questions:</span>
							<span className="px-2 py-1 rounded-full bg-lamaSkyLight text-xs font-semibold">
								{test._count.questions}
							</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500">Attempts:</span>
							<span className="px-2 py-1 rounded-full bg-lamaYellowLight text-xs font-semibold">
								{test._count.attempts}
							</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500">Created:</span>
							<span className="text-xs">
								{new Intl.DateTimeFormat("en-US").format(test.createdAt)}
							</span>
						</div>
					</div>
				</div>

				{/* STATISTICS CARD */}
				<div className="bg-white p-4 rounded-md">
					<h3 className="text-lg font-semibold mb-4">Statistics</h3>
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between p-3 bg-lamaSkyLight rounded-md">
							<span className="text-sm">Total Questions</span>
							<span className="text-2xl font-bold">
								{test._count.questions}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-lamaYellowLight rounded-md">
							<span className="text-sm">Student Attempts</span>
							<span className="text-2xl font-bold">{test._count.attempts}</span>
						</div>
						{(role === "admin" || role === "teacher") &&
							pendingAnswersCount > 0 && (
								<Link href={`/list/mcq-tests/${params.id}/grade`}>
									<div className="flex items-center justify-between p-3 bg-yellow-100 rounded-md cursor-pointer hover:bg-yellow-200 transition-colors">
										<span className="text-sm font-medium text-yellow-800">
											Pending Grades
										</span>
										<span className="text-2xl font-bold text-yellow-900">
											{pendingAnswersCount}
										</span>
									</div>
								</Link>
							)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MCQTestDetailPage;
