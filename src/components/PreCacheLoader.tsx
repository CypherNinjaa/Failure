/**
 * PreCacheLoader Component
 * Automatically pre-caches role-specific data after authentication
 */

"use client";

import { useEffect, useState } from "react";
import { usePreCache } from "@/hooks/usePWA";

interface PreCacheLoaderProps {
	role: string;
}

export default function PreCacheLoader({ role }: PreCacheLoaderProps) {
	const { isCaching, cachingComplete, preCacheData, checkPreCacheStatus } =
		usePreCache();
	const [showToast, setShowToast] = useState(false);

	useEffect(() => {
		// Check if pre-caching has already been done
		const isAlreadyCached = checkPreCacheStatus();

		// Only pre-cache if not already done and after a short delay (to not block initial render)
		if (!isAlreadyCached && role) {
			const timer = setTimeout(() => {
				preCacheData(role);
				setShowToast(true);

				// Hide toast after 5 seconds
				setTimeout(() => {
					setShowToast(false);
				}, 5000);
			}, 2000); // Wait 2 seconds after page load

			return () => clearTimeout(timer);
		}
	}, [role, checkPreCacheStatus, preCacheData]);

	// Toast notification (optional - can be removed if too intrusive)
	if (!showToast || cachingComplete) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50 animate-slide-up">
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
				<div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
				<div>
					<p className="font-semibold text-sm">Optimizing Your Experience</p>
					<p className="text-xs opacity-90">
						Downloading data for offline access...
					</p>
				</div>
			</div>
		</div>
	);
}
