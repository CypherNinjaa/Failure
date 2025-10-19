"use client";

import { motion } from "framer-motion";
import {
	Calendar,
	Clock,
	MapPin,
	Users,
	Trophy,
	BookOpen,
	Palette,
	ChevronLeft,
	ChevronRight,
	Filter,
	Download,
	Bell,
	Star,
} from "lucide-react";
import { useState } from "react";

export function AcademicCalendar() {
	const [selectedMonth, setSelectedMonth] = useState(8); // August (0-indexed)
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [currentYear] = useState(2025);

	const months = [
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

	const eventCategories = [
		{
			id: "all",
			name: "All Events",
			color: "from-gray-500 to-gray-600",
			count: 24,
		},
		{
			id: "academic",
			name: "Academic",
			color: "from-blue-500 to-blue-600",
			count: 8,
		},
		{
			id: "exam",
			name: "Examinations",
			color: "from-red-500 to-red-600",
			count: 6,
		},
		{
			id: "cultural",
			name: "Cultural",
			color: "from-purple-500 to-purple-600",
			count: 5,
		},
		{
			id: "sports",
			name: "Sports",
			color: "from-green-500 to-green-600",
			count: 3,
		},
		{
			id: "holiday",
			name: "Holidays",
			color: "from-orange-500 to-orange-600",
			count: 2,
		},
	];

	const academicEvents = [
		// August 2025
		{
			month: 8,
			date: 15,
			title: "Independence Day Celebration",
			category: "cultural",
			time: "9:00 AM - 12:00 PM",
			location: "School Auditorium",
			description:
				"Annual Independence Day program with cultural performances and flag hoisting ceremony.",
			participants: "All Students",
			isHighlight: true,
		},
		{
			month: 8,
			date: 20,
			title: "Parent-Teacher Meeting",
			category: "academic",
			time: "2:00 PM - 5:00 PM",
			location: "Individual Classrooms",
			description:
				"Quarterly academic progress discussion between parents and teachers.",
			participants: "Parents & Teachers",
		},
		{
			month: 8,
			date: 25,
			title: "Science Exhibition",
			category: "academic",
			time: "10:00 AM - 4:00 PM",
			location: "Science Laboratory",
			description: "Student science projects and experiments showcase.",
			participants: "Grades 6-10",
		},
		{
			month: 8,
			date: 30,
			title: "Monthly Assessment Test",
			category: "exam",
			time: "9:00 AM - 12:00 PM",
			location: "All Classrooms",
			description: "Comprehensive monthly evaluation for all subjects.",
			participants: "All Students",
		},

		// September 2025
		{
			month: 9,
			date: 5,
			title: "Teachers' Day Celebration",
			category: "cultural",
			time: "9:00 AM - 1:00 PM",
			location: "School Auditorium",
			description:
				"Special program to honor and appreciate our dedicated teachers.",
			participants: "All Students & Teachers",
			isHighlight: true,
		},
		{
			month: 9,
			date: 10,
			title: "Inter-House Sports Competition",
			category: "sports",
			time: "8:00 AM - 5:00 PM",
			location: "Sports Ground",
			description: "Annual sports competition between different school houses.",
			participants: "All Students",
		},
		{
			month: 9,
			date: 15,
			title: "Half-Yearly Examinations Begin",
			category: "exam",
			time: "9:00 AM - 12:00 PM",
			location: "Examination Halls",
			description: "Commencement of half-yearly examinations for all grades.",
			participants: "All Students",
			isHighlight: true,
		},
		{
			month: 9,
			date: 25,
			title: "Art & Craft Workshop",
			category: "cultural",
			time: "2:00 PM - 4:00 PM",
			location: "Art Room",
			description:
				"Creative workshop for developing artistic skills and creativity.",
			participants: "Grades 1-8",
		},

		// October 2025
		{
			month: 10,
			date: 2,
			title: "Gandhi Jayanti",
			category: "holiday",
			time: "All Day",
			location: "School Campus",
			description:
				"Commemorating Mahatma Gandhi's birthday with peace activities.",
			participants: "All Students",
		},
		{
			month: 10,
			date: 15,
			title: "Annual Day Practice",
			category: "cultural",
			time: "3:00 PM - 6:00 PM",
			location: "School Auditorium",
			description: "Rehearsals for the grand annual day celebration.",
			participants: "Selected Students",
		},
		{
			month: 10,
			date: 24,
			title: "Dussehra Holiday",
			category: "holiday",
			time: "All Day",
			location: "N/A",
			description:
				"Festival holiday celebrating the victory of good over evil.",
			participants: "All Students",
		},
		{
			month: 10,
			date: 30,
			title: "Halloween Fun Day",
			category: "cultural",
			time: "10:00 AM - 2:00 PM",
			location: "School Campus",
			description: "Costume party and fun activities for primary students.",
			participants: "Grades 1-5",
		},
	];

	const filteredEvents = academicEvents.filter((event) => {
		const matchesMonth = event.month === selectedMonth;
		const matchesCategory =
			selectedCategory === "all" || event.category === selectedCategory;
		return matchesMonth && matchesCategory;
	});

	const getCategoryStyle = (category: string) => {
		const categoryObj = eventCategories.find((cat) => cat.id === category);
		return categoryObj ? categoryObj.color : "from-gray-500 to-gray-600";
	};

	return (
		<section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
						<Calendar className="w-4 h-4" />
						Academic Calendar
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						Interactive Academic
						<span className="text-gradient-primary"> Calendar</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
						Stay updated with all academic events, examinations, cultural
						programs, and important dates throughout the academic year.
					</p>
				</motion.div>

				{/* Calendar Controls */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="flex flex-col lg:flex-row gap-6 mb-12"
				>
					{/* Month Navigation */}
					<div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4">
						<button
							onClick={() =>
								setSelectedMonth(selectedMonth > 0 ? selectedMonth - 1 : 11)
							}
							className="w-10 h-10 bg-muted hover:bg-primary hover:text-white rounded-xl flex items-center justify-center transition-all duration-300"
						>
							<ChevronLeft className="w-5 h-5" />
						</button>
						<div className="text-center min-w-[120px]">
							<div className="text-lg font-bold text-foreground">
								{months[selectedMonth]}
							</div>
							<div className="text-sm text-muted-foreground">{currentYear}</div>
						</div>
						<button
							onClick={() =>
								setSelectedMonth(selectedMonth < 11 ? selectedMonth + 1 : 0)
							}
							className="w-10 h-10 bg-muted hover:bg-primary hover:text-white rounded-xl flex items-center justify-center transition-all duration-300"
						>
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>

					{/* Category Filter */}
					<div className="flex-1 flex items-center gap-2">
						<Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
						<div className="flex flex-wrap gap-2">
							{eventCategories.map((category) => (
								<button
									key={category.id}
									onClick={() => setSelectedCategory(category.id)}
									className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
										selectedCategory === category.id
											? `bg-gradient-to-r ${category.color} text-white shadow-lg`
											: "bg-muted text-muted-foreground hover:bg-card"
									}`}
								>
									{category.name}
									<span className="ml-2 text-xs opacity-75">
										({category.count})
									</span>
								</button>
							))}
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2">
						<button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
							<Download className="w-4 h-4" />
							<span className="hidden sm:inline">Download</span>
						</button>
						<button className="flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-xl font-medium hover:bg-muted transition-all duration-300">
							<Bell className="w-4 h-4" />
							<span className="hidden sm:inline">Notify</span>
						</button>
					</div>
				</motion.div>

				{/* Events for Selected Month */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="mb-12"
				>
					<div className="bg-card border border-border rounded-2xl p-6 mb-6">
						<h3 className="text-xl font-bold text-foreground mb-2">
							{months[selectedMonth]} {currentYear} Events
						</h3>
						<p className="text-muted-foreground">
							{filteredEvents.length} event
							{filteredEvents.length !== 1 ? "s" : ""} scheduled this month
						</p>
					</div>

					{/* Events List */}
					<div className="space-y-4">
						{filteredEvents.length > 0 ? (
							filteredEvents.map((event, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className={`bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${
										event.isHighlight ? "ring-2 ring-primary/20" : ""
									} group`}
								>
									<div className="flex flex-col lg:flex-row lg:items-center gap-6">
										{/* Date Badge */}
										<div
											className={`w-16 h-16 bg-gradient-to-r ${getCategoryStyle(
												event.category
											)} rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
										>
											<div className="text-xs font-medium opacity-90">
												{months[event.month].slice(0, 3)}
											</div>
											<div className="text-xl font-bold">{event.date}</div>
										</div>

										{/* Event Details */}
										<div className="flex-1 space-y-3">
											<div className="flex items-start justify-between">
												<div>
													<h4 className="text-lg font-bold text-foreground flex items-center gap-2">
														{event.title}
														{event.isHighlight && (
															<Star className="w-4 h-4 text-yellow-500 fill-current" />
														)}
													</h4>
													<p className="text-muted-foreground mt-1">
														{event.description}
													</p>
												</div>
												<div
													className={`px-3 py-1 bg-gradient-to-r ${getCategoryStyle(
														event.category
													)} text-white text-xs font-medium rounded-full flex-shrink-0`}
												>
													{
														eventCategories.find(
															(cat) => cat.id === event.category
														)?.name
													}
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
												<div className="flex items-center gap-2 text-muted-foreground">
													<Clock className="w-4 h-4" />
													<span>{event.time}</span>
												</div>
												<div className="flex items-center gap-2 text-muted-foreground">
													<MapPin className="w-4 h-4" />
													<span>{event.location}</span>
												</div>
												<div className="flex items-center gap-2 text-muted-foreground">
													<Users className="w-4 h-4" />
													<span>{event.participants}</span>
												</div>
											</div>
										</div>

										{/* Action Button */}
										<div className="flex-shrink-0">
											<button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2">
												<span>View Details</span>
											</button>
										</div>
									</div>
								</motion.div>
							))
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-center py-12"
							>
								<div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
									<Calendar className="w-12 h-12 text-muted-foreground" />
								</div>
								<h3 className="text-xl font-semibold text-foreground mb-2">
									No Events Found
								</h3>
								<p className="text-muted-foreground">
									No events scheduled for {months[selectedMonth]} {currentYear}{" "}
									in the selected category.
								</p>
							</motion.div>
						)}
					</div>
				</motion.div>

				{/* Quick Stats */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
				>
					{eventCategories.slice(1).map((category, index) => (
						<motion.div
							key={category.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
						>
							<div
								className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
							>
								{category.id === "academic" && (
									<BookOpen className="w-6 h-6 text-white" />
								)}
								{category.id === "exam" && (
									<Trophy className="w-6 h-6 text-white" />
								)}
								{category.id === "cultural" && (
									<Palette className="w-6 h-6 text-white" />
								)}
								{category.id === "sports" && (
									<Users className="w-6 h-6 text-white" />
								)}
								{category.id === "holiday" && (
									<Star className="w-6 h-6 text-white" />
								)}
							</div>
							<div className="text-2xl font-bold text-foreground mb-1">
								{category.count}
							</div>
							<div className="text-sm text-muted-foreground">
								{category.name}
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.3 }}
					className="text-center"
				>
					<div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border">
						<div className="max-w-3xl mx-auto">
							<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
								Never Miss An Important Date
							</h3>
							<p className="text-muted-foreground mb-8 text-lg">
								Subscribe to calendar notifications and download the complete
								academic calendar to stay informed about all school events.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<button className="bg-gradient-to-r from-primary to-secondary  px-8 py-4 rounded-xl font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
									<Bell className="w-5 h-5" />
									Subscribe to Notifications
								</button>
								<button className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2">
									<Download className="w-5 h-5" />
									Download Full Calendar
								</button>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
