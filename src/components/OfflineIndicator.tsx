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

	useEffect(() => {
		if (!isOnline && !userDismissed) {
			setShowBanner(true);
		} else if (isOnline) {
			// Show "Back Online" message
			setShowBanner(true);
			setUserDismissed(false);
			// Hide banner after a delay when coming back online
			const timeout = setTimeout(() => {
				setShowBanner(false);
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [isOnline, userDismissed]);

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
			<div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-3 p-2 md:p-3">
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
						<p className="font-semibold text-xs md:text-base leading-tight">
							{isOnline ? "Back Online!" : "You're Offline"}
						</p>
						<p className="text-[10px] md:text-xs opacity-90 leading-tight mt-0.5">
							{isOnline
								? "Connection restored. Syncing data..."
								: "Cached data available"}
						</p>
					</div>
				</div>

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
	);
}
