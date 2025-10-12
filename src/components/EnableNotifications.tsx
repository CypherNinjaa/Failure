"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const EnableNotifications = () => {
	const { user } = useUser();
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<"idle" | "success" | "error" | "denied">(
		"idle"
	);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		checkExistingSubscription();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const checkExistingSubscription = async () => {
		if (!user) return;
		try {
			if ("serviceWorker" in navigator && "PushManager" in window) {
				const registration = await navigator.serviceWorker.getRegistration();
				if (registration) {
					const subscription = await registration.pushManager.getSubscription();
					if (subscription) {
						setStatus("success");
					}
				}
			}
		} catch (error) {
			console.log("No existing subscription");
		}
	};

	const enableNotifications = async () => {
		if (!user) return;

		try {
			setLoading(true);
			setStatus("idle");
			setErrorMessage("");

			if (!("Notification" in window)) {
				throw new Error("Browser doesn't support notifications");
			}

			const permission = await Notification.requestPermission();

			if (permission !== "granted") {
				setStatus("denied");
				return;
			}

			const registration = await navigator.serviceWorker.register("/sw.js");
			await navigator.serviceWorker.ready;

			let subscription = await registration.pushManager.getSubscription();
			if (subscription) {
				await subscription.unsubscribe();
			}

			subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
				),
			});

			const response = await fetch("/api/push/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: user.id,
					subscription: subscription.toJSON(),
				}),
			});

			if (!response.ok) throw new Error("Failed to save subscription");

			setStatus("success");

			await registration.showNotification("Notifications Enabled!", {
				body: "You will now receive updates from Happy Child School",
				icon: "/logo.png",
			});
		} catch (error: any) {
			setErrorMessage(error.message || "Failed to enable notifications");
			setStatus("error");
		} finally {
			setLoading(false);
		}
	};

	const sendTestNotification = async () => {
		try {
			await fetch("/api/push/test", { method: "POST" });
		} catch (error) {
			console.error("Test failed:", error);
		}
	};

	const resetSubscription = async () => {
		try {
			const registration = await navigator.serviceWorker.getRegistration();
			if (registration) {
				const subscription = await registration.pushManager.getSubscription();
				if (subscription) {
					await subscription.unsubscribe();
				}
			}
			setStatus("idle");
		} catch (error) {
			console.error("Reset failed:", error);
		}
	};

	function urlBase64ToUint8Array(base64String: string) {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/\-/g, "+")
			.replace(/_/g, "/");
		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);
		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

	if (status === "denied") {
		return (
			<div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<Image
						src="/close.png"
						alt="Blocked"
						width={18}
						height={18}
						className="mt-0.5 flex-shrink-0"
					/>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-red-800 text-sm md:text-base mb-1">
							Notifications Blocked
						</h3>
						<p className="text-xs md:text-sm text-red-700">
							Enable notifications in your browser settings to receive updates.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (status === "success") {
		return (
			<div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<Image
						src="/announcement.png"
						alt="Enabled"
						width={18}
						height={18}
						className="mt-0.5 flex-shrink-0"
					/>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-green-800 text-sm md:text-base mb-1">
							Notifications Enabled!
						</h3>
						<p className="text-xs md:text-sm text-green-700 mb-3">
							You will receive push notifications.
						</p>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={sendTestNotification}
								className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs md:text-sm"
							>
								<Image
									src="/message.png"
									alt="Test"
									width={12}
									height={12}
									className="brightness-0 invert"
								/>
								Send Test
							</button>
							<button
								onClick={resetSubscription}
								className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-xs md:text-sm"
							>
								<Image
									src="/update.png"
									alt="Reset"
									width={12}
									height={12}
									className="brightness-0 invert"
								/>
								Reset
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (status === "error") {
		return (
			<div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<Image
						src="/close.png"
						alt="Error"
						width={18}
						height={18}
						className="mt-0.5 flex-shrink-0"
					/>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-red-800 text-sm md:text-base mb-1">
							Error
						</h3>
						<p className="text-xs md:text-sm text-red-700 mb-3">
							{errorMessage || "Failed to enable notifications"}
						</p>
						<button
							onClick={enableNotifications}
							className="px-3 py-1.5 bg-lamaPurple text-white rounded-md hover:bg-lamaPurpleLight text-xs md:text-sm"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
			<div className="flex items-start gap-3">
				<Image
					src="/notification.png"
					alt="Enable"
					width={18}
					height={18}
					className="mt-0.5 flex-shrink-0"
				/>
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-orange-800 text-sm md:text-base mb-1">
						Enable Push Notifications
					</h3>
					<p className="text-xs md:text-sm text-orange-700 mb-3">
						Get instant updates and announcements.
					</p>
					<button
						onClick={enableNotifications}
						disabled={loading}
						className="flex items-center gap-1.5 px-4 py-2 bg-lamaPurple text-white rounded-md hover:bg-lamaPurpleLight disabled:opacity-50 text-xs md:text-sm font-medium"
					>
						<Image
							src="/announcement.png"
							alt="Enable"
							width={12}
							height={12}
							className="brightness-0 invert"
						/>
						{loading ? "Enabling..." : "Enable Notifications"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EnableNotifications;
