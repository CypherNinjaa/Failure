import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import webpush from "web-push";

// Configure VAPID (only if keys are available)
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
	webpush.setVapidDetails(
		"mailto:vk6938663@gmail.com",
		process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
		process.env.VAPID_PRIVATE_KEY
	);
}

export async function POST(req: NextRequest) {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		console.log("🧪 Test Push Notification Request");
		console.log("  👤 User ID:", userId);
		console.log("  🎭 Role:", role);

		// Get user's push subscriptions
		const subscriptions = await prisma.pushSubscription.findMany({
			where: {
				userId,
				isActive: true,
			},
		});

		console.log(`  📱 Found ${subscriptions.length} active subscriptions`);

		if (subscriptions.length === 0) {
			return NextResponse.json(
				{
					success: false,
					error: "No active push subscriptions found",
					message:
						"Please enable push notifications in Settings → Notifications first",
				},
				{ status: 404 }
			);
		}

		// Send test notification to all subscriptions
		const results = await Promise.allSettled(
			subscriptions.map(async (sub) => {
				const subscription = {
					endpoint: sub.endpoint,
					keys: sub.keys as { p256dh: string; auth: string },
				};

				const payload = JSON.stringify({
					title: "🧪 Test Notification",
					body: "This is a test push notification from Happy Child School!",
					icon: "/logo.png",
					url: "/",
				});
				console.log(
					"  📤 Sending to endpoint:",
					sub.endpoint.substring(0, 50) + "..."
				);

				try {
					await webpush.sendNotification(subscription, payload);
					console.log("  ✅ Sent successfully");
					return { success: true, endpoint: sub.endpoint };
				} catch (error: any) {
					console.error("  ❌ Failed:", error.message);

					// If subscription is invalid, mark as inactive
					if (error.statusCode === 410 || error.statusCode === 404) {
						await prisma.pushSubscription.update({
							where: { id: sub.id },
							data: { isActive: false },
						});
						console.log("  ♻️ Marked subscription as inactive");
					}

					throw error;
				}
			})
		);

		const successCount = results.filter((r) => r.status === "fulfilled").length;
		const failCount = results.filter((r) => r.status === "rejected").length;

		console.log(
			`  📊 Results: ${successCount} success, ${failCount} failed out of ${subscriptions.length}`
		);

		return NextResponse.json({
			success: successCount > 0,
			sent: successCount,
			failed: failCount,
			total: subscriptions.length,
			message:
				successCount > 0
					? `Test notification sent to ${successCount} device(s)`
					: "Failed to send test notification",
		});
	} catch (error: any) {
		console.error("❌ Test notification error:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to send test notification" },
			{ status: 500 }
		);
	}
}
