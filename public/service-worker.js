/**
 * Service Worker for HCS School Management PWA
 * Handles offline functionality, caching, and push notifications
 */

const CACHE_VERSION = "v1.0.0";
const CACHE_NAME = `hcs-school-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
	"/",
	"/manifest.json",
	"/icons/icon-192x192.png",
	"/icons/icon-512x512.png",
	"/offline.html",
	"/cache.png",
	"/offline.png",
	"/message.png",
	"/logo.png",
	"/update.png",
];

// API routes that should be cached
const API_CACHE_PATTERNS = [
	/\/api\/mobile\/students/,
	/\/api\/mobile\/teachers/,
	/\/api\/mobile\/classes/,
	/\/api\/mobile\/analytics/,
];

// Dynamic routes that should work offline
const OFFLINE_PAGES = [
	"/list/students",
	"/list/teachers",
	"/list/classes",
	"/list/attendances",
	"/list/exams",
];

/**
 * Install Event - Cache static assets
 */
self.addEventListener("install", (event) => {
	console.log("[Service Worker] Installing...");

	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log("[Service Worker] Caching static assets");
				return cache.addAll(STATIC_ASSETS);
			})
			.then(() => {
				// Force the waiting service worker to become the active service worker
				return self.skipWaiting();
			})
	);
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener("activate", (event) => {
	console.log("[Service Worker] Activating...");

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((name) => name !== CACHE_NAME)
						.map((name) => {
							console.log("[Service Worker] Deleting old cache:", name);
							return caches.delete(name);
						})
				);
			})
			.then(() => {
				// Take control of all clients immediately
				return self.clients.claim();
			})
	);
});

/**
 * Fetch Event - Network first, fallback to cache
 */
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip cross-origin requests
	if (url.origin !== self.location.origin) {
		return;
	}

	// Handle API requests with Network First strategy
	if (url.pathname.startsWith("/api/")) {
		event.respondWith(networkFirstStrategy(request));
		return;
	}

	// Handle page navigation with Network First strategy
	if (request.mode === "navigate") {
		event.respondWith(networkFirstStrategy(request));
		return;
	}

	// Handle static assets with Cache First strategy
	event.respondWith(cacheFirstStrategy(request));
});

/**
 * Network First Strategy
 * Try network first, fallback to cache if offline
 */
async function networkFirstStrategy(request) {
	try {
		const response = await fetch(request);

		// Cache successful responses
		if (response.ok) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(request, response.clone());
		}

		return response;
	} catch (error) {
		console.log(
			"[Service Worker] Network request failed, serving from cache:",
			error
		);

		const cachedResponse = await caches.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		// Return offline page for navigation requests
		if (request.mode === "navigate") {
			const offlinePage = await caches.match("/offline.html");
			if (offlinePage) return offlinePage;
		}

		// Return a basic offline response
		return new Response(
			JSON.stringify({
				error: "You are offline. Please check your internet connection.",
				offline: true,
			}),
			{
				status: 503,
				statusText: "Service Unavailable",
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

/**
 * Cache First Strategy
 * Try cache first, fallback to network
 */
async function cacheFirstStrategy(request) {
	const cachedResponse = await caches.match(request);

	if (cachedResponse) {
		return cachedResponse;
	}

	try {
		const response = await fetch(request);

		if (response.ok) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(request, response.clone());
		}

		return response;
	} catch (error) {
		console.log("[Service Worker] Fetch failed:", error);

		return new Response("Network error", {
			status: 408,
			statusText: "Request Timeout",
		});
	}
}

/**
 * Push Notification Event
 */
self.addEventListener("push", (event) => {
	console.log("[Service Worker] Push notification received");

	const data = event.data ? event.data.json() : {};
	const title = data.title || "HCS School Notification";
	const options = {
		body: data.body || "You have a new notification",
		icon: "/icons/icon-192x192.png",
		badge: "/icons/badge-72x72.png",
		vibrate: [200, 100, 200],
		tag: data.tag || "default",
		requireInteraction: data.requireInteraction || false,
		actions: data.actions || [
			{
				action: "open",
				title: "Open",
				icon: "/icons/open-24x24.png",
			},
			{
				action: "close",
				title: "Close",
				icon: "/icons/close-24x24.png",
			},
		],
		data: data.data || {},
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Notification Click Event
 */
self.addEventListener("notificationclick", (event) => {
	console.log("[Service Worker] Notification clicked:", event.action);

	event.notification.close();

	if (event.action === "close") {
		return;
	}

	// Get the URL from notification data or default to home
	const urlToOpen = event.notification.data?.url || "/";

	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clientList) => {
				// Check if there's already a window open
				for (const client of clientList) {
					if (client.url === urlToOpen && "focus" in client) {
						return client.focus();
					}
				}

				// Open a new window
				if (clients.openWindow) {
					return clients.openWindow(urlToOpen);
				}
			})
	);
});

/**
 * Background Sync Event
 */
self.addEventListener("sync", (event) => {
	console.log("[Service Worker] Background sync:", event.tag);

	if (event.tag === "sync-attendance") {
		event.waitUntil(syncAttendance());
	} else if (event.tag === "sync-messages") {
		event.waitUntil(syncMessages());
	}
});

/**
 * Sync attendance data when back online
 */
async function syncAttendance() {
	try {
		// Retrieve pending attendance from IndexedDB
		const db = await openDatabase();
		const pendingAttendance = await getAllPendingAttendance(db);

		// Send to server
		for (const record of pendingAttendance) {
			await fetch("/api/mobile/attendance", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(record),
			});

			// Remove from IndexedDB after successful sync
			await deletePendingAttendance(db, record.id);
		}

		console.log("[Service Worker] Attendance synced successfully");
	} catch (error) {
		console.error("[Service Worker] Attendance sync failed:", error);
	}
}

/**
 * Sync messages when back online
 */
async function syncMessages() {
	try {
		// Retrieve pending messages from IndexedDB
		const db = await openDatabase();
		const pendingMessages = await getAllPendingMessages(db);

		// Send to server
		for (const message of pendingMessages) {
			await fetch("/api/mobile/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(message),
			});

			// Remove from IndexedDB after successful sync
			await deletePendingMessage(db, message.id);
		}

		console.log("[Service Worker] Messages synced successfully");
	} catch (error) {
		console.error("[Service Worker] Messages sync failed:", error);
	}
}

/**
 * IndexedDB helpers
 */
function openDatabase() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("HCS_School_DB", 1);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;

			if (!db.objectStoreNames.contains("pendingAttendance")) {
				db.createObjectStore("pendingAttendance", { keyPath: "id" });
			}

			if (!db.objectStoreNames.contains("pendingMessages")) {
				db.createObjectStore("pendingMessages", { keyPath: "id" });
			}
		};
	});
}

function getAllPendingAttendance(db) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["pendingAttendance"], "readonly");
		const store = transaction.objectStore("pendingAttendance");
		const request = store.getAll();

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
	});
}

function deletePendingAttendance(db, id) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["pendingAttendance"], "readwrite");
		const store = transaction.objectStore("pendingAttendance");
		const request = store.delete(id);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
}

function getAllPendingMessages(db) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["pendingMessages"], "readonly");
		const store = transaction.objectStore("pendingMessages");
		const request = store.getAll();

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
	});
}

function deletePendingMessage(db, id) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["pendingMessages"], "readwrite");
		const store = transaction.objectStore("pendingMessages");
		const request = store.delete(id);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
}

/**
 * Message Event - Handle messages from clients
 */
self.addEventListener("message", (event) => {
	console.log("[Service Worker] Message received:", event.data);

	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}

	if (event.data && event.data.type === "CACHE_URLS") {
		event.waitUntil(
			caches.open(CACHE_NAME).then((cache) => {
				return cache.addAll(event.data.urls);
			})
		);
	}
});
