"use client";

import { motion } from "framer-motion";
import {
	Newspaper,
	Bell,
	Calendar,
	Download,
	Zap,
	TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function NewsHero() {
	const newsStats = [
		{
			icon: Newspaper,
			label: "News Articles",
			value: "250+",
			gradient: "from-blue-500 to-purple-600",
		},
		{
			icon: Bell,
			label: "Announcements",
			value: "150+",
			gradient: "from-green-500 to-teal-600",
		},
		{
			icon: Calendar,
			label: "Events",
			value: "75+",
			gradient: "from-orange-500 to-red-600",
		},
		{
			icon: Download,
			label: "Resources",
			value: "500+",
			gradient: "from-purple-500 to-pink-600",
		},
	];

	const recentHighlights = [
		{
			title: "Annual Sports Day 2024",
			type: "Event",
			date: "March 25, 2024",
			priority: "high",
			color: "from-green-400 to-teal-500",
		},
		{
			title: "Science Exhibition Results",
			type: "News",
			date: "March 20, 2024",
			priority: "medium",
			color: "from-blue-400 to-purple-500",
		},
		{
			title: "Parent-Teacher Meeting",
			type: "Announcement",
			date: "March 30, 2024",
			priority: "urgent",
			color: "from-orange-400 to-red-500",
		},
		{
			title: "New Library Books",
			type: "Update",
			date: "March 18, 2024",
			priority: "low",
			color: "from-purple-400 to-pink-500",
		},
	];

	return (
		<section className="relative py-16 lg:py-24 overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
			<div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
			<div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl"></div>

			<div className="container relative">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<Zap className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Live Updates</span>
					</div>

					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">News &</span>
						<br />
						<span className="text-gradient-secondary">Updates</span>
					</h1>

					<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
						Stay connected with the latest happenings at Happy Child School.
						From breaking news to important announcements, never miss what
						matters most to our school community.
					</p>

					<div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						<span>Live updates every 30 seconds</span>
					</div>
				</motion.div>

				{/* News Statistics */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16"
				>
					{newsStats.map((stat, index) => {
						const StatIcon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								whileHover={{ scale: 1.05 }}
								className="group"
							>
								<Card className="text-center hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 bg-gradient-to-br from-card to-muted/30 border-2 hover:border-accent/20">
									<CardContent className="p-6">
										<div
											className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
										>
											<StatIcon className="w-8 h-8 text-white" />
										</div>
										<div className="text-3xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
											{stat.value}
										</div>
										<div className="text-sm text-muted-foreground font-medium">
											{stat.label}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Recent Highlights Preview */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
				>
					{recentHighlights.map((highlight, index) => (
						<motion.div
							key={highlight.title}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.1 * index }}
							whileHover={{ scale: 1.02 }}
							className="group cursor-pointer"
						>
							<Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-muted/20 border hover:border-accent/30">
								<CardContent className="p-0">
									<div
										className={`h-24 bg-gradient-to-br ${highlight.color} relative overflow-hidden`}
									>
										<div className="absolute inset-0 bg-black/20"></div>
										<div className="absolute top-3 right-3">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
													highlight.priority === "urgent"
														? "bg-red-500"
														: highlight.priority === "high"
														? "bg-orange-500"
														: highlight.priority === "medium"
														? "bg-blue-500"
														: "bg-gray-500"
												}`}
											>
												{highlight.priority.toUpperCase()}
											</span>
										</div>
										<div className="absolute bottom-3 left-3">
											<TrendingUp className="w-5 h-5 text-white/80" />
										</div>
									</div>
									<div className="p-4">
										<div className="text-xs text-accent font-medium mb-1">
											{highlight.type}
										</div>
										<h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">
											{highlight.title}
										</h3>
										<div className="text-xs text-muted-foreground flex items-center">
											<Calendar className="w-3 h-3 mr-1" />
											{highlight.date}
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>

				{/* Scroll Indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 1 }}
					className="flex justify-center mt-16"
				>
					<motion.div
						animate={{ y: [0, -10, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="flex flex-col items-center text-muted-foreground"
					>
						<span className="text-sm mb-2">Scroll for more</span>
						<div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
							<motion.div
								animate={{ y: [0, 12, 0] }}
								transition={{ duration: 2, repeat: Infinity }}
								className="w-1 h-3 bg-accent rounded-full mt-2"
							></motion.div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
