import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { StudentFee, FeeStructure, Student, Class } from "@prisma/client";
import Image from "next/image";

type StudentFeeWithRelations = StudentFee & {
	student: Student;
	feeStructure: FeeStructure;
	_count: { payments: number };
};

const columns = [
	{
		header: "Student",
		accessor: "student",
	},
	{
		header: "Fee Structure",
		accessor: "feeStructure",
		className: "hidden md:table-cell",
	},
	{
		header: "Amount",
		accessor: "amount",
		className: "hidden md:table-cell",
	},
	{
		header: "Status",
		accessor: "status",
	},
	{
		header: "Month/Year",
		accessor: "period",
		className: "hidden lg:table-cell",
	},
	{
		header: "Due Date",
		accessor: "dueDate",
		className: "hidden lg:table-cell",
	},
];

const renderRow = (item: StudentFeeWithRelations) => {
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
				<div className="flex flex-col">
					<h3 className="font-semibold">
						{item.student.name} {item.student.surname}
					</h3>
					<p className="text-xs text-gray-500">ID: {item.student.id}</p>
				</div>
			</td>
			<td className="hidden md:table-cell">{item.feeStructure.name}</td>
			<td className="hidden md:table-cell">
				<div className="flex flex-col">
					<span className="font-semibold">₹{item.totalAmount.toFixed(2)}</span>
					<span className="text-xs text-green-600">
						Paid: ₹{item.paidAmount.toFixed(2)}
					</span>
					<span className="text-xs text-red-600">
						Pending: ₹{item.pendingAmount.toFixed(2)}
					</span>
				</div>
			</td>
			<td>
				<span
					className={`px-2 py-1 rounded-full text-xs font-semibold ${
						statusColors[item.status]
					}`}
				>
					{item.status}
				</span>
			</td>
			<td className="hidden lg:table-cell">
				{item.month && (
					<>
						{new Date(item.year, item.month - 1).toLocaleString("en-US", {
							month: "short",
						})}{" "}
						{item.year}
					</>
				)}
			</td>
			<td className="hidden lg:table-cell">
				{new Date(item.dueDate).toLocaleDateString()}
			</td>
		</tr>
	);
};

const AssignFeesListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	const { page, ...queryParams } = searchParams;
	const p = page ? parseInt(page) : 1;

	// Fetch recently assigned fees for display
	const query: any = {};

	if (queryParams.search) {
		query.OR = [
			{
				student: {
					name: { contains: queryParams.search, mode: "insensitive" },
				},
			},
			{
				student: {
					surname: {
						contains: queryParams.search,
						mode: "insensitive",
					},
				},
			},
		];
	}

	const [data, count] = await prisma.$transaction([
		prisma.studentFee.findMany({
			where: query,
			include: {
				student: true,
				feeStructure: true,
				_count: {
					select: { payments: true },
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.studentFee.count({ where: query }),
	]);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					Assign Fees to Students
				</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					<div className="flex items-center gap-4 self-end">
						{role === "admin" && (
							<FormContainer table="assignFees" type="create" />
						)}
					</div>
				</div>
			</div>

			{/* INFO CARD */}
			<div className="bg-lamaSkyLight p-4 rounded-lg mt-4">
				<div className="flex items-start gap-3">
					<div className="w-10 h-10 rounded-full bg-lamaSky flex items-center justify-center">
						<Image src="/announcement.png" alt="info" width={20} height={20} />
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-gray-700 mb-2">
							How to Assign Fees
						</h3>
						<ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
							<li>
								Click the <strong>+ button</strong> to open the assignment form
							</li>
							<li>
								Select a <strong>Fee Structure</strong> (e.g., &quot;Monthly
								Tuition - ₹1000&quot;)
							</li>
							<li>
								Choose to assign to an <strong>Entire Class</strong> or{" "}
								<strong>Specific Students</strong>
							</li>
							<li>
								Set the <strong>Due Date</strong>, <strong>Month</strong>, and{" "}
								<strong>Year</strong>
							</li>
							<li>
								Click <strong>Assign Fees</strong> - the system will create
								individual StudentFee records
							</li>
						</ol>
						<p className="text-xs text-gray-500 mt-3">
							💡 <strong>Tip:</strong> After assigning, go to{" "}
							<strong>Student Fees</strong> to view all assigned fees, or{" "}
							<strong>Record Payment</strong> when students pay.
						</p>
					</div>
				</div>
			</div>

			{/* LIST */}
			<div className="mt-4">
				<h2 className="text-md font-semibold mb-2 text-gray-600">
					Recently Assigned Fees
				</h2>
				<Table columns={columns} renderRow={renderRow} data={data} />
			</div>

			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default AssignFeesListPage;
