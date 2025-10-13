import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
	request: NextRequest,
	{ params }: { params: { conversationId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const conversationId = params.conversationId;

		// Verify user is participant
		const participant = await prisma.conversationParticipant.findUnique({
			where: {
				conversationId_userId: { conversationId, userId },
			},
		});

		if (!participant) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized access to conversation" },
				{ status: 403 }
			);
		}

		// Get all messages with attachments
		const messages = await prisma.message.findMany({
			where: {
				conversationId,
				isDeleted: false,
			},
			select: {
				attachments: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Extract all media URLs (filter out messages without attachments)
		const media: { url: string; createdAt: Date }[] = [];
		messages.forEach((msg) => {
			if (
				msg.attachments &&
				Array.isArray(msg.attachments) &&
				msg.attachments.length > 0
			) {
				msg.attachments.forEach((url) => {
					if (typeof url === "string") {
						media.push({
							url,
							createdAt: msg.createdAt,
						});
					}
				});
			}
		});

		return NextResponse.json({
			success: true,
			media,
		});
	} catch (error) {
		console.error("Error fetching conversation media:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch media" },
			{ status: 500 }
		);
	}
}
