"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPusherClient } from "@/lib/pusher";

const MessageIcon = ({ userId }: { userId: string }) => {
	const [unreadCount, setUnreadCount] = useState<number>(0);

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
			}
		};

		fetchUnreadCount();
	}, []);

	// Listen for real-time updates
	useEffect(() => {
		if (!userId) return;

		const pusher = getPusherClient();
		const channel = pusher.subscribe(`user-${userId}`);

		// Update count when new message arrives
		channel.bind("conversation-updated", async () => {
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
		});

		// Update count when messages are read
		channel.bind("unread-count-updated", async () => {
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
		});

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
		};
	}, [userId]);

	return (
		<Link
			href="/list/messages"
			className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative"
		>
			<Image src="/message.png" alt="Messages" width={20} height={20} />
			{unreadCount > 0 && (
				<span
					className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse"
					style={{ color: "white" }}
				>
					{unreadCount > 9 ? "9+" : unreadCount}
				</span>
			)}
		</Link>
	);
};

export default MessageIcon;
