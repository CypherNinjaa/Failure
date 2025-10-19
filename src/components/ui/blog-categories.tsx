"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
	BookOpen,
	Users,
	Trophy,
	Lightbulb,
	Heart,
	Star,
	TrendingUp,
} from "lucide-react";

interface BlogCategory {
	id: string;
	name: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	count: number;
	trending: boolean;
}

export function BlogCategories() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const categories: BlogCategory[] = [
		{
			id: "education",
			name: "Education",
			description:
				"Teaching methods, curriculum updates, and educational insights",
			icon: BookOpen,
			color: "from-blue-500 to-cyan-500",
			count: 45,
			trending: true,
		},
		{
			id: "student-life",
			name: "Student Life",
			description: "Campus activities, student experiences, and school events",
			icon: Users,
			color: "from-purple-500 to-pink-500",
			count: 32,
			trending: false,
		},
		{
			id: "achievements",
			name: "Achievements",
			description: "Student accomplishments, awards, and success stories",
			icon: Trophy,
			color: "from-yellow-500 to-orange-500",
			count: 28,
			trending: true,
		},
		{
			id: "innovation",
			name: "Innovation",
			description:
				"Technology in education, creative projects, and future learning",
			icon: Lightbulb,
			color: "from-green-500 to-emerald-500",
			count: 19,
			trending: false,
		},
		{
			id: "community",
			name: "Community",
			description:
				"Parent engagement, teacher spotlights, and school community",
			icon: Heart,
			color: "from-red-500 to-rose-500",
			count: 24,
			trending: false,
		},
		{
			id: "announcements",
			name: "Announcements",
			description: "Important updates, events, and school notifications",
			icon: Star,
			color: "from-indigo-500 to-blue-500",
			count: 16,
			trending: true,
		},
	];

	return (
		<section className="py-16 bg-muted/30">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium mb-4">
						<span className="mr-2">📂</span>
						Browse Categories
					</div>
					<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Explore by Topic
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Find articles that interest you most by browsing our organized
						categories
					</p>
				</motion.div>

				{/* Categories Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
					{categories.map((category, index) => {
						const IconComponent = category.icon;
						const isSelected = selectedCategory === category.id;

						return (
							<motion.div
								key={category.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								className={`relative group cursor-pointer transition-all duration-300 ${
									isSelected ? "scale-105" : "hover:scale-105"
								}`}
								onClick={() =>
									setSelectedCategory(isSelected ? null : category.id)
								}
							>
								<div
									className={`
									relative p-6 rounded-2xl border-2 transition-all duration-300
									${
										isSelected
											? "border-primary bg-card shadow-xl"
											: "border-border hover:border-primary/50 bg-card hover:shadow-lg"
									}
								`}
								>
									{/* Trending Badge */}
									{category.trending && (
										<div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
											<TrendingUp className="w-3 h-3 mr-1" />
											Trending
										</div>
									)}

									{/* Icon */}
									<div
										className={`
										w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} 
										flex items-center justify-center mb-4 shadow-lg
										${isSelected ? "scale-110" : "group-hover:scale-110"}
										transition-transform duration-300
									`}
									>
										<IconComponent className="w-8 h-8 text-white" />
									</div>

									{/* Content */}
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
												{category.name}
											</h3>
											<div className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-lg">
												{category.count}
											</div>
										</div>

										<p className="text-muted-foreground text-sm leading-relaxed">
											{category.description}
										</p>

										{/* View Articles Button */}
										<motion.div
											className={`
												mt-4 text-sm font-medium transition-all duration-300
												${
													isSelected
														? "text-primary"
														: "text-muted-foreground group-hover:text-primary"
												}
											`}
										>
											{isSelected ? "✓ Selected" : "View Articles →"}
										</motion.div>
									</div>

									{/* Hover Effect Background */}
									<div
										className={`
										absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
										bg-gradient-to-br ${category.color} transition-opacity duration-300
									`}
									/>
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* Selected Category Info */}
				{selectedCategory && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="mt-12 max-w-2xl mx-auto"
					>
						<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
							<div className="text-center">
								<h3 className="text-lg font-semibold text-foreground mb-2">
									Browsing:{" "}
									{categories.find((c) => c.id === selectedCategory)?.name}
								</h3>
								<p className="text-muted-foreground text-sm mb-4">
									{
										categories.find((c) => c.id === selectedCategory)
											?.description
									}
								</p>
								<button
									onClick={() => setSelectedCategory(null)}
									className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
								>
									Clear Selection
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</section>
	);
}
