/**
 * Festival Diya Decorations
 * Animated diya lamps in corners with glowing effect
 */

"use client";

import { useFestival } from "@/hooks/useFestival";
import Image from "next/image";

export default function DiyaDecorations() {
	const { activeFestival, isActive, animationsEnabled } = useFestival();

	if (!isActive || !animationsEnabled || !activeFestival) return null;

	return (
		<>
			{/* Top Left Diya */}
			<div className="fixed top-20 left-4 z-[9996] animate-float">
				<div className="relative w-16 h-16 md:w-20 md:h-20">
					<div
						className="absolute inset-0 blur-xl opacity-50 animate-pulse"
						style={{ backgroundColor: activeFestival.colors.secondary }}
					/>
					<Image
						src="/images/diya.svg"
						alt="Diya lamp"
						fill
						className="relative drop-shadow-2xl object-contain"
					/>
				</div>
			</div>

			{/* Top Right Diya */}
			<div className="fixed top-20 right-4 z-[9996] animate-float animation-delay-1000">
				<div className="relative w-16 h-16 md:w-20 md:h-20">
					<div
						className="absolute inset-0 blur-xl opacity-50 animate-pulse"
						style={{ backgroundColor: activeFestival.colors.accent }}
					/>
					<Image
						src="/images/diya.svg"
						alt="Diya lamp"
						fill
						className="relative drop-shadow-2xl object-contain"
					/>
				</div>
			</div>

			{/* Bottom Left Diya */}
			<div className="fixed bottom-6 left-4 z-[9996] animate-float animation-delay-2000">
				<div className="relative w-16 h-16 md:w-20 md:h-20">
					<div
						className="absolute inset-0 blur-xl opacity-50 animate-pulse"
						style={{ backgroundColor: activeFestival.colors.primary }}
					/>
					<Image
						src="/images/diya.svg"
						alt="Diya lamp"
						fill
						className="relative drop-shadow-2xl object-contain"
					/>
				</div>
			</div>

			{/* Bottom Right Diya */}
			<div className="fixed bottom-6 right-4 z-[9996] animate-float animation-delay-3000">
				<div className="relative w-16 h-16 md:w-20 md:h-20">
					<div
						className="absolute inset-0 blur-xl opacity-50 animate-pulse"
						style={{ backgroundColor: activeFestival.colors.secondary }}
					/>
					<Image
						src="/images/diya.svg"
						alt="Diya lamp"
						fill
						className="relative drop-shadow-2xl object-contain"
					/>
				</div>
			</div>

			{/* Floating particles */}
			<div className="fixed inset-0 pointer-events-none z-[9995] overflow-hidden">
				{[...Array(15)].map((_, i) => (
					<div
						key={i}
						className="absolute w-2 h-2 rounded-full animate-float-up opacity-60"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${100 + Math.random() * 20}%`,
							backgroundColor: activeFestival.colors.accent,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${10 + Math.random() * 10}s`,
						}}
					/>
				))}
			</div>
		</>
	);
}
