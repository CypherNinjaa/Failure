import { NextRequest, NextResponse } from "next/server";
import { calculateTeacherLeaderboard } from "@/lib/actions";

const CRON_SECRET =
	process.env.CRON_SECRET || "school_cron_2025_secure_token_vikash";

export async function GET(request: NextRequest) {
	try {
		// Verify authorization
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (token !== CRON_SECRET) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		console.log("🔄 Starting teacher leaderboard update...");

		// Calculate teacher leaderboard (this also auto-awards/removes badges)
		const leaderboard = await calculateTeacherLeaderboard();

		console.log(
			`✅ Teacher leaderboard updated: ${leaderboard.length} teachers processed`
		);

		return NextResponse.json({
			success: true,
			message: "Teacher leaderboard updated successfully",
			teachersProcessed: leaderboard.length,
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		console.error("❌ Error updating teacher leaderboard:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to update teacher leaderboard",
			},
			{ status: 500 }
		);
	}
}
