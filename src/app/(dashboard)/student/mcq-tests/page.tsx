import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { MCQTest, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type MCQTestList = MCQTest & {
	subject: { name: string } | null;
	class: { name: string } | null;
	teacher: { name: string; surname: string };
	_count: {
		questions: number;
		attempts: number;
	};
	myAttempts: {
		id: string;
		completedAt: Date | null;
		score: number | null;
		startedAt: Date;
	}[];
};

const columns = [
	{
		header: "Title",
		accessor: "title",
	},
	{
		header: "Subject",
		accessor: "subject",
		className: "hidden md:table-cell",
	},
	{
		header: "Teacher",
		accessor: "teacher",
		className: "hidden md:table-cell",
	},
	{
		header: "Questions",
		accessor: "questions",
		className: "hidden lg:table-cell",
	},
	{
		header: "Status",
		accessor: "status",
	},
	{
		header: "Best Score",
		accessor: "bestScore",
		className: "hidden md:table-cell",
	},
	{
		header: "Actions",
		accessor: "action",
	},
];

const renderRow = (item: MCQTestList) => {
	const completedAttempts = item.myAttempts.filter(
		(a) => a.completedAt !== null
	);
	const bestScore =
		completedAttempts.length > 0
			? Math.max(...completedAttempts.map((a) => a.score || 0))
			: null;
	const hasInProgressAttempt = item.myAttempts.some(
		(a) => a.completedAt === null
	);
	const hasCompletedAttempt = completedAttempts.length > 0;

	return (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="flex items-center gap-4 p-4">
				<div className="flex flex-col">
					<h3 className="font-semibold">{item.title}</h3>
					{item.description && (
						<p className="text-xs text-gray-500">
							{item.description.length > 50
								? item.description.substring(0, 50) + "..."
								: item.description}
						</p>
					)}
				</div>
			</td>
			<td className="hidden md:table-cell">
				{item.subject?.name || "All Subjects"}
			</td>
			<td className="hidden md:table-cell">
				{item.teacher.name} {item.teacher.surname}
			</td>
			<td className="hidden lg:table-cell">
				<span className="px-2 py-1 rounded-full bg-lamaSkyLight text-lamaSky text-xs">
					{item._count.questions} Questions
				</span>
			</td>
			<td>
				{hasCompletedAttempt ? (
					<span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs">
						Completed
					</span>
				) : hasInProgressAttempt ? (
					<span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs">
						In Progress
					</span>
				) : (
					<span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
						Not Started
					</span>
				)}
			</td>
			<td className="hidden md:table-cell">
				{bestScore !== null ? (
					<span className="font-semibold text-lamaPurple">
						{bestScore.toFixed(1)}%
					</span>
				) : (
					<span className="text-gray-400">-</span>
				)}
			</td>
			<td>
				<div className="flex items-center gap-2">
					{hasInProgressAttempt ? (
						<Link
							href={`/student/mcq-tests/${item.id}/take?attemptId=${
								item.myAttempts.find((a) => a.completedAt === null)?.id
							}`}
						>
							<button className="w-7 h-7 flex items-center justify-center rounded-full bg-yellow-100">
								<Image src="/edit.png" alt="" width={16} height={16} />
							</button>
						</Link>
					) : (
						<Link href={`/student/mcq-tests/${item.id}/take`}>
							<button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
								<Image src="/plus.png" alt="" width={16} height={16} />
							</button>
						</Link>
					)}
					{hasCompletedAttempt && (
						<Link href={`/student/mcq-tests/${item.id}/results`}>
							<button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
								<Image src="/view.png" alt="" width={16} height={16} />
							</button>
						</Link>
					)}
				</div>
			</td>
		</tr>
	);
};

const StudentMCQTestListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { userId } = auth();
	const { page, search, ...queryParams } = searchParams;
	const p = page ? parseInt(page) : 1;

	// Get student's class
	const student = await prisma.student.findUnique({
		where: { id: userId! },
		select: { classId: true },
	});

	if (!student?.classId) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold">My MCQ Tests</h1>
				<p className="text-gray-500 mt-4">You are not assigned to any class.</p>
			</div>
		);
	}

	// Query for tests assigned to student's class
	const query: Prisma.MCQTestWhereInput = {
		classId: student.classId,
	};

	if (search) {
		query.OR = [
			{ title: { contains: search, mode: "insensitive" } },
			{ description: { contains: search, mode: "insensitive" } },
		];
	}

	const [data, count] = await prisma.$transaction([
		prisma.mCQTest.findMany({
			where: query,
			include: {
				subject: { select: { name: true } },
				class: { select: { name: true } },
				teacher: { select: { name: true, surname: true } },
				_count: {
					select: {
						questions: true,
						attempts: true,
					},
				},
				attempts: {
					where: { studentId: userId! },
					select: {
						id: true,
						completedAt: true,
						score: true,
						startedAt: true,
					},
					orderBy: { startedAt: "desc" },
				},
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
			orderBy: { createdAt: "desc" },
		}),
		prisma.mCQTest.count({ where: query }),
	]);

	const dataWithMyAttempts = data.map((test) => ({
		...test,
		myAttempts: test.attempts,
	}));

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">My MCQ Tests</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
				</div>
			</div>
			{/* LIST */}
			<Table
				columns={columns}
				renderRow={renderRow}
				data={dataWithMyAttempts}
			/>
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default StudentMCQTestListPage;
