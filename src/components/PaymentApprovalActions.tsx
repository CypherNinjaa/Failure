"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const PaymentApprovalActions = ({ paymentId }: { paymentId: string }) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const router = useRouter();

	const handleApprove = async () => {
		if (
			!confirm(
				"Approve this payment? This will update the student's fee balance."
			)
		) {
			return;
		}

		setIsProcessing(true);
		try {
			const response = await fetch("/api/approve-payment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ paymentId, action: "approve" }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to approve payment");
			}

			toast.success("Payment approved successfully!");
			router.refresh();
		} catch (error: any) {
			console.error("Approval error:", error);
			toast.error(error.message || "Failed to approve payment");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleReject = async () => {
		if (!rejectionReason.trim()) {
			toast.error("Please provide a rejection reason");
			return;
		}

		setIsProcessing(true);
		try {
			const response = await fetch("/api/approve-payment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					paymentId,
					action: "reject",
					rejectionReason: rejectionReason.trim(),
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to reject payment");
			}

			toast.success("Payment rejected");
			setShowRejectModal(false);
			setRejectionReason("");
			router.refresh();
		} catch (error: any) {
			console.error("Rejection error:", error);
			toast.error(error.message || "Failed to reject payment");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<>
			<div className="flex gap-3 mt-4 pt-4 border-t border-yellow-400">
				<button
					onClick={handleApprove}
					disabled={isProcessing}
					className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
				>
					{isProcessing ? "Processing..." : "✓ Approve Payment"}
				</button>
				<button
					onClick={() => setShowRejectModal(true)}
					disabled={isProcessing}
					className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
				>
					✗ Reject Payment
				</button>
			</div>

			{/* Rejection Modal */}
			{showRejectModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold mb-4">Reject Payment</h3>
						<p className="text-sm text-gray-600 mb-4">
							Please provide a reason for rejecting this payment. This will be
							recorded for reference.
						</p>
						<textarea
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							placeholder="Enter rejection reason..."
							className="w-full border border-gray-300 rounded-md p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-red-500 focus:border-transparent"
							disabled={isProcessing}
						/>
						<div className="flex gap-3 mt-4">
							<button
								onClick={() => {
									setShowRejectModal(false);
									setRejectionReason("");
								}}
								disabled={isProcessing}
								className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
							<button
								onClick={handleReject}
								disabled={isProcessing}
								className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
							>
								{isProcessing ? "Rejecting..." : "Confirm Rejection"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PaymentApprovalActions;
