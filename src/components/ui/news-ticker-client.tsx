"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";

type NewsItem = {
	icon: string;
	text: string;
	type: "event" | "facility" | "achievement" | "announcement";
};

export function NewsTickerClient({ newsItems }: { newsItems: NewsItem[] }) {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (newsItems.length === 0) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % newsItems.length);
		}, 4000);

		return () => clearInterval(interval);
	}, [newsItems.length]);

	if (newsItems.length === 0) return null;

	return (
		<section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-3 md:py-4 overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20">
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
					animate={{ x: ["-100%", "100%"] }}
					transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
				/>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<div className="flex items-center gap-4">
					{/* News Icon */}
					<div className="flex items-center gap-2 shrink-0">
						<div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
							<Megaphone className="w-4 h-4 md:w-5 md:h-5" />
						</div>
						<span className="font-semibold text-sm md:text-base whitespace-nowrap">
							📢 Latest News:
						</span>
					</div>

					{/* News Content */}
					<div className="flex-1 overflow-hidden">
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.5 }}
							className="flex items-center gap-2"
						>
							<span className="text-lg shrink-0">
								{newsItems[currentIndex].icon}
							</span>
							<span className="text-sm md:text-base font-medium truncate">
								{newsItems[currentIndex].text}
							</span>
						</motion.div>
					</div>

					{/* Indicators */}
					<div className="hidden sm:flex items-center gap-1 shrink-0">
						{newsItems.map((_, index) => (
							<motion.div
								key={index}
								className={`w-2 h-2 rounded-full transition-all duration-300 ${
									index === currentIndex
										? "bg-white scale-125"
										: "bg-white/40 hover:bg-white/60"
								}`}
								whileHover={{ scale: 1.2 }}
								onClick={() => setCurrentIndex(index)}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
