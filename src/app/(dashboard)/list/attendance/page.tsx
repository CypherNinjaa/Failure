import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

type AttendanceList = Attendance & { student: Student };

const AttendanceListPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
	const { sessionClaims, userId } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	const columns = [
		{
			header: "Student Name",
			accessor: "student",
			className: role === "student" ? "hidden" : "", // Hide for students (they know their own name)
		},
		{
			header: "Date",
			accessor: "date",
			className: "hidden md:table-cell",
		},
		{
			header: "Status",
			accessor: "present",
		},
		{
			header: "Class",
			accessor: "class",
			className: "hidden lg:table-cell",
		},
	];

	const renderRow = (item: AttendanceList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			{role !== "student" && (
				<td className="flex items-center gap-4 p-4">
					{item.student.name} {item.student.surname}
				</td>
			)}
			<td className="hidden md:table-cell">
				{new Intl.DateTimeFormat("en-US", {
					year: "numeric",
					month: "short",
					day: "2-digit",
				}).format(item.date)}
			</td>
			<td>
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold ${
						item.present
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{item.present ? "Present" : "Absent"}
				</span>
			</td>
			<td className="hidden lg:table-cell">
				{(item.student as any).class?.name || "N/A"}
			</td>
		</tr>
	);

	const resolvedSearchParams = await searchParams;
	const { page, ...queryParams } = resolvedSearchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.AttendanceWhereInput = {};

	// ROLE-BASED FILTERING
	if (role === "student") {
		// Students can only see their own attendance
		query.studentId = userId!;
	} else if (role === "parent") {
		// Parents can only see their children's attendance
		query.student = {
			parentId: userId!,
		};
	}

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "studentId":
						// Only admin/teacher can filter by studentId
						if (role === "admin" || role === "teacher") {
							query.studentId = value;
						}
						break;
					case "search":
						// Students and parents cannot search other students
						if (role === "admin" || role === "teacher") {
							query.student = {
								OR: [
									{ name: { contains: value, mode: "insensitive" } },
									{ surname: { contains: value, mode: "insensitive" } },
								],
							};
						}
						break;
					default:
						break;
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.attendance.findMany({
			where: query,
			include: {
				student: {
					include: {
						class: { select: { name: true } },
					},
				},
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
			orderBy: {
				date: "desc",
			},
		}),
		prisma.attendance.count({ where: query }),
	]);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					{role === "student"
						? "My Attendance"
						: role === "parent"
						? "My Children's Attendance"
						: "All Attendance Records"}
				</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					{(role === "admin" || role === "teacher") && <TableSearch />}
					<div className="flex items-center gap-4 self-end">
						{(role === "admin" || role === "teacher") && (
							<>
								<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
									<Image src="/filter.png" alt="" width={14} height={14} />
								</button>
								<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
									<Image src="/sort.png" alt="" width={14} height={14} />
								</button>
							</>
						)}
						{(role === "admin" || role === "teacher") && (
							<Link
								href="/list/classes"
								className="px-4 py-2 bg-lamaPurple text-white rounded-md text-sm font-medium hover:bg-opacity-90 flex items-center gap-2"
							>
								<Image src="/create.png" alt="" width={16} height={16} />
								Take Attendance
							</Link>
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

export default AttendanceListPage;
