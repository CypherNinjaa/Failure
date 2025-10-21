/**
 * useFestival Hook
 * Manages festival state and preferences
 */

import { useEffect, useState } from "react";
import {
	getActiveFestival,
	hasDismissedFestival,
	dismissFestival as dismissFestivalConfig,
	getFestivalPreference,
	setFestivalPreference,
	Festival,
} from "@/lib/festivalConfig";

const FESTIVAL_DISPLAY_DURATION = 60 * 1000; // 1 minute in milliseconds

export function useFestival() {
	const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
	const [isModalDismissed, setIsModalDismissed] = useState(true);
	const [animationsEnabled, setAnimationsEnabled] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [isTimeExpired, setIsTimeExpired] = useState(false);

	useEffect(() => {
		// Check for active festival
		const festival = getActiveFestival();
		setActiveFestival(festival);

		if (festival) {
			// Check if modal was dismissed
			const dismissed = hasDismissedFestival(festival.id);
			setIsModalDismissed(dismissed);

			// Check animation preference
			const prefEnabled = getFestivalPreference();
			setAnimationsEnabled(prefEnabled);

			// Set timer to disable festival effects after 1 minute
			const timer = setTimeout(() => {
				setIsTimeExpired(true);
				console.log("[Festival] Display duration expired (1 minute)");
			}, FESTIVAL_DISPLAY_DURATION);

			// Cleanup timer on unmount
			return () => clearTimeout(timer);
		}

		setIsLoading(false);
	}, []);

	const dismissModal = () => {
		if (activeFestival) {
			dismissFestivalConfig(activeFestival.id);
			setIsModalDismissed(true);
		}
	};

	const toggleAnimations = () => {
		const newState = !animationsEnabled;
		setAnimationsEnabled(newState);
		setFestivalPreference(newState);
	};

	return {
		activeFestival,
		isActive: !!activeFestival && !isTimeExpired, // Only active if festival exists AND time hasn't expired
		isModalDismissed,
		animationsEnabled,
		isLoading,
		dismissModal,
		toggleAnimations,
		isTimeExpired, // Expose for debugging
	};
}
