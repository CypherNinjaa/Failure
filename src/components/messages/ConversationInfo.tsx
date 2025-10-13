"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type ConversationInfoProps = {
	conversationName: string;
	conversationImage?: string | null;
	isGroup: boolean;
	memberCount?: number;
	otherUserId?: string;
	conversationId: string;
	onClose: () => void;
};

type UserDetails = {
	name: string;
	surname: string;
	email?: string;
	phone?: string;
	img?: string;
	birthday?: string;
	sex?: string;
};

type MediaItem = {
	url: string;
	createdAt: Date;
};

const ConversationInfo = ({
	conversationName,
	conversationImage,
	isGroup,
	memberCount,
	otherUserId,
	conversationId,
	onClose,
}: ConversationInfoProps) => {
	const [activeTab, setActiveTab] = useState<"details" | "media" | "settings">(
		"details"
	);
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const [isLoadingMedia, setIsLoadingMedia] = useState(false);

	// Fetch user details
	useEffect(() => {
		if (!isGroup && otherUserId) {
			setIsLoadingDetails(true);
			fetch(`/api/users/${otherUserId}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.success) {
						setUserDetails(data.user);
					}
				})
				.catch((error) => console.error("Error fetching user details:", error))
				.finally(() => setIsLoadingDetails(false));
		}
	}, [otherUserId, isGroup]);

	// Fetch media
	useEffect(() => {
		if (activeTab === "media") {
			setIsLoadingMedia(true);
			fetch(`/api/conversations/${conversationId}/media`)
				.then((res) => res.json())
				.then((data) => {
					if (data.success) {
						setMediaItems(data.media || []);
					}
				})
				.catch((error) => console.error("Error fetching media:", error))
				.finally(() => setIsLoadingMedia(false));
		}
	}, [activeTab, conversationId]);

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
				{/* Header */}
				<div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
					<h2 className="text-xl font-bold text-white">Conversation Info</h2>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
					>
						<svg
							className="w-5 h-5 text-white"
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

				{/* Profile section */}
				<div className="p-6 border-b border-gray-200 flex flex-col items-center">
					{conversationImage ? (
						<Image
							src={conversationImage}
							alt={conversationName}
							width={100}
							height={100}
							className="rounded-full object-cover shadow-lg"
						/>
					) : (
						<div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
							{isGroup ? "👥" : conversationName.charAt(0).toUpperCase()}
						</div>
					)}
					<h3 className="mt-4 text-xl font-bold text-gray-900">
						{conversationName}
					</h3>
					{isGroup && (
						<p className="text-sm text-gray-500 mt-1">{memberCount} members</p>
					)}
				</div>

				{/* Tabs */}
				<div className="flex border-b border-gray-200 bg-gray-50">
					<button
						onClick={() => setActiveTab("details")}
						className={`flex-1 py-3 text-sm font-semibold transition-all ${
							activeTab === "details"
								? "text-purple-600 border-b-2 border-purple-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Details
					</button>
					<button
						onClick={() => setActiveTab("media")}
						className={`flex-1 py-3 text-sm font-semibold transition-all ${
							activeTab === "media"
								? "text-purple-600 border-b-2 border-purple-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Media
					</button>
					<button
						onClick={() => setActiveTab("settings")}
						className={`flex-1 py-3 text-sm font-semibold transition-all ${
							activeTab === "settings"
								? "text-purple-600 border-b-2 border-purple-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Settings
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">
					{activeTab === "details" && (
						<div className="space-y-4">
							{/* User info */}
							{!isGroup && userDetails && (
								<>
									<div>
										<h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
											About
										</h4>
										<p className="text-gray-700">Individual conversation</p>
									</div>

									{/* User Details */}
									{userDetails.email && (
										<div>
											<h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
												Email
											</h4>
											<p className="text-gray-700">{userDetails.email}</p>
										</div>
									)}

									{userDetails.phone && (
										<div>
											<h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
												Phone
											</h4>
											<p className="text-gray-700">{userDetails.phone}</p>
										</div>
									)}

									{userDetails.birthday && (
										<div>
											<h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
												Birthday
											</h4>
											<p className="text-gray-700">
												{new Date(userDetails.birthday).toLocaleDateString()}
											</p>
										</div>
									)}

									{userDetails.sex && (
										<div>
											<h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
												Gender
											</h4>
											<p className="text-gray-700">{userDetails.sex}</p>
										</div>
									)}
								</>
							)}

							{isGroup && (
								<div>
									<h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
										About
									</h4>
									<p className="text-gray-700">This is a group conversation</p>
								</div>
							)}

							{/* Participants (for groups) */}
							{isGroup && (
								<div>
									<h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
										Members
									</h4>
									<p className="text-gray-500 text-sm">
										{memberCount} participants in this conversation
									</p>
								</div>
							)}

							{/* Actions */}
							<div className="space-y-2 pt-4">
								<button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-gray-700 font-medium transition-all flex items-center gap-3">
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
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									Search in conversation
								</button>
							</div>
						</div>
					)}

					{activeTab === "media" && (
						<div className="space-y-4">
							{isLoadingMedia ? (
								<div className="flex justify-center py-8">
									<svg
										className="animate-spin h-8 w-8 text-purple-600"
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
								</div>
							) : mediaItems.length > 0 ? (
								<div className="grid grid-cols-3 gap-2">
									{mediaItems.map((item, index) => (
										<div
											key={index}
											className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer"
										>
											<Image
												src={item.url}
												alt="Shared media"
												fill
												className="object-cover group-hover:scale-110 transition-transform duration-200"
											/>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 text-sm text-center py-8">
									No shared media yet
								</p>
							)}
						</div>
					)}

					{activeTab === "settings" && (
						<div className="space-y-2">
							<button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-gray-700 font-medium transition-all flex items-center gap-3">
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
										d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
									/>
								</svg>
								Mute notifications
							</button>

							<button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-gray-700 font-medium transition-all flex items-center gap-3">
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
										d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
									/>
								</svg>
								Block user
							</button>

							<button className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 rounded-lg text-left text-red-600 font-medium transition-all flex items-center gap-3">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete conversation
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ConversationInfo;
