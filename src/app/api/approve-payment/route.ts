import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		// Only admin can approve/reject payments
		if (role !== "admin") {
			return NextResponse.json(
				{ message: "Unauthorized: Admin access required" },
				{ status: 403 }
			);
		}

		const { paymentId, action, rejectionReason } = await req.json();

		if (!paymentId || !action) {
			return NextResponse.json(
				{ message: "Missing required fields: paymentId and action" },
				{ status: 400 }
			);
		}

		// Fetch the payment with related data
		const payment = await prisma.payment.findUnique({
			where: { id: paymentId },
			include: {
				studentFee: {
					include: {
						feeStructure: true,
						student: true,
					},
				},
			},
		});

		if (!payment) {
			return NextResponse.json(
				{ message: "Payment not found" },
				{ status: 404 }
			);
		}

		if (payment.approvalStatus !== "PENDING") {
			return NextResponse.json(
				{ message: "Payment has already been processed" },
				{ status: 400 }
			);
		}

		const userId = sessionClaims?.userId as string;

		if (action === "approve") {
			// Approve payment: Update payment status and StudentFee balance
			await prisma.$transaction(async (tx) => {
				// Update payment status
				await tx.payment.update({
					where: { id: paymentId },
					data: {
						approvalStatus: "APPROVED",
						approvedBy: userId,
						approvedAt: new Date(),
						processedBy: userId,
					},
				});

				// Get current student fee
				const currentStudentFee = await tx.studentFee.findUnique({
					where: { id: payment.studentFeeId },
				});

				if (!currentStudentFee) {
					throw new Error("Student fee record not found");
				}

				// Calculate new amounts
				const newPaidAmount = currentStudentFee.paidAmount + payment.amount;
				const newPendingAmount = currentStudentFee.totalAmount - newPaidAmount;

				// Determine new status
				let newStatus: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" = "PENDING";
				if (newPendingAmount <= 0) {
					newStatus = "PAID";
				} else if (newPaidAmount > 0) {
					newStatus = "PARTIAL";
				} else if (
					currentStudentFee.dueDate &&
					new Date() > currentStudentFee.dueDate
				) {
					newStatus = "OVERDUE";
				}

				// Update student fee
				await tx.studentFee.update({
					where: { id: payment.studentFeeId },
					data: {
						paidAmount: newPaidAmount,
						pendingAmount: newPendingAmount,
						status: newStatus,
					},
				});
			});

			return NextResponse.json({
				message: "Payment approved successfully",
				success: true,
			});
		} else if (action === "reject") {
			if (!rejectionReason || !rejectionReason.trim()) {
				return NextResponse.json(
					{ message: "Rejection reason is required" },
					{ status: 400 }
				);
			}

			// Reject payment: Update payment status with reason
			await prisma.payment.update({
				where: { id: paymentId },
				data: {
					approvalStatus: "REJECTED",
					processedBy: userId,
					rejectionReason: rejectionReason.trim(),
				},
			});

			return NextResponse.json({
				message: "Payment rejected",
				success: true,
			});
		} else {
			return NextResponse.json(
				{ message: "Invalid action. Use 'approve' or 'reject'" },
				{ status: 400 }
			);
		}
	} catch (error: any) {
		console.error("Payment approval error:", error);
		return NextResponse.json(
			{ message: error.message || "Internal server error" },
			{ status: 500 }
		);
	}
}
