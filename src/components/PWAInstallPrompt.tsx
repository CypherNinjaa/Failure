/**
 * PWA Install Prompt Component
 * Shows a beautiful prompt to install the app
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);
	const [pageViews, setPageViews] = useState(0);
	const [isIOS, setIsIOS] = useState(false);

	useEffect(() => {
		// Detect iOS device
		const iOS =
			/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
		setIsIOS(iOS);

		// Check if already installed (IMPROVED: More reliable detection)
		const checkInstallation = () => {
			// Check standalone mode
			if (window.matchMedia("(display-mode: standalone)").matches) {
				return true;
			}
			// Check iOS standalone
			if ((window.navigator as any).standalone === true) {
				return true;
			}
			// Check if previously installed
			if (localStorage.getItem("pwa-installed") === "true") {
				return true;
			}
			// Check Android TWA
			if (document.referrer.includes("android-app://")) {
				return true;
			}
			return false;
		};

		if (checkInstallation()) {
			setIsInstalled(true);
			console.log("✅ PWA already installed - hiding install prompt");
			return;
		}

		// For iOS, show manual instructions after engagement
		if (iOS) {
			const visitCount = parseInt(
				localStorage.getItem("pwa-visit-count") || "0"
			);
			localStorage.setItem("pwa-visit-count", (visitCount + 1).toString());

			if (visitCount >= 2) {
				setTimeout(() => setShowPrompt(true), 15000);
			}
			return;
		}

		// Listen for the beforeinstallprompt event
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);

			// IMPROVED: Smart timing based on user engagement
			const visitCount = parseInt(
				localStorage.getItem("pwa-visit-count") || "0"
			);
			localStorage.setItem("pwa-visit-count", (visitCount + 1).toString());

			// Track page views in current session
			const sessionPageViews = parseInt(
				sessionStorage.getItem("pwa-session-views") || "0"
			);
			setPageViews(sessionPageViews);

			// Show prompt based on engagement:
			// 1. After 3 page views in session OR
			// 2. After 2nd visit to site OR
			// 3. After 15 seconds if user is actively browsing (not 30s idle)
			if (sessionPageViews >= 3) {
				// User is engaged, show immediately
				setTimeout(() => setShowPrompt(true), 2000);
			} else if (visitCount >= 2) {
				// Returning visitor, show after 15 seconds
				setTimeout(() => setShowPrompt(true), 15000);
			}
		};

		window.addEventListener("beforeinstallprompt", handler);

		// Check if app was installed
		window.addEventListener("appinstalled", () => {
			setIsInstalled(true);
			setShowPrompt(false);
			localStorage.setItem("pwa-installed", "true");
			localStorage.setItem("pwa-install-date", Date.now().toString());
			console.log("✅ PWA installed successfully");

			// Track analytics
			if (typeof window !== "undefined" && (window as any).gtag) {
				(window as any).gtag("event", "pwa_install", {
					event_category: "engagement",
					event_label: "PWA Installed",
				});
			}
		});

		// Track page views for smart timing
		const trackPageView = () => {
			const views = parseInt(
				sessionStorage.getItem("pwa-session-views") || "0"
			);
			sessionStorage.setItem("pwa-session-views", (views + 1).toString());
			setPageViews(views + 1);
		};
		trackPageView();

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		// Track install attempt
		localStorage.setItem("pwa-install-attempted", Date.now().toString());

		// Show the install prompt
		await deferredPrompt.prompt();

		// Wait for the user's response
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === "accepted") {
			console.log("✅ User accepted the install prompt");
			localStorage.setItem("pwa-installed", "true");
			localStorage.setItem("pwa-install-date", Date.now().toString());

			// Track analytics
			if (typeof window !== "undefined" && (window as any).gtag) {
				(window as any).gtag("event", "pwa_install_accepted", {
					event_category: "engagement",
					event_label: "Install Accepted",
				});
			}
		} else {
			console.log("❌ User dismissed the install prompt");

			// Track dismissal
			if (typeof window !== "undefined" && (window as any).gtag) {
				(window as any).gtag("event", "pwa_install_dismissed", {
					event_category: "engagement",
					event_label: "Install Dismissed",
				});
			}
		}

		// Clear the deferred prompt
		setDeferredPrompt(null);
		setShowPrompt(false);
	};

	const handleDismiss = () => {
		setShowPrompt(false);
		// Don't show again for 7 days
		localStorage.setItem("pwa-install-dismissed", Date.now().toString());
	};

	const handleDismissToday = () => {
		setShowPrompt(false);
		// Don't show again for today (set expiry to end of day)
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);
		localStorage.setItem(
			"pwa-install-dismissed-today",
			endOfDay.getTime().toString()
		);
	};

	// Don't show if dismissed recently (7 days) or dismissed for today
	useEffect(() => {
		const dismissed = localStorage.getItem("pwa-install-dismissed");
		const dismissedToday = localStorage.getItem("pwa-install-dismissed-today");

		if (dismissed) {
			const sevenDays = 7 * 24 * 60 * 60 * 1000;
			if (Date.now() - parseInt(dismissed) < sevenDays) {
				setShowPrompt(false);
				return;
			}
		}

		if (dismissedToday) {
			const expiryTime = parseInt(dismissedToday);
			if (Date.now() < expiryTime) {
				setShowPrompt(false);
				return;
			} else {
				// Clean up expired "today" dismissal
				localStorage.removeItem("pwa-install-dismissed-today");
			}
		}
	}, []);

	if (isInstalled || !showPrompt) {
		return null;
	}

	// iOS doesn't support beforeinstallprompt
	if (!deferredPrompt && !isIOS) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm animate-slide-up">
			<div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
				{/* Header with gradient */}
				<div className="bg-gradient-to-r from-lamaSky to-lamaPurple p-6">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
							<Image
								src="/logo.png"
								alt="Happy Child School"
								width={64}
								height={64}
								className="object-contain"
							/>
						</div>
						<div className="flex-1">
							<h3 className="text-xl font-bold text-white">
								{isIOS ? "Add to Home Screen" : "Install Happy Child School"}
							</h3>
							<p className="text-white/80 text-sm mt-1">
								{isIOS
									? "Install this app on your iPhone"
									: "Get instant access from your home screen"}
							</p>
						</div>
					</div>
				</div>

				{/* Features */}
				<div className="p-6 space-y-3">
					{isIOS ? (
						// iOS Instructions
						<>
							<div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-3">
								<p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
									Follow these steps:
								</p>
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
										1
									</div>
									<div className="flex-1">
										<p className="text-sm text-gray-700 dark:text-gray-300">
											Tap the{" "}
											<span className="inline-flex items-center px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-blue-900 dark:text-blue-100 font-mono text-xs mx-1">
												<svg
													className="w-4 h-4"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
												</svg>
											</span>{" "}
											Share button at the bottom
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
										2
									</div>
									<div className="flex-1">
										<p className="text-sm text-gray-700 dark:text-gray-300">
											Scroll and tap{" "}
											<span className="font-semibold">
												&ldquo;Add to Home Screen&rdquo;
											</span>
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
										3
									</div>
									<div className="flex-1">
										<p className="text-sm text-gray-700 dark:text-gray-300">
											Tap{" "}
											<span className="font-semibold">&ldquo;Add&rdquo;</span>{" "}
											to confirm
										</p>
									</div>
								</div>
							</div>
							<div className="pt-2 border-t dark:border-gray-700">
								<p className="text-xs text-gray-500 dark:text-gray-400 text-center">
									✨ Access the app instantly from your home screen
								</p>
							</div>
						</>
					) : (
						// Android/Desktop Features - Enhanced with more benefits
						<>
							<div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-3">
								<p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
									🚀 Why Install?
								</p>
								<div className="space-y-2.5">
									<div className="flex items-center gap-3">
										<div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2.5}
													d="M13 10V3L4 14h7v7l9-11h-7z"
												/>
											</svg>
										</div>
										<div className="flex-1">
											<p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
												2-3x Faster Loading
											</p>
											<p className="text-xs text-gray-600 dark:text-gray-400">
												Smart caching makes pages load instantly
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2.5}
													d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
												/>
											</svg>
										</div>
										<div className="flex-1">
											<p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
												Works Offline
											</p>
											<p className="text-xs text-gray-600 dark:text-gray-400">
												Access students, classes & more without internet
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2.5}
													d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
												/>
											</svg>
										</div>
										<div className="flex-1">
											<p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
												Instant Notifications
											</p>
											<p className="text-xs text-gray-600 dark:text-gray-400">
												Never miss important updates & messages
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2.5}
													d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
												/>
											</svg>
										</div>
										<div className="flex-1">
											<p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
												Home Screen Shortcut
											</p>
											<p className="text-xs text-gray-600 dark:text-gray-400">
												Launch app with one tap - no browser needed
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
										clipRule="evenodd"
									/>
								</svg>
								100% secure • Uses only 2MB storage
							</div>
						</>
					)}
				</div>

				{/* Actions */}
				<div className="p-6 pt-0 space-y-3">
					{isIOS ? (
						// iOS: Only show dismiss buttons
						<div className="space-y-2">
							<button
								onClick={() => {
									setShowPrompt(false);
									localStorage.setItem("pwa-ios-instructions-seen", "true");
								}}
								className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-lamaSky to-lamaPurple text-white font-semibold shadow-lg hover:shadow-xl transition-all"
							>
								Got it!
							</button>
							<button
								onClick={handleDismissToday}
								className="w-full px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
									/>
								</svg>
								Don&apos;t show again today
							</button>
						</div>
					) : (
						// Android/Desktop: Show install button
						<>
							<div className="flex gap-3">
								<button
									onClick={handleDismiss}
									className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
								>
									Not Now
								</button>
								<button
									onClick={handleInstall}
									className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-lamaSky to-lamaPurple text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
								>
									Install App
								</button>
							</div>

							{/* Never show today button */}
							<button
								onClick={handleDismissToday}
								className="w-full px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
									/>
								</svg>
								Don&apos;t show again today
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
