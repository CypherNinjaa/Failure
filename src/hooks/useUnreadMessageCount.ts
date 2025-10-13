"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher";

export function useUnreadMessageCount(userId: string | null) {
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch initial unread count
	useEffect(() => {
		const fetchUnreadCount = async () => {
			try {
				const response = await fetch("/api/conversations/unread-counts");
				const data = await response.json();

				if (data.success && data.unreadCounts) {
					const total = Object.values(data.unreadCounts).reduce(
						(sum: number, count) => sum + (count as number),
						0
					);
					setUnreadCount(total);
				}
			} catch (error) {
				console.error("Failed to fetch unread count:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (userId) {
			fetchUnreadCount();
		}
	}, [userId]);

	// Listen for real-time updates
	useEffect(() => {
		if (!userId) return;

		const pusher = getPusherClient();
		const channel = pusher.subscribe(`user-${userId}`);

		const updateCount = async () => {
			try {
				const response = await fetch("/api/conversations/unread-counts");
				const data = await response.json();

				if (data.success && data.unreadCounts) {
					const total = Object.values(data.unreadCounts).reduce(
						(sum: number, count) => sum + (count as number),
						0
					);
					setUnreadCount(total);
				}
			} catch (error) {
				console.error("Failed to update unread count:", error);
			}
		};

		// Update count when new message arrives
		channel.bind("conversation-updated", updateCount);

		// Update count when messages are read
		channel.bind("unread-count-updated", updateCount);

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
		};
	}, [userId]);

	return { unreadCount, isLoading };
}
