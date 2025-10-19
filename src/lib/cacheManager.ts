/**
 * Cache Management Utilities
 * Helpers for managing PWA cache with role-based policies
 */

"use client";

export interface CachePolicy {
	maxAge: number; // in milliseconds
	maxItems: number;
	priority: "high" | "normal" | "low";
}

export const ROLE_CACHE_POLICIES: Record<string, CachePolicy> = {
	admin: {
		maxAge: 30 * 60 * 1000, // 30 minutes
		maxItems: 1000,
		priority: "high",
	},
	teacher: {
		maxAge: 60 * 60 * 1000, // 1 hour
		maxItems: 500,
		priority: "high",
	},
	student: {
		maxAge: 2 * 60 * 60 * 1000, // 2 hours
		maxItems: 100,
		priority: "normal",
	},
	parent: {
		maxAge: 60 * 60 * 1000, // 1 hour
		maxItems: 200,
		priority: "normal",
	},
};

/**
 * Get cache statistics
 */
export async function getCacheStats() {
	if (typeof caches === "undefined") {
		return null;
	}

	try {
		const cacheNames = await caches.keys();
		const stats = {
			totalCaches: cacheNames.length,
			caches: [] as any[],
			totalSize: 0,
		};

		for (const cacheName of cacheNames) {
			const cache = await caches.open(cacheName);
			const keys = await cache.keys();

			const cacheInfo = {
				name: cacheName,
				itemCount: keys.length,
				urls: keys.map((req) => req.url),
			};

			stats.caches.push(cacheInfo);
		}

		return stats;
	} catch (error) {
		console.error("Failed to get cache stats:", error);
		return null;
	}
}

/**
 * Clear old cache entries based on role policy
 */
export async function cleanCache(role: string) {
	if (typeof caches === "undefined") {
		return false;
	}

	const policy = ROLE_CACHE_POLICIES[role] || ROLE_CACHE_POLICIES.student;

	try {
		const cacheNames = await caches.keys();

		for (const cacheName of cacheNames) {
			const cache = await caches.open(cacheName);
			const keys = await cache.keys();

			// If exceeds max items, remove oldest entries
			if (keys.length > policy.maxItems) {
				const toRemove = keys.slice(0, keys.length - policy.maxItems);
				for (const request of toRemove) {
					await cache.delete(request);
				}
				console.log(
					`[Cache] Cleaned ${toRemove.length} items from ${cacheName}`
				);
			}
		}

		return true;
	} catch (error) {
		console.error("Failed to clean cache:", error);
		return false;
	}
}

/**
 * Clear all caches
 */
export async function clearAllCaches() {
	if (typeof caches === "undefined") {
		return false;
	}

	try {
		const cacheNames = await caches.keys();
		await Promise.all(cacheNames.map((name) => caches.delete(name)));
		console.log("[Cache] All caches cleared");
		return true;
	} catch (error) {
		console.error("Failed to clear caches:", error);
		return false;
	}
}

/**
 * Get cache size estimate
 */
export async function getCacheSize() {
	if (typeof navigator === "undefined" || !("storage" in navigator)) {
		return null;
	}

	try {
		const estimate = await (navigator as any).storage.estimate();
		return {
			usage: estimate.usage || 0,
			quota: estimate.quota || 0,
			usagePercent: ((estimate.usage / estimate.quota) * 100).toFixed(2),
			usageMB: (estimate.usage / (1024 * 1024)).toFixed(2),
			quotaMB: (estimate.quota / (1024 * 1024)).toFixed(2),
		};
	} catch (error) {
		console.error("Failed to get cache size:", error);
		return null;
	}
}

/**
 * Preload critical resources based on role
 */
export async function preloadCriticalResources(role: string) {
	if (typeof caches === "undefined") {
		return false;
	}

	const criticalUrls: Record<string, string[]> = {
		admin: [
			"/list/students",
			"/list/teachers",
			"/list/classes",
			"/api/mobile/students",
			"/api/mobile/teachers",
		],
		teacher: [
			"/list/students",
			"/list/classes",
			"/list/exams",
			"/api/mobile/students",
			"/api/mobile/classes",
		],
		student: ["/list/exams", "/list/attendances", "/api/mobile/exams"],
		parent: ["/list/students", "/list/attendances", "/api/mobile/students"],
	};

	const urls = criticalUrls[role] || [];

	try {
		const cache = await caches.open(`hcs-school-${role}`);

		for (const url of urls) {
			try {
				const response = await fetch(url);
				if (response.ok) {
					await cache.put(url, response);
				}
			} catch (error) {
				console.warn(`Failed to preload ${url}:`, error);
			}
		}

		console.log(`[Cache] Preloaded ${urls.length} resources for ${role}`);
		return true;
	} catch (error) {
		console.error("Failed to preload resources:", error);
		return false;
	}
}
