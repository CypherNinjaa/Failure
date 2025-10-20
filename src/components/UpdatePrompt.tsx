/**
 * Update Prompt Component
 * Shows a prompt when a new version of the app is available
 */

"use client";

import { useAppUpdate } from "@/hooks/usePWA";
import { useEffect, useState } from "react";
import Image from "next/image";
// Changelog for the latest version
const CHANGELOG = {
	version: "1.1.0",
	date: "2025-01-15",
	features: [
		"🚀 Faster offline performance",
		"💾 Improved data caching",
		"🔄 Background sync enhancements",
		"🐛 Bug fixes and improvements",
	],
};

export default function UpdatePrompt() {
	const { updateAvailable, applyUpdate } = useAppUpdate();
	const [showPrompt, setShowPrompt] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
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
			<div className="max-w-7xl mx-auto">
				{/* Main Update Banner */}
				<div className="flex items-center justify-between gap-4 p-3 md:p-4">
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
							<div className="flex items-center gap-2">
								<p className="font-bold text-base md:text-lg text-gray-900 leading-tight">
									Version {CHANGELOG.version} Available!
								</p>
								<span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
									NEW
								</span>
							</div>
							<p className="text-xs md:text-sm text-gray-600 mt-0.5 leading-tight">
								Released {CHANGELOG.date} • {CHANGELOG.features.length}{" "}
								improvements
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 flex-shrink-0">
						<button
							onClick={() => setShowDetails(!showDetails)}
							className="px-3 py-2 text-xs md:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all font-medium"
							disabled={isUpdating}
						>
							{showDetails ? "Hide" : "What's New"}
						</button>
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
							{isUpdating ? (
								<span className="flex items-center gap-2">
									<div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									Updating...
								</span>
							) : (
								"Update Now"
							)}
						</button>
					</div>
				</div>

				{/* Changelog Details */}
				{showDetails && (
					<div className="border-t border-gray-200 bg-gray-50 px-4 py-3 animate-slide-down">
						<p className="text-xs font-semibold text-gray-700 mb-2">
							✨ What&apos;s New in Version {CHANGELOG.version}:
						</p>
						<ul className="space-y-1.5">
							{CHANGELOG.features.map((feature, index) => (
								<li
									key={index}
									className="text-xs md:text-sm text-gray-700 flex items-start gap-2"
								>
									<span className="flex-shrink-0 mt-0.5">{feature}</span>
								</li>
							))}
						</ul>
						<div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Update takes only a few seconds and won&apos;t lose your data
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
