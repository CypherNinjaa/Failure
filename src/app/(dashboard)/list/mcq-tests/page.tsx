import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
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
	subject: { name: string };
	class: { name: string };
	teacher: { name: string; surname: string };
	_count: { questions: number; attempts: number };
};

const MCQTestListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	const columns = [
		{
			header: "Title",
			accessor: "title",
		},
		{
			header: "Subject",
			accessor: "subject",
		},
		{
			header: "Class",
			accessor: "class",
		},
		{
			header: "Teacher",
			accessor: "teacher",
			className: "hidden md:table-cell",
		},
		{
			header: "Questions",
			accessor: "questions",
			className: "hidden md:table-cell",
		},
		{
			header: "Attempts",
			accessor: "attempts",
			className: "hidden md:table-cell",
		},
		{
			header: "Duration",
			accessor: "duration",
			className: "hidden lg:table-cell",
		},
		{
			header: "Deadline",
			accessor: "deadline",
			className: "hidden lg:table-cell",
		},
		{
			header: "Status",
			accessor: "status",
			className: "hidden lg:table-cell",
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

	const renderRow = (item: MCQTestList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="flex items-center gap-4 p-4">
				<Link
					href={`/list/mcq-tests/${item.id}`}
					className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
				>
					{item.title}
				</Link>
			</td>
			<td>{item.subject.name}</td>
			<td>{item.class.name}</td>
			<td className="hidden md:table-cell">
				{item.teacher.name} {item.teacher.surname}
			</td>
			<td className="hidden md:table-cell">{item._count.questions}</td>
			<td className="hidden md:table-cell">{item._count.attempts}</td>
			<td className="hidden lg:table-cell">{item.duration} min</td>
			<td className="hidden lg:table-cell">
				{new Intl.DateTimeFormat("en-US").format(item.deadline)}
			</td>
			<td className="hidden lg:table-cell">
				<span
					className={`px-2 py-1 rounded-full text-xs font-semibold ${
						item.isPublished
							? "bg-green-100 text-green-700"
							: "bg-yellow-100 text-yellow-700"
					}`}
				>
					{item.isPublished ? "Published" : "Draft"}
				</span>
			</td>
			<td>
				<div className="flex items-center gap-2">
					{role === "admin" || role === "teacher" ? (
						<>
							<Link
								href={`/list/mcq-tests/${item.id}`}
								className="bg-lamaSky text-white px-3 py-1 rounded-md hover:bg-blue-600 text-xs font-semibold"
							>
								Manage
							</Link>
							<FormContainer table="mcqTest" type="update" data={item} />
							<FormContainer table="mcqTest" type="delete" id={item.id} />
						</>
					) : role === "student" ? (
						<Link
							href={`/student/test/${item.id}`}
							className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-semibold"
						>
							Start Test
						</Link>
					) : null}
				</div>
			</td>
		</tr>
	);
	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION

	const query: Prisma.MCQTestWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.title = { contains: value, mode: "insensitive" };
						break;
					case "classId":
						query.classId = parseInt(value);
						break;
					case "subjectId":
						query.subjectId = parseInt(value);
						break;
					case "teacherId":
						query.teacherId = value;
						break;
					default:
						break;
				}
			}
		}
	}

	// ROLE CONDITIONS
	switch (role) {
		case "admin":
			break;
		case "teacher":
			query.teacherId = sessionClaims!.userId as string;
			break;
		case "student":
			query.isPublished = true;
			query.class = {
				students: {
					some: {
						id: sessionClaims!.userId as string,
					},
				},
			};
			break;
		case "parent":
			query.isPublished = true;
			query.class = {
				students: {
					some: {
						parentId: sessionClaims!.userId as string,
					},
				},
			};
			break;
		default:
			break;
	}

	const [data, count] = await prisma.$transaction([
		prisma.mCQTest.findMany({
			where: query,
			include: {
				subject: { select: { name: true } },
				class: { select: { name: true } },
				teacher: { select: { name: true, surname: true } },
				_count: { select: { questions: true, attempts: true } },
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.mCQTest.count({ where: query }),
	]);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">MCQ Tests</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					<div className="flex items-center gap-4 self-end">
						<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
							<Image src="/filter.png" alt="" width={14} height={14} />
						</button>
						<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
							<Image src="/sort.png" alt="" width={14} height={14} />
						</button>
						{(role === "admin" || role === "teacher") && (
							<FormContainer table="mcqTest" type="create" />
						)}
					</div>
				</div>
			</div>
			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={data} />
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default MCQTestListPage;
