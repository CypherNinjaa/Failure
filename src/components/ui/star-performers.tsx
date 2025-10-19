"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	Trophy,
	Award,
	Star,
	Crown,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

export function StarPerformers() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const topStudents = [
		{
			id: 1,
			name: "Arjun Sharma",
			grade: "10th Grade",
			achievement: "Science Olympiad Gold",
			badge: "🏆",
			points: 2850,
			rank: 1,
			avatar: "AS",
			gradient: "from-yellow-400 to-orange-500",
		},
		{
			id: 2,
			name: "Priya Patel",
			grade: "9th Grade",
			achievement: "Art Competition Winner",
			badge: "🎨",
			points: 2720,
			rank: 2,
			avatar: "PP",
			gradient: "from-pink-400 to-purple-500",
		},
		{
			id: 3,
			name: "Rahul Kumar",
			grade: "8th Grade",
			achievement: "Academic Excellence",
			badge: "📚",
			points: 2680,
			rank: 3,
			avatar: "RK",
			gradient: "from-blue-400 to-cyan-500",
		},
	];

	// Auto-play carousel on mobile
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % topStudents.length);
		}, 4000); // Slower for reading

		return () => clearInterval(interval);
	}, [isAutoPlaying, topStudents.length]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % topStudents.length);
		setIsAutoPlaying(false);
	};

	const prevSlide = () => {
		setCurrentSlide(
			(prev) => (prev - 1 + topStudents.length) % topStudents.length
		);
		setIsAutoPlaying(false);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
	};

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Crown className="w-5 h-5 text-yellow-500" />;
			case 2:
				return <Trophy className="w-5 h-5 text-gray-400" />;
			case 3:
				return <Award className="w-5 h-5 text-orange-600" />;
			default:
				return <Star className="w-5 h-5 text-blue-500" />;
		}
	};

	const getRankColor = (rank: number) => {
		switch (rank) {
			case 1:
				return "text-yellow-500 bg-yellow-100/50 dark:bg-yellow-500/10";
			case 2:
				return "text-gray-500 bg-gray-100/50 dark:bg-gray-500/10";
			case 3:
				return "text-orange-600 bg-orange-100/50 dark:bg-orange-500/10";
			default:
				return "text-blue-500 bg-blue-100/50 dark:bg-blue-500/10";
		}
	};

	return (
		<section className="py-16 md:py-24 bg-muted/30">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
						🌟 Our Star Performers
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Celebrating excellence and achievements of our outstanding students
						who inspire others to reach for the stars.
					</p>
				</motion.div>

				{/* Mobile Carousel View */}
				<div className="block md:hidden">
					<div className="relative max-w-sm mx-auto">
						{/* Carousel Container */}
						<div className="overflow-hidden rounded-3xl">
							<motion.div
								className="flex transition-transform duration-500 ease-in-out"
								style={{ transform: `translateX(-${currentSlide * 100}%)` }}
							>
								{topStudents.map((student, index) => (
									<motion.div
										key={student.id}
										className="w-full flex-shrink-0 px-2"
										initial={{ opacity: 0, scale: 0.9 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
										viewport={{ once: true }}
									>
										<div
											className={`relative bg-card border border-border rounded-3xl p-6 shadow-xl transition-all duration-500 overflow-hidden`}
										>
											{/* Rank Badge */}
											<div
												className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(
													student.rank
												)}`}
											>
												{getRankIcon(student.rank)}
											</div>

											{/* Background decoration */}
											<div className="absolute -top-6 -right-6 w-24 h-24 opacity-10">
												<div
													className={`w-full h-full bg-gradient-to-br ${student.gradient} rounded-full blur-xl`}
												/>
											</div>

											{/* Content */}
											<div className="relative z-10 text-center">
												{/* Avatar */}
												<div className="relative mb-6">
													<div
														className={`w-20 h-20 bg-gradient-to-br ${student.gradient} rounded-full flex items-center justify-center mx-auto shadow-xl transition-all duration-300`}
													>
														<span className="text-2xl">{student.badge}</span>
													</div>

													{/* Initials overlay */}
													<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background rounded-full border-2 border-border flex items-center justify-center shadow-lg">
														<span className="text-xs font-bold text-foreground">
															{student.avatar}
														</span>
													</div>
												</div>

												{/* Student Info */}
												<h3 className="text-xl font-bold text-foreground mb-2">
													{student.name}
												</h3>

												<p className="text-sm font-semibold text-muted-foreground mb-4">
													{student.grade}
												</p>

												{/* Achievement */}
												<div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-3 mb-4">
													<p className="text-foreground font-medium text-sm">
														{student.achievement}
													</p>
												</div>

												{/* Points and Rank */}
												<div className="flex items-center justify-between">
													<div className="text-left">
														<div className="text-sm text-muted-foreground">
															Points
														</div>
														<div
															className={`text-lg font-black bg-gradient-to-r ${student.gradient} bg-clip-text text-transparent`}
														>
															{student.points.toLocaleString()}
														</div>
													</div>

													<div className="text-right">
														<div className="text-sm text-muted-foreground">
															Rank
														</div>
														<div
															className={`text-lg font-black bg-gradient-to-r ${student.gradient} bg-clip-text text-transparent`}
														>
															#{student.rank}
														</div>
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								))}
							</motion.div>
						</div>

						{/* Navigation Buttons */}
						<button
							onClick={prevSlide}
							className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-background border border-border p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
						>
							<ChevronLeft className="w-5 h-5 text-foreground" />
						</button>
						<button
							onClick={nextSlide}
							className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-background border border-border p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
						>
							<ChevronRight className="w-5 h-5 text-foreground" />
						</button>

						{/* Dots Indicator */}
						<div className="flex justify-center mt-6 space-x-2">
							{topStudents.map((_, index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									className={`w-3 h-3 rounded-full transition-all duration-300 ${
										currentSlide === index
											? "bg-yellow-500 w-8"
											: "bg-muted hover:bg-muted-foreground/30"
									}`}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Desktop Grid View */}
				<div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
					{topStudents.map((student, index) => (
						<motion.div
							key={student.id}
							initial={{ opacity: 0, y: 30, scale: 0.9 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -12, scale: 1.05 }}
							className="group relative"
						>
							<div
								className={`relative bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden`}
							>
								{/* Rank Badge */}
								<div
									className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(
										student.rank
									)}`}
								>
									{getRankIcon(student.rank)}
								</div>

								{/* Background decoration */}
								<div className="absolute -top-6 -right-6 w-24 h-24 opacity-10">
									<div
										className={`w-full h-full bg-gradient-to-br ${student.gradient} rounded-full blur-xl`}
									/>
								</div>

								{/* Content */}
								<div className="relative z-10 text-center">
									{/* Avatar */}
									<div className="relative mb-6">
										<div
											className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${student.gradient} rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
										>
											<span className="text-2xl md:text-3xl">
												{student.badge}
											</span>
										</div>

										{/* Initials overlay for personalization */}
										<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background rounded-full border-2 border-border flex items-center justify-center shadow-lg">
											<span className="text-xs font-bold text-foreground">
												{student.avatar}
											</span>
										</div>
									</div>

									{/* Student Info */}
									<h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:opacity-80 transition-opacity">
										{student.name}
									</h3>

									<p className="text-sm font-semibold text-muted-foreground mb-4">
										{student.grade}
									</p>

									{/* Achievement */}
									<div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-4 mb-4">
										<p className="text-foreground font-medium text-sm">
											{student.achievement}
										</p>
									</div>

									{/* Points and Rank */}
									<div className="flex items-center justify-between">
										<div className="text-left">
											<div className="text-sm text-muted-foreground">
												Points
											</div>
											<div
												className={`text-lg font-black bg-gradient-to-r ${student.gradient} bg-clip-text text-transparent`}
											>
												{student.points.toLocaleString()}
											</div>
										</div>

										<div className="text-right">
											<div className="text-sm text-muted-foreground">Rank</div>
											<div
												className={`text-lg font-black bg-gradient-to-r ${student.gradient} bg-clip-text text-transparent`}
											>
												#{student.rank}
											</div>
										</div>
									</div>
								</div>

								{/* Shine effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
							</div>
						</motion.div>
					))}
				</div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<p className="text-muted-foreground mb-6">
						Join our community of achievers and unlock your potential
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
					>
						🏆 View Full Leaderboard
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
}
