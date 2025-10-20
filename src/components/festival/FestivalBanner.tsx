/**
 * Festival Banner Component
 * Displays a celebratory banner at the top of the page during festivals
 */

"use client";

import { useFestival } from "@/hooks/useFestival";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function FestivalBanner() {
	const { activeFestival, isActive } = useFestival();
	const [showBanner, setShowBanner] = useState(true);

	if (!isActive || !activeFestival || !showBanner) return null;

	return (
		<div
			className="fixed top-0 left-0 right-0 z-[9998] animate-slide-down"
			style={{
				background: `linear-gradient(135deg, ${activeFestival.colors.primary}, ${activeFestival.colors.secondary})`,
			}}
		>
			<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-3 flex-1">
					<div className="hidden md:block">
						<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse relative">
							<Image
								src="/images/diya.svg"
								alt="Diya"
								width={28}
								height={28}
								className="object-contain"
							/>
						</div>
					</div>
					<div className="flex-1">
						<p className="font-bold text-white text-sm md:text-base drop-shadow-lg">
							{activeFestival.greeting}
						</p>
						<p className="text-white/90 text-xs hidden md:block">
							{activeFestival.description}
						</p>
					</div>
				</div>

				<button
					onClick={() => setShowBanner(false)}
					className="ml-4 p-2 rounded-full hover:bg-white/20 transition-all text-white"
					aria-label="Close festival banner"
				>
					<X className="w-5 h-5" />
				</button>
			</div>

			{/* Decorative bottom border */}
			<div
				className="h-1 w-full"
				style={{
					background: `linear-gradient(90deg, ${activeFestival.colors.accent}, ${activeFestival.colors.secondary}, ${activeFestival.colors.accent})`,
				}}
			/>
		</div>
	);
}
