import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	try {
		const { userId } = auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { subscription } = body;

		if (!subscription || !subscription.endpoint) {
			return NextResponse.json(
				{ error: "Invalid subscription data" },
				{ status: 400 }
			);
		}

		console.log("💾 Saving push subscription for user:", userId);

		// Check if subscription already exists
		const existing = await prisma.pushSubscription.findFirst({
			where: {
				userId,
				endpoint: subscription.endpoint,
			},
		});

		if (existing) {
			console.log("✅ Subscription already exists, updating...");
			await prisma.pushSubscription.update({
				where: { id: existing.id },
				data: {
					keys: subscription.keys,
					isActive: true,
				},
			});
		} else {
			console.log("✅ Creating new subscription...");
			await prisma.pushSubscription.create({
				data: {
					userId,
					endpoint: subscription.endpoint,
					keys: subscription.keys,
					isActive: true,
				},
			});
		}

		console.log("✅ Push subscription saved successfully");

		return NextResponse.json({
			success: true,
			message: "Subscription saved successfully",
		});
	} catch (error: any) {
		console.error("❌ Failed to save push subscription:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to save subscription" },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { userId } = auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { endpoint } = body;

		if (!endpoint) {
			return NextResponse.json(
				{ error: "Endpoint is required" },
				{ status: 400 }
			);
		}

		console.log("🗑️ Deleting push subscription for user:", userId);

		await prisma.pushSubscription.updateMany({
			where: {
				userId,
				endpoint,
			},
			data: {
				isActive: false,
			},
		});

		console.log("✅ Push subscription deleted successfully");

		return NextResponse.json({
			success: true,
			message: "Subscription deleted successfully",
		});
	} catch (error: any) {
		console.error("❌ Failed to delete push subscription:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to delete subscription" },
			{ status: 500 }
		);
	}
}
