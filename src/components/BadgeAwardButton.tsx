"use client";

import { autoAwardBadges } from "@/lib/actions";
import { useState } from "react";
import { toast } from "react-toastify";

const BadgeAwardButton = () => {
	const [isProcessing, setIsProcessing] = useState(false);

	const handleAwardBadges = async () => {
		setIsProcessing(true);
		toast.info("Processing badge awards...", { autoClose: 2000 });

		try {
			const result = await autoAwardBadges();

			if (result.success) {
				toast.success(
					`✅ Badges processed! Awarded: ${result.awardedCount}, Removed: ${result.removedCount}`,
					{ autoClose: 5000 }
				);
			} else {
				toast.error("Failed to process badges", { autoClose: 3000 });
			}
		} catch (error) {
			console.error("Error awarding badges:", error);
			toast.error("An error occurred while processing badges", {
				autoClose: 3000,
			});
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<button
			onClick={handleAwardBadges}
			disabled={isProcessing}
			className="px-4 py-2 bg-lamaPurple text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
		>
			{isProcessing ? (
				<>
					<span className="animate-spin">⚙️</span>
					Processing...
				</>
			) : (
				<>
					<span>🎖️</span>
					Award Badges Now
				</>
			)}
		</button>
	);
};

export default BadgeAwardButton;
