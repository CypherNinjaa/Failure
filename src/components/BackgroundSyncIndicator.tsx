/**
 * BackgroundSyncIndicator Component
 * Shows pending items waiting to sync when back online
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BackgroundSyncIndicator() {
	const [pendingCount, setPendingCount] = useState(0);
	const [isSyncing, setIsSyncing] = useState(false);
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		// Check online status
		setIsOnline(navigator.onLine);

		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Check pending items count
		checkPendingItems();

		// Listen for sync events
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.addEventListener("message", (event) => {
				if (event.data.type === "SYNC_START") {
					setIsSyncing(true);
				} else if (event.data.type === "SYNC_COMPLETE") {
					setIsSyncing(false);
					checkPendingItems();
				} else if (event.data.type === "SYNC_FAILED") {
					setIsSyncing(false);
				}
			});
		}

		// Check periodically
		const interval = setInterval(checkPendingItems, 5000);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			clearInterval(interval);
		};
	}, []);

	async function checkPendingItems() {
		try {
			// Open IndexedDB to check pending items
			const dbRequest = indexedDB.open("hcs-offline-db", 1);

			dbRequest.onsuccess = (event: any) => {
				const db = event.target.result;
				let totalPending = 0;

				// Check pendingAttendance store
				if (db.objectStoreNames.contains("pendingAttendance")) {
					const transaction = db.transaction(["pendingAttendance"], "readonly");
					const store = transaction.objectStore("pendingAttendance");
					const countRequest = store.count();

					countRequest.onsuccess = () => {
						totalPending += countRequest.result;
						setPendingCount(totalPending);
					};
				}

				// Check pendingMessages store
				if (db.objectStoreNames.contains("pendingMessages")) {
					const transaction = db.transaction(["pendingMessages"], "readonly");
					const store = transaction.objectStore("pendingMessages");
					const countRequest = store.count();

					countRequest.onsuccess = () => {
						totalPending += countRequest.result;
						setPendingCount(totalPending);
					};
				}
			};

			dbRequest.onerror = () => {
				console.warn("Failed to check pending items");
			};
		} catch (error) {
			console.warn("IndexedDB not available:", error);
		}
	}

	// Don't show if no pending items
	if (pendingCount === 0) return null;

	return (
		<div className="fixed bottom-20 md:bottom-4 left-4 z-40 animate-slide-up">
			<div className="bg-white border border-gray-200 shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
				{isSyncing ? (
					<>
						<div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
						<span className="text-gray-700 font-medium">Syncing...</span>
					</>
				) : isOnline ? (
					<>
						<div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
						<span className="text-gray-700 font-medium">Syncing soon</span>
					</>
				) : (
					<>
						<Image
							src="/offline.png"
							alt="offline"
							width={16}
							height={16}
							className="w-4 h-4"
						/>
						<span className="text-gray-700 font-medium">
							{pendingCount} pending
						</span>
					</>
				)}

				<div className="ml-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
					{pendingCount}
				</div>
			</div>

			{!isOnline && (
				<div className="mt-1 text-xs text-gray-500 px-2">
					Will sync when online
				</div>
			)}
		</div>
	);
}
