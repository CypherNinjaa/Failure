import { expireOldSuspensions } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		// Verify the request is from Vercel Cron
		const authHeader = request.headers.get("authorization");
		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		console.log("🔄 Running suspension expiry cron job...");

		const result = await expireOldSuspensions();

		console.log(
			`✅ Suspension expiry complete: ${result.expiredCount} suspensions expired`
		);

		return NextResponse.json({
			success: true,
			message: "Suspension expiry complete",
			data: {
				expiredCount: result.expiredCount,
				timestamp: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error("❌ Error in suspension expiry cron:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
