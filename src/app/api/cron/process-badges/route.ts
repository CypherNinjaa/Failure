import { NextResponse } from "next/server";
import { autoAwardBadges } from "@/lib/actions";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Cron job endpoint to automatically process badges
 * Awards new badges and removes badges from students who no longer qualify
 *
 * Security: Add CRON_SECRET to environment variables
 * Schedule: Configure in vercel.json
 */
export async function GET(req: Request) {
	try {
		// Verify cron secret for security
		const authHeader = req.headers.get("authorization");
		const cronSecret = process.env.CRON_SECRET;

		if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		console.log("[CRON] Starting badge processing...");

		const result = await autoAwardBadges();

		if (result.success) {
			console.log(
				`[CRON] Badge processing completed. Awarded: ${result.awardedCount}, Removed: ${result.removedCount}`
			);

			return NextResponse.json({
				success: true,
				message: "Badges processed successfully",
				data: {
					awardedCount: result.awardedCount,
					removedCount: result.removedCount,
					timestamp: new Date().toISOString(),
				},
			});
		} else {
			console.error("[CRON] Badge processing failed");
			return NextResponse.json(
				{
					success: false,
					message: "Badge processing failed",
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("[CRON] Error processing badges:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to process badges",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
