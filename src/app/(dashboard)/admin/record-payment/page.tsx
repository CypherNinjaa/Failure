import FormContainer from "@/components/FormContainer";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Payment, StudentFee, Student, FeeStructure } from "@prisma/client";
import { redirect } from "next/navigation";

type PaymentWithRelations = Payment & {
	studentFee: StudentFee & {
		student: Student;
		feeStructure: FeeStructure;
	};
};

const columns = [
	{
		header: "Receipt",
		accessor: "receipt",
	},
	{
		header: "Student",
		accessor: "student",
	},
	{
		header: "Fee Structure",
		accessor: "fee",
		className: "hidden md:table-cell",
	},
	{
		header: "Amount",
		accessor: "amount",
	},
	{
		header: "Payment Method",
		accessor: "method",
		className: "hidden lg:table-cell",
	},
	{
		header: "Date",
		accessor: "date",
		className: "hidden lg:table-cell",
	},
	{
		header: "Status",
		accessor: "status",
		className: "hidden md:table-cell",
	},
];

const renderRow = (item: PaymentWithRelations) => {
	const statusColors = {
		APPROVED: "bg-green-100 text-green-800",
		PENDING: "bg-yellow-100 text-yellow-800",
		REJECTED: "bg-red-100 text-red-800",
	};

	const methodColors = {
		CASH: "bg-blue-100 text-blue-800",
		CARD: "bg-purple-100 text-purple-800",
		BANK_TRANSFER: "bg-indigo-100 text-indigo-800",
		CHEQUE: "bg-pink-100 text-pink-800",
		UPI: "bg-green-100 text-green-800",
		OTHER: "bg-gray-100 text-gray-800",
	};

	return (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="p-4">
				<div className="flex flex-col">
					<span className="font-mono text-xs text-blue-600">
						{item.receiptNumber}
					</span>
					<span className="text-xs text-gray-500">
						{item.processedBy
							? `By: ${item.processedBy.substring(0, 8)}...`
							: ""}
					</span>
				</div>
			</td>
			<td className="p-4">
				<div className="flex flex-col">
					<span className="font-semibold">
						{item.studentFee.student.name} {item.studentFee.student.surname}
					</span>
					<span className="text-xs text-gray-500">
						ID: {item.studentFee.student.id.substring(0, 8)}
					</span>
				</div>
			</td>
			<td className="hidden md:table-cell">
				{item.studentFee.feeStructure.name}
			</td>
			<td className="p-4">
				<span className="font-semibold text-green-600">
					₹{item.amount.toFixed(2)}
				</span>
			</td>
			<td className="hidden lg:table-cell">
				<span
					className={`px-2 py-1 rounded-full text-xs font-semibold ${
						methodColors[item.paymentMethod as keyof typeof methodColors]
					}`}
				>
					{item.paymentMethod.replace("_", " ")}
				</span>
			</td>
			<td className="hidden lg:table-cell">
				{new Date(item.createdAt).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})}
			</td>
			<td className="hidden md:table-cell">
				<span
					className={`px-2 py-1 rounded-full text-xs font-semibold ${
						statusColors[item.approvalStatus as keyof typeof statusColors]
					}`}
				>
					{item.approvalStatus}
				</span>
			</td>
		</tr>
	);
};

const RecordPaymentPage = async () => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		redirect("/");
	}

	// Fetch recent payments (last 20)
	const recentPayments = await prisma.payment.findMany({
		include: {
			studentFee: {
				include: {
					student: true,
					feeStructure: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 20,
	});

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP SECTION */}
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-lg font-semibold">Record Offline Payment</h1>
				<div className="text-sm text-gray-500">
					Total Payments Today:{" "}
					{
						recentPayments.filter(
							(p) =>
								new Date(p.createdAt).toDateString() ===
								new Date().toDateString()
						).length
					}
				</div>
			</div>

			{/* FORM SECTION */}
			<div className="mb-8 p-4 bg-lamaSkyLight rounded-lg border border-lamaSky">
				<h2 className="text-md font-semibold mb-4 text-gray-700">
					Record New Payment
				</h2>
				<FormContainer table="offlinePayment" type="create" />
			</div>

			{/* RECENT PAYMENTS TABLE */}
			<div className="mt-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-md font-semibold text-gray-700">
						Recent Payments
					</h2>
					<div className="text-xs text-gray-500">
						Showing last {recentPayments.length} payments
					</div>
				</div>

				{recentPayments.length === 0 ? (
					<div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-gray-500">No payments recorded yet</p>
						<p className="text-xs text-gray-400 mt-2">
							Payments will appear here after you record them
						</p>
					</div>
				) : (
					<Table
						columns={columns}
						renderRow={renderRow}
						data={recentPayments}
					/>
				)}
			</div>
		</div>
	);
};

export default RecordPaymentPage;
