"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
	id: number;
	name: string;
	role: string;
	avatar: string;
	content: string;
	rating: number;
	gradient: string;
}

interface TestimonialsSectionClientProps {
	testimonials: Testimonial[];
}

export default function TestimonialsSectionClient({
	testimonials,
}: TestimonialsSectionClientProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	if (!testimonials || testimonials.length === 0) {
		return (
			<section className="py-16 md:py-24 bg-muted/30">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="text-center"
					>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
							💬 What People Say About Us
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
							No testimonials available yet. Be the first to share your
							experience!
						</p>

						{/* Share Your Experience Button */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							viewport={{ once: true }}
							className="mt-8"
						>
							<a
								href="/submit-testimonial"
								className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
							>
								<span className="text-2xl">✨</span>
								Share Your Experience
							</a>
							<p className="text-sm text-muted-foreground mt-3">
								Your feedback helps us improve and inspires others!
							</p>
						</motion.div>
					</motion.div>
				</div>
			</section>
		);
	}

	const nextTestimonial = () => {
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setCurrentIndex(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length
		);
	};

	const currentTestimonial = testimonials[currentIndex];

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
						💬 What People Say About Us
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Real experiences from our school community members who have
						witnessed our commitment to excellence.
					</p>
				</motion.div>

				{/* Main Testimonial Card */}
				<div className="max-w-4xl mx-auto">
					<motion.div
						key={currentIndex}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						className={`relative bg-gradient-to-br ${currentTestimonial.gradient} rounded-3xl p-8 md:p-12 shadow-2xl`}
					>
						{/* Quote Icon */}
						<div className="absolute top-8 left-8 opacity-20">
							<Quote className="w-16 h-16 text-white" />
						</div>

						<div className="relative z-10">
							{/* Rating Stars */}
							<div className="flex justify-center gap-1 mb-6">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-6 h-6 ${
											i < currentTestimonial.rating
												? "fill-yellow-400 text-yellow-400"
												: "text-white/30"
										}`}
									/>
								))}
							</div>
							{/* Testimonial Content */}
							<p className="text-lg md:text-xl text-white text-center mb-8 leading-relaxed">
								&ldquo;{currentTestimonial.content}&rdquo;
							</p>{" "}
							{/* Author Info */}
							<div className="flex items-center justify-center gap-4">
								<div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
									{currentTestimonial.avatar}
								</div>
								<div className="text-left">
									<h4 className="text-xl font-bold text-white">
										{currentTestimonial.name}
									</h4>
									<p className="text-white/80">{currentTestimonial.role}</p>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Navigation Controls */}
					{testimonials.length > 1 && (
						<div className="flex items-center justify-center gap-4 mt-8">
							<button
								onClick={prevTestimonial}
								className="p-3 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
							>
								<ChevronLeft className="w-6 h-6 text-foreground" />
							</button>

							{/* Dots Indicator */}
							<div className="flex gap-2">
								{testimonials.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentIndex(index)}
										className={`transition-all duration-300 rounded-full ${
											index === currentIndex
												? "w-8 h-3 bg-blue-500"
												: "w-3 h-3 bg-muted hover:bg-muted-foreground/30"
										}`}
									/>
								))}
							</div>

							<button
								onClick={nextTestimonial}
								className="p-3 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
							>
								<ChevronRight className="w-6 h-6 text-foreground" />
							</button>
						</div>
					)}
				</div>

				{/* Testimonial Grid (Desktop) */}
				{testimonials.length > 3 && (
					<div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
						{testimonials.slice(0, 3).map((testimonial, index) => (
							<motion.div
								key={testimonial.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{ y: -8 }}
								className={`bg-gradient-to-br ${testimonial.gradient} rounded-2xl p-6 shadow-lg cursor-pointer`}
								onClick={() => setCurrentIndex(index)}
							>
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
										{testimonial.avatar}
									</div>
									<div>
										<h5 className="font-bold text-white">{testimonial.name}</h5>
										<p className="text-sm text-white/80">{testimonial.role}</p>
									</div>
								</div>
								<div className="flex gap-1 mb-3">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${
												i < testimonial.rating
													? "fill-yellow-400 text-yellow-400"
													: "text-white/30"
											}`}
										/>
									))}
								</div>
								<p className="text-sm text-white/90 line-clamp-3">
									{testimonial.content}
								</p>
							</motion.div>
						))}
					</div>
				)}

				{/* Share Your Experience Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<a
						href="/submit-testimonial"
						className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
					>
						<span className="text-2xl">✨</span>
						Share Your Experience
					</a>
					<p className="text-sm text-muted-foreground mt-3">
						Your feedback helps us improve and inspires others!
					</p>
				</motion.div>
			</div>
		</section>
	);
}
