"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	BookOpen,
	Users,
	Trophy,
	Globe,
	Heart,
	Shield,
	Lightbulb,
	Target,
	Award,
	Star,
	Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WhyChooseUsCard {
	id: number;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	features: string[];
	color: string;
	stats?: string;
}

const whyChooseUsCards: WhyChooseUsCard[] = [
	{
		id: 1,
		title: "Academic Excellence",
		description:
			"World-class curriculum designed to nurture critical thinking and intellectual growth in every student.",
		icon: BookOpen,
		features: [
			"CBSE Curriculum",
			"Expert Faculty",
			"Small Class Sizes",
			"Personalized Learning",
		],
		color: "from-blue-500 to-purple-600",
		stats: "95% Success Rate",
	},
	{
		id: 2,
		title: "Holistic Development",
		description:
			"We focus on developing the complete personality of students through sports, arts, and life skills.",
		icon: Users,
		features: [
			"Sports Programs",
			"Arts & Crafts",
			"Leadership Training",
			"Character Building",
		],
		color: "from-green-500 to-teal-600",
		stats: "150+ Activities",
	},
	{
		id: 3,
		title: "Modern Infrastructure",
		description:
			"State-of-the-art facilities including smart classrooms, labs, and recreational areas.",
		icon: Globe,
		features: [
			"Smart Classrooms",
			"Science Labs",
			"Computer Lab",
			"Sports Complex",
		],
		color: "from-orange-500 to-red-600",
		stats: "50+ Facilities",
	},
	{
		id: 4,
		title: "Safe Environment",
		description:
			"Secure and nurturing environment with 24/7 security, CCTV monitoring, and caring staff.",
		icon: Shield,
		features: [
			"24/7 Security",
			"CCTV Monitoring",
			"Trained Staff",
			"Emergency Protocols",
		],
		color: "from-purple-500 to-pink-600",
		stats: "100% Safe",
	},
	{
		id: 5,
		title: "Innovation Focus",
		description:
			"Emphasis on creativity, innovation, and future-ready skills through project-based learning.",
		icon: Lightbulb,
		features: [
			"STEM Programs",
			"Robotics Club",
			"Innovation Lab",
			"Future Skills",
		],
		color: "from-yellow-500 to-orange-600",
		stats: "25+ Projects",
	},
	{
		id: 6,
		title: "Individual Attention",
		description:
			"Low student-teacher ratio ensures every child receives personalized attention and care.",
		icon: Target,
		features: [
			"Small Batches",
			"Personal Mentoring",
			"Custom Learning",
			"Regular Feedback",
		],
		color: "from-teal-500 to-blue-600",
		stats: "1:15 Ratio",
	},
];

export function WhyChooseUs() {
	const [isMounted, setIsMounted] = useState(false);
	const [hoveredCard, setHoveredCard] = useState<number | null>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-background">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							Why Choose Us?
						</h2>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 lg:py-24 bg-background">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<Star className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Why Happy Child School</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						What Makes Us <span className="text-gradient-primary">Special</span>
					</h2>

					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Discover the unique features and advantages that set Happy Child
						School apart as the premier choice for your child&apos;s educational
						journey.
					</p>
				</motion.div>

				{/* Main Highlight Cards */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
				>
					{whyChooseUsCards.map((card, index) => {
						const CardIcon = card.icon;
						return (
							<motion.div
								key={card.id}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
								onHoverStart={() => setHoveredCard(card.id)}
								onHoverEnd={() => setHoveredCard(null)}
								className="group cursor-pointer"
							>
								<Card className="overflow-hidden hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 h-full">
									<CardContent className="p-6 flex flex-col h-full">
										{/* Header */}
										<div className="flex items-center justify-between mb-4">
											<div
												className={`p-3 rounded-xl bg-gradient-to-br ${card.color} group-hover:scale-110 transition-transform duration-300`}
											>
												<CardIcon className="w-6 h-6 text-white" />
											</div>
											{card.stats && (
												<span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
													{card.stats}
												</span>
											)}
										</div>

										{/* Content */}
										<div className="flex-1">
											<h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
												{card.title}
											</h3>
											<p className="text-muted-foreground mb-4 leading-relaxed">
												{card.description}
											</p>

											{/* Features */}
											<div className="space-y-2">
												{card.features.map((feature, featureIndex) => (
													<motion.div
														key={featureIndex}
														initial={{ opacity: 0, x: -10 }}
														animate={{
															opacity: hoveredCard === card.id ? 1 : 0.7,
															x: hoveredCard === card.id ? 0 : -10,
														}}
														transition={{
															duration: 0.3,
															delay: featureIndex * 0.1,
														}}
														className="flex items-center text-sm text-muted-foreground"
													>
														<div
															className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.color} mr-3`}
														></div>
														{feature}
													</motion.div>
												))}
											</div>
										</div>

										{/* Hover Effect Overlay */}
										<motion.div
											initial={{ opacity: 0, scale: 0 }}
											animate={{
												opacity: hoveredCard === card.id ? 1 : 0,
												scale: hoveredCard === card.id ? 1 : 0,
											}}
											transition={{ duration: 0.3 }}
											className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 rounded-lg"
										/>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Bottom Statistics */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6"
				>
					{[
						{
							icon: Award,
							value: "25+",
							label: "Years of Excellence",
							color: "text-yellow-600",
						},
						{
							icon: Users,
							value: "2000+",
							label: "Happy Students",
							color: "text-blue-600",
						},
						{
							icon: Trophy,
							value: "500+",
							label: "Awards Won",
							color: "text-green-600",
						},
						{
							icon: Heart,
							value: "98%",
							label: "Parent Satisfaction",
							color: "text-red-600",
						},
					].map((stat, index) => {
						const StatIcon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
								className="text-center"
							>
								<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/30">
									<CardContent className="p-6">
										<StatIcon
											className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
										/>
										<div className="text-3xl font-bold text-foreground mb-2">
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

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<Card className="max-w-4xl mx-auto overflow-hidden">
						<CardContent className="p-8 bg-gradient-to-r from-accent/5 to-secondary/5">
							<Zap className="w-12 h-12 text-accent mx-auto mb-4" />
							<h3 className="text-2xl font-bold text-foreground mb-4">
								Ready to Join Our Family?
							</h3>
							<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
								Experience the difference at Happy Child School. Schedule a
								campus visit or start your admission process today and give your
								child the best educational foundation.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors duration-300"
								>
									Schedule Campus Visit
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-8 py-3 border border-accent text-accent rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
								>
									Download Prospectus
								</motion.button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
