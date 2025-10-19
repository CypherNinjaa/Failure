"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	Calendar,
	MapPin,
	Clock,
	Users,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function EventsSection() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const upcomingEvents = [
		{
			id: 1,
			title: "Annual Sports Day",
			date: "March 15, 2025",
			time: "9:00 AM - 4:00 PM",
			location: "School Playground",
			attendees: 500,
			emoji: "🏃‍♂️",
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			id: 2,
			title: "Science Exhibition",
			date: "March 22, 2025",
			time: "10:00 AM - 2:00 PM",
			location: "Science Lab",
			attendees: 200,
			emoji: "🔬",
			gradient: "from-purple-500 to-pink-500",
		},
		{
			id: 3,
			title: "Cultural Festival",
			date: "March 28, 2025",
			time: "6:00 PM - 9:00 PM",
			location: "Main Auditorium",
			attendees: 800,
			emoji: "🎭",
			gradient: "from-green-500 to-emerald-500",
		},
	];

	// Auto-play carousel on mobile
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % upcomingEvents.length);
		}, 4000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, upcomingEvents.length]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % upcomingEvents.length);
		setIsAutoPlaying(false);
	};

	const prevSlide = () => {
		setCurrentSlide(
			(prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length
		);
		setIsAutoPlaying(false);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
	};

	const calendarDays = Array.from({ length: 35 }, (_, i) => {
		const day = i - 6;
		const isCurrentMonth = day > 0 && day <= 31;
		const isEvent = [15, 22, 28].includes(day);
		const isToday = day === 8;

		return {
			day: isCurrentMonth ? day : null,
			isEvent,
			isToday,
		};
	});

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
						📅 Upcoming Events
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Stay updated with all the exciting activities and events happening
						at our school this month.
					</p>
				</motion.div>

				{/* Mobile Carousel View */}
				<div className="block md:hidden">
					<div className="relative max-w-sm mx-auto mb-8">
						{/* Carousel Container */}
						<div className="overflow-hidden rounded-3xl">
							<motion.div
								className="flex transition-transform duration-500 ease-in-out"
								style={{ transform: `translateX(-${currentSlide * 100}%)` }}
							>
								{upcomingEvents.map((event, index) => (
									<motion.div
										key={event.id}
										className="w-full flex-shrink-0 px-2"
										initial={{ opacity: 0, scale: 0.9 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
										viewport={{ once: true }}
									>
										<div
											className={`relative bg-card border border-border rounded-3xl p-6 shadow-lg transition-all duration-500 overflow-hidden`}
										>
											{/* Background decoration */}
											<div className="absolute top-0 right-0 w-20 h-20 opacity-10">
												<div
													className={`w-full h-full bg-gradient-to-br ${event.gradient} rounded-full blur-xl`}
												/>
											</div>

											<div className="relative z-10">
												{/* Event Icon */}
												<div className="text-center mb-4">
													<div
														className={`inline-flex w-16 h-16 bg-gradient-to-br ${event.gradient} rounded-2xl items-center justify-center shadow-lg transition-transform duration-300`}
													>
														<span className="text-2xl">{event.emoji}</span>
													</div>
												</div>

												{/* Event Details */}
												<div className="text-center">
													<h3 className="text-xl font-bold text-foreground mb-3">
														{event.title}
													</h3>

													<div className="space-y-2 mb-4">
														<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
															<Calendar className="w-4 h-4" />
															<span>{event.date}</span>
														</div>
														<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
															<Clock className="w-4 h-4" />
															<span>{event.time}</span>
														</div>
														<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
															<MapPin className="w-4 h-4" />
															<span>{event.location}</span>
														</div>
														<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
															<Users className="w-4 h-4" />
															<span>{event.attendees} attendees</span>
														</div>
													</div>

													<Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
														Register Now
													</Button>
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
							{upcomingEvents.map((_, index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									className={`w-3 h-3 rounded-full transition-all duration-300 ${
										currentSlide === index
											? "bg-blue-500 w-8"
											: "bg-muted hover:bg-muted-foreground/30"
									}`}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Desktop Grid View */}
				<div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
					{/* Events List */}
					<div className="space-y-6">
						{upcomingEvents.map((event, index) => (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, x: -30 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{ x: 8, scale: 1.02 }}
								className="group"
							>
								<div
									className={`relative bg-card border border-border rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}
								>
									{/* Background decoration */}
									<div className="absolute top-0 right-0 w-20 h-20 opacity-10">
										<div
											className={`w-full h-full bg-gradient-to-br ${event.gradient} rounded-full blur-xl`}
										/>
									</div>

									<div className="relative z-10 flex items-start gap-4">
										{/* Event Icon */}
										<div
											className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${event.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
										>
											<span className="text-2xl">{event.emoji}</span>
										</div>

										{/* Event Details */}
										<div className="flex-1 min-w-0">
											<h3 className="text-xl font-bold text-foreground mb-2 group-hover:opacity-80 transition-opacity">
												{event.title}
											</h3>

											<div className="space-y-2">
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Calendar className="w-4 h-4" />
													<span>{event.date}</span>
												</div>

												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Clock className="w-4 h-4" />
													<span>{event.time}</span>
												</div>

												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<MapPin className="w-4 h-4" />
													<span>{event.location}</span>
												</div>

												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Users className="w-4 h-4" />
													<span>{event.attendees}+ expected attendees</span>
												</div>
											</div>

											<Button
												size="sm"
												className="mt-4 bg-muted/50 hover:bg-muted text-foreground border-0"
											>
												Learn More
											</Button>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>

					{/* Calendar Widget */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						viewport={{ once: true }}
						className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl"
					>
						<h3 className="text-2xl font-bold text-foreground mb-6 text-center">
							March 2025
						</h3>

						{/* Calendar Header */}
						<div className="grid grid-cols-7 gap-2 mb-4">
							{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
								<div
									key={day}
									className="p-3 text-center font-semibold text-muted-foreground text-sm"
								>
									{day}
								</div>
							))}
						</div>

						{/* Calendar Grid */}
						<div className="grid grid-cols-7 gap-2">
							{calendarDays.map((dayData, index) => (
								<motion.div
									key={index}
									whileHover={dayData.day ? { scale: 1.1 } : {}}
									className={`
                    aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                    ${
											dayData.day
												? dayData.isToday
													? "bg-blue-600 text-white shadow-lg"
													: dayData.isEvent
													? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
													: "text-foreground hover:bg-muted"
												: "text-muted-foreground"
										}
                  `}
								>
									{dayData.day}
								</motion.div>
							))}
						</div>

						{/* Legend */}
						<div className="mt-6 pt-6 border-t border-border">
							<div className="space-y-2 text-xs">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 bg-blue-600 rounded-full"></div>
									<span className="text-muted-foreground">Today</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
									<span className="text-muted-foreground">Events</span>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
