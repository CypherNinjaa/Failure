"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
	Users,
	BookOpen,
	Trophy,
	Star,
	Award,
	GraduationCap,
	Building,
	Calendar,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

// Icon mapping
const iconMap: { [key: string]: any } = {
	Users,
	BookOpen,
	Trophy,
	Star,
	Award,
	GraduationCap,
	Building,
	Calendar,
};

interface CounterProps {
	end: number;
	duration?: number;
	suffix?: string;
}

function AnimatedCounter({ end, suffix = "" }: CounterProps) {
	return (
		<div className="text-4xl md:text-5xl font-black">
			{end}
			{suffix}
		</div>
	);
}

interface StatItemType {
	value: number;
	suffix: string;
	label: string;
	emoji: string;
	iconName: string;
	gradient: string;
}

export default function StatsClient({ stats }: { stats: StatItemType[] }) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	const formattedStats = stats.map((stat) => ({
		icon: iconMap[stat.iconName] || Users,
		value: Number(stat.value) || 0,
		suffix: stat.suffix || "",
		label: stat.label,
		emoji: stat.emoji,
		gradient: stat.gradient,
	}));

	// Auto-play carousel on mobile
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % formattedStats.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, formattedStats.length]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % formattedStats.length);
		setIsAutoPlaying(false);
	};

	const prevSlide = () => {
		setCurrentSlide(
			(prev) => (prev - 1 + formattedStats.length) % formattedStats.length
		);
		setIsAutoPlaying(false);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
	};

	const StatCard = ({ stat }: { stat: (typeof formattedStats)[0] }) => (
		<div
			className={`relative bg-card border border-border rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}
		>
			{/* Background decoration */}
			<div className="absolute -top-4 -right-4 w-16 h-16 opacity-10">
				<div
					className={`w-full h-full bg-gradient-to-br ${stat.gradient} rounded-full blur-lg`}
				/>
			</div>

			{/* Icon */}
			<div className="relative z-10 text-center">
				<div
					className={`inline-flex p-3 md:p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 mb-4`}
				>
					<stat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
				</div>

				{/* Counter */}
				<div
					className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
				>
					<AnimatedCounter end={stat.value} suffix={stat.suffix} />
				</div>

				{/* Label */}
				<div className="text-sm md:text-base font-semibold text-muted-foreground mb-2">
					{stat.label}
				</div>

				{/* Emoji */}
				<div className="text-2xl md:text-3xl hover:scale-110 transition-transform duration-300">
					{stat.emoji}
				</div>
			</div>

			{/* Shine effect */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
		</div>
	);

	return (
		<section className="py-16 md:py-24 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
						<Image
							src="/chart.png"
							alt="chart"
							width={40}
							height={40}
							className="inline-block mr-2"
						/>{" "}
						Our Impact in Numbers
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						These numbers represent our commitment to excellence and the trust
						our community places in us.
					</p>
				</div>

				{/* Mobile Carousel View */}
				<div className="block md:hidden">
					<div className="relative max-w-sm mx-auto">
						{/* Carousel Container */}
						<div className="overflow-hidden rounded-3xl">
							<motion.div
								className="flex transition-transform duration-300 ease-in-out"
								style={{ transform: `translateX(-${currentSlide * 100}%)` }}
							>
								{formattedStats.map((stat, index) => (
									<motion.div
										key={stat.label}
										className="w-full flex-shrink-0 px-2"
										initial={{ opacity: 0, scale: 0.9 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
										viewport={{ once: true }}
									>
										<StatCard stat={stat} />
									</motion.div>
								))}
							</motion.div>
						</div>

						{/* Navigation Buttons */}
						<button
							onClick={prevSlide}
							className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-card p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
						>
							<ChevronLeft className="w-5 h-5 text-muted-foreground" />
						</button>
						<button
							onClick={nextSlide}
							className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-card p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
						>
							<ChevronLeft className="w-5 h-5 text-muted-foreground" />
						</button>

						{/* Dots Indicator */}
						<div className="flex justify-center mt-6 space-x-2">
							{formattedStats.map((_, index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									className={`w-3 h-3 rounded-full transition-all duration-300 ${
										currentSlide === index
											? "bg-blue-500 w-8"
											: "bg-muted hover:bg-muted/80"
									}`}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Desktop Grid View */}
				<div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
					{formattedStats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 30, scale: 0.9 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -8, scale: 1.05 }}
							className="group"
						>
							<StatCard stat={stat} />
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
