"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export function TestimonialsSection() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const testimonials = [
		{
			id: 1,
			name: "Mr. & Mrs. Sharma",
			role: "Parent - Grade 8",
			avatar: "👨‍👩‍👧",
			content:
				"The digital learning platform has transformed how our daughter studies. The gamification keeps her engaged and motivated!",
			rating: 5,
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			id: 2,
			name: "Ananya Patel",
			role: "Student - Grade 10",
			avatar: "🎓",
			content:
				"The MCQ tests and instant feedback help me understand my progress. I love collecting badges for achievements!",
			rating: 5,
			gradient: "from-purple-500 to-pink-500",
		},
		{
			id: 3,
			name: "Ms. Priya Singh",
			role: "Mathematics Teacher",
			avatar: "👨‍🏫",
			content:
				"The teacher portal makes managing classes effortless. Student analytics help me personalize learning for each child.",
			rating: 5,
			gradient: "from-green-500 to-emerald-500",
		},
	];

	// Auto-play carousel on mobile
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % testimonials.length);
		}, 5000); // Slower for reading testimonials

		return () => clearInterval(interval);
	}, [isAutoPlaying, testimonials.length]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % testimonials.length);
		setIsAutoPlaying(false);
	};

	const prevSlide = () => {
		setCurrentSlide(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length
		);
		setIsAutoPlaying(false);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
	};

	return (
		<section className="py-16 md:py-24 bg-background">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
						💬 What Our Family Says
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Hear from our parents, students, and teachers about their amazing
						experience with our school community.
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
								{testimonials.map((testimonial, index) => (
									<motion.div
										key={testimonial.id}
										className="w-full flex-shrink-0 px-2"
										initial={{ opacity: 0, scale: 0.9 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
										viewport={{ once: true }}
									>
										<div className="relative bg-card/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl transition-all duration-500 border border-border/50 overflow-hidden">
											{/* Quote Icon */}
											<div className="absolute top-4 right-4 opacity-10">
												<Quote className="w-12 h-12 text-muted-foreground" />
											</div>

											{/* Header */}
											<div className="flex items-center mb-6">
												<div
													className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center mr-4 transition-transform duration-300 shadow-lg`}
												>
													<span className="text-xl">{testimonial.avatar}</span>
												</div>
												<div>
													<h4 className="font-bold text-foreground text-lg">
														{testimonial.name}
													</h4>
													<p className="text-sm text-muted-foreground">
														{testimonial.role}
													</p>
												</div>
											</div>

											{/* Content */}
											<blockquote className="text-foreground leading-relaxed mb-4 italic">
												&ldquo;{testimonial.content}&rdquo;
											</blockquote>

											{/* Rating */}
											<div className="flex items-center">
												{Array.from({ length: testimonial.rating }).map(
													(_, i) => (
														<Star
															key={i}
															className="w-5 h-5 text-yellow-400 fill-current"
														/>
													)
												)}
											</div>
										</div>
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
							{testimonials.map((_, index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									className={`w-3 h-3 rounded-full transition-all duration-300 ${
										currentSlide === index
											? "bg-purple-500 w-8"
											: "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
									}`}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Desktop Grid View */}
				<div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -8, scale: 1.02 }}
							className="group"
						>
							<div className="relative bg-card/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-border/50 overflow-hidden">
								{/* Quote Icon */}
								<div className="absolute top-4 right-4 opacity-10">
									<Quote className="w-12 h-12 text-muted-foreground" />
								</div>

								{/* Header */}
								<div className="flex items-center mb-6">
									<div
										className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
									>
										<span className="text-xl md:text-2xl">
											{testimonial.avatar}
										</span>
									</div>
									<div>
										<h4 className="font-bold text-foreground text-lg">
											{testimonial.name}
										</h4>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{testimonial.role}
										</p>
									</div>
								</div>

								{/* Content */}
								<blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic relative z-10">
									&quot;{testimonial.content}&quot;
								</blockquote>

								{/* Rating */}
								<div className="flex items-center justify-between">
									<div className="flex space-x-1">
										{Array.from({ length: testimonial.rating }, (_, i) => (
											<Star
												key={i}
												className="w-5 h-5 text-yellow-400 fill-current"
											/>
										))}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										Verified Review
									</div>
								</div>

								{/* Hover effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							</div>
						</motion.div>
					))}
				</div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						Join thousands of happy families in our school community
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
					>
						📝 Share Your Experience
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
}
