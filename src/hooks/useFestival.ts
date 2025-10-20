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

export function useFestival() {
	const [activeFestival, setActiveFestival] = useState<Festival | null>(null);
	const [isModalDismissed, setIsModalDismissed] = useState(true);
	const [animationsEnabled, setAnimationsEnabled] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

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
		isActive: !!activeFestival,
		isModalDismissed,
		animationsEnabled,
		isLoading,
		dismissModal,
		toggleAnimations,
	};
}
