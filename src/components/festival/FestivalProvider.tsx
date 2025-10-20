/**
 * Festival Provider Component
 * Main wrapper that manages all festival components
 */

"use client";

import FestivalBanner from "./FestivalBanner";
import FestivalFireworks from "./FestivalFireworks";
import DiyaDecorations from "./DiyaDecorations";
import FestivalWelcomeModal from "./FestivalWelcomeModal";
import { useFestival } from "@/hooks/useFestival";

export default function FestivalProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isActive, isLoading } = useFestival();

	if (isLoading) {
		return <>{children}</>;
	}

	return (
		<>
			{children}
			{isActive && (
				<>
					<FestivalWelcomeModal />
					<FestivalBanner />
					<FestivalFireworks />
					<DiyaDecorations />
				</>
			)}
		</>
	);
}
