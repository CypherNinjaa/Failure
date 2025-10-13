"use server";

import prisma from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { triggerPusherEvent } from "./pusher";
import { revalidatePath } from "next/cache";

// Helper to get user info from Clerk
async function getUserInfo(userId: string) {
	try {
		const client = clerkClient();
		const user = await client.users.getUser(userId);
		const role = (user.publicMetadata as { role?: string })?.role;

		// Get additional info based on role
		let userData = null;
		if (role === "student") {
			userData = await prisma.student.findUnique({
				where: { id: userId },
				select: { name: true, surname: true, img: true },
			});
		} else if (role === "teacher") {
			userData = await prisma.teacher.findUnique({
				where: { id: userId },
				select: { name: true, surname: true, img: true },
			});
		} else if (role === "parent") {
			userData = await prisma.parent.findUnique({
				where: { id: userId },
				select: { name: true, surname: true },
			});
		} else if (role === "admin") {
			userData = await prisma.admin.findUnique({
				where: { id: userId },
				select: { username: true },
			});
		}

		// Extract name and surname safely
		let name = user.firstName || "";
		let surname = user.lastName || "";

		if (userData && "name" in userData) {
			name = userData.name || name;
		}
		if (userData && "surname" in userData) {
			surname = userData.surname || surname;
		}

		return {
			userId,
			username: user.username || user.firstName || "User",
			role,
			name,
			surname,
			img: (userData as any)?.img || user.imageUrl,
		};
	} catch (error) {
		console.error("Error fetching user info:", error);
		return null;
	}
}

// Get all conversations for current user
export async function getUserConversations() {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		const conversations = await prisma.conversation.findMany({
			where: {
				participants: {
					some: { userId },
				},
				isArchived: false,
			},
			include: {
				participants: {
					where: {
						userId: { not: userId }, // Get other participants
					},
				},
				messages: {
					take: 1,
					orderBy: { createdAt: "desc" },
				},
				_count: {
					select: { messages: true },
				},
			},
			orderBy: {
				lastMessageAt: "desc",
			},
		});

		// Get unread count for current user
		const conversationsWithDetails = await Promise.all(
			conversations.map(async (conv) => {
				const myParticipant = await prisma.conversationParticipant.findUnique({
					where: {
						conversationId_userId: {
							conversationId: conv.id,
							userId,
						},
					},
				});

				// Get participant info
				const participantsInfo = await Promise.all(
					conv.participants.map((p) => getUserInfo(p.userId))
				);

				return {
					...conv,
					unreadCount: myParticipant?.unreadCount || 0,
					participants: participantsInfo.filter((p) => p !== null),
				};
			})
		);

		return { success: true, conversations: conversationsWithDetails };
	} catch (error) {
		console.error("Error fetching conversations:", error);
		return { success: false, error: "Failed to fetch conversations" };
	}
}

// Get messages for a conversation
export async function getConversationMessages(
	conversationId: string,
	limit: number = 30,
	cursor?: string
) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		// Verify user is participant
		const participant = await prisma.conversationParticipant.findUnique({
			where: {
				conversationId_userId: { conversationId, userId },
			},
		});

		if (!participant) {
			return { success: false, error: "Unauthorized access to conversation" };
		}

		// Build query with pagination
		const messages = await prisma.message.findMany({
			where: {
				conversationId,
				isDeleted: false,
				...(cursor && {
					createdAt: {
						lt: new Date(cursor), // Get messages older than cursor
					},
				}),
			},
			select: {
				id: true,
				content: true,
				senderId: true,
				createdAt: true,
				isEdited: true,
				attachments: true,
				readBy: true,
				reactions: {
					select: {
						id: true,
						emoji: true,
						userId: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc", // Get newest first
			},
			take: limit,
		});

		// Get sender info for each message
		const messagesWithSenderInfo = await Promise.all(
			messages.map(async (msg) => {
				const senderInfo = await getUserInfo(msg.senderId);
				return {
					...msg,
					sender: senderInfo,
				};
			})
		);

		// Reverse to show oldest first in UI
		const sortedMessages = messagesWithSenderInfo.reverse();

		// Check if there are more messages
		const hasMore = messages.length === limit;
		const nextCursor =
			messages.length > 0
				? messages[messages.length - 1].createdAt.toISOString()
				: null;

		// Mark as read
		await prisma.conversationParticipant.update({
			where: {
				conversationId_userId: { conversationId, userId },
			},
			data: {
				lastReadAt: new Date(),
				unreadCount: 0,
			},
		});

		return {
			success: true,
			messages: sortedMessages,
			hasMore,
			nextCursor,
		};
	} catch (error) {
		console.error("Error fetching messages:", error);
		return { success: false, error: "Failed to fetch messages" };
	}
}

// Send message
export async function sendMessage(
	conversationId: string,
	content: string,
	attachments?: string[]
) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		// Verify user is participant
		const participant = await prisma.conversationParticipant.findUnique({
			where: {
				conversationId_userId: { conversationId, userId },
			},
		});

		if (!participant) {
			return { success: false, error: "Unauthorized access to conversation" };
		}

		// Create message
		const message = await prisma.message.create({
			data: {
				conversationId,
				senderId: userId,
				content,
				attachments: attachments || [],
			},
			include: {
				reactions: true,
			},
		});

		// Update conversation lastMessageAt
		await prisma.conversation.update({
			where: { id: conversationId },
			data: { lastMessageAt: new Date() },
		});

		// Increment unread count for other participants
		await prisma.conversationParticipant.updateMany({
			where: {
				conversationId,
				userId: { not: userId },
			},
			data: {
				unreadCount: { increment: 1 },
			},
		});

		// Get sender info
		const senderInfo = await getUserInfo(userId);

		const messageWithSender = {
			...message,
			sender: senderInfo,
		};

		// Trigger real-time update via Pusher
		await triggerPusherEvent(
			`conversation-${conversationId}`,
			"new-message",
			messageWithSender
		);

		// Trigger conversation list update for all participants
		const participants = await prisma.conversationParticipant.findMany({
			where: { conversationId },
			select: { userId: true },
		});

		for (const p of participants) {
			await triggerPusherEvent(`user-${p.userId}`, "conversation-updated", {
				conversationId,
				lastMessage: messageWithSender,
			});
		}

		return { success: true, message: messageWithSender };
	} catch (error) {
		console.error("Error sending message:", error);
		return { success: false, error: "Failed to send message" };
	}
}

// Create direct conversation
export async function createDirectConversation(otherUserId: string) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		if (userId === otherUserId) {
			return { success: false, error: "Cannot create conversation with self" };
		}

		// Check if conversation already exists
		const existingConversations = await prisma.conversation.findMany({
			where: {
				type: "DIRECT",
				participants: {
					every: {
						userId: { in: [userId, otherUserId] },
					},
				},
			},
			include: {
				participants: true,
			},
		});

		// Find conversation with exactly 2 participants
		const existing = existingConversations.find(
			(conv) => conv.participants.length === 2
		);

		if (existing) {
			return { success: true, conversation: existing };
		}

		// Create new conversation
		const conversation = await prisma.conversation.create({
			data: {
				type: "DIRECT",
				participants: {
					create: [{ userId }, { userId: otherUserId }],
				},
			},
			include: {
				participants: true,
			},
		});

		// Trigger Pusher event for new conversation
		await triggerPusherEvent(`user-${userId}`, "new-conversation", {
			conversationId: conversation.id,
		});
		await triggerPusherEvent(`user-${otherUserId}`, "new-conversation", {
			conversationId: conversation.id,
		});

		return { success: true, conversation };
	} catch (error) {
		console.error("Error creating conversation:", error);
		return { success: false, error: "Failed to create conversation" };
	}
}

// Create group conversation
export async function createGroupConversation(
	name: string,
	participantIds: string[]
) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		// Add current user to participants if not included
		const allParticipants = Array.from(new Set([userId, ...participantIds]));

		if (allParticipants.length < 2) {
			return {
				success: false,
				error: "Group must have at least 2 participants",
			};
		}

		const conversation = await prisma.conversation.create({
			data: {
				type: "GROUP",
				name,
				createdBy: userId,
				participants: {
					create: allParticipants.map((id) => ({
						userId: id,
						role: id === userId ? "ADMIN" : "MEMBER",
					})),
				},
			},
			include: {
				participants: true,
			},
		});

		// Trigger Pusher event for all participants
		for (const participantId of allParticipants) {
			await triggerPusherEvent(`user-${participantId}`, "new-conversation", {
				conversationId: conversation.id,
			});
		}

		return { success: true, conversation };
	} catch (error) {
		console.error("Error creating group conversation:", error);
		return { success: false, error: "Failed to create group conversation" };
	}
}

// Add reaction to message (one reaction per user)
// If user clicks same emoji they already reacted with, it removes the reaction
export async function addMessageReaction(messageId: string, emoji: string) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		// Check if user already has this exact reaction
		const existingReaction = await prisma.messageReaction.findUnique({
			where: {
				messageId_userId_emoji: {
					messageId,
					userId,
					emoji,
				},
			},
		});

		// If they already have this reaction, remove it (toggle off)
		if (existingReaction) {
			await prisma.messageReaction.delete({
				where: {
					messageId_userId_emoji: {
						messageId,
						userId,
						emoji,
					},
				},
			});

			// Trigger reaction removed event
			const message = await prisma.message.findUnique({
				where: { id: messageId },
				select: { conversationId: true },
			});

			if (message) {
				await triggerPusherEvent(
					`conversation-${message.conversationId}`,
					"reaction-removed",
					{
						messageId,
						userId,
						emoji,
					}
				);
			}

			return { success: true, removed: true };
		}

		// Delete any other reactions from this user on this message
		await prisma.messageReaction.deleteMany({
			where: {
				messageId,
				userId,
			},
		});

		// Create the new reaction
		const reaction = await prisma.messageReaction.create({
			data: {
				messageId,
				userId,
				emoji,
			},
		});

		// Get message to trigger update
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			select: { conversationId: true },
		});

		if (message) {
			await triggerPusherEvent(
				`conversation-${message.conversationId}`,
				"reaction-added",
				{
					messageId,
					reaction,
				}
			);
		}

		return { success: true, reaction };
	} catch (error) {
		console.error("Error adding reaction:", error);
		return { success: false, error: "Failed to add reaction" };
	}
}

// Remove reaction from message
export async function removeMessageReaction(messageId: string, emoji: string) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		await prisma.messageReaction.delete({
			where: {
				messageId_userId_emoji: {
					messageId,
					userId,
					emoji,
				},
			},
		});

		// Get message to trigger update
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			select: { conversationId: true },
		});

		if (message) {
			await triggerPusherEvent(
				`conversation-${message.conversationId}`,
				"reaction-removed",
				{
					messageId,
					userId,
					emoji,
				}
			);
		}

		return { success: true };
	} catch (error) {
		console.error("Error removing reaction:", error);
		return { success: false, error: "Failed to remove reaction" };
	}
}

// Delete message
export async function deleteMessage(messageId: string) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		const message = await prisma.message.findUnique({
			where: { id: messageId },
		});

		if (!message || message.senderId !== userId) {
			return { success: false, error: "Unauthorized to delete this message" };
		}

		await prisma.message.update({
			where: { id: messageId },
			data: { isDeleted: true },
		});

		await triggerPusherEvent(
			`conversation-${message.conversationId}`,
			"message-deleted",
			{
				messageId,
			}
		);

		return { success: true };
	} catch (error) {
		console.error("Error deleting message:", error);
		return { success: false, error: "Failed to delete message" };
	}
}

export async function editMessage(messageId: string, newContent: string) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		const message = await prisma.message.findUnique({
			where: { id: messageId },
		});

		if (!message || message.senderId !== userId) {
			return { success: false, error: "Unauthorized to edit this message" };
		}

		const updatedMessage = await prisma.message.update({
			where: { id: messageId },
			data: {
				content: newContent,
				isEdited: true,
				editedAt: new Date(),
			},
			include: {
				reactions: true,
			},
		});

		await triggerPusherEvent(
			`conversation-${message.conversationId}`,
			"message-edited",
			{
				messageId,
				message: updatedMessage,
			}
		);

		return { success: true, message: updatedMessage };
	} catch (error) {
		console.error("Error editing message:", error);
		return { success: false, error: "Failed to edit message" };
	}
} // Get all users (for starting new conversation)
export async function getAllUsers() {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		const [students, teachers, parents, admins] = await Promise.all([
			prisma.student.findMany({
				select: { id: true, name: true, surname: true, img: true },
			}),
			prisma.teacher.findMany({
				select: { id: true, name: true, surname: true, img: true },
			}),
			prisma.parent.findMany({
				select: { id: true, name: true, surname: true },
			}),
			prisma.admin.findMany({
				select: { id: true, username: true },
			}),
		]);

		const allUsers = [
			...students.map((s) => ({
				...s,
				role: "student",
				fullName: `${s.name} ${s.surname}`,
			})),
			...teachers.map((t) => ({
				...t,
				role: "teacher",
				fullName: `${t.name} ${t.surname}`,
			})),
			...parents.map((p) => ({
				...p,
				role: "parent",
				fullName: `${p.name} ${p.surname}`,
				img: null,
			})),
			...admins.map((a) => ({
				...a,
				role: "admin",
				fullName: a.username,
				name: a.username,
				surname: "",
				img: null,
			})),
		].filter((u) => u.id !== userId); // Exclude current user

		return { success: true, users: allUsers };
	} catch (error) {
		console.error("Error fetching users:", error);
		return { success: false, error: "Failed to fetch users" };
	}
}

// Send typing indicator
export async function sendTypingIndicator(
	conversationId: string,
	isTyping: boolean
) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		const userInfo = await getUserInfo(userId);

		await triggerPusherEvent(`conversation-${conversationId}`, "typing", {
			userId,
			userName: userInfo?.name || "User",
			isTyping,
		});

		return { success: true };
	} catch (error) {
		console.error("Error sending typing indicator:", error);
		return { success: false };
	}
}

// Mark messages as read
export async function markMessagesAsRead(
	conversationId: string,
	messageIds: string[]
) {
	try {
		const { userId } = auth();
		if (!userId) return { success: false, error: "Unauthorized" };

		// Update each message to add current user to readBy array
		for (const messageId of messageIds) {
			const message = await prisma.message.findUnique({
				where: { id: messageId },
			});

			if (!message) continue;

			const readByArray = message.readBy
				? (JSON.parse(JSON.stringify(message.readBy)) as any[])
				: [];

			// Check if user already marked as read
			const alreadyRead = readByArray.some(
				(read: any) => read.userId === userId
			);

			if (!alreadyRead) {
				readByArray.push({
					userId,
					readAt: new Date().toISOString(),
				});

				await prisma.message.update({
					where: { id: messageId },
					data: {
						readBy: readByArray,
					},
				});

				// Trigger Pusher event for message read
				await triggerPusherEvent(
					`conversation-${conversationId}`,
					"message-read",
					{
						messageId,
						userId,
					}
				);
			}
		}

		// Reset unread count for this user
		await prisma.conversationParticipant.update({
			where: {
				conversationId_userId: {
					conversationId,
					userId,
				},
			},
			data: {
				unreadCount: 0,
			},
		});

		// Trigger Pusher event for unread count update
		await triggerPusherEvent(`user-${userId}`, "unread-count-updated", {
			conversationId,
			unreadCount: 0,
		});

		return { success: true };
	} catch (error) {
		console.error("Error marking messages as read:", error);
		return { success: false, error: "Failed to mark messages as read" };
	}
}
