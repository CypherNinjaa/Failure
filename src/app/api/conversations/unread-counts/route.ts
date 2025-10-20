import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Force dynamic rendering - required for auth()
export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const { userId } = auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Get all conversation participants for this user with unread counts
		const participants = await prisma.conversationParticipant.findMany({
			where: {
				userId,
				conversation: {
					isArchived: false,
				},
			},
			select: {
				conversationId: true,
				unreadCount: true,
			},
		});

		// Create a map of conversationId -> unreadCount
		const unreadCounts = participants.reduce(
			(
				acc: Record<string, number>,
				p: { conversationId: string; unreadCount: number }
			) => {
				acc[p.conversationId] = p.unreadCount;
				return acc;
			},
			{} as Record<string, number>
		);

		return NextResponse.json({ success: true, unreadCounts });
	} catch (error) {
		console.error("Error fetching unread counts:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch unread counts" },
			{ status: 500 }
		);
	}
}
