"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
	MapPin,
	Navigation,
	Zap,
	Trees,
	BookOpen,
	Coffee,
	Users,
	Car,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InteractiveCampusMap() {
	const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

	const locations = [
		{
			id: 1,
			name: "Main Academic Block",
			icon: BookOpen,
			description:
				"State-of-the-art classrooms with smart boards and modern teaching aids",
			position: { top: "30%", left: "40%" },
			color: "from-blue-500 to-purple-600",
		},
		{
			id: 2,
			name: "Science Laboratory",
			icon: Zap,
			description:
				"Fully equipped physics, chemistry, and biology labs for hands-on learning",
			position: { top: "25%", left: "60%" },
			color: "from-green-500 to-blue-500",
		},
		{
			id: 3,
			name: "Library & Resource Center",
			icon: BookOpen,
			description:
				"Modern library with digital resources and quiet study spaces",
			position: { top: "45%", left: "35%" },
			color: "from-purple-500 to-pink-500",
		},
		{
			id: 4,
			name: "Student Hostel",
			icon: Users,
			description: "Comfortable accommodation with all modern amenities",
			position: { top: "60%", left: "70%" },
			color: "from-orange-500 to-red-500",
		},
		{
			id: 5,
			name: "Cafeteria",
			icon: Coffee,
			description:
				"Spacious dining hall serving nutritious and delicious meals",
			position: { top: "70%", left: "45%" },
			color: "from-yellow-500 to-orange-500",
		},
		{
			id: 6,
			name: "Sports Complex",
			icon: Users,
			description:
				"Multi-purpose sports facilities including indoor and outdoor games",
			position: { top: "50%", left: "80%" },
			color: "from-teal-500 to-green-500",
		},
		{
			id: 7,
			name: "Garden & Recreation",
			icon: Trees,
			description: "Beautiful landscaped gardens and recreational areas",
			position: { top: "80%", left: "25%" },
			color: "from-green-400 to-teal-500",
		},
		{
			id: 8,
			name: "Transport Hub",
			icon: Car,
			description: "Safe and reliable transportation services",
			position: { top: "35%", left: "15%" },
			color: "from-indigo-500 to-blue-600",
		},
	];

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
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
						<MapPin className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Campus Tour</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						Explore Our{" "}
						<span className="text-gradient-primary">Interactive Campus</span>
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Navigate through our campus facilities with our interactive map.
						Click on any location to learn more about what makes our campus
						special.
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
					{/* Interactive Map */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="relative"
					>
						<Card className="relative aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-dashed border-primary/20 overflow-hidden">
							<CardContent className="relative h-full p-0">
								{/* Campus Background */}
								<div className="absolute inset-4 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
									{/* Building Shapes */}
									<div className="absolute top-[25%] left-[35%] w-20 h-16 bg-blue-200 dark:bg-blue-800/50 rounded"></div>
									<div className="absolute top-[20%] left-[55%] w-16 h-12 bg-green-200 dark:bg-green-800/50 rounded"></div>
									<div className="absolute top-[40%] left-[30%] w-18 h-14 bg-purple-200 dark:bg-purple-800/50 rounded"></div>
									<div className="absolute top-[55%] left-[65%] w-22 h-18 bg-orange-200 dark:bg-orange-800/50 rounded"></div>
									<div className="absolute top-[65%] left-[40%] w-24 h-16 bg-yellow-200 dark:bg-yellow-800/50 rounded"></div>
									<div className="absolute top-[45%] left-[75%] w-20 h-20 bg-teal-200 dark:bg-teal-800/50 rounded-full"></div>
									<div className="absolute top-[75%] left-[20%] w-16 h-16 bg-green-300 dark:bg-green-700/50 rounded-full"></div>
									<div className="absolute top-[30%] left-[10%] w-14 h-12 bg-indigo-200 dark:bg-indigo-800/50 rounded"></div>
								</div>

								{/* Location Markers */}
								{locations.map((location) => (
									<motion.button
										key={location.id}
										className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
										style={{
											top: location.position.top,
											left: location.position.left,
										}}
										onClick={() => setSelectedLocation(location.id)}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
									>
										<div
											className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r ${
												location.color
											} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
												selectedLocation === location.id
													? "ring-4 ring-primary/30 scale-110"
													: "hover:ring-2 hover:ring-primary/20"
											}`}
										>
											<location.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
										</div>

										{/* Pulse Animation */}
										<div
											className={`absolute inset-0 bg-gradient-to-r ${location.color} rounded-full animate-ping opacity-30`}
										></div>
									</motion.button>
								))}

								{/* Navigation Icon */}
								<div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg">
									<Navigation className="w-5 h-5 text-primary" />
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Location Details */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="space-y-4"
					>
						{selectedLocation ? (
							<Card className="border-primary/20 shadow-lg">
								<CardContent className="p-6">
									{(() => {
										const location = locations.find(
											(l) => l.id === selectedLocation
										);
										if (!location) return null;

										return (
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3 }}
											>
												<div className="flex items-center mb-4">
													<div
														className={`w-12 h-12 bg-gradient-to-r ${location.color} rounded-xl flex items-center justify-center mr-4`}
													>
														<location.icon className="w-6 h-6 text-white" />
													</div>
													<h3 className="text-xl font-bold text-foreground">
														{location.name}
													</h3>
												</div>
												<p className="text-muted-foreground mb-6">
													{location.description}
												</p>
												<Button className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90">
													Take Virtual Tour
												</Button>
											</motion.div>
										);
									})()}
								</CardContent>
							</Card>
						) : (
							<Card className="border-dashed border-primary/30">
								<CardContent className="p-8 text-center">
									<MapPin className="w-16 h-16 text-primary/50 mx-auto mb-4" />
									<h3 className="text-lg font-semibold text-foreground mb-2">
										Select a Location
									</h3>
									<p className="text-muted-foreground">
										Click on any marker on the map to explore our campus
										facilities
									</p>
								</CardContent>
							</Card>
						)}

						{/* Quick Links */}
						<div className="grid grid-cols-2 gap-3">
							{locations.slice(0, 4).map((location) => (
								<motion.button
									key={location.id}
									onClick={() => setSelectedLocation(location.id)}
									className="p-3 bg-card border border-border rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-300 text-left group"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<div className="flex items-center">
										<div
											className={`w-8 h-8 bg-gradient-to-r ${location.color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300`}
										>
											<location.icon className="w-4 h-4 text-white" />
										</div>
										<span className="text-sm font-medium text-foreground">
											{location.name}
										</span>
									</div>
								</motion.button>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
