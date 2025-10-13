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

	useEffect(() => {
		// Check if already installed
		if (
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as any).standalone === true
		) {
			setIsInstalled(true);
			return;
		}

		// Listen for the beforeinstallprompt event
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);

			// Show prompt after 30 seconds or on second visit
			const visitCount = parseInt(
				localStorage.getItem("pwa-visit-count") || "0"
			);
			localStorage.setItem("pwa-visit-count", (visitCount + 1).toString());

			if (visitCount >= 1) {
				setTimeout(() => setShowPrompt(true), 30000);
			}
		};

		window.addEventListener("beforeinstallprompt", handler);

		// Check if app was installed
		window.addEventListener("appinstalled", () => {
			setIsInstalled(true);
			setShowPrompt(false);
			console.log("PWA installed successfully");
		});

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
		};
	}, []);

	const handleInstall = async () => {
		if (!deferredPrompt) return;

		// Show the install prompt
		await deferredPrompt.prompt();

		// Wait for the user's response
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
		} else {
			console.log("User dismissed the install prompt");
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

	// Don't show if dismissed recently (7 days)
	useEffect(() => {
		const dismissed = localStorage.getItem("pwa-install-dismissed");
		if (dismissed) {
			const sevenDays = 7 * 24 * 60 * 60 * 1000;
			if (Date.now() - parseInt(dismissed) < sevenDays) {
				setShowPrompt(false);
			}
		}
	}, []);

	if (isInstalled || !showPrompt || !deferredPrompt) {
		return null;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm animate-slide-up">
			<div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
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
								Install Happy Child School
							</h3>
							<p className="text-white/80 text-sm mt-1">
								Get instant access from your home screen
							</p>
						</div>
					</div>
				</div>

				{/* Features */}
				<div className="p-6 space-y-3">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
							<svg
								className="w-5 h-5 text-green-600"
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
						<span className="text-sm text-gray-700">
							Works offline with cached data
						</span>
					</div>

					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
							<svg
								className="w-5 h-5 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/>
							</svg>
						</div>
						<span className="text-sm text-gray-700">
							Instant push notifications
						</span>
					</div>

					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
							<svg
								className="w-5 h-5 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<span className="text-sm text-gray-700">
							Lightning fast performance
						</span>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-3 p-6 pt-0">
					<button
						onClick={handleDismiss}
						className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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
			</div>
		</div>
	);
}
