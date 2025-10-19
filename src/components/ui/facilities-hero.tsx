"use client";

import { motion } from "framer-motion";
import { Building2, Map, Users, Utensils, Heart, Wifi } from "lucide-react";

export function FacilitiesHero() {
	const features = [
		{
			icon: Building2,
			title: "Smart Campus",
			description: "Modern infrastructure with cutting-edge technology",
		},
		{
			icon: Map,
			title: "Interactive Map",
			description: "Navigate our campus with ease",
		},
		{
			icon: Users,
			title: "Comfortable Hostels",
			description: "Home away from home experience",
		},
		{
			icon: Utensils,
			title: "Nutritious Meals",
			description: "Healthy and delicious food options",
		},
		{
			icon: Heart,
			title: "Health Care",
			description: "Complete medical and wellness support",
		},
		{
			icon: Wifi,
			title: "Digital Learning",
			description: "High-speed connectivity everywhere",
		},
	];

	return (
		<section className="relative py-20 lg:py-32 overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
			<div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

			<div className="container relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
					>
						<Building2 className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">World-Class Facilities</span>
					</motion.div>

					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Modern Campus</span>
						<br />
						Built for Excellence
					</h1>

					<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
						Experience our state-of-the-art facilities designed to provide the
						best learning environment for students. From smart classrooms to
						comfortable hostels, we have everything needed for academic and
						personal growth.
					</p>
				</motion.div>

				{/* Feature Grid */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
				>
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 * index }}
							className="group"
						>
							<div className="bg-card border border-border rounded-xl p-4 md:p-6 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
								<div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
									<feature.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
								</div>
								<h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">
									{feature.title}
								</h3>
								<p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
