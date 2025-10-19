/**
 * CacheSettings Component
 * Allow users to view and manage PWA cache
 */

"use client";

import { useState, useEffect } from "react";
import {
	getCacheStats,
	getCacheSize,
	clearAllCaches,
	cleanCache,
} from "@/lib/cacheManager";

interface CacheSettingsProps {
	role: string;
}

export default function CacheSettings({ role }: CacheSettingsProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [stats, setStats] = useState<any>(null);
	const [size, setSize] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			loadCacheInfo();
		}
	}, [isOpen]);

	// Listen for custom event from menu
	useEffect(() => {
		const handleOpenModal = (e: CustomEvent) => {
			if (e.detail?.modalId === "#cache-settings") {
				setIsOpen(true);
			}
		};

		window.addEventListener("openModal", handleOpenModal as EventListener);
		return () => {
			window.removeEventListener("openModal", handleOpenModal as EventListener);
		};
	}, []);

	async function loadCacheInfo() {
		setIsLoading(true);
		const [cacheStats, cacheSize] = await Promise.all([
			getCacheStats(),
			getCacheSize(),
		]);
		setStats(cacheStats);
		setSize(cacheSize);
		setIsLoading(false);
	}

	async function handleClearAll() {
		if (!confirm("Clear all cached data? This will make the app reload.")) {
			return;
		}

		const success = await clearAllCaches();
		if (success) {
			alert("Cache cleared! The page will reload.");
			window.location.reload();
		} else {
			alert("Failed to clear cache");
		}
	}

	async function handleCleanCache() {
		const success = await cleanCache(role);
		if (success) {
			alert("Old cache entries removed!");
			loadCacheInfo();
		} else {
			alert("Failed to clean cache");
		}
	}

	return (
		<>
			{/* Settings Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-48 md:bottom-36 right-4 z-40 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
				title="Cache Settings"
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</button>

			{/* Modal */}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col">
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
									<svg
										className="w-6 h-6 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
										/>
									</svg>
								</div>
								<div>
									<h2 className="text-lg font-bold text-gray-900 dark:text-white">
										Cache Settings
									</h2>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Manage offline data
									</p>
								</div>
							</div>
							<button
								onClick={() => setIsOpen(false)}
								className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
							>
								<svg
									className="w-5 h-5 text-gray-500"
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

						{/* Content */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4">
							{isLoading ? (
								<div className="flex items-center justify-center py-12">
									<div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
								</div>
							) : (
								<>
									{/* Storage Usage */}
									{size && (
										<div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
													Storage Used
												</span>
												<span className="text-lg font-bold text-purple-600 dark:text-purple-400">
													{size.usageMB} MB
												</span>
											</div>
											<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
												<div
													className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
													style={{
														width: `${Math.min(size.usagePercent, 100)}%`,
													}}
												></div>
											</div>
											<div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
												<span>{size.usagePercent}% used</span>
												<span>{size.quotaMB} MB available</span>
											</div>
										</div>
									)}

									{/* Cache Stats */}
									{stats && (
										<div className="space-y-2">
											<p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
												Cached Items
											</p>
											{stats.caches.map((cache: any, index: number) => (
												<div
													key={index}
													className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
												>
													<div className="flex-1">
														<p className="text-sm font-medium text-gray-800 dark:text-gray-200">
															{cache.name}
														</p>
														<p className="text-xs text-gray-500 dark:text-gray-400">
															{cache.itemCount} items
														</p>
													</div>
												</div>
											))}
										</div>
									)}

									{/* Actions */}
									<div className="space-y-2 pt-4 border-t dark:border-gray-700">
										<button
											onClick={handleCleanCache}
											className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium"
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
													d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
												/>
											</svg>
											Clean Old Cache
										</button>

										<button
											onClick={handleClearAll}
											className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
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
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
											Clear All Cache
										</button>
									</div>

									<p className="text-xs text-gray-500 dark:text-gray-400 text-center">
										Cache helps the app work offline and load faster
									</p>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
