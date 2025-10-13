"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher";

// Track user's last activity
let activityTimeout: NodeJS.Timeout;

export function useOnlineStatus(currentUserId: string | null) {
	const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (!currentUserId) return;

		const pusher = getPusherClient();
		const channel = pusher.subscribe("online-status");

		// Listen for user online status updates
		channel.bind("user-online", (data: { userId: string }) => {
			setOnlineUsers((prev) => {
				const newSet = new Set(prev);
				newSet.add(data.userId);
				return newSet;
			});
		});

		channel.bind("user-offline", (data: { userId: string }) => {
			setOnlineUsers((prev) => {
				const newSet = new Set(prev);
				newSet.delete(data.userId);
				return newSet;
			});
		});

		// Broadcast current user as online
		const broadcastOnline = async () => {
			try {
				await fetch("/api/online-status", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ status: "online" }),
				});
			} catch (error) {
				console.error("Failed to broadcast online status:", error);
			}
		};

		const broadcastOffline = async () => {
			try {
				await fetch("/api/online-status", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ status: "offline" }),
				});
			} catch (error) {
				console.error("Failed to broadcast offline status:", error);
			}
		};

		// Initial broadcast
		broadcastOnline();

		// Heartbeat - send online status every 30 seconds
		const heartbeat = setInterval(broadcastOnline, 30000);

		// Handle tab visibility
		const handleVisibilityChange = () => {
			if (document.hidden) {
				broadcastOffline();
			} else {
				broadcastOnline();
			}
		};

		// Handle page unload
		const handleBeforeUnload = () => {
			broadcastOffline();
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			clearInterval(heartbeat);
			channel.unbind_all();
			pusher.unsubscribe("online-status");
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("beforeunload", handleBeforeUnload);
			broadcastOffline();
		};
	}, [currentUserId]);

	const isUserOnline = (userId: string) => {
		return onlineUsers.has(userId);
	};

	return { onlineUsers, isUserOnline };
}
