import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import PaymentApprovalActions from "@/components/PaymentApprovalActions";

const PaymentApprovalsPage = async () => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		redirect("/");
	}

	// Fetch pending payments
	const pendingPayments = await prisma.payment.findMany({
		where: {
			approvalStatus: "PENDING",
		},
		include: {
			studentFee: {
				include: {
					student: {
						include: {
							class: true,
							grade: true,
						},
					},
					feeStructure: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	// Fetch recently processed payments (approved/rejected)
	const recentPayments = await prisma.payment.findMany({
		where: {
			approvalStatus: {
				in: ["APPROVED", "REJECTED"],
			},
			paymentMethod: "ONLINE_UPI",
		},
		include: {
			studentFee: {
				include: {
					student: true,
					feeStructure: true,
				},
			},
		},
		orderBy: {
			updatedAt: "desc",
		},
		take: 10,
	});

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-lg font-semibold">Online Payment Approvals</h1>
				<div className="text-sm text-gray-500">
					{pendingPayments.length} pending approval
				</div>
			</div>

			{/* Pending Payments */}
			<div className="mb-8">
				<h2 className="text-md font-semibold mb-4 text-gray-700">
					⏳ Pending Approvals
				</h2>

				{pendingPayments.length === 0 ? (
					<div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-gray-500">No pending payments</p>
						<p className="text-xs text-gray-400 mt-2">
							New online payments will appear here for approval
						</p>
					</div>
				) : (
					<div className="grid gap-4">
						{pendingPayments.map((payment) => (
							<div
								key={payment.id}
								className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-4"
							>
								<div className="flex flex-col lg:flex-row gap-4">
									{/* Left: Payment Details */}
									<div className="flex-1">
										<div className="flex items-start gap-3 mb-3">
											<Image
												src={payment.studentFee.student.img || "/noAvatar.png"}
												alt={payment.studentFee.student.name}
												width={48}
												height={48}
												className="rounded-full object-cover"
											/>
											<div className="flex-1">
												<h3 className="font-semibold text-lg">
													{payment.studentFee.student.name}{" "}
													{payment.studentFee.student.surname}
												</h3>
												<p className="text-sm text-gray-600">
													Class:{" "}
													{payment.studentFee.student.class?.name || "N/A"} |
													Grade:{" "}
													{payment.studentFee.student.grade?.level || "N/A"}
												</p>
												<p className="text-sm text-gray-600">
													Fee: {payment.studentFee.feeStructure.name}
												</p>
											</div>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
											<div>
												<p className="text-xs text-gray-600">Amount Paid</p>
												<p className="text-lg font-bold text-green-600">
													₹{payment.amount.toFixed(2)}
												</p>
											</div>
											<div>
												<p className="text-xs text-gray-600">Payment App</p>
												<p className="text-sm font-semibold">
													{payment.paymentApp || "N/A"}
												</p>
											</div>
											<div>
												<p className="text-xs text-gray-600">Transaction ID</p>
												<p className="text-sm font-mono break-all">
													{payment.transactionId}
												</p>
											</div>
											<div>
												<p className="text-xs text-gray-600">Submitted On</p>
												<p className="text-sm">
													{new Intl.DateTimeFormat("en-IN", {
														dateStyle: "medium",
														timeStyle: "short",
													}).format(new Date(payment.createdAt))}
												</p>
											</div>
										</div>

										{payment.notes && (
											<div className="bg-white p-2 rounded border border-gray-200 mb-3">
												<p className="text-xs text-gray-600">Notes:</p>
												<p className="text-sm">{payment.notes}</p>
											</div>
										)}

										<div className="text-xs text-gray-500">
											Receipt: {payment.receiptNumber}
										</div>
									</div>

									{/* Right: Screenshot */}
									{payment.screenshot && (
										<div className="lg:w-64 flex flex-col">
											<p className="text-xs text-gray-600 mb-2 font-semibold">
												Payment Screenshot:
											</p>
											<a
												href={payment.screenshot}
												target="_blank"
												rel="noopener noreferrer"
												className="relative w-full h-64 lg:h-full border-2 border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors group"
											>
												<Image
													src={payment.screenshot}
													alt="Payment Screenshot"
													fill
													className="object-contain group-hover:scale-105 transition-transform"
												/>
												<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
													<span className="text-white opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 px-3 py-1 rounded text-sm">
														🔍 View Full Size
													</span>
												</div>
											</a>
										</div>
									)}
								</div>

								{/* Action Buttons */}
								<PaymentApprovalActions paymentId={payment.id} />
							</div>
						))}
					</div>
				)}
			</div>

			{/* Recent Processed Payments */}
			<div>
				<h2 className="text-md font-semibold mb-4 text-gray-700">
					📋 Recently Processed
				</h2>

				{recentPayments.length === 0 ? (
					<div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-sm text-gray-500">No processed payments yet</p>
					</div>
				) : (
					<div className="grid gap-3">
						{recentPayments.map((payment) => {
							const isApproved = payment.approvalStatus === "APPROVED";
							return (
								<div
									key={payment.id}
									className={`border rounded-lg p-3 ${
										isApproved
											? "bg-green-50 border-green-200"
											: "bg-red-50 border-red-200"
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<span
													className={`px-2 py-1 rounded-full text-xs font-bold ${
														isApproved
															? "bg-green-200 text-green-800"
															: "bg-red-200 text-red-800"
													}`}
												>
													{isApproved ? "✓ APPROVED" : "✗ REJECTED"}
												</span>
												<span className="font-semibold">
													{payment.studentFee.student.name}{" "}
													{payment.studentFee.student.surname}
												</span>
											</div>
											<div className="text-sm text-gray-600 mt-1">
												{payment.studentFee.feeStructure.name} • ₹
												{payment.amount.toFixed(2)} •{" "}
												{payment.paymentApp || "UPI"}
											</div>
										</div>
										<div className="text-right text-xs text-gray-500">
											{new Intl.DateTimeFormat("en-IN", {
												dateStyle: "short",
											}).format(new Date(payment.updatedAt))}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default PaymentApprovalsPage;
