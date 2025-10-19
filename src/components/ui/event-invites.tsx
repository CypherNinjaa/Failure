"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	Calendar,
	MapPin,
	Clock,
	Users,
	Check,
	X,
	Star,
	Gift,
	Trophy,
	Music,
	BookOpen,
	Camera,
	Heart,
	UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventInvite {
	id: number;
	title: string;
	description: string;
	date: string;
	time: string;
	location: string;
	category: "academic" | "cultural" | "sports" | "celebration" | "meeting";
	attendees: number;
	maxAttendees: number;
	isUrgent: boolean;
	deadline: string;
	organizer: string;
	requirements: string[];
	perks: string[];
	image: string;
	rsvpStatus?: "pending" | "accepted" | "declined";
}

const eventInvites: EventInvite[] = [
	{
		id: 1,
		title: "Annual Sports Day 2024",
		description:
			"Join us for an exciting day of athletic competitions, team spirit, and sportsmanship as our students showcase their talents.",
		date: "2024-04-15",
		time: "09:00 AM - 05:00 PM",
		location: "School Sports Complex",
		category: "sports",
		attendees: 156,
		maxAttendees: 300,
		isUrgent: true,
		deadline: "2024-04-10",
		organizer: "Sports Department",
		requirements: ["Comfortable clothing", "Water bottle", "Sun protection"],
		perks: ["Free lunch", "Participation certificate", "Photo session"],
		image: "from-green-500 to-teal-600",
		rsvpStatus: "pending",
	},
	{
		id: 2,
		title: "Science Exhibition & Fair",
		description:
			"Explore innovative science projects by our students and participate in interactive demonstrations and workshops.",
		date: "2024-04-20",
		time: "10:00 AM - 04:00 PM",
		location: "Science Laboratory Complex",
		category: "academic",
		attendees: 89,
		maxAttendees: 200,
		isUrgent: false,
		deadline: "2024-04-17",
		organizer: "Science Department",
		requirements: ["Student ID", "Notebook for observations"],
		perks: [
			"Workshop certificates",
			"Science kit gifts",
			"Expert interactions",
		],
		image: "from-purple-500 to-pink-600",
		rsvpStatus: "pending",
	},
	{
		id: 3,
		title: "Cultural Festival - Talent Showcase",
		description:
			"Celebrate diversity and creativity in our annual cultural festival featuring music, dance, drama, and art exhibitions.",
		date: "2024-04-25",
		time: "06:00 PM - 09:00 PM",
		location: "Main Auditorium",
		category: "cultural",
		attendees: 234,
		maxAttendees: 500,
		isUrgent: false,
		deadline: "2024-04-22",
		organizer: "Cultural Committee",
		requirements: ["Formal attire", "Invitation card"],
		perks: ["Cultural performances", "Art exhibition", "Refreshments"],
		image: "from-pink-500 to-rose-600",
		rsvpStatus: "accepted",
	},
	{
		id: 4,
		title: "Parent-Teacher Conference",
		description:
			"Important meeting to discuss student progress, academic performance, and future planning with teachers and coordinators.",
		date: "2024-04-30",
		time: "02:00 PM - 06:00 PM",
		location: "Conference Hall",
		category: "meeting",
		attendees: 67,
		maxAttendees: 150,
		isUrgent: true,
		deadline: "2024-04-27",
		organizer: "Academic Coordination",
		requirements: ["Parent ID", "Student report card", "Question list"],
		perks: ["Individual consultation", "Progress reports", "Guidance sessions"],
		image: "from-blue-500 to-purple-600",
		rsvpStatus: "pending",
	},
	{
		id: 5,
		title: "Achievement Awards Ceremony",
		description:
			"Honoring outstanding students for their academic excellence, leadership, and contributions to the school community.",
		date: "2024-05-05",
		time: "11:00 AM - 01:00 PM",
		location: "Main Hall",
		category: "celebration",
		attendees: 178,
		maxAttendees: 400,
		isUrgent: false,
		deadline: "2024-05-02",
		organizer: "Administration",
		requirements: ["Formal dress code", "Invitation only"],
		perks: ["Award ceremony", "Photo opportunities", "Celebration lunch"],
		image: "from-orange-500 to-red-600",
		rsvpStatus: "pending",
	},
	{
		id: 6,
		title: "Library Reading Marathon",
		description:
			"24-hour reading challenge to promote literacy and love for books among students with exciting prizes and recognition.",
		date: "2024-05-10",
		time: "08:00 AM - 08:00 AM (Next day)",
		location: "School Library",
		category: "academic",
		attendees: 45,
		maxAttendees: 100,
		isUrgent: false,
		deadline: "2024-05-07",
		organizer: "Library Committee",
		requirements: ["Reading materials", "Comfortable seating", "Snacks"],
		perks: ["Book prizes", "Reading certificates", "Author meet"],
		image: "from-teal-500 to-green-600",
		rsvpStatus: "declined",
	},
];

export function EventInvites() {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [rsvpStatuses, setRsvpStatuses] = useState<{ [key: number]: string }>(
		{}
	);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		// Initialize RSVP statuses
		const initialStatuses: { [key: number]: string } = {};
		eventInvites.forEach((event) => {
			if (event.rsvpStatus) {
				initialStatuses[event.id] = event.rsvpStatus;
			}
		});
		setRsvpStatuses(initialStatuses);
	}, []);

	const categories = [
		{
			id: "all",
			name: "All Events",
			icon: Calendar,
			count: eventInvites.length,
		},
		{
			id: "academic",
			name: "Academic",
			icon: BookOpen,
			count: eventInvites.filter((e) => e.category === "academic").length,
		},
		{
			id: "cultural",
			name: "Cultural",
			icon: Music,
			count: eventInvites.filter((e) => e.category === "cultural").length,
		},
		{
			id: "sports",
			name: "Sports",
			icon: Trophy,
			count: eventInvites.filter((e) => e.category === "sports").length,
		},
		{
			id: "celebration",
			name: "Celebrations",
			icon: Gift,
			count: eventInvites.filter((e) => e.category === "celebration").length,
		},
		{
			id: "meeting",
			name: "Meetings",
			icon: Users,
			count: eventInvites.filter((e) => e.category === "meeting").length,
		},
	];

	const filteredEvents =
		selectedCategory === "all"
			? eventInvites
			: eventInvites.filter((event) => event.category === selectedCategory);

	const handleRsvp = (eventId: number, status: "accepted" | "declined") => {
		setRsvpStatuses((prev) => ({ ...prev, [eventId]: status }));
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "academic":
				return BookOpen;
			case "cultural":
				return Music;
			case "sports":
				return Trophy;
			case "celebration":
				return Gift;
			case "meeting":
				return Users;
			default:
				return Calendar;
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const isEventUrgent = (deadline: string) => {
		const deadlineDate = new Date(deadline);
		const today = new Date();
		const diffTime = deadlineDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays <= 3;
	};

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-muted/30">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							Event Invitations
						</h2>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 lg:py-24 bg-muted/30">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<Gift className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">RSVP Events</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Event</span> Invitations
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Join us for exciting school events and activities. RSVP to secure
						your spot and be part of memorable experiences with the school
						community.
					</p>
				</motion.div>

				{/* Category Filter */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-3 mb-12"
				>
					{categories.map((category, index) => {
						const CategoryIcon = category.icon;
						return (
							<motion.button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-300 ${
									selectedCategory === category.id
										? "bg-accent text-accent-foreground shadow-lg scale-105"
										: "bg-card text-foreground hover:bg-muted border border-border"
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.1 * index }}
							>
								<CategoryIcon className="w-4 h-4 mr-2" />
								{category.name}
								<span
									className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
										selectedCategory === category.id
											? "bg-white/20 text-white"
											: "bg-accent/10 text-accent"
									}`}
								>
									{category.count}
								</span>
							</motion.button>
						);
					})}
				</motion.div>

				{/* Event Invites Grid */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{filteredEvents.map((event, index) => {
						const CategoryIcon = getCategoryIcon(event.category);
						const rsvpStatus = rsvpStatuses[event.id];
						const isUrgent = event.isUrgent || isEventUrgent(event.deadline);

						return (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
								className="group"
							>
								<Card
									className={`overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full ${
										isUrgent ? "border-2 border-red-500/30" : ""
									}`}
								>
									<CardContent className="p-6 flex flex-col h-full">
										{/* Header */}
										<div className="flex items-center justify-between mb-4">
											<div
												className={`p-2 rounded-lg bg-gradient-to-br ${event.image}`}
											>
												<CategoryIcon className="w-5 h-5 text-white" />
											</div>
											<div className="flex items-center space-x-2">
												{isUrgent && (
													<span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
														URGENT
													</span>
												)}
												<span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded">
													{event.category.toUpperCase()}
												</span>
											</div>
										</div>

										{/* Event Image */}
										<div
											className={`h-32 bg-gradient-to-br ${event.image} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}
										>
											<div className="absolute inset-0 bg-black/20"></div>
											<Star className="w-8 h-8 text-white/70 z-10" />
											<div className="absolute top-3 right-3 bg-white/20 backdrop-blur rounded-full px-2 py-1 text-white text-xs">
												{event.attendees}/{event.maxAttendees}
											</div>
										</div>

										{/* Event Details */}
										<div className="flex-1">
											<h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
												{event.title}
											</h3>
											<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
												{event.description}
											</p>

											<div className="space-y-2 text-sm text-muted-foreground mb-4">
												<div className="flex items-center">
													<Calendar className="w-4 h-4 mr-2 text-accent" />
													{formatDate(event.date)}
												</div>
												<div className="flex items-center">
													<Clock className="w-4 h-4 mr-2 text-accent" />
													{event.time}
												</div>
												<div className="flex items-center">
													<MapPin className="w-4 h-4 mr-2 text-accent" />
													{event.location}
												</div>
												<div className="flex items-center">
													<UserPlus className="w-4 h-4 mr-2 text-accent" />
													{event.organizer}
												</div>
											</div>

											{/* Perks */}
											<div className="mb-4">
												<h4 className="text-xs font-semibold text-foreground mb-2">
													What&apos;s Included:
												</h4>
												<div className="flex flex-wrap gap-1">
													{event.perks.slice(0, 3).map((perk, perkIndex) => (
														<span
															key={perkIndex}
															className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
														>
															{perk}
														</span>
													))}
												</div>
											</div>
										</div>

										{/* RSVP Status & Actions */}
										<div className="mt-auto">
											{rsvpStatus === "accepted" ? (
												<div className="flex items-center justify-center p-3 bg-green-500/10 text-green-600 rounded-lg">
													<Check className="w-4 h-4 mr-2" />
													<span className="font-medium">Attending</span>
												</div>
											) : rsvpStatus === "declined" ? (
												<div className="flex items-center justify-center p-3 bg-red-500/10 text-red-600 rounded-lg">
													<X className="w-4 h-4 mr-2" />
													<span className="font-medium">Not Attending</span>
												</div>
											) : (
												<div className="flex space-x-2">
													<Button
														size="sm"
														className="flex-1 bg-green-500 hover:bg-green-600 text-white"
														onClick={() => handleRsvp(event.id, "accepted")}
													>
														<Check className="w-4 h-4 mr-1" />
														Accept
													</Button>
													<Button
														size="sm"
														variant="outline"
														className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
														onClick={() => handleRsvp(event.id, "declined")}
													>
														<X className="w-4 h-4 mr-1" />
														Decline
													</Button>
												</div>
											)}

											{/* Deadline Warning */}
											{isEventUrgent(event.deadline) &&
												rsvpStatus === undefined && (
													<div className="text-center mt-2">
														<span className="text-xs text-red-600 font-medium">
															RSVP by {formatDate(event.deadline)}
														</span>
													</div>
												)}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* RSVP Statistics */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
				>
					{[
						{ label: "Total Events", value: "25+", icon: Calendar },
						{ label: "RSVPs Sent", value: "1.2K+", icon: UserPlus },
						{ label: "Attendance Rate", value: "94%", icon: Heart },
						{ label: "Photo Memories", value: "5K+", icon: Camera },
					].map((stat, index) => {
						const StatIcon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
							>
								<Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/30">
									<CardContent className="p-4">
										<StatIcon className="w-8 h-8 text-accent mx-auto mb-2" />
										<div className="text-2xl font-bold text-foreground mb-1">
											{stat.value}
										</div>
										<div className="text-sm text-muted-foreground">
											{stat.label}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
