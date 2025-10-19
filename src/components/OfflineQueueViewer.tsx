/**
 * OfflineQueueViewer Component
 * Shows detailed view of pending items in IndexedDB queue
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface QueueItem {
	id: string;
	type: "attendance" | "message";
	data: any;
	timestamp: number;
	retryCount?: number;
}

export default function OfflineQueueViewer() {
	const [isOpen, setIsOpen] = useState(false);
	const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			loadQueueItems();
		}
	}, [isOpen]);

	// Listen for custom event from menu
	useEffect(() => {
		const handleOpenModal = (e: CustomEvent) => {
			if (e.detail?.modalId === "#offline-queue") {
				setIsOpen(true);
			}
		};

		window.addEventListener("openModal", handleOpenModal as EventListener);
		return () => {
			window.removeEventListener("openModal", handleOpenModal as EventListener);
		};
	}, []);

	async function loadQueueItems() {
		setIsLoading(true);
		try {
			const dbRequest = indexedDB.open("hcs-offline-db", 1);

			dbRequest.onsuccess = (event: any) => {
				const db = event.target.result;
				const items: QueueItem[] = [];

				// Load pending attendance
				if (db.objectStoreNames.contains("pendingAttendance")) {
					const transaction = db.transaction(["pendingAttendance"], "readonly");
					const store = transaction.objectStore("pendingAttendance");
					const request = store.getAll();

					request.onsuccess = () => {
						const attendanceItems = request.result.map((item: any) => ({
							id: item.id || Math.random().toString(),
							type: "attendance" as const,
							data: item,
							timestamp: item.timestamp || Date.now(),
							retryCount: item.retryCount || 0,
						}));
						items.push(...attendanceItems);

						// Load pending messages
						if (db.objectStoreNames.contains("pendingMessages")) {
							const msgTransaction = db.transaction(
								["pendingMessages"],
								"readonly"
							);
							const msgStore = msgTransaction.objectStore("pendingMessages");
							const msgRequest = msgStore.getAll();

							msgRequest.onsuccess = () => {
								const messageItems = msgRequest.result.map((item: any) => ({
									id: item.id || Math.random().toString(),
									type: "message" as const,
									data: item,
									timestamp: item.timestamp || Date.now(),
									retryCount: item.retryCount || 0,
								}));
								items.push(...messageItems);

								// Sort by timestamp (newest first)
								items.sort((a, b) => b.timestamp - a.timestamp);
								setQueueItems(items);
								setIsLoading(false);
							};
						} else {
							items.sort((a, b) => b.timestamp - a.timestamp);
							setQueueItems(items);
							setIsLoading(false);
						}
					};
				} else {
					setIsLoading(false);
				}
			};

			dbRequest.onerror = () => {
				console.error("Failed to open IndexedDB");
				setIsLoading(false);
			};
		} catch (error) {
			console.error("Error loading queue items:", error);
			setIsLoading(false);
		}
	}

	async function clearQueue() {
		if (!confirm("Clear all pending items? This cannot be undone.")) {
			return;
		}

		try {
			const dbRequest = indexedDB.open("hcs-offline-db", 1);

			dbRequest.onsuccess = (event: any) => {
				const db = event.target.result;

				// Clear attendance
				if (db.objectStoreNames.contains("pendingAttendance")) {
					const transaction = db.transaction(
						["pendingAttendance"],
						"readwrite"
					);
					const store = transaction.objectStore("pendingAttendance");
					store.clear();
				}

				// Clear messages
				if (db.objectStoreNames.contains("pendingMessages")) {
					const transaction = db.transaction(["pendingMessages"], "readwrite");
					const store = transaction.objectStore("pendingMessages");
					store.clear();
				}

				setQueueItems([]);
			};
		} catch (error) {
			console.error("Error clearing queue:", error);
		}
	}

	function formatTimestamp(timestamp: number) {
		const diff = Date.now() - timestamp;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return "Just now";
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	}

	return (
		<>
			{/* Floating Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-32 md:bottom-20 right-4 z-40 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
				title="View Offline Queue"
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
						d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
					/>
				</svg>
			</button>

			{/* Modal */}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-scale-in">
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
											d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
										/>
									</svg>
								</div>
								<div>
									<h2 className="text-lg font-bold text-gray-900 dark:text-white">
										Offline Queue
									</h2>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{queueItems.length} pending item
										{queueItems.length !== 1 ? "s" : ""}
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
						<div className="flex-1 overflow-y-auto p-4">
							{isLoading ? (
								<div className="flex items-center justify-center py-12">
									<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
								</div>
							) : queueItems.length === 0 ? (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
										<svg
											className="w-8 h-8 text-green-600 dark:text-green-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<p className="text-gray-600 dark:text-gray-400 font-medium">
										All synced up!
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
										No pending items in the queue
									</p>
								</div>
							) : (
								<div className="space-y-3">
									{queueItems.map((item) => (
										<div
											key={item.id}
											className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
										>
											<div className="flex items-start justify-between gap-3">
												<div className="flex items-start gap-3 flex-1">
													<div
														className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
															item.type === "attendance"
																? "bg-blue-100 dark:bg-blue-900/30"
																: "bg-purple-100 dark:bg-purple-900/30"
														}`}
													>
														{item.type === "attendance" ? (
															<svg
																className="w-5 h-5 text-blue-600 dark:text-blue-400"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
																/>
															</svg>
														) : (
															<svg
																className="w-5 h-5 text-purple-600 dark:text-purple-400"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
																/>
															</svg>
														)}
													</div>
													<div className="flex-1">
														<p className="font-semibold text-gray-900 dark:text-white text-sm capitalize">
															{item.type}
														</p>
														<p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
															{formatTimestamp(item.timestamp)}
														</p>
														{item.retryCount && item.retryCount > 0 && (
															<span className="inline-block mt-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded">
																Retry {item.retryCount}
															</span>
														)}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Footer */}
						{queueItems.length > 0 && (
							<div className="border-t dark:border-gray-700 p-4 flex items-center justify-between">
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Will sync automatically when online
								</p>
								<button
									onClick={clearQueue}
									className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
								>
									Clear All
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
