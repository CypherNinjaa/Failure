/**
 * Offline Indicator Component
 * Shows a banner when the user is offline
 */

"use client";

import { useOnlineStatus } from "@/hooks/usePWA";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function OfflineIndicator() {
	const isOnline = useOnlineStatus();
	const [showBanner, setShowBanner] = useState(false);
	const [userDismissed, setUserDismissed] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [lastSync, setLastSync] = useState<string | null>(null);
	const [cacheInfo, setCacheInfo] = useState({
		hasStudents: false,
		hasTeachers: false,
		hasClasses: false,
	});

	useEffect(() => {
		if (!isOnline && !userDismissed) {
			setShowBanner(true);
			loadCacheInfo();
			loadLastSync();
		} else if (isOnline) {
			// Show "Back Online" message
			setShowBanner(true);
			setUserDismissed(false);
			// Update last sync time
			localStorage.setItem("last-sync-time", Date.now().toString());
			// Hide banner after a delay when coming back online
			const timeout = setTimeout(() => {
				setShowBanner(false);
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [isOnline, userDismissed]);

	const loadLastSync = () => {
		const syncTime = localStorage.getItem("last-sync-time");
		if (syncTime) {
			const date = new Date(parseInt(syncTime));
			const now = new Date();
			const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

			if (diffMinutes < 1) {
				setLastSync("Just now");
			} else if (diffMinutes < 60) {
				setLastSync(`${diffMinutes}m ago`);
			} else {
				const hours = Math.floor(diffMinutes / 60);
				setLastSync(`${hours}h ago`);
			}
		}
	};

	const loadCacheInfo = async () => {
		try {
			const cacheNames = await caches.keys();
			if (cacheNames.length > 0) {
				const cache = await caches.open(cacheNames[0]);
				const [students, teachers, classes] = await Promise.all([
					cache.match("/list/students"),
					cache.match("/list/teachers"),
					cache.match("/list/classes"),
				]);

				setCacheInfo({
					hasStudents: !!students,
					hasTeachers: !!teachers,
					hasClasses: !!classes,
				});
			}
		} catch (error) {
			console.error("Failed to load cache info:", error);
		}
	};

	const handleClose = () => {
		setShowBanner(false);
		if (!isOnline) {
			setUserDismissed(true);
		}
	};

	if (!showBanner) return null;

	return (
		<div
			className={`fixed top-0 left-0 right-0 z-[9999] shadow-lg transition-all duration-300 animate-slide-down ${
				isOnline
					? "bg-gradient-to-r from-green-500 to-green-600"
					: "bg-gradient-to-r from-amber-500 to-orange-500"
			}`}
		>
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between gap-2 md:gap-3 p-2 md:p-3">
					<div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
						<div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center text-base md:text-xl shadow-md flex-shrink-0">
							{isOnline ? (
								"✓"
							) : (
								<Image
									src="/offline.png"
									alt="offline"
									width={16}
									height={16}
									className="md:w-5 md:h-5"
								/>
							)}
						</div>
						<div className="text-white flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<p className="font-semibold text-xs md:text-base leading-tight">
									{isOnline ? "Back Online!" : "You're Offline"}
								</p>
								{!isOnline && lastSync && (
									<span className="text-[10px] md:text-xs bg-white/20 px-2 py-0.5 rounded">
										Synced {lastSync}
									</span>
								)}
							</div>
							<p className="text-[10px] md:text-xs opacity-90 leading-tight mt-0.5">
								{isOnline
									? "Connection restored. Syncing data..."
									: "Some features still available"}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{!isOnline && (
							<button
								onClick={() => setShowDetails(!showDetails)}
								className="flex-shrink-0 text-[10px] md:text-xs text-white bg-white/20 hover:bg-white/30 px-2 md:px-3 py-1 rounded-lg transition-colors font-medium"
							>
								{showDetails ? "Hide" : "Details"}
							</button>
						)}
						<button
							onClick={handleClose}
							className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors group"
							aria-label="Close"
						>
							<svg
								className="w-3 h-3 md:w-4 md:h-4 text-white"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>
				</div>

				{/* Expandable Details Section */}
				{showDetails && !isOnline && (
					<div className="border-t border-white/20 p-3 bg-black/10">
						<p className="text-white text-xs md:text-sm font-semibold mb-2">
							✨ Available Offline:
						</p>
						<div className="grid grid-cols-3 gap-2">
							<div
								className={`text-center p-2 rounded-lg ${
									cacheInfo.hasStudents
										? "bg-white/20 text-white"
										: "bg-black/10 text-white/50"
								}`}
							>
								<div className="text-base md:text-lg mb-1">👨‍🎓</div>
								<div className="text-[10px] md:text-xs">Students</div>
								{cacheInfo.hasStudents && (
									<div className="text-[8px] md:text-[10px] text-green-200">
										✓ Cached
									</div>
								)}
							</div>
							<div
								className={`text-center p-2 rounded-lg ${
									cacheInfo.hasTeachers
										? "bg-white/20 text-white"
										: "bg-black/10 text-white/50"
								}`}
							>
								<div className="text-base md:text-lg mb-1">👨‍🏫</div>
								<div className="text-[10px] md:text-xs">Teachers</div>
								{cacheInfo.hasTeachers && (
									<div className="text-[8px] md:text-[10px] text-green-200">
										✓ Cached
									</div>
								)}
							</div>
							<div
								className={`text-center p-2 rounded-lg ${
									cacheInfo.hasClasses
										? "bg-white/20 text-white"
										: "bg-black/10 text-white/50"
								}`}
							>
								<div className="text-base md:text-lg mb-1">📚</div>
								<div className="text-[10px] md:text-xs">Classes</div>
								{cacheInfo.hasClasses && (
									<div className="text-[8px] md:text-[10px] text-green-200">
										✓ Cached
									</div>
								)}
							</div>
						</div>
						<p className="text-white/70 text-[10px] md:text-xs mt-2 text-center">
							Data will sync automatically when you&apos;re back online
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
