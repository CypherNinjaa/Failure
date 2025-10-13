"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPusherClient } from "@/lib/pusher";

const UnreadMessagesCard = ({ userId }: { userId: string }) => {
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

	if (isLoading) {
		return (
			<div className="bg-white rounded-2xl p-6 flex-1 shadow-md hover:shadow-lg transition-shadow">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full animate-pulse" />
						<div>
							<div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
							<div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Link
			href="/list/messages"
			className="bg-white rounded-2xl p-6 flex-1 shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					{/* Icon */}
					<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg relative">
						<svg
							className="w-7 h-7 text-white"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
								clipRule="evenodd"
							/>
						</svg>
						{/* Pulse animation for new messages */}
						{unreadCount > 0 && (
							<div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
						)}
					</div>

					{/* Text */}
					<div>
						<p className="text-sm text-gray-500 font-medium">Unread Messages</p>
						<div className="flex items-center gap-2">
							<h3 className="text-3xl font-bold text-gray-800">
								{unreadCount}
							</h3>
							{unreadCount > 0 && (
								<span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full animate-pulse">
									New
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Arrow */}
				<div className="flex items-center">
					<svg
						className="w-6 h-6 text-purple-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</div>
			</div>

			{/* Bottom info bar */}
			<div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
				<span className="text-xs text-gray-400 flex items-center gap-1">
					<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
							clipRule="evenodd"
						/>
					</svg>
					Real-time updates
				</span>
				<span className="text-xs font-semibold text-purple-600">
					View All →
				</span>
			</div>
		</Link>
	);
};

export default UnreadMessagesCard;
