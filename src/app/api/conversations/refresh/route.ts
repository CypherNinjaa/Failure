import { getUserConversations } from "@/lib/messageActions";
import { NextResponse } from "next/server";

// Force dynamic rendering - required for auth() in getUserConversations
export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const result = await getUserConversations();
		return NextResponse.json(result);
	} catch (error) {
		console.error("Error refreshing conversations:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to refresh conversations" },
			{ status: 500 }
		);
	}
}
