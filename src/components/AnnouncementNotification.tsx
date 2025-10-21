"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Announcement = {
	id: number;
	title: string;
	description: string;
	date: string;
	className?: string;
};

type AnnouncementNotificationProps = {
	announcements: Announcement[];
};

const AnnouncementNotification = ({
	announcements,
}: AnnouncementNotificationProps) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [readAnnouncements, setReadAnnouncements] = useState<Set<number>>(
		new Set()
	);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Load read announcements from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem("readAnnouncements");
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				setReadAnnouncements(new Set(parsed));
			} catch (error) {
				console.error("Failed to parse read announcements:", error);
			}
		}
	}, []);

	// Mark announcement as read
	const markAsRead = (announcementId: number) => {
		const newReadSet = new Set(readAnnouncements);
		newReadSet.add(announcementId);
		setReadAnnouncements(newReadSet);
		localStorage.setItem(
			"readAnnouncements",
			JSON.stringify(Array.from(newReadSet))
		);
	};

	// Mark all as read when opening dropdown
	const markAllAsRead = () => {
		const allIds = new Set(announcements.map((a) => a.id));
		setReadAnnouncements(allIds);
		localStorage.setItem(
			"readAnnouncements",
			JSON.stringify(Array.from(allIds))
		);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Calculate unread count
	const unreadCount = announcements.filter(
		(a) => !readAnnouncements.has(a.id)
	).length;

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => {
					setShowDropdown(!showDropdown);
					if (!showDropdown) {
						// Mark all as read when opening dropdown
						markAllAsRead();
					}
				}}
				className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative hover:bg-gray-100 transition-colors"
				aria-label="Announcements"
			>
				<Image src="/announcement.png" alt="" width={20} height={20} />
				{unreadCount > 0 && (
					<div
						className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs font-semibold animate-pulse"
						style={{ color: "white" }}
					>
						{unreadCount > 9 ? "9+" : unreadCount}
					</div>
				)}
			</button>

			{/* Dropdown */}
			{showDropdown && (
				<div className="fixed inset-0 z-50 md:absolute md:inset-auto md:right-0 md:top-10">
					{/* Mobile backdrop */}
					<div
						className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
						onClick={() => setShowDropdown(false)}
					></div>

					{/* Dropdown content */}
					<div className="fixed bottom-0 left-0 right-0 md:relative md:w-96 bg-white rounded-t-2xl md:rounded-lg shadow-xl border-t md:border border-gray-200 max-h-[85vh] md:max-h-[500px] overflow-hidden flex flex-col">
						{/* Header */}
						<div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-gray-800 flex items-center gap-2">
									<Image
										src="/announcement.png"
										alt=""
										width={20}
										height={20}
									/>
									Announcements
								</h3>
								<div className="flex items-center gap-2">
									<span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
										{unreadCount} new
									</span>
									{/* Close button for mobile */}
									<button
										onClick={() => setShowDropdown(false)}
										className="md:hidden p-1 hover:bg-gray-200 rounded-full"
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
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>

						{/* Announcements List */}
						<div className="overflow-y-auto max-h-[400px]">
							{announcements.length === 0 ? (
								<div className="p-8 text-center text-gray-500">
									<Image
										src="/announcement.png"
										alt=""
										width={48}
										height={48}
										className="mx-auto mb-3 opacity-30"
									/>
									<p className="text-sm">No new announcements</p>
								</div>
							) : (
								announcements.map((announcement) => {
									const isRead = readAnnouncements.has(announcement.id);
									return (
										<div
											key={announcement.id}
											className={`p-4 border-b border-gray-100 hover:bg-purple-50 transition-colors cursor-pointer ${
												isRead ? "bg-gray-50 opacity-75" : "bg-white"
											}`}
											onClick={() => {
												markAsRead(announcement.id);
												setShowDropdown(false);
											}}
										>
											<div className="flex gap-3">
												<div
													className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
														isRead ? "bg-gray-200" : "bg-purple-100"
													}`}
												>
													<Image
														src="/announcement.png"
														alt=""
														width={20}
														height={20}
													/>
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-2">
														<h4
															className={`font-semibold text-sm mb-1 line-clamp-1 ${
																isRead ? "text-gray-600" : "text-gray-800"
															}`}
														>
															{announcement.title}
														</h4>
														{!isRead && (
															<div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1"></div>
														)}
													</div>
													<p className="text-xs text-gray-600 mb-2 line-clamp-2">
														{announcement.description}
													</p>
													<div className="flex items-center justify-between">
														<span className="text-xs text-gray-500">
															{new Date(announcement.date).toLocaleDateString(
																"en-US",
																{
																	month: "short",
																	day: "numeric",
																	year: "numeric",
																}
															)}
														</span>
														{announcement.className && (
															<span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
																{announcement.className}
															</span>
														)}
													</div>
												</div>
											</div>
										</div>
									);
								})
							)}
						</div>

						{/* Footer */}
						<div className="p-3 border-t border-gray-200 bg-gray-50">
							<Link
								href="/list/announcements"
								onClick={() => setShowDropdown(false)}
								className="block text-center text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
							>
								View All Announcements →
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AnnouncementNotification;
