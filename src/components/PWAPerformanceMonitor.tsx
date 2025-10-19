/**
 * PWA Performance Client Component
 * Initializes performance monitoring on client side
 */

"use client";

import { usePWAPerformance } from "@/hooks/usePWAPerformance";

export default function PWAPerformanceMonitor() {
	usePWAPerformance();
	return null;
}
