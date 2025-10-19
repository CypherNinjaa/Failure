/**
 * Share Button Hook
 * Custom hook for Web Share API integration
 */

"use client";

import { useState, useEffect } from "react";

interface ShareData {
	title?: string;
	text?: string;
	url?: string;
	files?: File[];
}

export function useShare() {
	const [isSupported, setIsSupported] = useState(false);

	useEffect(() => {
		setIsSupported(typeof navigator !== "undefined" && "share" in navigator);
	}, []);

	const share = async (data: ShareData) => {
		if (!isSupported) {
			// Fallback: Copy to clipboard
			const textToShare = `${data.title || ""}\n${data.text || ""}\n${
				data.url || ""
			}`.trim();
			try {
				await navigator.clipboard.writeText(textToShare);
				return { success: true, method: "clipboard" };
			} catch (error) {
				console.error("Failed to copy to clipboard:", error);
				return { success: false, error: "Failed to share" };
			}
		}

		try {
			await navigator.share(data);
			return { success: true, method: "share" };
		} catch (error: any) {
			if (error.name === "AbortError") {
				return { success: false, error: "Share cancelled" };
			}
			console.error("Share failed:", error);
			return { success: false, error: error.message };
		}
	};

	const canShareFiles = () => {
		return (
			isSupported &&
			typeof navigator !== "undefined" &&
			"canShare" in navigator &&
			(navigator as any).canShare({ files: [] })
		);
	};

	return { isSupported, share, canShareFiles };
}
