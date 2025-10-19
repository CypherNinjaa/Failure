"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
	Users,
	BookOpen,
	Trophy,
	Star,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

interface CounterProps {
	end: number;
	duration?: number;
	suffix?: string;
}

function AnimatedCounter({ end, duration = 2, suffix = "" }: CounterProps) {
	const [count, setCount] = useState(0);
	const [hasAnimated, setHasAnimated] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.5 });

	useEffect(() => {
		if (!isInView || hasAnimated) return;

		setHasAnimated(true);
		let startTime: number;
		let animationFrame: number;

		const animate = (currentTime: number) => {
			if (!startTime) startTime = currentTime;
			const progress = Math.min(
				(currentTime - startTime) / (duration * 1000),
				1
			);

			setCount(Math.floor(progress * end));

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);

		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	}, [isInView, end, duration, hasAnimated]);

	return (
		<div ref={ref} className="text-4xl md:text-5xl font-black">
			{count}
			{suffix}
		</div>
	);
}

export function StatsSection() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const stats = [
		{
			icon: Users,
			value: 1200,
			suffix: "+",
			label: "Happy Students",
			emoji: "🎓",
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			icon: BookOpen,
			value: 80,
			suffix: "+",
			label: "Expert Teachers",
			emoji: "👨‍🏫",
			gradient: "from-purple-500 to-pink-500",
		},
		{
			icon: Trophy,
			value: 15,
			suffix: "+",
			label: "Years Excellence",
			emoji: "🏆",
			gradient: "from-green-500 to-emerald-500",
		},
		{
			icon: Star,
			value: 95,
			suffix: "%",
			label: "Success Rate",
			emoji: "⭐",
			gradient: "from-orange-500 to-red-500",
		},
	];

	// Auto-play carousel on mobile
	useEffect(() => {
		if (!mounted || !isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % stats.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, stats.length, mounted]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % stats.length);
		setIsAutoPlaying(false);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + stats.length) % stats.length);
		setIsAutoPlaying(false);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
	};

	const StatCard = ({ stat }: { stat: (typeof stats)[0] }) => (
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
				{mounted && (
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
							📊 Our Impact in Numbers
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							These numbers represent our commitment to excellence and the trust
							our community places in us.
						</p>
					</motion.div>
				)}

				{!mounted && (
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
							📊 Our Impact in Numbers
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							These numbers represent our commitment to excellence and the trust
							our community places in us.
						</p>
					</div>
				)}

				{/* Mobile Carousel View */}
				<div className="block md:hidden">
					<div className="relative max-w-sm mx-auto">
						{/* Carousel Container */}
						<div className="overflow-hidden rounded-3xl">
							<motion.div
								className="flex transition-transform duration-300 ease-in-out"
								style={{ transform: `translateX(-${currentSlide * 100}%)` }}
							>
								{stats.map((stat, index) => (
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
							<ChevronRight className="w-5 h-5 text-muted-foreground" />
						</button>

						{/* Dots Indicator */}
						<div className="flex justify-center mt-6 space-x-2">
							{stats.map((_, index) => (
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
					{stats.map((stat, index) => (
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
