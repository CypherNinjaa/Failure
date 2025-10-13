"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher";

type Conversation = {
	id: string;
	type: string;
	name?: string | null;
	participants: any[];
	messages: any[];
	unreadCount: number;
	lastMessageAt: Date;
};

export function useConversations(
	initialConversations: Conversation[],
	userId: string | null
) {
	const [conversations, setConversations] =
		useState<Conversation[]>(initialConversations);

	useEffect(() => {
		// Update conversations when initial data changes
		setConversations(initialConversations);
	}, [initialConversations]);

	useEffect(() => {
		if (!userId) return;

		const pusher = getPusherClient();
		const channel = pusher.subscribe(`user-${userId}`);

		// Listen for conversation updates (new messages)
		channel.bind(
			"conversation-updated",
			async (data: { conversationId: string; lastMessage: any }) => {
				// Update the conversation with new last message and move to top
				setConversations((prev) => {
					const updated = prev.map((conv) => {
						if (conv.id === data.conversationId) {
							return {
								...conv,
								messages: [data.lastMessage],
								lastMessageAt: new Date(data.lastMessage.createdAt),
								unreadCount: conv.unreadCount + 1, // Increment unread count
							};
						}
						return conv;
					});

					// Sort by lastMessageAt (most recent first)
					return updated.sort(
						(a, b) =>
							new Date(b.lastMessageAt).getTime() -
							new Date(a.lastMessageAt).getTime()
					);
				});

				// Also fetch fresh unread counts to ensure accuracy
				try {
					const response = await fetch("/api/conversations/unread-counts");
					const result = await response.json();

					if (result.success && result.unreadCounts) {
						setConversations((prev) =>
							prev.map((conv) => ({
								...conv,
								unreadCount: result.unreadCounts[conv.id] || 0,
							}))
						);
					}
				} catch (error) {
					console.error("Failed to fetch unread counts:", error);
				}
			}
		);

		// Listen for unread count updates (when messages are read)
		channel.bind(
			"unread-count-updated",
			(data: { conversationId: string; unreadCount: number }) => {
				setConversations((prev) =>
					prev.map((conv) =>
						conv.id === data.conversationId
							? { ...conv, unreadCount: data.unreadCount }
							: conv
					)
				);
			}
		);

		// Listen for new conversations
		channel.bind("new-conversation", async () => {
			try {
				const response = await fetch("/api/conversations/refresh");
				const result = await response.json();

				if (result.success && result.conversations) {
					setConversations(result.conversations);
				}
			} catch (error) {
				console.error("Failed to refresh conversations:", error);
			}
		});

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
		};
	}, [userId]);

	return { conversations };
}
