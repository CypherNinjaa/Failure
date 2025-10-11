import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import ParentTransactionFilters from "@/components/ParentTransactionFilters";

const ITEM_PER_PAGE = 15;

const ParentTransactionsPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "parent" || !userId) {
		redirect("/");
	}

	const { page, student, year, status } = searchParams;
	const p = page ? parseInt(page) : 1;

	// Get parent's students
	const parent = await prisma.parent.findUnique({
		where: { id: userId },
		include: {
			students: {
				include: {
					class: true,
					grade: true,
				},
			},
		},
	});

	if (!parent || parent.students.length === 0) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold mb-4">Payment History</h1>
				<p className="text-gray-500">No students linked to your account.</p>
			</div>
		);
	}

	// Build filter query
	const currentYear = new Date().getFullYear();
	const selectedYear = year ? parseInt(year) : undefined;
	const selectedStudent = student || undefined;

	// Fetch all payments for parent's children
	const payments = await prisma.payment.findMany({
		where: {
			studentFee: {
				studentId: selectedStudent || { in: parent.students.map((s) => s.id) },
			},
			...(status && { approvalStatus: status as any }),
			...(selectedYear && {
				paymentDate: {
					gte: new Date(selectedYear, 0, 1),
					lt: new Date(selectedYear + 1, 0, 1),
				},
			}),
		},
		include: {
			studentFee: {
				include: {
					student: true,
					feeStructure: true,
				},
			},
		},
		orderBy: { paymentDate: "desc" },
	});

	// Pagination
	const start = (p - 1) * ITEM_PER_PAGE;
	const end = start + ITEM_PER_PAGE;
	const paginatedPayments = payments.slice(start, end);

	// Calculate pending fees (from student fees, not payments)
	const allStudentFees = await prisma.studentFee.findMany({
		where: {
			studentId: selectedStudent || { in: parent.students.map((s) => s.id) },
			status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
		},
		include: {
			feeStructure: true,
		},
	});

	const totalPendingFees = allStudentFees.reduce(
		(sum, fee) => sum + fee.pendingAmount,
		0
	);
	const overdueFeesCount = allStudentFees.filter(
		(fee) => fee.status === "OVERDUE"
	).length;

	// Calculate payment status counts
	const pendingApprovalAmount = payments
		.filter((p) => p.approvalStatus === "PENDING")
		.reduce((sum, p) => sum + p.amount, 0);
	const pendingApprovalCount = payments.filter(
		(p) => p.approvalStatus === "PENDING"
	).length;

	const recentSuccessCount = payments.filter(
		(p) => p.approvalStatus === "APPROVED"
	).length;

	// Payment method icon
	const getPaymentMethodIcon = (method: string) => {
		switch (method) {
			case "CASH":
				return "💵";
			case "CARD":
				return "💳";
			case "BANK_TRANSFER":
				return "🏦";
			case "ONLINE_UPI":
				return "📱";
			case "CHEQUE":
				return "📝";
			default:
				return "💰";
		}
	};

	// Status badge
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "APPROVED":
				return "bg-green-100 text-green-800 border border-green-300";
			case "PENDING":
				return "bg-yellow-100 text-yellow-800 border border-yellow-300";
			case "REJECTED":
				return "bg-red-100 text-red-800 border border-red-300";
			default:
				return "bg-gray-100 text-gray-800 border border-gray-300";
		}
	};

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* Header with Summary */}
			<div className="mb-6">
				<h1 className="text-xl font-semibold mb-4">Payment History</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
						<p className="text-sm text-red-700 mb-1">⚠️ Pending Fees</p>
						<p className="text-2xl font-bold text-red-600">
							₹{totalPendingFees.toFixed(2)}
						</p>
						<p className="text-xs text-red-600 mt-1">
							{overdueFeesCount > 0 ? `${overdueFeesCount} overdue` : "Pay now"}
						</p>
					</div>
					<div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
						<p className="text-sm text-yellow-700 mb-1">⏳ Awaiting Approval</p>
						<p className="text-2xl font-bold text-yellow-600">
							₹{pendingApprovalAmount.toFixed(2)}
						</p>
						<p className="text-xs text-yellow-600 mt-1">
							{pendingApprovalCount > 0
								? `${pendingApprovalCount} payments pending`
								: "All approved"}
						</p>
					</div>
					<div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
						<p className="text-sm text-green-700 mb-1">✅ Recent Successful</p>
						<p className="text-2xl font-bold text-green-600">
							{recentSuccessCount}
						</p>
						<p className="text-xs text-green-600 mt-1">
							{recentSuccessCount > 0 ? "Payments cleared" : "No payments yet"}
						</p>
					</div>
				</div>
			</div>

			{/* Filters */}
			<ParentTransactionFilters
				students={parent.students}
				currentYear={currentYear}
			/>

			{/* Results count */}
			<div className="mb-4 text-sm text-gray-600">
				Showing {paginatedPayments.length} of {payments.length} payments
			</div>

			{/* Payments List */}
			<div className="space-y-4">
				{paginatedPayments.length === 0 ? (
					<div className="text-center py-12 text-gray-500">
						<p className="text-lg mb-2">No payment records found</p>
						<p className="text-sm">Your payment history will appear here</p>
					</div>
				) : (
					paginatedPayments.map((payment) => (
						<div
							key={payment.id}
							className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow"
						>
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
								{/* Left: Payment Details */}
								<div className="flex-1">
									<div className="flex items-start gap-3 mb-2">
										<Image
											src={payment.studentFee.student.img || "/noAvatar.png"}
											alt={payment.studentFee.student.name}
											width={40}
											height={40}
											className="rounded-full object-cover"
										/>
										<div className="flex-1">
											<h3 className="font-semibold">
												{payment.studentFee.student.name}{" "}
												{payment.studentFee.student.surname}
											</h3>
											<p className="text-sm text-gray-600">
												{payment.studentFee.feeStructure.name}
											</p>
											<p className="text-xs text-gray-500">
												{payment.studentFee.feeStructure.feeType} •{" "}
												{payment.studentFee.feeStructure.frequency.replace(
													"_",
													" "
												)}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
										<div>
											<p className="text-xs text-gray-600">Amount</p>
											<p className="font-bold text-green-600">
												₹{payment.amount.toFixed(2)}
											</p>
										</div>
										<div>
											<p className="text-xs text-gray-600">Payment Method</p>
											<p className="font-semibold">
												{getPaymentMethodIcon(payment.paymentMethod)}{" "}
												{payment.paymentMethod.replace("_", " ")}
											</p>
										</div>
										<div>
											<p className="text-xs text-gray-600">Payment Date</p>
											<p className="font-semibold">
												{new Intl.DateTimeFormat("en-IN", {
													day: "numeric",
													month: "short",
													year: "numeric",
												}).format(new Date(payment.paymentDate))}
											</p>
										</div>
										<div>
											<p className="text-xs text-gray-600">Receipt Number</p>
											<p className="font-mono text-xs">
												{payment.receiptNumber}
											</p>
										</div>
									</div>

									{payment.transactionId && (
										<div className="mt-2 text-sm">
											<span className="text-gray-600">Transaction ID: </span>
											<span className="font-mono font-semibold">
												{payment.transactionId}
											</span>
										</div>
									)}

									{payment.notes && (
										<div className="mt-2 bg-gray-50 border border-gray-200 rounded p-2">
											<p className="text-xs text-gray-600">Notes:</p>
											<p className="text-sm">{payment.notes}</p>
										</div>
									)}
								</div>

								{/* Right: Status */}
								<div className="flex flex-col items-end gap-2">
									<span
										className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(
											payment.approvalStatus
										)}`}
									>
										{payment.approvalStatus === "APPROVED" && "✓ "}
										{payment.approvalStatus === "PENDING" && "⏳ "}
										{payment.approvalStatus === "REJECTED" && "✗ "}
										{payment.approvalStatus}
									</span>

									{payment.screenshot && (
										<a
											href={payment.screenshot}
											target="_blank"
											rel="noopener noreferrer"
											className="text-xs text-blue-600 hover:underline"
										>
											📷 View Screenshot
										</a>
									)}

									{payment.approvalStatus === "APPROVED" &&
										payment.approvedAt && (
											<p className="text-xs text-gray-500">
												Approved on{" "}
												{new Intl.DateTimeFormat("en-IN", {
													day: "numeric",
													month: "short",
												}).format(new Date(payment.approvedAt))}
											</p>
										)}
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Pagination */}
			<div className="mt-6">
				<Pagination
					page={p}
					count={Math.ceil(payments.length / ITEM_PER_PAGE)}
				/>
			</div>
		</div>
	);
};

export default ParentTransactionsPage;
