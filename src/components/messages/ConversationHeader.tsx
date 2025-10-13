"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import ConversationInfo from "./ConversationInfo";

type ConversationHeaderProps = {
	currentUserId: string;
	otherUserId?: string;
	conversationName: string;
	conversationImage?: string | null;
	isGroup: boolean;
	memberCount?: number;
	conversationId: string;
};

const ConversationHeader = ({
	currentUserId,
	otherUserId,
	conversationName,
	conversationImage,
	isGroup,
	memberCount,
	conversationId,
}: ConversationHeaderProps) => {
	const { isUserOnline } = useOnlineStatus(currentUserId);
	const isOnline = otherUserId ? isUserOnline(otherUserId) : false;
	const [showInfo, setShowInfo] = useState(false);
	const router = useRouter();

	// Handle ESC key to close chat (desktop only)
	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !showInfo) {
				router.push("/list/messages");
			}
		};

		window.addEventListener("keydown", handleEscKey);
		return () => window.removeEventListener("keydown", handleEscKey);
	}, [router, showInfo]);

	const handleClose = () => {
		router.push("/list/messages");
	};

	return (
		<>
			<div className="sticky top-0 z-30 h-16 md:h-20 border-b border-gray-200 bg-white px-4 md:px-5 flex items-center gap-3 flex-shrink-0 shadow-sm">
				{/* Back button (mobile only) */}
				<Link
					href="/list/messages"
					className="md:hidden w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center transition-all flex-shrink-0"
				>
					<svg
						className="w-5 h-5 text-purple-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2.5}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</Link>

				{/* Avatar */}
				<div className="relative flex-shrink-0">
					{conversationImage ? (
						<Image
							src={conversationImage}
							alt={conversationName}
							width={44}
							height={44}
							className="rounded-full object-cover ring-2 ring-purple-500 shadow-sm"
						/>
					) : (
						<div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-sm ring-2 ring-white">
							{isGroup ? "👥" : conversationName.charAt(0).toUpperCase()}
						</div>
					)}
				</div>

				{/* Conversation info */}
				<div className="flex-1 min-w-0">
					<h2 className="font-bold text-gray-900 text-base md:text-lg truncate">
						{conversationName}
					</h2>
					{isGroup ? (
						<p className="text-xs text-gray-500 truncate">
							{memberCount} members
						</p>
					) : (
						<div className="flex items-center gap-1.5 text-xs text-gray-600">
							<div
								className={`w-2 h-2 rounded-full ${
									isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
								}`}
							></div>
							<span>{isOnline ? "Active now" : "Offline"}</span>
						</div>
					)}
				</div>

				{/* Action buttons */}
				<div className="flex items-center gap-2">
					{/* Video call button */}
					<button className="w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center transition-all flex-shrink-0 group">
						<svg
							className="w-5 h-5 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
					</button>

					{/* Info button */}
					<button
						onClick={() => setShowInfo(true)}
						className="w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-all flex-shrink-0"
					>
						<svg
							className="w-5 h-5 text-pink-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</button>

					{/* Close button (desktop only) - WhatsApp style */}
					<button
						onClick={handleClose}
						className="hidden md:flex w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 items-center justify-center transition-all flex-shrink-0 group"
						title="Close chat (ESC)"
					>
						<svg
							className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Conversation Info Modal */}
			{showInfo && (
				<ConversationInfo
					conversationName={conversationName}
					conversationImage={conversationImage}
					isGroup={isGroup}
					memberCount={memberCount}
					otherUserId={otherUserId}
					conversationId={conversationId}
					onClose={() => setShowInfo(false)}
				/>
			)}
		</>
	);
};

export default ConversationHeader;
