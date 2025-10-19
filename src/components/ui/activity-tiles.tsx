"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Music,
	Palette,
	Users,
	Trophy,
	BookOpen,
	Mic2,
	Theater,
	Camera,
	Gamepad2,
	Heart,
	Globe,
	Zap,
} from "lucide-react";
import { useState } from "react";

const activities = [
	{
		id: 1,
		title: "Music & Band",
		description:
			"Express your musical talents through our school band, choir, and individual instrument training.",
		icon: Music,
		category: "Creative Arts",
		participants: "120+ Students",
		achievements: "15 Awards",
		color: "from-blue-500 to-purple-600",
		highlights: [
			"School Band",
			"Choir Group",
			"Music Theory",
			"Instrumental Classes",
		],
	},
	{
		id: 2,
		title: "Visual Arts",
		description:
			"Unleash creativity through painting, sketching, digital art, and sculpture workshops.",
		icon: Palette,
		category: "Creative Arts",
		participants: "85+ Students",
		achievements: "22 Exhibitions",
		color: "from-purple-500 to-pink-600",
		highlights: [
			"Painting Classes",
			"Digital Art",
			"Sculpture",
			"Art Exhibitions",
		],
	},
	{
		id: 3,
		title: "Drama & Theater",
		description:
			"Develop confidence and communication skills through dramatic performances and storytelling.",
		icon: Theater,
		category: "Performing Arts",
		participants: "95+ Students",
		achievements: "12 Plays",
		color: "from-green-500 to-blue-600",
		highlights: [
			"Annual Plays",
			"Drama Workshop",
			"Story Telling",
			"Stage Performance",
		],
	},
	{
		id: 4,
		title: "Photography Club",
		description:
			"Capture moments and learn the art of photography with modern equipment and techniques.",
		icon: Camera,
		category: "Technical",
		participants: "60+ Students",
		achievements: "8 Competitions",
		color: "from-orange-500 to-red-600",
		highlights: [
			"Digital Photography",
			"Photo Editing",
			"Nature Photography",
			"Portrait Sessions",
		],
	},
	{
		id: 5,
		title: "Debate Society",
		description:
			"Enhance public speaking and critical thinking through structured debates and discussions.",
		icon: Mic2,
		category: "Academic",
		participants: "75+ Students",
		achievements: "18 Victories",
		color: "from-cyan-500 to-blue-600",
		highlights: [
			"Public Speaking",
			"Model UN",
			"Quiz Competitions",
			"Presentation Skills",
		],
	},
	{
		id: 6,
		title: "Sports Club",
		description:
			"Build teamwork and physical fitness through various indoor and outdoor sports activities.",
		icon: Trophy,
		category: "Sports",
		participants: "200+ Students",
		achievements: "35 Trophies",
		color: "from-yellow-500 to-orange-600",
		highlights: ["Football Team", "Basketball", "Cricket", "Athletics"],
	},
	{
		id: 7,
		title: "Literary Society",
		description:
			"Explore the world of literature through creative writing, poetry, and book discussions.",
		icon: BookOpen,
		category: "Academic",
		participants: "65+ Students",
		achievements: "10 Publications",
		color: "from-indigo-500 to-purple-600",
		highlights: [
			"Creative Writing",
			"Poetry Club",
			"Book Reviews",
			"Literary Magazine",
		],
	},
	{
		id: 8,
		title: "Gaming & Esports",
		description:
			"Competitive gaming and strategic thinking through organized esports tournaments.",
		icon: Gamepad2,
		category: "Technical",
		participants: "90+ Students",
		achievements: "25 Tournaments",
		color: "from-red-500 to-purple-600",
		highlights: [
			"Esports Team",
			"Strategy Games",
			"Coding Games",
			"Gaming Tournaments",
		],
	},
	{
		id: 9,
		title: "Community Service",
		description:
			"Make a positive impact through volunteering and community outreach programs.",
		icon: Heart,
		category: "Social",
		participants: "110+ Students",
		achievements: "50+ Projects",
		color: "from-pink-500 to-rose-600",
		highlights: [
			"Volunteer Work",
			"Social Awareness",
			"Charity Drives",
			"Environmental Care",
		],
	},
	{
		id: 10,
		title: "Model United Nations",
		description:
			"Develop diplomatic skills and global awareness through simulated UN conferences.",
		icon: Globe,
		category: "Academic",
		participants: "45+ Students",
		achievements: "12 Conferences",
		color: "from-emerald-500 to-teal-600",
		highlights: [
			"Diplomacy Training",
			"Global Issues",
			"Research Skills",
			"Conference Participation",
		],
	},
	{
		id: 11,
		title: "Innovation Lab",
		description:
			"Explore STEM through robotics, coding, and innovative project development.",
		icon: Zap,
		category: "Technical",
		participants: "80+ Students",
		achievements: "15 Projects",
		color: "from-violet-500 to-purple-600",
		highlights: [
			"Robotics Club",
			"Coding Workshop",
			"Science Projects",
			"Tech Innovation",
		],
	},
	{
		id: 12,
		title: "Student Council",
		description:
			"Develop leadership skills and represent student voices in school governance.",
		icon: Users,
		category: "Leadership",
		participants: "30+ Students",
		achievements: "100% Participation",
		color: "from-blue-500 to-indigo-600",
		highlights: [
			"Student Leadership",
			"Event Organization",
			"Peer Mentoring",
			"School Representation",
		],
	},
];

const categories = [
	"All",
	"Creative Arts",
	"Performing Arts",
	"Academic",
	"Sports",
	"Technical",
	"Social",
	"Leadership",
];

export function ActivityTiles() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [hoveredCard, setHoveredCard] = useState<number | null>(null);

	const filteredActivities =
		selectedCategory === "All"
			? activities
			: activities.filter((activity) => activity.category === selectedCategory);

	return (
		<section className="py-20 bg-background">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary font-medium text-sm mb-6">
						🎯 Interactive Experience
					</div>
					<h2 className="text-3xl md:text-5xl font-bold mb-6">
						<span className="text-gradient-primary">Explore</span>{" "}
						<span className="text-foreground">Our Activities</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Interactive tiles showcasing our diverse range of co-curricular
						activities. Click on any category to filter and discover what
						interests you most.
					</p>
				</motion.div>

				{/* Category Filter */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-2 mb-12"
				>
					{categories.map((category) => (
						<Button
							key={category}
							variant={selectedCategory === category ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedCategory(category)}
							className={`rounded-full transition-all duration-300 ${
								selectedCategory === category
									? "bg-gradient-to-r from-secondary to-accent text-blue-500 shadow-lg"
									: "text-foreground hover:bg-muted hover:text-foreground border-border"
							}`}
						>
							{category}
						</Button>
					))}
				</motion.div>

				{/* Activity Grid */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
				>
					{filteredActivities.map((activity, index) => {
						const IconComponent = activity.icon;
						return (
							<motion.div
								key={activity.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								onHoverStart={() => setHoveredCard(activity.id)}
								onHoverEnd={() => setHoveredCard(null)}
							>
								<Card
									className={`group relative overflow-hidden border-0 bg-gradient-to-br ${activity.color} p-1 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
								>
									<div className="relative bg-card rounded-lg p-6 h-full">
										{/* Icon */}
										<div className="relative mb-4">
											<div
												className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}
											>
												<IconComponent className="w-8 h-8 text-white" />
											</div>
											<div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
										</div>

										{/* Category Badge */}
										<div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium mb-3">
											{activity.category}
										</div>

										{/* Title */}
										<h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
											{activity.title}
										</h3>

										{/* Description */}
										<p className="text-sm text-muted-foreground mb-4 line-clamp-3">
											{activity.description}
										</p>

										{/* Stats */}
										<div className="space-y-2 mb-4">
											<div className="flex items-center justify-between text-xs">
												<span className="text-muted-foreground">
													Participants:
												</span>
												<span className="font-medium text-primary">
													{activity.participants}
												</span>
											</div>
											<div className="flex items-center justify-between text-xs">
												<span className="text-muted-foreground">
													Achievements:
												</span>
												<span className="font-medium text-secondary">
													{activity.achievements}
												</span>
											</div>
										</div>

										{/* Highlights - Only show on hover */}
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{
												opacity: hoveredCard === activity.id ? 1 : 0,
												height: hoveredCard === activity.id ? "auto" : 0,
											}}
											transition={{ duration: 0.3 }}
											className="overflow-hidden"
										>
											<div className="border-t border-border pt-4">
												<div className="text-xs font-medium text-muted-foreground mb-2">
													Highlights:
												</div>
												<div className="flex flex-wrap gap-1">
													{activity.highlights.map((highlight, idx) => (
														<span
															key={idx}
															className="px-2 py-1 bg-muted rounded text-xs"
														>
															{highlight}
														</span>
													))}
												</div>
											</div>
										</motion.div>

										{/* Hover Effect Overlay */}
										<div
											className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg`}
										/>
									</div>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 max-w-2xl mx-auto border border-primary/20">
						<h3 className="text-2xl font-bold mb-4 text-gradient-primary">
							Ready to Join an Activity?
						</h3>
						<p className="text-muted-foreground mb-6">
							Discover your passion and unlock your potential. Register for
							activities that inspire you!
						</p>
						<Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-green-500 rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
							Register Now
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
