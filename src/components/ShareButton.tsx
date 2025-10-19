/**
 * ShareButton Component
 * Reusable button for sharing content via Web Share API
 */

"use client";

import { useState } from "react";
import { useShare } from "@/hooks/useShare";

interface ShareButtonProps {
	title?: string;
	text?: string;
	url?: string;
	variant?: "icon" | "button" | "text";
	className?: string;
	onShare?: () => void;
}

export default function ShareButton({
	title,
	text,
	url,
	variant = "icon",
	className = "",
	onShare,
}: ShareButtonProps) {
	const { isSupported, share } = useShare();
	const [showFeedback, setShowFeedback] = useState(false);

	const handleShare = async () => {
		const result = await share({
			title: title || "Happy Child School",
			text: text || "Check this out!",
			url: url || window.location.href,
		});

		if (result.success) {
			setShowFeedback(true);
			setTimeout(() => setShowFeedback(false), 2000);
			onShare?.();
		}
	};

	if (variant === "icon") {
		return (
			<div className="relative">
				<button
					onClick={handleShare}
					className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
					title={isSupported ? "Share" : "Copy link"}
				>
					<svg
						className="w-5 h-5 text-gray-600 dark:text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
						/>
					</svg>
				</button>
				{showFeedback && (
					<div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded shadow-lg whitespace-nowrap animate-slide-down">
						{isSupported ? "Shared!" : "Copied!"}
					</div>
				)}
			</div>
		);
	}

	if (variant === "text") {
		return (
			<div className="relative">
				<button
					onClick={handleShare}
					className={`text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium ${className}`}
				>
					{isSupported ? "Share" : "Copy Link"}
				</button>
				{showFeedback && (
					<div className="absolute top-full left-0 mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded shadow-lg whitespace-nowrap animate-slide-down">
						{isSupported ? "Shared!" : "Copied!"}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="relative">
			<button
				onClick={handleShare}
				className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium ${className}`}
			>
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
						d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
					/>
				</svg>
				{isSupported ? "Share" : "Copy Link"}
			</button>
			{showFeedback && (
				<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-slide-down">
					{isSupported ? "✓ Shared successfully!" : "✓ Copied to clipboard!"}
				</div>
			)}
		</div>
	);
}
