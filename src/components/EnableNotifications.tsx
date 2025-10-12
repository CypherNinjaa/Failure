"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const EnableNotifications = () => {
	const { user } = useUser();
	const [loading, setLoading] = useState(false);
	const [testLoading, setTestLoading] = useState(false);
	const [status, setStatus] = useState<"idle" | "success" | "error" | "denied">(
		"idle"
	);
	const [errorMessage, setErrorMessage] = useState("");
	const [debugInfo, setDebugInfo] = useState<any>(null);
	const [testResult, setTestResult] = useState<string>("");

	// Check if already subscribed on mount
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
						console.log("✅ Already subscribed:", subscription);
						setStatus("success");
						setDebugInfo({
							endpoint: subscription.endpoint,
							expirationTime: subscription.expirationTime,
						});
					}
				}
			}
		} catch (error) {
			console.log("No existing subscription found");
		}
	};

	const enableNotifications = async () => {
		if (!user) {
			setErrorMessage("User not logged in");
			return;
		}

		try {
			setLoading(true);
			setStatus("idle");
			setErrorMessage("");

			console.log("🚀 Starting notification setup...");
			console.log("👤 User ID:", user.id);
			console.log("🌐 Current URL:", window.location.href);
			console.log(
				"🔑 VAPID Key (first 20 chars):",
				process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.substring(0, 20)
			);

			// Check if browser supports notifications
			if (!("Notification" in window)) {
				const msg = "This browser does not support notifications";
				console.error("❌", msg);
				setErrorMessage(msg);
				setStatus("error");
				return;
			}

			// Check if service worker is supported
			if (!("serviceWorker" in navigator)) {
				const msg = "Service Worker not supported in this browser";
				console.error("❌", msg);
				setErrorMessage(msg);
				setStatus("error");
				return;
			}

			// Check if push is supported
			if (!("PushManager" in window)) {
				const msg = "Push notifications not supported in this browser";
				console.error("❌", msg);
				setErrorMessage(msg);
				setStatus("error");
				return;
			}

			// Request notification permission
			console.log("🔔 Requesting notification permission...");
			const permission = await Notification.requestPermission();
			console.log("📋 Permission result:", permission);

			if (permission !== "granted") {
				const msg = "Notification permission denied";
				console.log("⚠️", msg);
				setErrorMessage(msg);
				setStatus("denied");
				return;
			}

			console.log("✅ Notification permission granted");

			// Register service worker
			console.log("📝 Registering service worker...");
			const registration = await navigator.serviceWorker.register("/sw.js");
			console.log("✅ Service Worker registered:", registration);
			console.log("📍 SW scope:", registration.scope);
			console.log("📍 SW state:", registration.active?.state);

			// Wait for service worker to be ready
			console.log("⏳ Waiting for service worker to be ready...");
			await navigator.serviceWorker.ready;
			console.log("✅ Service Worker ready");

			// Check for existing subscription
			let subscription = await registration.pushManager.getSubscription();

			if (subscription) {
				console.log("♻️ Found existing subscription, unsubscribing first...");
				await subscription.unsubscribe();
			}

			// Subscribe to push notifications
			console.log("📡 Subscribing to push notifications...");
			console.log(
				"🔑 Using VAPID key:",
				process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
			);

			subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
				),
			});

			console.log("✅ Push subscription created:", subscription);
			console.log("📍 Endpoint:", subscription.endpoint);

			const subscriptionJSON = subscription.toJSON();
			console.log("📦 Subscription JSON:", subscriptionJSON);

			// Save subscription to database
			console.log("💾 Saving subscription to database...");
			const response = await fetch("/api/push/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: user.id,
					subscription: subscriptionJSON,
				}),
			});

			const responseData = await response.json();
			console.log("📨 Server response:", responseData);

			if (!response.ok) {
				throw new Error(
					`Failed to save subscription: ${JSON.stringify(responseData)}`
				);
			}

			console.log("✅ Subscription saved successfully");
			setStatus("success");
			setDebugInfo({
				endpoint: subscription.endpoint,
				userId: user.id,
				savedAt: new Date().toISOString(),
			});

			// Send a test notification immediately
			console.log("🧪 Sending test notification...");
			await registration.showNotification("🎉 Notifications Enabled!", {
				body: "You will now receive push notifications from HCS School",
				icon: "/logo.png",
				badge: "/logo.png",
			});
		} catch (error: any) {
			console.error("❌ Failed to enable notifications:", error);
			setErrorMessage(error.message || "Unknown error occurred");
			setStatus("error");
		} finally {
			setLoading(false);
		}
	};

	const sendTestNotification = async () => {
		setTestLoading(true);
		setTestResult("");

		try {
			console.log("🧪 Sending test notification...");
			const response = await fetch("/api/push/test", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			const data = await response.json();
			console.log("📨 Test response:", data);

			if (data.success) {
				setTestResult(`✅ Test sent to ${data.sent} device(s)!`);
			} else {
				setTestResult(`❌ ${data.error || data.message}`);
			}
		} catch (error: any) {
			console.error("❌ Test failed:", error);
			setTestResult(`❌ ${error.message}`);
		} finally {
			setTestLoading(false);
		}
	};

	// Helper function to convert VAPID key
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

	return (
		<div className="bg-white p-6 rounded-lg border-2 border-gray-200">
			<div className="flex items-start gap-4">
				<div className="text-4xl">🔔</div>
				<div className="flex-1">
					<h3 className="text-lg font-semibold mb-2">
						Enable Push Notifications
					</h3>
					<p className="text-sm text-gray-600 mb-4">
						Get instant notifications about important updates, reminders, and
						announcements directly in your browser.
					</p>

					{status === "success" && (
						<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
							<p className="font-medium">✅ Notifications Enabled!</p>
							<p className="text-sm mb-2">
								You will now receive push notifications.
							</p>
							{debugInfo && (
								<details className="text-xs">
									<summary className="cursor-pointer font-medium">
										Debug Info
									</summary>
									<pre className="mt-2 bg-white p-2 rounded overflow-x-auto">
										{JSON.stringify(debugInfo, null, 2)}
									</pre>
								</details>
							)}
						</div>
					)}

					{status === "denied" && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							<p className="font-medium">❌ Permission Denied</p>
							<p className="text-sm mb-2">
								Please enable notifications in your browser settings.
							</p>
							<p className="text-xs">
								Chrome: Settings → Privacy → Site Settings → Notifications
							</p>
						</div>
					)}

					{status === "error" && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							<p className="font-medium">❌ Error</p>
							<p className="text-sm mb-2">
								{errorMessage ||
									"Failed to enable notifications. Please try again."}
							</p>
							<p className="text-xs">
								Check browser console (F12) for detailed logs
							</p>
						</div>
					)}

					<div className="flex gap-2 flex-wrap">
						<button
							onClick={enableNotifications}
							disabled={loading || status === "success"}
							className={`px-6 py-2 rounded-lg font-medium transition-colors ${
								loading || status === "success"
									? "bg-gray-300 text-gray-500 cursor-not-allowed"
									: "bg-lamaPurple text-white hover:bg-lamaPurpleLight"
							}`}
						>
							{loading
								? "Enabling..."
								: status === "success"
								? "✅ Enabled"
								: "Enable Notifications"}
						</button>

						{status === "success" && (
							<>
								<button
									onClick={sendTestNotification}
									disabled={testLoading}
									className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
								>
									{testLoading ? "Sending..." : "🧪 Send Test"}
								</button>

								<button
									onClick={() => {
										setStatus("idle");
										setDebugInfo(null);
										setTestResult("");
									}}
									className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
								>
									🔄 Reset
								</button>
							</>
						)}
					</div>

					{testResult && (
						<div
							className={`mt-3 p-3 rounded text-sm ${
								testResult.startsWith("✅")
									? "bg-green-50 text-green-700 border border-green-200"
									: "bg-red-50 text-red-700 border border-red-200"
							}`}
						>
							{testResult}
						</div>
					)}

					{/* Developer Info */}
					<details className="mt-4 text-xs text-gray-500">
						<summary className="cursor-pointer">Developer Info</summary>
						<div className="mt-2 space-y-1">
							<p>
								🌐 Browser:{" "}
								{typeof window !== "undefined" && navigator.userAgent}
							</p>
							<p>
								🔔 Notification Support:{" "}
								{typeof window !== "undefined" && "Notification" in window
									? "✅"
									: "❌"}
							</p>
							<p>
								👷 Service Worker Support:{" "}
								{typeof window !== "undefined" && "serviceWorker" in navigator
									? "✅"
									: "❌"}
							</p>
							<p>
								📡 Push Support:{" "}
								{typeof window !== "undefined" && "PushManager" in window
									? "✅"
									: "❌"}
							</p>
							<p>
								🔐 HTTPS:{" "}
								{typeof window !== "undefined" &&
								window.location.protocol === "https:"
									? "✅"
									: "❌"}
							</p>
						</div>
					</details>
				</div>
			</div>
		</div>
	);
};

export default EnableNotifications;
