/**
 * Update Prompt Component
 * Shows a prompt when a new version of the app is available
 */

"use client";

import { useAppUpdate } from "@/hooks/usePWA";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function UpdatePrompt() {
	const { updateAvailable, applyUpdate } = useAppUpdate();
	const [showPrompt, setShowPrompt] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		if (updateAvailable) {
			console.log("Update available, showing prompt");
			setShowPrompt(true);
		}
	}, [updateAvailable]);

	const handleUpdate = () => {
		console.log("Update button clicked");
		setIsUpdating(true);
		applyUpdate();
	};

	if (!showPrompt) return null;

	return (
		<div className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-xl border-b-4 border-lamaSky animate-slide-down">
			<div className="max-w-7xl mx-auto flex items-center justify-between gap-4 p-3 md:p-4">
				<div className="flex items-center gap-3 flex-1">
					<div className="w-12 h-12 bg-gradient-to-r from-lamaSky to-lamaPurple rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
						<Image
							src="/update.png"
							alt="update"
							width={28}
							height={28}
							className="brightness-0 invert"
						/>
					</div>
					<div className="flex-1 min-w-0">
						<p className="font-bold text-base md:text-lg text-gray-900 leading-tight">
							New Version Available!
						</p>
						<p className="text-xs md:text-sm text-gray-600 mt-0.5 leading-tight">
							Update now to get the latest features and improvements
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 flex-shrink-0">
					<button
						onClick={() => setShowPrompt(false)}
						className="px-3 py-2 text-xs md:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium"
						disabled={isUpdating}
					>
						Later
					</button>
					<button
						onClick={handleUpdate}
						disabled={isUpdating}
						className="px-4 py-2 text-xs md:text-sm bg-gradient-to-r from-lamaSky to-lamaPurple text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all shadow-md whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isUpdating ? "Updating..." : "Update Now"}
					</button>
				</div>
			</div>
		</div>
	);
}
