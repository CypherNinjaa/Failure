"use client";

import { useState } from "react";
import ParentOnlinePaymentForm from "./forms/ParentOnlinePaymentForm";
import Image from "next/image";

type FeeCardProps = {
	fee: any;
	studentName: string;
	upiId: string | null;
	upiQRCode: string | null;
};

const ParentFeeCard = ({
	fee,
	studentName,
	upiId,
	upiQRCode,
}: FeeCardProps) => {
	const [showOnlinePayment, setShowOnlinePayment] = useState(false);

	const statusColors = {
		PAID: "bg-green-100 text-green-800 border-green-300",
		PARTIAL: "bg-yellow-100 text-yellow-800 border-yellow-300",
		PENDING: "bg-red-100 text-red-800 border-red-300",
		OVERDUE: "bg-red-200 text-red-900 border-red-400",
	};

	const paymentMethodIcons: { [key: string]: string } = {
		CASH: "💵",
		CARD: "💳",
		BANK_TRANSFER: "🏦",
		ONLINE_UPI: "📱",
		CHEQUE: "📝",
		OTHER: "💰",
	};

	// Format month/year display
	const getMonthYearDisplay = () => {
		if (fee.month) {
			const monthNames = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			return `${monthNames[fee.month - 1]} ${fee.year}`;
		}
		return `${fee.year}`;
	};

	return (
		<>
			<div
				className={`border-2 rounded-lg p-4 ${
					statusColors[fee.status as keyof typeof statusColors]
				}`}
			>
				<div className="flex justify-between items-start mb-3">
					<div className="flex-1">
						<h3 className="font-semibold text-lg">{fee.feeStructure.name}</h3>
						<p className="text-sm text-gray-600">
							{fee.feeStructure.feeType} •{" "}
							{fee.feeStructure.frequency.replace("_", " ")}
						</p>
						<p className="text-sm font-semibold text-gray-700 mt-1">
							📅 {getMonthYearDisplay()}
						</p>
					</div>
					<span
						className={`px-3 py-1 rounded-full text-sm font-bold ${
							statusColors[fee.status as keyof typeof statusColors]
						}`}
					>
						{fee.status}
					</span>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
					<div>
						<p className="text-xs text-gray-600">Total Amount</p>
						<p className="text-lg font-bold">₹{fee.totalAmount.toFixed(2)}</p>
					</div>
					<div>
						<p className="text-xs text-gray-600">Paid Amount</p>
						<p className="text-lg font-bold text-green-600">
							₹{fee.paidAmount.toFixed(2)}
						</p>
					</div>
					<div>
						<p className="text-xs text-gray-600">Pending Amount</p>
						<p className="text-lg font-bold text-red-600">
							₹{fee.pendingAmount.toFixed(2)}
						</p>
					</div>
					<div>
						<p className="text-xs text-gray-600">Due Date</p>
						<p className="text-sm font-semibold">
							{new Intl.DateTimeFormat("en-IN", {
								day: "numeric",
								month: "short",
								year: "numeric",
							}).format(new Date(fee.dueDate))}
						</p>
					</div>
				</div>

				{fee.carriedForward > 0 && (
					<div className="bg-yellow-50 border border-yellow-300 rounded p-2 mb-3">
						<p className="text-xs text-yellow-800">
							⚠️ Carried forward from previous month: ₹
							{fee.carriedForward.toFixed(2)}
						</p>
					</div>
				)}

				{/* Payment History */}
				{fee.payments.length > 0 && (
					<div className="mt-4 pt-3 border-t">
						<h4 className="text-sm font-semibold mb-2">Payment History</h4>
						<div className="space-y-2">
							{fee.payments.slice(0, 3).map((payment: any) => (
								<div
									key={payment.id}
									className="flex justify-between items-center text-xs bg-white bg-opacity-50 p-2 rounded"
								>
									<div className="flex items-center gap-2">
										<span className="text-lg">
											{paymentMethodIcons[payment.paymentMethod] || "💰"}
										</span>
										<div>
											<span className="font-semibold">
												₹{payment.amount.toFixed(2)}
											</span>
											<span className="text-gray-600 ml-2">
												{payment.paymentMethod.replace("_", " ")}
											</span>
											{payment.approvalStatus === "PENDING" && (
												<span className="ml-2 text-yellow-600 font-semibold">
													⏳ Pending Approval
												</span>
											)}
											{payment.approvalStatus === "REJECTED" && (
												<span className="ml-2 text-red-600 font-semibold">
													❌ Rejected
												</span>
											)}
										</div>
									</div>
									<div className="text-right">
										<div>
											{new Intl.DateTimeFormat("en-IN", {
												day: "numeric",
												month: "short",
											}).format(new Date(payment.createdAt))}
										</div>
										{payment.receiptNumber && (
											<div className="text-gray-500 font-mono text-[10px]">
												{payment.receiptNumber}
											</div>
										)}
									</div>
								</div>
							))}
							{fee.payments.length > 3 && (
								<p className="text-xs text-gray-500 text-center pt-1">
									+{fee.payments.length - 3} more payments
								</p>
							)}
						</div>
					</div>
				)}

				{/* Pay Buttons - Only show if pending */}
				{fee.pendingAmount > 0 && (
					<div className="mt-4 pt-3 border-t flex gap-2">
						{upiId ? (
							<button
								onClick={() => setShowOnlinePayment(true)}
								className="flex-1 bg-lamaPurple hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
							>
								💳 Pay Online (UPI)
							</button>
						) : (
							<button
								disabled
								className="flex-1 bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded cursor-not-allowed"
								title="Online payment not configured by admin"
							>
								💳 Pay Online (Unavailable)
							</button>
						)}
						<button
							disabled
							className="flex-1 bg-gray-400 text-gray-100 font-semibold py-2 px-4 rounded cursor-not-allowed"
							title="Pay at school office"
						>
							🏪 Pay Offline
						</button>
					</div>
				)}
			</div>

			{/* Online Payment Modal */}
			{showOnlinePayment && upiId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
					<div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
						<ParentOnlinePaymentForm
							studentFeeId={fee.id}
							studentFeeName={`${studentName} - ${fee.feeStructure.name}`}
							pendingAmount={fee.pendingAmount}
							upiId={upiId}
							upiQRCode={upiQRCode}
							onClose={() => setShowOnlinePayment(false)}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default ParentFeeCard;
