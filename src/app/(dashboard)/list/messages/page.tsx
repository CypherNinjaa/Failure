"use client";

import { useEffect, useState } from "react";
import ConversationList from "@/components/messages/ConversationList";
import NewChatButton from "@/components/messages/NewChatButton";
import { useConversations } from "@/hooks/useConversations";

const MessagesPage = () => {
	const [initialConversations, setInitialConversations] = useState<any[]>([]);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Get conversations
				const convResponse = await fetch("/api/conversations/refresh");
				const convResult = await convResponse.json();

				if (convResult.success && convResult.conversations) {
					setInitialConversations(convResult.conversations);
				}

				// Get current user ID
				const userResponse = await fetch("/api/current-user");
				const userData = await userResponse.json();
				if (userData.userId) {
					setCurrentUserId(userData.userId);
				}
			} catch (error) {
				console.error("Failed to fetch initial data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Use real-time conversations hook
	const { conversations } = useConversations(
		initialConversations,
		currentUserId
	);

	// Calculate total unread count
	const totalUnreadCount = conversations.reduce(
		(sum, conv) => sum + conv.unreadCount,
		0
	);

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Loading conversations...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen flex relative overflow-hidden">
			{/* Fixed Instagram gradient background */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"linear-gradient(135deg, #405de6, #5b51d8, #833ab4, #c13584, #e1306c, #fd1d1d)",
					backgroundAttachment: "fixed",
					opacity: 0.08,
				}}
			></div>

			{/* Sidebar */}
			<div className="w-full md:w-96 border-r border-gray-200/50 bg-white/95 backdrop-blur-sm flex flex-col relative z-10">
				{/* Header */}
				<div className="h-16 md:h-20 px-4 md:px-5 border-b border-gray-200/50 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
					<div>
						<h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
									clipRule="evenodd"
								/>
							</svg>
							Messages
							{totalUnreadCount > 0 && (
								<span className="ml-1 min-w-[22px] h-5.5 px-2 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
									{totalUnreadCount > 99 ? "99+" : totalUnreadCount}
								</span>
							)}
						</h1>
						<p className="text-xs text-white/80 mt-0.5">
							{conversations.length} conversation
							{conversations.length !== 1 ? "s" : ""}
						</p>
					</div>
					<NewChatButton hasConversations={conversations.length > 0} />
				</div>
				<ConversationList conversations={conversations} />
			</div>

			{/* Empty state (for desktop) */}
			<div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden">
				<div className="text-center px-8 max-w-md relative z-10">
					<div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-xl">
						<svg
							className="w-16 h-16 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						Your Messages
					</h2>
					<p className="text-gray-500 leading-relaxed">
						Select a conversation from the sidebar to view messages, or start a
						new conversation by clicking the{" "}
						<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-semibold text-sm">
							+ New
						</span>{" "}
						button
					</p>
					<div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							<span>Online</span>
						</div>
						<div className="flex items-center gap-2">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clipRule="evenodd"
								/>
							</svg>
							<span>End-to-end encrypted</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessagesPage;
