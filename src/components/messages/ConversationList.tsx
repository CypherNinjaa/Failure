"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useState } from "react";

type Conversation = {
	id: string;
	type: string;
	name?: string | null;
	participants: any[];
	messages: any[];
	unreadCount: number;
	lastMessageAt: Date;
};

const ConversationList = ({
	conversations,
}: {
	conversations: Conversation[];
}) => {
	const pathname = usePathname();
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [updatedConversations, setUpdatedConversations] = useState<Set<string>>(
		new Set()
	);
	const { isUserOnline } = useOnlineStatus(currentUserId);

	useEffect(() => {
		// Get current user ID from Clerk on client side
		const getUserId = async () => {
			try {
				const response = await fetch("/api/current-user");
				const data = await response.json();
				if (data.userId) {
					setCurrentUserId(data.userId);
				}
			} catch (error) {
				console.error("Failed to get current user:", error);
			}
		};
		getUserId();
	}, []);

	// Flash animation when conversation updates
	useEffect(() => {
		const prevConversations = new Map(
			conversations.map((c) => [c.id, c.unreadCount])
		);

		conversations.forEach((conv) => {
			const prevCount = prevConversations.get(conv.id);
			if (prevCount !== undefined && prevCount !== conv.unreadCount) {
				setUpdatedConversations((prev) => new Set(prev).add(conv.id));
				setTimeout(() => {
					setUpdatedConversations((prev) => {
						const next = new Set(prev);
						next.delete(conv.id);
						return next;
					});
				}, 2000); // Remove flash after 2 seconds
			}
		});
	}, [conversations]);

	const getConversationName = (conv: Conversation) => {
		if (conv.type === "GROUP") {
			return conv.name || "Group Chat";
		}
		// For direct chat, show other participant's name
		const otherParticipant = conv.participants[0];
		if (otherParticipant) {
			return `${otherParticipant.name} ${otherParticipant.surname}`.trim();
		}
		return "Unknown";
	};

	const getLastMessage = (conv: Conversation) => {
		if (conv.messages.length > 0) {
			const lastMsg = conv.messages[0];
			return (
				lastMsg.content.substring(0, 50) +
				(lastMsg.content.length > 50 ? "..." : "")
			);
		}
		return "No messages yet";
	};

	const formatTime = (date: Date) => {
		const now = new Date();
		const messageDate = new Date(date);
		const diffInHours =
			(now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return messageDate.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (diffInHours < 168) {
			// Less than a week
			return messageDate.toLocaleDateString("en-US", { weekday: "short" });
		} else {
			return messageDate.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
		}
	};

	return (
		<div
			className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-lamaSky scrollbar-track-transparent"
			style={{ scrollbarWidth: "thin", scrollbarColor: "#833ab4 transparent" }}
		>
			{conversations.length === 0 ? (
				<div className="p-8 text-center">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
						<svg
							className="w-8 h-8 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							/>
						</svg>
					</div>
					<p className="text-sm font-medium text-gray-600 mb-1">
						No messages yet
					</p>
					<p className="text-xs text-gray-400">
						Start a conversation to connect with others
					</p>
				</div>
			) : (
				<div className="divide-y divide-gray-100">
					{conversations.map((conv) => {
						const isActive = pathname === `/list/messages/${conv.id}`;
						const otherParticipant = conv.participants[0];
						const isOnline =
							conv.type === "DIRECT" && otherParticipant?.userId
								? isUserOnline(otherParticipant.userId)
								: false;
						const isUpdated = updatedConversations.has(conv.id);

						return (
							<Link
								key={conv.id}
								href={`/list/messages/${conv.id}`}
								className={`block p-3.5 md:p-4 hover:bg-purple-50/50 transition-all ${
									isActive
										? "bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500"
										: "border-l-4 border-transparent"
								} ${isUpdated ? "animate-pulse bg-purple-100/30" : ""}`}
							>
								<div className="flex items-center gap-3">
									{/* Avatar with online indicator */}
									<div className="relative flex-shrink-0">
										{conv.type === "DIRECT" && otherParticipant?.img ? (
											<div className="relative">
												<Image
													src={otherParticipant.img}
													alt={getConversationName(conv)}
													width={52}
													height={52}
													className="w-13 h-13 rounded-full object-cover ring-2 ring-white"
												/>
												{/* Online indicator - green dot only when online */}
												{isOnline && (
													<div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse ring-2 ring-green-200"></div>
												)}
											</div>
										) : (
											<div className="w-13 h-13 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
												{conv.type === "GROUP"
													? "👥"
													: getConversationName(conv).charAt(0).toUpperCase()}
											</div>
										)}
										{/* Unread badge */}
										{conv.unreadCount > 0 && (
											<div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
												{conv.unreadCount > 9 ? "9+" : conv.unreadCount}
											</div>
										)}
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="flex items-baseline justify-between mb-0.5">
											<h3
												className={`font-semibold text-sm truncate ${
													conv.unreadCount > 0
														? "text-gray-900"
														: "text-gray-700"
												}`}
											>
												{getConversationName(conv)}
											</h3>
											<span
												className={`text-xs ml-2 flex-shrink-0 ${
													conv.unreadCount > 0
														? "text-purple-600 font-medium"
														: "text-gray-400"
												}`}
											>
												{formatTime(conv.lastMessageAt)}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<p
												className={`text-xs truncate flex-1 ${
													conv.unreadCount > 0
														? "text-gray-900 font-medium"
														: "text-gray-500"
												}`}
											>
												{getLastMessage(conv)}
											</p>
											{conv.unreadCount === 0 && (
												<svg
													className="w-4 h-4 text-gray-400 flex-shrink-0"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
												</svg>
											)}
										</div>
										{conv.type === "GROUP" && (
											<div className="flex items-center gap-1 mt-1">
												<svg
													className="w-3 h-3 text-gray-400"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
												</svg>
												<span className="text-xs text-gray-400">
													{conv.participants.length + 1} members
												</span>
											</div>
										)}
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ConversationList;
