/**
 * Festival Configuration
 * Manages festival dates and themes
 */

export interface Festival {
	id: string;
	name: string;
	startDate: string; // YYYY-MM-DD
	endDate: string; // YYYY-MM-DD
	colors: {
		primary: string;
		secondary: string;
		accent: string;
		background: string;
	};
	greeting: string;
	description: string;
	enabled: boolean;
	yearlyDates?: Array<{ year: number; startDate: string; endDate: string }>; // Optional: dates for multiple years
}

export const FESTIVALS: Record<string, Festival> = {
	diwali: {
		id: "diwali",
		name: "Diwali",
		startDate: "2025-10-20", // Default/fallback dates
		endDate: "2025-10-24",
		yearlyDates: [
			// Add dates for multiple years - Diwali varies each year
			{ year: 2025, startDate: "2025-10-20", endDate: "2025-10-24" },
			{ year: 2026, startDate: "2026-11-08", endDate: "2026-11-12" },
			{ year: 2027, startDate: "2027-10-28", endDate: "2027-11-01" },
			{ year: 2028, startDate: "2028-10-16", endDate: "2028-10-20" },
			{ year: 2029, startDate: "2029-11-04", endDate: "2029-11-08" },
			{ year: 2030, startDate: "2030-10-24", endDate: "2030-10-28" },
		],
		colors: {
			primary: "#FF9933", // Orange
			secondary: "#FFD700", // Gold
			accent: "#FF6600", // Deep Orange
			background: "rgba(255, 153, 51, 0.05)",
		},
		greeting: "✨ Happy Diwali 2025! ✨",
		description:
			"May the festival of lights bring joy, prosperity, and success to our entire school community!",
		enabled: true,
	},
	chhath: {
		id: "chhath",
		name: "Chhath Puja",
		startDate: "2025-11-07", // Default/fallback dates
		endDate: "2025-11-09",
		yearlyDates: [
			// Chhath Puja dates for multiple years (6 days after Diwali)
			{ year: 2025, startDate: "2025-11-07", endDate: "2025-11-09" },
			{ year: 2026, startDate: "2026-11-25", endDate: "2026-11-27" },
			{ year: 2027, startDate: "2027-11-14", endDate: "2027-11-16" },
			{ year: 2028, startDate: "2028-11-02", endDate: "2028-11-04" },
			{ year: 2029, startDate: "2029-11-21", endDate: "2029-11-23" },
			{ year: 2030, startDate: "2030-11-10", endDate: "2030-11-12" },
		],
		colors: {
			primary: "#FFA500", // Saffron
			secondary: "#FFE5B4", // Peach
			accent: "#FF8C00", // Dark Orange
			background: "rgba(255, 165, 0, 0.05)",
		},
		greeting: "🌅 Happy Chhath Puja! 🌅",
		description:
			"Wishing everyone a blessed Chhath Puja filled with devotion, health, and happiness!",
		enabled: true,
	},
};

/**
 * Check if a festival is currently active
 * Now supports yearly dates for automatic year-to-year activation
 */
export function getActiveFestival(): Festival | null {
	const today = new Date();
	const currentYear = today.getFullYear();
	today.setHours(0, 0, 0, 0);

	for (const festival of Object.values(FESTIVALS)) {
		if (!festival.enabled) continue;

		// First, check if there are yearly dates defined for current year
		if (festival.yearlyDates && festival.yearlyDates.length > 0) {
			const yearlyDate = festival.yearlyDates.find(
				(yd) => yd.year === currentYear
			);

			if (yearlyDate) {
				const startDate = new Date(yearlyDate.startDate);
				const endDate = new Date(yearlyDate.endDate);
				startDate.setHours(0, 0, 0, 0);
				endDate.setHours(23, 59, 59, 999);

				if (today >= startDate && today <= endDate) {
					// Update greeting with current year
					return {
						...festival,
						greeting: festival.greeting.replace(
							/\d{4}/,
							currentYear.toString()
						),
					};
				}
				continue; // Move to next festival if this year's date doesn't match
			}
		}

		// Fallback to default startDate/endDate if no yearly dates match
		const startDate = new Date(festival.startDate);
		const endDate = new Date(festival.endDate);
		startDate.setHours(0, 0, 0, 0);
		endDate.setHours(23, 59, 59, 999);

		if (today >= startDate && today <= endDate) {
			return festival;
		}
	}

	return null;
}

/**
 * Check if user has dismissed the festival modal
 */
export function hasDismissedFestival(festivalId: string): boolean {
	if (typeof window === "undefined") return false;
	const dismissed = localStorage.getItem(`festival_dismissed_${festivalId}`);
	return dismissed === "true";
}

/**
 * Mark festival modal as dismissed
 */
export function dismissFestival(festivalId: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(`festival_dismissed_${festivalId}`, "true");
}

/**
 * Get festival preference (animations enabled/disabled)
 */
export function getFestivalPreference(): boolean {
	if (typeof window === "undefined") return true;
	const pref = localStorage.getItem("festival_animations_enabled");
	return pref !== "false"; // Default to true
}

/**
 * Set festival preference
 */
export function setFestivalPreference(enabled: boolean): void {
	if (typeof window === "undefined") return;
	localStorage.setItem("festival_animations_enabled", enabled.toString());
}
