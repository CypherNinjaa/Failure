import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "parent") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const body = await req.json();
		const {
			studentFeeId,
			amount,
			paymentApp,
			transactionId,
			screenshot,
			notes,
		} = body;

		// Validate amount
		const parsedAmount = parseFloat(amount);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
		}

		// Get student fee details
		const studentFee = await prisma.studentFee.findUnique({
			where: { id: studentFeeId },
			include: {
				student: true,
			},
		});

		if (!studentFee) {
			return NextResponse.json(
				{ error: "Student fee not found" },
				{ status: 404 }
			);
		}

		// Verify parent owns this student
		if (studentFee.student.parentId !== userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		// Generate receipt number
		const receiptNumber = `REC-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;

		// Create payment record with PENDING status
		await prisma.payment.create({
			data: {
				studentFeeId,
				amount: parsedAmount,
				paymentMethod: "ONLINE_UPI",
				transactionId,
				screenshot,
				paymentApp: paymentApp as any,
				notes,
				receiptNumber,
				approvalStatus: "PENDING", // Requires admin approval
				processedBy: userId,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Payment submitted for verification",
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to submit payment" },
			{ status: 500 }
		);
	}
}
