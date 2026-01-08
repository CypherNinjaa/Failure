"use client";

import { useEffect } from "react";

/**
 * Component to unregister any existing service workers
 * This runs once on app load to clean up PWA features
 */
export default function UnregisterServiceWorker() {
	useEffect(() => {
		if (typeof window !== "undefined" && "serviceWorker" in navigator) {
			navigator.serviceWorker.getRegistrations().then((registrations) => {
				for (const registration of registrations) {
					registration.unregister().then((success) => {
						if (success) {
							console.log("Service Worker unregistered successfully");
						}
					});
				}
			});

			// Clear all caches
			if ("caches" in window) {
				caches.keys().then((names) => {
					names.forEach((name) => {
						caches.delete(name);
					});
				});
			}
		}
	}, []);

	return null;
}
