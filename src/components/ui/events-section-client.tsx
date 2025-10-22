"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
	Calendar,
	MapPin,
	Clock,
	Users,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
	id: number;
	title: string;
	description: string;
	startTime: Date;
	endTime: Date;
	classId: number | null;
	class: {
		name: string;
	} | null;
}

interface EventsSectionClientProps {
	events: Event[];
}

export default function EventsSectionClient({
	events,
}: EventsSectionClientProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [selectedDate, setSelectedDate] = useState<number | null>(null);
	const [showEventModal, setShowEventModal] = useState(false);

	// Transform database events to display format
	const gradients = [
		"from-blue-500 to-cyan-500",
		"from-purple-500 to-pink-500",
		"from-green-500 to-emerald-500",
		"from-orange-500 to-red-500",
		"from-pink-500 to-rose-500",
		"from-indigo-500 to-purple-500",
	];

	const emojis = ["🏃‍♂️", "🔬", "🎭", "🎨", "🎵", "📚", "⚽", "🎪", "🌟", "🎉"];

	const upcomingEvents = events.map((event, index) => {
		const startDate = new Date(event.startTime);
		const endDate = new Date(event.endTime);

		// Use event ID to generate a consistent "random-looking" number
		const deterministicAttendees = 100 + ((event.id * 137) % 400);

		return {
			id: event.id,
			title: event.title,
			date: startDate.toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			}),
			time: `${startDate.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			})} - ${endDate.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			})}`,
			location: event.class?.name || "School Campus",
			attendees: deterministicAttendees,
			emoji: emojis[index % emojis.length],
			gradient: gradients[index % gradients.length],
			description: event.description,
		};
	});

	// Auto-play carousel on mobile
	useEffect(() => {
		if (!isAutoPlaying || upcomingEvents.length === 0) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % upcomingEvents.length);
		}, 4000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, upcomingEvents.length]);

	// If no events, show empty state
	if (!events || events.length === 0) {
		return (
			<section className="py-16 md:py-24 bg-background">
				<div className="container mx-auto px-4">
					<div className="text-center">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 flex items-center justify-center gap-2">
							<Image
								src="/event-list.png"
								alt="Events"
								width={40}
								height={40}
								className="inline-block"
							/>
							Upcoming Events
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							No upcoming events scheduled at the moment. Check back later for
							exciting activities!
						</p>
					</div>
				</div>
			</section>
		);
	}

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

	// Get current month and year
	const now = new Date();
	const currentMonth = now.getMonth();
	const currentYear = now.getFullYear();
	const currentDay = now.getDate();

	// Get event dates for the current month
	const eventDates = events
		.filter((event) => {
			const eventDate = new Date(event.startTime);
			return (
				eventDate.getMonth() === currentMonth &&
				eventDate.getFullYear() === currentYear
			);
		})
		.map((event) => new Date(event.startTime).getDate());

	// Get first day of month and total days
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

	// Generate calendar days
	const calendarDays = Array.from({ length: 35 }, (_, i) => {
		const day = i - firstDayOfMonth + 1;
		const isCurrentMonth = day > 0 && day <= daysInMonth;
		const isEvent = eventDates.includes(day);
		const isToday = day === currentDay && isCurrentMonth;

		return {
			day: isCurrentMonth ? day : null,
			isEvent,
			isToday,
		};
	});

	// Get month name
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const currentMonthName = monthNames[currentMonth];

	// Handle calendar date click
	const handleDateClick = (day: number | null, isEvent: boolean) => {
		if (!day || !isEvent) return;

		// Find events for this date
		const eventsOnDate = upcomingEvents.filter((event) => {
			const eventDate = new Date(
				events[upcomingEvents.indexOf(event)].startTime
			);
			return (
				eventDate.getDate() === day &&
				eventDate.getMonth() === currentMonth &&
				eventDate.getFullYear() === currentYear
			);
		});

		if (eventsOnDate.length > 0) {
			setSelectedDate(day);
			setShowEventModal(true);
			// On mobile, scroll to the first event
			if (window.innerWidth < 768) {
				const eventIndex = upcomingEvents.findIndex(
					(e) =>
						new Date(events[upcomingEvents.indexOf(e)].startTime).getDate() ===
						day
				);
				if (eventIndex !== -1) {
					setCurrentSlide(eventIndex);
					setIsAutoPlaying(false);
				}
			}
		}
	};

	// Get events for selected date
	const selectedDateEvents =
		selectedDate !== null
			? upcomingEvents.filter((event) => {
					const eventDate = new Date(
						events[upcomingEvents.indexOf(event)].startTime
					);
					return (
						eventDate.getDate() === selectedDate &&
						eventDate.getMonth() === currentMonth &&
						eventDate.getFullYear() === currentYear
					);
			  })
			: [];

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
							{currentMonthName} {currentYear}
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
								<motion.button
									key={index}
									onClick={() => handleDateClick(dayData.day, dayData.isEvent)}
									whileHover={dayData.day ? { scale: 1.1 } : {}}
									whileTap={dayData.isEvent ? { scale: 0.95 } : {}}
									disabled={!dayData.day}
									title={
										dayData.isEvent
											? `Click to view events on ${dayData.day}`
											: dayData.isToday
											? "Today"
											: ""
									}
									className={`
                    aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 relative
                    ${
											dayData.day
												? dayData.isToday
													? "bg-blue-600 text-white shadow-lg cursor-pointer hover:shadow-xl"
													: dayData.isEvent
													? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl cursor-pointer hover:scale-110 animate-pulse"
													: "text-foreground hover:bg-muted cursor-default"
												: "text-muted-foreground cursor-default"
										}
										${
											dayData.isEvent && !dayData.isToday
												? "ring-2 ring-purple-500/50 ring-offset-2"
												: ""
										}
                  `}
								>
									{dayData.day}
									{dayData.isEvent && (
										<span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>
									)}
								</motion.button>
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
									<span className="text-muted-foreground">
										Events (Click to view)
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Event Details Modal */}
				{showEventModal && selectedDateEvents.length > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						onClick={() => setShowEventModal(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-2xl font-bold text-foreground">
									Events on {currentMonthName} {selectedDate}, {currentYear}
								</h3>
								<button
									onClick={() => setShowEventModal(false)}
									className="p-2 hover:bg-muted rounded-full transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="space-y-4">
								{selectedDateEvents.map((event, index) => (
									<div
										key={event.id}
										className={`bg-gradient-to-br ${event.gradient} p-6 rounded-2xl text-white`}
									>
										<div className="flex items-start gap-4">
											<div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
												<span className="text-2xl">{event.emoji}</span>
											</div>
											<div className="flex-1">
												<h4 className="text-xl font-bold mb-2">
													{event.title}
												</h4>
												<p className="text-white/90 text-sm mb-3">
													{event.description}
												</p>
												<div className="space-y-2 text-sm">
													<div className="flex items-center gap-2">
														<Clock className="w-4 h-4" />
														<span>{event.time}</span>
													</div>
													<div className="flex items-center gap-2">
														<MapPin className="w-4 h-4" />
														<span>{event.location}</span>
													</div>
													<div className="flex items-center gap-2">
														<Users className="w-4 h-4" />
														<span>{event.attendees}+ expected attendees</span>
													</div>
												</div>
												<Button
													className="mt-4 bg-white text-gray-900 hover:bg-gray-100"
													onClick={() => setShowEventModal(false)}
												>
													Register Now
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						</motion.div>
					</motion.div>
				)}
			</div>
		</section>
	);
}
