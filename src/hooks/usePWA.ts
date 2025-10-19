/**
 * PWA Hooks
 * Custom hooks for Progressive Web App functionality
 */

"use client";

import { useState, useEffect } from "react";

/**
 * Hook to check if app is installed as PWA
 */
export function useIsPWA() {
	const [isPWA, setIsPWA] = useState(false);

	useEffect(() => {
		const checkPWA = () => {
			const isStandalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				(window.navigator as any).standalone === true ||
				document.referrer.includes("android-app://");

			setIsPWA(isStandalone);
		};

		checkPWA();
		window.addEventListener("resize", checkPWA);

		return () => window.removeEventListener("resize", checkPWA);
	}, []);

	return isPWA;
}

/**
 * Hook to check online/offline status
 */
export function useOnlineStatus() {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== "undefined" ? navigator.onLine : true
	);

	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return isOnline;
}

/**
 * Hook to register service worker
 */
export function useServiceWorker() {
	const [isRegistered, setIsRegistered] = useState(false);
	const [registration, setRegistration] =
		useState<ServiceWorkerRegistration | null>(null);
	const [updateAvailable, setUpdateAvailable] = useState(false);

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			"serviceWorker" in navigator &&
			process.env.NODE_ENV === "production"
		) {
			const registerSW = async () => {
				try {
					const reg = await navigator.serviceWorker.register(
						"/service-worker.js",
						{
							scope: "/",
						}
					);

					setRegistration(reg);
					setIsRegistered(true);

					// Check for updates
					reg.addEventListener("updatefound", () => {
						const newWorker = reg.installing;
						if (newWorker) {
							newWorker.addEventListener("statechange", () => {
								if (
									newWorker.state === "installed" &&
									navigator.serviceWorker.controller
								) {
									setUpdateAvailable(true);
								}
							});
						}
					});

					// Check for updates periodically (every 1 hour)
					setInterval(() => {
						reg.update();
					}, 60 * 60 * 1000);

					console.log("Service Worker registered successfully");
				} catch (error) {
					console.error("Service Worker registration failed:", error);
				}
			};

			registerSW();
		}
	}, []);

	const updateServiceWorker = () => {
		if (registration && registration.waiting) {
			registration.waiting.postMessage({ type: "SKIP_WAITING" });
			window.location.reload();
		}
	};

	return { isRegistered, updateAvailable, updateServiceWorker, registration };
}

/**
 * Hook to handle push notifications
 */
export function usePushNotifications() {
	const [permission, setPermission] =
		useState<NotificationPermission>("default");
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null
	);

	useEffect(() => {
		if ("Notification" in window) {
			setPermission(Notification.permission);
		}
	}, []);

	const requestPermission = async () => {
		if (!("Notification" in window)) {
			console.error("This browser does not support notifications");
			return false;
		}

		const result = await Notification.requestPermission();
		setPermission(result);
		return result === "granted";
	};

	const subscribe = async (registration: ServiceWorkerRegistration) => {
		try {
			const sub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
			});

			setSubscription(sub);

			// Send subscription to server
			await fetch("/api/push-subscription", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(sub),
			});

			return sub;
		} catch (error) {
			console.error("Failed to subscribe to push notifications:", error);
			return null;
		}
	};

	const unsubscribe = async () => {
		if (subscription) {
			await subscription.unsubscribe();
			setSubscription(null);

			// Remove subscription from server
			await fetch("/api/push-subscription", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subscription),
			});
		}
	};

	return {
		permission,
		subscription,
		requestPermission,
		subscribe,
		unsubscribe,
	};
}

/**
 * Hook to handle background sync
 */
export function useBackgroundSync() {
	const [isSupported, setIsSupported] = useState(false);

	useEffect(() => {
		if ("serviceWorker" in navigator && "SyncManager" in window) {
			setIsSupported(true);
		}
	}, []);

	const registerSync = async (tag: string) => {
		if (!isSupported) {
			console.warn("Background Sync is not supported");
			return false;
		}

		try {
			const registration = await navigator.serviceWorker.ready;
			await (registration as any).sync.register(tag);
			console.log("Background sync registered:", tag);
			return true;
		} catch (error) {
			console.error("Background sync registration failed:", error);
			return false;
		}
	};

	return { isSupported, registerSync };
}

/**
 * Hook to check if device supports app installation
 */
export function useInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isInstallable, setIsInstallable] = useState(false);

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setIsInstallable(true);
		};

		window.addEventListener("beforeinstallprompt", handler);

		window.addEventListener("appinstalled", () => {
			setIsInstallable(false);
			setDeferredPrompt(null);
		});

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
		};
	}, []);

	const promptInstall = async () => {
		if (!deferredPrompt) return null;

		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;

		setDeferredPrompt(null);
		setIsInstallable(false);

		return outcome;
	};

	return { isInstallable, promptInstall };
}

/**
 * Hook to detect device type
 */
export function useDeviceType() {
	const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
		"desktop"
	);

	useEffect(() => {
		const checkDevice = () => {
			const width = window.innerWidth;
			if (width < 768) {
				setDeviceType("mobile");
			} else if (width < 1024) {
				setDeviceType("tablet");
			} else {
				setDeviceType("desktop");
			}
		};

		checkDevice();
		window.addEventListener("resize", checkDevice);

		return () => window.removeEventListener("resize", checkDevice);
	}, []);

	return deviceType;
}

/**
 * Hook to handle app updates
 */
export function useAppUpdate() {
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [registration, setRegistration] =
		useState<ServiceWorkerRegistration | null>(null);
	const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
		null
	);

	useEffect(() => {
		if ("serviceWorker" in navigator) {
			// Get the current registration
			navigator.serviceWorker.ready.then((reg) => {
				setRegistration(reg);

				// Check if there's already a waiting worker
				if (reg.waiting) {
					setWaitingWorker(reg.waiting);
					setUpdateAvailable(true);
				}

				// Listen for new updates
				reg.addEventListener("updatefound", () => {
					const newWorker = reg.installing;
					if (newWorker) {
						newWorker.addEventListener("statechange", () => {
							if (
								newWorker.state === "installed" &&
								navigator.serviceWorker.controller
							) {
								setWaitingWorker(newWorker);
								setUpdateAvailable(true);
								console.log(
									"New version available! Click 'Update Now' to refresh."
								);
							}
						});
					}
				});

				// Check for updates every 60 seconds
				setInterval(() => {
					reg.update();
				}, 60000);
			});

			// Listen for controller change (when new service worker activates)
			let refreshing = false;
			navigator.serviceWorker.addEventListener("controllerchange", () => {
				if (!refreshing) {
					refreshing = true;
					window.location.reload();
				}
			});
		}
	}, []);

	const applyUpdate = () => {
		console.log("Applying update...");

		if (waitingWorker) {
			// Tell the waiting service worker to activate immediately
			waitingWorker.postMessage({ type: "SKIP_WAITING" });
			console.log("Sent SKIP_WAITING message to service worker");
		} else if (registration && registration.waiting) {
			registration.waiting.postMessage({ type: "SKIP_WAITING" });
			console.log("Sent SKIP_WAITING message via registration");
		} else {
			// If no waiting worker, just reload
			console.log("No waiting worker found, forcing reload");
			window.location.reload();
		}
	};

	return { updateAvailable, applyUpdate };
}

/**
 * Hook to pre-cache role-specific data
 */
export function usePreCache() {
	const [isCaching, setIsCaching] = useState(false);
	const [cachingComplete, setCachingComplete] = useState(false);

	const preCacheData = async (role: string) => {
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
			console.warn("Service Worker not supported");
			return false;
		}

		setIsCaching(true);

		try {
			const registration = await navigator.serviceWorker.ready;

			if (registration.active) {
				// Send message to service worker to pre-cache role data
				registration.active.postMessage({
					type: "PRECACHE_ROLE_DATA",
					role: role,
				});

				// Store that pre-caching has been done
				localStorage.setItem("precache-complete", "true");
				localStorage.setItem("precache-role", role);
				localStorage.setItem("precache-time", new Date().toISOString());

				setCachingComplete(true);
				console.log(`Pre-caching initiated for role: ${role}`);
				return true;
			}
		} catch (error) {
			console.error("Pre-caching failed:", error);
			return false;
		} finally {
			setIsCaching(false);
		}
	};

	const checkPreCacheStatus = () => {
		if (typeof window === "undefined") return false;

		const isComplete = localStorage.getItem("precache-complete") === "true";
		setCachingComplete(isComplete);
		return isComplete;
	};

	useEffect(() => {
		checkPreCacheStatus();
	}, []);

	return { isCaching, cachingComplete, preCacheData, checkPreCacheStatus };
}
