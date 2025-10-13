"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { getPusherClient } from "@/lib/pusher";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
	sendMessage,
	sendTypingIndicator,
	addMessageReaction,
	editMessage,
	markMessagesAsRead,
} from "@/lib/messageActions";
import { useRouter } from "next/navigation";

type Message = {
	id: string;
	content: string;
	senderId: string;
	createdAt: Date;
	isEdited: boolean;
	attachments?: any;
	readBy?: any;
	sender: any;
	reactions: any[];
};

const MessageThread = ({
	conversationId,
	initialMessages,
	currentUserId,
	otherUserId,
	initialHasMore,
	initialCursor,
}: {
	conversationId: string;
	initialMessages: Message[];
	currentUserId: string;
	otherUserId?: string;
	initialHasMore?: boolean;
	initialCursor?: string | null;
}) => {
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [typingUsers, setTypingUsers] = useState<
		{ userId: string; userName: string }[]
	>([]);
	const [hasMore, setHasMore] = useState(initialHasMore || false);
	const [cursor, setCursor] = useState<string | null>(initialCursor || null);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { isUserOnline } = useOnlineStatus(currentUserId);
	const isOtherUserOnline = otherUserId ? isUserOnline(otherUserId) : false;

	// Scroll to bottom
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (shouldScrollToBottom) {
			scrollToBottom();
		}
	}, [messages, shouldScrollToBottom]);

	// Mark messages as read when component mounts or messages change
	useEffect(() => {
		const unreadMessageIds = messages
			.filter((msg) => msg.senderId !== currentUserId)
			.map((msg) => msg.id);

		if (unreadMessageIds.length > 0) {
			markMessagesAsRead(conversationId, unreadMessageIds);
		}
	}, [messages, conversationId, currentUserId]);

	// Set up Pusher for real-time updates
	useEffect(() => {
		const pusher = getPusherClient();
		const channel = pusher.subscribe(`conversation-${conversationId}`);

		// Listen for new messages
		channel.bind("new-message", (data: Message) => {
			setMessages((prev) => {
				// Avoid duplicates
				if (prev.some((msg) => msg.id === data.id)) {
					return prev;
				}
				return [...prev, data];
			});
			setShouldScrollToBottom(true); // Enable auto-scroll for new messages
			router.refresh(); // Refresh to update conversation list
		});

		// Listen for reactions
		channel.bind("reaction-added", (data: any) => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === data.messageId
						? {
								...msg,
								reactions: [
									...msg.reactions.filter(
										(r) =>
											!(
												r.userId === data.reaction.userId &&
												r.emoji === data.reaction.emoji
											)
									),
									data.reaction,
								],
						  }
						: msg
				)
			);
		});

		channel.bind("reaction-removed", (data: any) => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === data.messageId
						? {
								...msg,
								reactions: msg.reactions.filter(
									(r) => !(r.userId === data.userId && r.emoji === data.emoji)
								),
						  }
						: msg
				)
			);
		});

		// Listen for message deletions
		channel.bind("message-deleted", (data: any) => {
			setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
		});

		// Listen for message edits
		channel.bind("message-edited", (data: any) => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === data.messageId
						? { ...msg, content: data.message.content, isEdited: true }
						: msg
				)
			);
		});

		// Listen for typing indicators
		channel.bind("typing", (data: any) => {
			if (data.userId !== currentUserId) {
				if (data.isTyping) {
					setTypingUsers((prev) => {
						if (prev.some((u) => u.userId === data.userId)) {
							return prev;
						}
						return [...prev, { userId: data.userId, userName: data.userName }];
					});

					// Remove typing indicator after 3 seconds
					setTimeout(() => {
						setTypingUsers((prev) =>
							prev.filter((u) => u.userId !== data.userId)
						);
					}, 3000);
				} else {
					setTypingUsers((prev) =>
						prev.filter((u) => u.userId !== data.userId)
					);
				}
			}
		});

		// Listen for message read status updates
		channel.bind("message-read", (data: any) => {
			setMessages((prev) =>
				prev.map((msg) => {
					if (msg.id === data.messageId) {
						const readByArray = msg.readBy
							? (JSON.parse(JSON.stringify(msg.readBy)) as any[])
							: [];

						// Check if already in readBy
						const alreadyRead = readByArray.some(
							(read: any) => read.userId === data.userId
						);

						if (!alreadyRead) {
							readByArray.push({
								userId: data.userId,
								readAt: new Date().toISOString(),
							});
							return { ...msg, readBy: readByArray };
						}
					}
					return msg;
				})
			);
		});

		return () => {
			channel.unbind_all();
			pusher.unsubscribe(`conversation-${conversationId}`);
		};
	}, [conversationId, currentUserId, router]);

	const handleSendMessage = async (content: string, attachments?: string[]) => {
		const result = await sendMessage(conversationId, content, attachments);
		if (!result.success) {
			// Show error to user if needed
			console.error("Failed to send message");
		}
		setShouldScrollToBottom(true); // Enable auto-scroll when sending message
		// Don't add message optimistically - let Pusher handle it to avoid duplicates
	};

	const handleTyping = async (isTyping: boolean) => {
		await sendTypingIndicator(conversationId, isTyping);
	};

	const handleReaction = async (messageId: string, emoji: string) => {
		// Backend handles toggle logic (add if not exists, remove if clicking same emoji again)
		await addMessageReaction(messageId, emoji);
	};

	const handleEditMessage = async (messageId: string, newContent: string) => {
		await editMessage(messageId, newContent);
	};

	const loadMoreMessages = async () => {
		if (!hasMore || isLoadingMore || !cursor) return;

		setIsLoadingMore(true);
		setShouldScrollToBottom(false); // Disable auto-scroll to bottom

		try {
			// Save current scroll position
			const container = messagesContainerRef.current;
			if (!container) return;

			const scrollHeightBefore = container.scrollHeight;
			const scrollTopBefore = container.scrollTop;

			const response = await fetch(
				`/api/messages/${conversationId}?cursor=${cursor}`
			);
			const result = await response.json();

			if (result.success && result.messages) {
				setMessages((prev) => [...result.messages, ...prev]);
				setHasMore(result.hasMore);
				setCursor(result.nextCursor);

				// Restore scroll position after adding messages
				// Use requestAnimationFrame to ensure DOM has updated
				requestAnimationFrame(() => {
					if (container) {
						const scrollHeightAfter = container.scrollHeight;
						const scrollDiff = scrollHeightAfter - scrollHeightBefore;
						container.scrollTop = scrollTopBefore + scrollDiff;
					}
				});
			}
		} catch (error) {
			console.error("Error loading more messages:", error);
		} finally {
			setIsLoadingMore(false);
		}
	};

	return (
		<div className="flex flex-col flex-1 overflow-hidden relative min-h-0">
			{/* Fixed gradient background - Instagram style */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"linear-gradient(135deg, #405de6, #5b51d8, #833ab4, #c13584, #e1306c, #fd1d1d)",
					backgroundAttachment: "fixed",
					opacity: 0.12,
				}}
			></div>

			{/* Messages area */}
			<div
				ref={messagesContainerRef}
				className="flex-1 overflow-y-auto p-3 md:p-4 relative z-10"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#833ab4 transparent",
					WebkitOverflowScrolling: "touch",
				}}
			>
				{messages.length === 0 ? (
					<div className="h-full flex items-center justify-center px-4">
						<div className="text-center text-gray-400">
							<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-lamaSky to-lamaPurple flex items-center justify-center">
								<svg
									className="w-10 h-10 text-gray-600"
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
							<p className="text-base font-medium text-gray-500 mb-1">
								No messages yet
							</p>
							<p className="text-sm text-gray-400">
								Start the conversation by sending a message
							</p>
						</div>
					</div>
				) : (
					<div className="max-w-4xl mx-auto space-y-1">
						{/* Load More Button */}
						{hasMore && (
							<div className="flex justify-center py-3">
								<button
									onClick={loadMoreMessages}
									disabled={isLoadingMore}
									className="group px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-full shadow-sm border border-purple-200 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoadingMore ? (
										<>
											<svg
												className="animate-spin h-4 w-4 text-purple-600"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											<span className="text-sm font-medium text-purple-600">
												Loading...
											</span>
										</>
									) : (
										<>
											<svg
												className="w-4 h-4 text-purple-600 group-hover:animate-bounce"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 15l7-7 7 7"
												/>
											</svg>
											<span className="text-sm font-medium text-purple-600">
												Load older messages
											</span>
										</>
									)}
								</button>
							</div>
						)}

						{messages.map((message) => (
							<MessageBubble
								key={message.id}
								message={message}
								isOwn={message.senderId === currentUserId}
								currentUserId={currentUserId}
								otherUserId={otherUserId}
								isOtherUserOnline={isOtherUserOnline}
								onReact={(emoji) => handleReaction(message.id, emoji)}
								onEdit={(newContent) =>
									handleEditMessage(message.id, newContent)
								}
							/>
						))}

						{/* Typing indicator */}
						{typingUsers.length > 0 && (
							<div className="flex items-center gap-2 px-2 py-1">
								<div className="flex gap-1 bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-200">
									<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
									<span
										className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style={{ animationDelay: "0.2s" }}
									></span>
									<span
										className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style={{ animationDelay: "0.4s" }}
									></span>
								</div>
								<span className="text-xs text-gray-500">
									{typingUsers.map((u) => u.userName).join(", ")}{" "}
									{typingUsers.length === 1 ? "is" : "are"} typing
								</span>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Input area */}
			<MessageInput onSend={handleSendMessage} onTyping={handleTyping} />
		</div>
	);
};

export default MessageThread;
