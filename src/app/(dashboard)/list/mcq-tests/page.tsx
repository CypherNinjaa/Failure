import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, MCQTest, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

type MCQTestList = MCQTest & {
	subject: Subject | null;
	class: Class | null;
	teacher: Teacher;
	_count: {
		questions: number;
		attempts: number;
	};
};

const MCQTestListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;
	const currentUserId = userId;

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
			header: "Class",
			accessor: "class",
			className: "hidden md:table-cell",
		},
		{
			header: "Teacher",
			accessor: "teacher",
			className: "hidden lg:table-cell",
		},
		{
			header: "Questions",
			accessor: "questions",
			className: "hidden md:table-cell",
		},
		{
			header: "Attempts",
			accessor: "attempts",
			className: "hidden lg:table-cell",
		},
		{
			header: "Created",
			accessor: "createdAt",
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
				<div className="flex flex-col">
					<h3 className="font-semibold">{item.title}</h3>
					{item.description && (
						<p className="text-xs text-gray-500">
							{item.description.substring(0, 50)}...
						</p>
					)}
				</div>
			</td>
			<td className="hidden md:table-cell">{item.subject?.name || "-"}</td>
			<td className="hidden md:table-cell">{item.class?.name || "-"}</td>
			<td className="hidden lg:table-cell">
				{item.teacher.name + " " + item.teacher.surname}
			</td>
			<td className="hidden md:table-cell">
				<span className="px-2 py-1 rounded-full bg-lamaSkyLight text-xs">
					{item._count.questions}
				</span>
			</td>
			<td className="hidden lg:table-cell">
				<span className="px-2 py-1 rounded-full bg-lamaYellowLight text-xs">
					{item._count.attempts}
				</span>
			</td>
			<td className="hidden lg:table-cell">
				{new Intl.DateTimeFormat("en-US").format(item.createdAt)}
			</td>
			<td>
				<div className="flex items-center gap-2">
					{(role === "admin" || role === "teacher") && (
						<>
							<Link href={`/list/mcq-tests/${item.id}`}>
								<button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
									<Image src="/view.png" alt="" width={16} height={16} />
								</button>
							</Link>
							<FormContainer table="mcqTest" type="update" data={item} />
							<FormContainer table="mcqTest" type="delete" id={item.id} />
						</>
					)}
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
					case "classId":
						query.classId = parseInt(value);
						break;
					case "teacherId":
						query.teacherId = value;
						break;
					case "subjectId":
						query.subjectId = parseInt(value);
						break;
					case "search":
						query.title = { contains: value, mode: "insensitive" };
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
			query.teacherId = currentUserId!;
			break;
		default:
			break;
	}

	const [data, count] = await prisma.$transaction([
		prisma.mCQTest.findMany({
			where: query,
			include: {
				subject: { select: { id: true, name: true } },
				class: { select: { id: true, name: true } },
				teacher: { select: { id: true, name: true, surname: true } },
				_count: {
					select: {
						questions: true,
						attempts: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
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
				<h1 className="hidden md:block text-lg font-semibold">All MCQ Tests</h1>
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
