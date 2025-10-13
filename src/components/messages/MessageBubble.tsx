"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type Message = {
	id: string;
	content: string;
	senderId: string;
	createdAt: Date;
	isEdited: boolean;
	attachments?: any;
	readBy?: any; // JSON array of { userId: string, readAt: timestamp }
	sender: {
		name: string;
		surname: string;
		img?: string;
		role?: string;
	} | null;
	reactions: {
		id: string;
		emoji: string;
		userId: string;
	}[];
};

const MessageBubble = ({
	message,
	isOwn,
	currentUserId,
	otherUserId,
	isOtherUserOnline,
	onReact,
	onEdit,
}: {
	message: Message;
	isOwn: boolean;
	currentUserId: string;
	otherUserId?: string;
	isOtherUserOnline?: boolean;
	onReact?: (emoji: string) => void;
	onEdit?: (newContent: string) => void;
}) => {
	const [showReactionPicker, setShowReactionPicker] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(message.content);
	const [showEmojiMenu, setShowEmojiMenu] = useState(false);
	const [lastTap, setLastTap] = useState(0);
	const reactionPickerRef = useRef<HTMLDivElement>(null);
	const emojiMenuRef = useRef<HTMLDivElement>(null);

	// Extended emoji list
	const quickReactions = ["❤️", "👍", "😂", "😮", "😢", "🙏"];
	const allEmojis = [
		"❤️",
		"�",
		"�",
		"😂",
		"�😮",
		"😢",
		"😍",
		"🔥",
		"🎉",
		"💯",
		"🙏",
		"👏",
		"✨",
		"💪",
		"🤔",
		"😊",
		"🥰",
		"😎",
	];

	const formatTime = (date: Date) => {
		return new Date(date).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Get user's reaction (only one allowed)
	const userReaction = message.reactions.find(
		(r) => r.userId === currentUserId
	);

	// Get grouped reactions for display (show all reactions)
	const reactionGroups = message.reactions.reduce((acc, reaction) => {
		if (!acc[reaction.emoji]) {
			acc[reaction.emoji] = { emoji: reaction.emoji, count: 0, userIds: [] };
		}
		acc[reaction.emoji].count++;
		acc[reaction.emoji].userIds.push(reaction.userId);
		return acc;
	}, {} as Record<string, { emoji: string; count: number; userIds: string[] }>);

	const hasReactions = Object.keys(reactionGroups).length > 0;

	// Message delivery status logic (WhatsApp style)
	const getMessageStatus = () => {
		if (!isOwn) return null; // Only show status for own messages

		// Handle readBy field - it might be a JSON string or already parsed array
		let readByArray: any[] = [];
		if (message.readBy) {
			if (typeof message.readBy === "string") {
				try {
					readByArray = JSON.parse(message.readBy);
				} catch (e) {
					console.error("Failed to parse readBy:", e);
				}
			} else if (Array.isArray(message.readBy)) {
				readByArray = message.readBy;
			} else if (typeof message.readBy === "object") {
				// Handle case where it's already an object but not an array
				readByArray = [message.readBy];
			}
		}

		// Check if message has been read by other user (not by current user)
		const isRead = readByArray.some(
			(read: any) => read.userId && read.userId !== currentUserId
		);

		if (isRead) {
			return "seen"; // Blue double tick
		}

		// If other user is online but hasn't read it = delivered
		if (isOtherUserOnline) {
			return "delivered"; // Gray double tick
		}

		// If other user is offline = sent
		return "sent"; // Gray single tick
	};

	const messageStatus = getMessageStatus();

	// Render tick icons (WhatsApp style)
	const renderStatusTick = () => {
		if (!messageStatus) return null;

		if (messageStatus === "seen") {
			// Blue double tick (WhatsApp style)
			return (
				<svg
					className="w-4 h-4 text-blue-400 flex-shrink-0"
					viewBox="0 0 16 15"
					fill="none"
				>
					<path
						d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
						fill="currentColor"
					/>
				</svg>
			);
		}

		if (messageStatus === "delivered") {
			// Gray double tick
			return (
				<svg
					className="w-4 h-4 text-white/60 flex-shrink-0"
					viewBox="0 0 16 15"
					fill="none"
				>
					<path
						d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
						fill="currentColor"
					/>
				</svg>
			);
		}

		// Single tick (sent) - gray
		return (
			<svg
				className="w-4 h-4 text-white/60 flex-shrink-0"
				viewBox="0 0 12 11"
				fill="none"
			>
				<path
					d="M11.1 2.9l-.5-.4c-.2-.1-.4-.1-.5.1L4.5 9.2c-.1.1-.3.1-.4 0L1.4 6.9c-.2-.1-.4-.1-.5 0l-.4.4c-.1.2-.1.4 0 .5l3.3 3.2c.1.1.4.1.5 0l6.2-8c.2-.2.1-.5-.1-.6z"
					fill="currentColor"
				/>
			</svg>
		);
	};

	// Close pickers when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				reactionPickerRef.current &&
				!reactionPickerRef.current.contains(event.target as Node)
			) {
				setShowReactionPicker(false);
			}
			if (
				emojiMenuRef.current &&
				!emojiMenuRef.current.contains(event.target as Node)
			) {
				setShowEmojiMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Double tap to like
	const handleDoubleTap = () => {
		const now = Date.now();
		const DOUBLE_TAP_DELAY = 300;

		if (now - lastTap < DOUBLE_TAP_DELAY && !userReaction && onReact) {
			onReact("❤️");
		}
		setLastTap(now);
	};

	const handleReaction = (emoji: string) => {
		if (onReact) {
			// Backend handles toggle logic (remove if same emoji, change if different)
			onReact(emoji);
		}
		setShowReactionPicker(false);
		setShowEmojiMenu(false);
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSaveEdit = () => {
		if (editContent.trim() && editContent !== message.content && onEdit) {
			onEdit(editContent.trim());
		}
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setEditContent(message.content);
		setIsEditing(false);
	};

	const handleLongPress = () => {
		setShowReactionPicker(true);
	};

	// Long press detection
	const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

	const handleTouchStart = (e: React.TouchEvent) => {
		// Prevent text selection and context menu
		e.preventDefault();
		longPressTimerRef.current = setTimeout(() => {
			handleLongPress();
		}, 500);
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		e.preventDefault();
		if (longPressTimerRef.current) {
			clearTimeout(longPressTimerRef.current);
		}
	};

	return (
		<div
			className={`flex gap-1.5 mb-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
		>
			{/* Avatar - only show for received messages */}
			{!isOwn && (
				<div className="flex-shrink-0 w-7 self-end">
					{message.sender?.img ? (
						<Image
							src={message.sender.img}
							alt={message.sender.name}
							width={28}
							height={28}
							className="w-7 h-7 rounded-full object-cover"
						/>
					) : (
						<div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-xs">
							{message.sender?.name?.charAt(0).toUpperCase() || "?"}
						</div>
					)}
				</div>
			)}

			{/* Message Content */}
			<div
				className={`flex flex-col ${
					isOwn ? "items-end" : "items-start"
				} max-w-[80%] md:max-w-[65%]`}
			>
				{/* Message bubble */}
				<div className="relative group">
					<div
						onClick={handleDoubleTap}
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
						onContextMenu={(e) => {
							e.preventDefault();
							setShowReactionPicker(true);
						}}
						style={{
							WebkitUserSelect: "none",
							userSelect: "none",
							WebkitTouchCallout: "none",
						}}
						className={`px-3 py-2 shadow-sm backdrop-blur-sm cursor-pointer relative ${
							isOwn
								? "message-bubble-own text-white rounded-2xl rounded-tr-sm"
								: "message-bubble-received text-gray-800 rounded-2xl rounded-tl-sm border border-gray-200/50"
						}`}
					>
						{isEditing ? (
							<div className="space-y-2">
								<textarea
									value={editContent}
									onChange={(e) => setEditContent(e.target.value)}
									className={`w-full text-sm leading-relaxed resize-none border-none outline-none bg-transparent ${
										isOwn ? "text-white placeholder-white/50" : "text-gray-800"
									}`}
									rows={3}
									autoFocus
								/>
								<div className="flex gap-2 justify-end">
									<button
										onClick={handleCancelEdit}
										className="px-3 py-1 rounded-lg text-xs font-medium bg-white/20 hover:bg-white/30 text-white"
									>
										Cancel
									</button>
									<button
										onClick={handleSaveEdit}
										className="px-3 py-1 rounded-lg text-xs font-medium bg-white hover:bg-white/90 text-purple-600"
									>
										Save
									</button>
								</div>
							</div>
						) : (
							<>
								{/* Message content with time and tick inline (WhatsApp style) */}
								<div className="flex items-end gap-1">
									<p className="text-sm leading-relaxed whitespace-pre-wrap break-words flex-1">
										{message.content}
									</p>

									{/* Time and tick inside bubble */}
									<div className="flex items-center gap-1 flex-shrink-0 ml-2 pb-0.5">
										<span
											className={`text-[10px] ${
												isOwn ? "text-white/70" : "text-gray-400"
											}`}
										>
											{formatTime(message.createdAt)}
										</span>
										{isOwn && renderStatusTick()}
									</div>
								</div>

								{/* Edited indicator */}
								{message.isEdited && (
									<span
										className={`text-[9px] ${
											isOwn ? "text-white/60" : "text-gray-400"
										} block mt-0.5`}
									>
										edited
									</span>
								)}

								{/* Attachments */}
								{message.attachments &&
									Array.isArray(message.attachments) &&
									message.attachments.length > 0 && (
										<div className="mt-2 space-y-2">
											{message.attachments.map((url: string, index: number) => (
												<div
													key={index}
													className="relative rounded-xl overflow-hidden"
												>
													<Image
														src={url}
														alt="Attachment"
														width={250}
														height={250}
														className="rounded-xl max-w-full h-auto"
													/>
												</div>
											))}
										</div>
									)}
							</>
						)}
					</div>

					{/* Reactions below bubble - WhatsApp style */}
					{hasReactions && !isEditing && (
						<div
							className={`flex flex-wrap gap-1 mt-1 ${
								isOwn ? "justify-end" : "justify-start"
							}`}
						>
							{Object.values(reactionGroups).map((group) => {
								const userReactedWithThis =
									group.userIds.includes(currentUserId);
								return (
									<button
										key={group.emoji}
										onClick={() => handleReaction(group.emoji)}
										className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
											userReactedWithThis
												? "bg-purple-100 border-2 border-purple-500 text-purple-700"
												: "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
										}`}
										title={
											userReactedWithThis
												? "Click to remove your reaction"
												: "Click to react"
										}
									>
										<span className="text-sm">{group.emoji}</span>
										{group.count > 1 && (
											<span className="text-xs font-semibold">
												{group.count}
											</span>
										)}
									</button>
								);
							})}
						</div>
					)}

					{!isEditing && (
						<>
							{/* Quick reaction bar on hover (desktop only) */}
							<div
								className={`hidden md:flex absolute ${
									isOwn
										? "left-0 -translate-x-full"
										: "right-0 translate-x-full"
								} top-0 opacity-0 group-hover:opacity-100 transition-opacity gap-1 px-2`}
							>
								{quickReactions.slice(0, 3).map((emoji) => (
									<button
										key={emoji}
										onClick={() => handleReaction(emoji)}
										className="w-8 h-8 rounded-full bg-white shadow-md hover:scale-110 transition-transform flex items-center justify-center text-lg border border-gray-200"
										title={`React with ${emoji}`}
									>
										{emoji}
									</button>
								))}
								<button
									onClick={() => setShowEmojiMenu(true)}
									className="w-8 h-8 rounded-full bg-white shadow-md hover:scale-110 transition-transform flex items-center justify-center text-lg border border-gray-200"
									title="More reactions"
								>
									<svg
										className="w-4 h-4 text-gray-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4v16m8-8H4"
										/>
									</svg>
								</button>
								{isOwn && (
									<button
										onClick={handleEdit}
										className="w-8 h-8 rounded-full bg-white shadow-md hover:scale-110 transition-transform flex items-center justify-center border border-gray-200"
										title="Edit message"
									>
										<svg
											className="w-4 h-4 text-gray-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
									</button>
								)}
							</div>

							{/* Reaction picker (mobile long press / desktop right-click) */}
							{showReactionPicker && (
								<div
									ref={reactionPickerRef}
									className="absolute z-50 bg-white rounded-2xl shadow-2xl p-2 flex gap-2"
									style={{
										top: isOwn ? "auto" : "100%",
										bottom: isOwn ? "100%" : "auto",
										[isOwn ? "right" : "left"]: 0,
										marginBottom: isOwn ? "8px" : "0",
										marginTop: isOwn ? "0" : "8px",
									}}
								>
									{quickReactions.map((emoji) => (
										<button
											key={emoji}
											onClick={() => handleReaction(emoji)}
											className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-2xl"
										>
											{emoji}
										</button>
									))}
									<button
										onClick={() => {
											setShowReactionPicker(false);
											setShowEmojiMenu(true);
										}}
										className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center border-2 border-dashed border-gray-300"
									>
										<svg
											className="w-5 h-5 text-gray-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 4v16m8-8H4"
											/>
										</svg>
									</button>
								</div>
							)}

							{/* Extended emoji menu */}
							{showEmojiMenu && (
								<div
									ref={emojiMenuRef}
									className="absolute z-50 bg-white rounded-2xl shadow-2xl p-3"
									style={{
										top: isOwn ? "auto" : "100%",
										bottom: isOwn ? "100%" : "auto",
										[isOwn ? "right" : "left"]: 0,
										marginBottom: isOwn ? "8px" : "0",
										marginTop: isOwn ? "0" : "8px",
										width: "240px",
									}}
								>
									<div className="grid grid-cols-6 gap-2">
										{allEmojis.map((emoji) => (
											<button
												key={emoji}
												onClick={() => handleReaction(emoji)}
												className="w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-xl"
											>
												{emoji}
											</button>
										))}
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{/* Spacer for own messages to align with avatar width */}
			{isOwn && <div className="w-7 flex-shrink-0"></div>}
		</div>
	);
};

export default MessageBubble;
