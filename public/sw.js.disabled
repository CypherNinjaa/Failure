// Service Worker for Web Push Notifications

console.log("🔧 Service Worker loaded");

self.addEventListener("install", function (event) {
	console.log("📥 Service Worker installing...");
	self.skipWaiting();
});

self.addEventListener("activate", function (event) {
	console.log("✅ Service Worker activated");
	event.waitUntil(clients.claim());
});

self.addEventListener("push", function (event) {
	console.log("📨 Push event received!");

	if (event.data) {
		try {
			const data = event.data.json();
			console.log("📦 Push data:", data);

			const options = {
				body: data.body || "New notification",
				icon: data.icon || "/logo.png",
				badge: "/logo.png",
				vibrate: [100, 50, 100],
				data: {
					dateOfArrival: Date.now(),
					primaryKey: 1,
					url: data.url || "/",
				},
				actions: [
					{
						action: "open",
						title: "Open",
					},
					{
						action: "close",
						title: "Close",
					},
				],
			};

			console.log("🔔 Showing notification:", data.title);
			event.waitUntil(self.registration.showNotification(data.title, options));
		} catch (error) {
			console.error("❌ Error parsing push data:", error);
			// Fallback notification
			event.waitUntil(
				self.registration.showNotification("New Notification", {
					body: "You have a new notification",
					icon: "/logo.png",
				})
			);
		}
	} else {
		console.log("⚠️ Push event received but no data");
	}
});

self.addEventListener("notificationclick", function (event) {
	console.log("🖱️ Notification clicked:", event.action);
	event.notification.close();

	if (event.action === "close") {
		return;
	}

	const url = event.notification.data?.url || "/";
	console.log("🔗 Opening URL:", url);

	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUntracked: true })
			.then(function (clientList) {
				// Check if there's already a window open
				for (let i = 0; i < clientList.length; i++) {
					const client = clientList[i];
					if (client.url === url && "focus" in client) {
						return client.focus();
					}
				}
				// If not, open a new window
				if (clients.openWindow) {
					return clients.openWindow(url);
				}
			})
	);
});
