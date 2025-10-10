import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

type TeacherAttendanceList = {
	id: number;
	date: Date;
	present: boolean;
	checkInTime: Date;
	teacherId: string;
	livenessVerified: boolean;
	teacher: {
		name: string;
		surname: string;
	};
	location: {
		name: string;
	} | null;
};

const TeacherAttendanceListPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
	const { sessionClaims, userId } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	const columns = [
		{
			header: "Teacher Name",
			accessor: "teacher",
		},
		{
			header: "Date",
			accessor: "date",
			className: "hidden md:table-cell",
		},
		{
			header: "Check-In Time",
			accessor: "checkInTime",
			className: "hidden lg:table-cell",
		},
		{
			header: "Status",
			accessor: "present",
		},
		{
			header: "Location",
			accessor: "location",
			className: "hidden lg:table-cell",
		},
		{
			header: "Verified",
			accessor: "livenessVerified",
			className: "hidden xl:table-cell",
		},
	];

	const renderRow = (item: TeacherAttendanceList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="p-4">
				<div className="flex flex-col">
					<span className="font-medium">
						{item.teacher.name} {item.teacher.surname}
					</span>
					{/* Show date on mobile below name */}
					<span className="text-xs text-gray-500 md:hidden">
						{new Intl.DateTimeFormat("en-US", {
							year: "numeric",
							month: "short",
							day: "2-digit",
						}).format(item.date)}
					</span>
				</div>
			</td>
			<td className="hidden md:table-cell">
				{new Intl.DateTimeFormat("en-US", {
					year: "numeric",
					month: "short",
					day: "2-digit",
				}).format(item.date)}
			</td>
			<td className="hidden lg:table-cell">
				{new Intl.DateTimeFormat("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				}).format(item.checkInTime)}
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
			<td className="hidden lg:table-cell">{item.location?.name || "N/A"}</td>
			<td className="hidden xl:table-cell">
				{item.livenessVerified ? (
					<span className="flex items-center gap-1 text-green-600">
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Yes
					</span>
				) : (
					<span className="text-gray-400">No</span>
				)}
			</td>
		</tr>
	);

	const resolvedSearchParams = await searchParams;
	const { page, ...queryParams } = resolvedSearchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.TeacherAttendanceWhereInput = {};

	// ROLE-BASED FILTERING
	if (role === "teacher") {
		// Teachers can only see their own attendance
		query.teacherId = userId!;
	}

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "teacherId":
						// Only admin can filter by teacherId
						if (role === "admin") {
							query.teacherId = value;
						}
						break;
					case "search":
						// Only admin can search
						if (role === "admin") {
							query.teacher = {
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
		prisma.teacherAttendance.findMany({
			where: query,
			include: {
				teacher: {
					select: {
						name: true,
						surname: true,
					},
				},
				location: {
					select: {
						name: true,
					},
				},
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
			orderBy: {
				date: "desc",
			},
		}),
		prisma.teacherAttendance.count({ where: query }),
	]);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					{role === "teacher" ? "My Attendance" : "Teacher Attendance Records"}
				</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					{role === "admin" && <TableSearch />}
					<div className="flex items-center gap-4 self-end">
						{role === "admin" && (
							<>
								<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
									<Image src="/filter.png" alt="" width={14} height={14} />
								</button>
								<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
									<Image src="/sort.png" alt="" width={14} height={14} />
								</button>
							</>
						)}
						{role === "teacher" && (
							<Link
								href="/teacher/attendance"
								className="px-4 py-2 bg-lamaPurple text-white rounded-md text-sm font-medium hover:bg-opacity-90 flex items-center gap-2"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
								Mark Attendance
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

export default TeacherAttendanceListPage;
