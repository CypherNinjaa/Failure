import { getConversationMessages } from "@/lib/messageActions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { conversationId: string } }
) {
	try {
		const { searchParams } = new URL(request.url);
		const cursor = searchParams.get("cursor");
		const limit = parseInt(searchParams.get("limit") || "30");

		const result = await getConversationMessages(
			params.conversationId,
			limit,
			cursor || undefined
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error in messages API:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch messages" },
			{ status: 500 }
		);
	}
}
