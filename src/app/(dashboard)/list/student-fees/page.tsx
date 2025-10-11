import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { StudentFee, Student, FeeStructure, Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

type StudentFeeList = StudentFee & {
	student: Student;
	feeStructure: FeeStructure;
};

const StudentFeesListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	const columns = [
		{
			header: "Student",
			accessor: "student",
		},
		{
			header: "Fee",
			accessor: "fee",
			className: "hidden md:table-cell",
		},
		{
			header: "Total Amount",
			accessor: "totalAmount",
			className: "hidden md:table-cell",
		},
		{
			header: "Paid Amount",
			accessor: "paidAmount",
			className: "hidden lg:table-cell",
		},
		{
			header: "Pending Amount",
			accessor: "pendingAmount",
			className: "hidden lg:table-cell",
		},
		{
			header: "Status",
			accessor: "status",
		},
		{
			header: "Due Date",
			accessor: "dueDate",
			className: "hidden lg:table-cell",
		},
	];

	const renderRow = (item: StudentFeeList) => {
		// Color-coded status
		const statusColors = {
			PAID: "bg-green-100 text-green-800",
			PARTIAL: "bg-yellow-100 text-yellow-800",
			PENDING: "bg-red-100 text-red-800",
			OVERDUE: "bg-red-200 text-red-900",
		};

		return (
			<tr
				key={item.id}
				className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
			>
				<td className="flex items-center gap-4 p-4">
					{item.student.name} {item.student.surname}
				</td>
				<td className="hidden md:table-cell">{item.feeStructure.name}</td>
				<td className="hidden md:table-cell">₹{item.totalAmount}</td>
				<td className="hidden lg:table-cell">₹{item.paidAmount}</td>
				<td className="hidden lg:table-cell">₹{item.pendingAmount}</td>
				<td>
					<span
						className={`px-2 py-1 rounded-full text-xs font-semibold ${
							statusColors[item.status as keyof typeof statusColors]
						}`}
					>
						{item.status}
					</span>
				</td>
				<td className="hidden lg:table-cell">
					{new Intl.DateTimeFormat("en-IN").format(item.dueDate)}
				</td>
			</tr>
		);
	};

	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.StudentFeeWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.OR = [
							{
								student: {
									name: { contains: value, mode: "insensitive" },
								},
							},
							{
								feeStructure: {
									name: { contains: value, mode: "insensitive" },
								},
							},
						];
						break;
					case "status":
						query.status = value as any;
						break;
					default:
						break;
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.studentFee.findMany({
			where: query,
			include: {
				student: true,
				feeStructure: true,
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
			orderBy: { dueDate: "asc" },
		}),
		prisma.studentFee.count({ where: query }),
	]);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">Student Fees</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					{role === "admin" && (
						<div className="flex gap-2">
							<div className="flex gap-1 bg-gray-100 rounded-md p-1">
								<Link
									href="/list/student-fees"
									className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
										!queryParams.status
											? "bg-white shadow"
											: "hover:bg-gray-200"
									}`}
								>
									All
								</Link>
								<Link
									href="/list/student-fees?status=PAID"
									className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
										queryParams.status === "PAID"
											? "bg-green-500 text-white shadow"
											: "hover:bg-gray-200"
									}`}
								>
									Paid
								</Link>
								<Link
									href="/list/student-fees?status=PARTIAL"
									className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
										queryParams.status === "PARTIAL"
											? "bg-yellow-500 text-white shadow"
											: "hover:bg-gray-200"
									}`}
								>
									Partial
								</Link>
								<Link
									href="/list/student-fees?status=PENDING"
									className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
										queryParams.status === "PENDING"
											? "bg-red-500 text-white shadow"
											: "hover:bg-gray-200"
									}`}
								>
									Pending
								</Link>
								<Link
									href="/list/student-fees?status=OVERDUE"
									className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
										queryParams.status === "OVERDUE"
											? "bg-red-700 text-white shadow"
											: "hover:bg-gray-200"
									}`}
								>
									Overdue
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={data} />
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default StudentFeesListPage;
