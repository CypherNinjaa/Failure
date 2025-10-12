import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type StudentWithViolations = {
	id: string;
	name: string;
	surname: string;
	username: string;
	img: string | null;
	class: {
		name: string;
	};
	totalViolations: number;
	cleanTests: number;
	activeSuspension: boolean;
};

const columns = [
	{
		header: "Student",
		accessor: "info",
	},
	{
		header: "Class",
		accessor: "class",
	},
	{
		header: "Violations",
		accessor: "violations",
		className: "hidden md:table-cell",
	},
	{
		header: "Clean Tests",
		accessor: "cleanTests",
		className: "hidden md:table-cell",
	},
	{
		header: "Status",
		accessor: "status",
		className: "hidden lg:table-cell",
	},
	{
		header: "Actions",
		accessor: "action",
	},
];

const renderRow = (item: StudentWithViolations) => (
	<tr
		key={item.id}
		className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
	>
		<td className="flex items-center gap-4 p-4">
			<Image
				src={item.img || "/noAvatar.png"}
				alt=""
				width={40}
				height={40}
				className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
			/>
			<div className="flex flex-col">
				<h3 className="font-semibold">{item.name + " " + item.surname}</h3>
				<p className="text-xs text-gray-500">{item.username}</p>
			</div>
		</td>
		<td className="hidden md:table-cell">{item.class.name}</td>
		<td className="hidden md:table-cell">
			<span
				className={`px-2 py-1 rounded-full text-xs font-semibold ${
					item.totalViolations === 0
						? "bg-green-100 text-green-800"
						: item.totalViolations <= 2
						? "bg-yellow-100 text-yellow-800"
						: "bg-red-100 text-red-800"
				}`}
			>
				{item.totalViolations}
			</span>
		</td>
		<td className="hidden md:table-cell">
			<span className="text-green-600 font-semibold">{item.cleanTests}</span>
		</td>
		<td className="hidden lg:table-cell">
			{item.activeSuspension ? (
				<span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
					🚫 Suspended
				</span>
			) : item.totalViolations >= 3 ? (
				<span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
					⚠️ Warning
				</span>
			) : (
				<span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
					✅ Good Standing
				</span>
			)}
		</td>
		<td>
			<div className="flex items-center gap-2">
				<Link href={`/admin/penalty-management/${item.id}`}>
					<button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
						<Image src="/view.png" alt="" width={16} height={16} />
					</button>
				</Link>
			</div>
		</td>
	</tr>
);

const PenaltyManagementListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.StudentWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.OR = [
							{ name: { contains: value, mode: "insensitive" } },
							{ surname: { contains: value, mode: "insensitive" } },
							{ username: { contains: value, mode: "insensitive" } },
						];
						break;
					default:
						break;
				}
			}
		}
	}

	// Fetch students with their MCQ attempts
	const [students, count] = await prisma.$transaction([
		prisma.student.findMany({
			where: query,
			include: {
				class: {
					select: { name: true },
				},
				mcqAttempts: {
					select: {
						cheatingViolations: true,
						completedAt: true,
					},
				},
				cheatingSuspensions: {
					where: {
						isActive: true,
						suspendedUntil: { gte: new Date() },
					},
					select: { id: true },
				},
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.student.count({ where: query }),
	]);

	// Transform data to calculate violations
	const studentsWithViolations: StudentWithViolations[] = students.map(
		(student) => {
			const totalViolations = student.mcqAttempts.reduce(
				(sum: number, attempt: any) => sum + attempt.cheatingViolations,
				0
			);

			// Find last violation date
			const attemptsWithViolations = student.mcqAttempts.filter(
				(a: any) => a.cheatingViolations > 0
			);
			const lastViolationDate = attemptsWithViolations[0]?.completedAt;

			// Count clean tests (after last violation)
			const cleanTests = student.mcqAttempts.filter(
				(a: any) =>
					a.cheatingViolations === 0 &&
					(!lastViolationDate ||
						(a.completedAt && a.completedAt > lastViolationDate))
			).length;

			return {
				id: student.id,
				name: student.name,
				surname: student.surname,
				username: student.username,
				img: student.img,
				class: student.class,
				totalViolations,
				cleanTests,
				activeSuspension: student.cheatingSuspensions.length > 0,
			};
		}
	);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					Penalty Management
				</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
				</div>
			</div>
			{/* LIST */}
			<Table
				columns={columns}
				renderRow={renderRow}
				data={studentsWithViolations}
			/>
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default PenaltyManagementListPage;
