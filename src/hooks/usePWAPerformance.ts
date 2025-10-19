/**
 * PWA Performance Monitor
 * Tracks and reports PWA performance metrics
 */

"use client";

import { useEffect } from "react";

interface PerformanceMetrics {
	fcp?: number; // First Contentful Paint
	lcp?: number; // Largest Contentful Paint
	fid?: number; // First Input Delay
	cls?: number; // Cumulative Layout Shift
	ttfb?: number; // Time to First Byte
	cacheHitRate?: number;
	offlineTime?: number;
}

export function usePWAPerformance() {
	useEffect(() => {
		if (typeof window === "undefined") return;

		// Track performance metrics
		const metrics: PerformanceMetrics = {};

		// First Contentful Paint
		const paintObserver = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (entry.name === "first-contentful-paint") {
					metrics.fcp = entry.startTime;
					logMetric("FCP", entry.startTime);
				}
			}
		});
		paintObserver.observe({ entryTypes: ["paint"] });

		// Largest Contentful Paint
		const lcpObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			const lastEntry = entries[entries.length - 1];
			metrics.lcp = lastEntry.startTime;
			logMetric("LCP", lastEntry.startTime);
		});
		lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

		// First Input Delay
		const fidObserver = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				metrics.fid = (entry as any).processingStart - entry.startTime;
				logMetric("FID", metrics.fid);
			}
		});
		fidObserver.observe({ entryTypes: ["first-input"] });

		// Cumulative Layout Shift
		let clsValue = 0;
		const clsObserver = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (!(entry as any).hadRecentInput) {
					clsValue += (entry as any).value;
					metrics.cls = clsValue;
					logMetric("CLS", clsValue);
				}
			}
		});
		clsObserver.observe({ entryTypes: ["layout-shift"] });

		// Navigation Timing
		window.addEventListener("load", () => {
			const navTiming = performance.getEntriesByType(
				"navigation"
			)[0] as PerformanceNavigationTiming;
			if (navTiming) {
				metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
				logMetric("TTFB", metrics.ttfb);
			}
		});

		// Cache Hit Rate Tracking
		let cacheHits = 0;
		let cacheMisses = 0;

		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.addEventListener("message", (event) => {
				if (event.data.type === "CACHE_HIT") {
					cacheHits++;
				} else if (event.data.type === "CACHE_MISS") {
					cacheMisses++;
				}

				const total = cacheHits + cacheMisses;
				if (total > 0) {
					metrics.cacheHitRate = (cacheHits / total) * 100;
					localStorage.setItem(
						"pwa-cache-hit-rate",
						metrics.cacheHitRate.toString()
					);
				}
			});
		}

		// Track offline time
		let offlineStart: number | null = null;
		let totalOfflineTime = parseInt(
			localStorage.getItem("pwa-offline-time") || "0"
		);

		window.addEventListener("offline", () => {
			offlineStart = Date.now();
		});

		window.addEventListener("online", () => {
			if (offlineStart) {
				const offlineDuration = Date.now() - offlineStart;
				totalOfflineTime += offlineDuration;
				localStorage.setItem("pwa-offline-time", totalOfflineTime.toString());
				metrics.offlineTime = totalOfflineTime;
				offlineStart = null;

				// Send analytics event
				if (typeof window !== "undefined" && (window as any).gtag) {
					(window as any).gtag("event", "pwa_back_online", {
						offline_duration_ms: offlineDuration,
					});
				}
			}
		});

		// Send metrics to analytics after 10 seconds
		setTimeout(() => {
			if (typeof window !== "undefined" && (window as any).gtag) {
				(window as any).gtag("event", "pwa_performance", {
					fcp: metrics.fcp,
					lcp: metrics.lcp,
					fid: metrics.fid,
					cls: metrics.cls,
					ttfb: metrics.ttfb,
					cache_hit_rate: metrics.cacheHitRate,
				});
			}

			// Store metrics in localStorage for debugging
			localStorage.setItem("pwa-performance-metrics", JSON.stringify(metrics));
		}, 10000);

		return () => {
			paintObserver.disconnect();
			lcpObserver.disconnect();
			fidObserver.disconnect();
			clsObserver.disconnect();
		};
	}, []);
}

function logMetric(name: string, value: number) {
	console.log(`[PWA Performance] ${name}: ${value.toFixed(2)}ms`);

	// Color code based on thresholds
	const getColor = (metricName: string, val: number) => {
		const thresholds: Record<string, { good: number; needs: number }> = {
			FCP: { good: 1800, needs: 3000 },
			LCP: { good: 2500, needs: 4000 },
			FID: { good: 100, needs: 300 },
			CLS: { good: 0.1, needs: 0.25 },
			TTFB: { good: 800, needs: 1800 },
		};

		const threshold = thresholds[metricName];
		if (!threshold) return "gray";

		if (val <= threshold.good) return "green";
		if (val <= threshold.needs) return "orange";
		return "red";
	};

	const color = getColor(name, value);
	console.log(
		`%c[PWA] ${name} is ${color}`,
		`color: ${color}; font-weight: bold;`
	);
}

/**
 * Hook to get stored performance metrics
 */
export function usePerformanceMetrics() {
	if (typeof window === "undefined") return null;

	const stored = localStorage.getItem("pwa-performance-metrics");
	return stored ? JSON.parse(stored) : null;
}
