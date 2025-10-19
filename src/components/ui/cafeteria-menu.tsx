"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
	ChefHat,
	Clock,
	Star,
	Leaf,
	Users,
	Calendar,
	Apple,
	Coffee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CafeteriaMenu() {
	const [selectedMeal, setSelectedMeal] = useState("breakfast");

	const menuData = {
		breakfast: [
			{
				name: "Aloo Paratha",
				description: "Spiced potato flatbread with yogurt",
				type: "Indian",
				icon: "🥖",
			},
			{
				name: "Upma",
				description: "Semolina porridge with vegetables",
				type: "South Indian",
				icon: "🍲",
			},
			{
				name: "Poha",
				description: "Flattened rice with onions and spices",
				type: "Maharashtrian",
				icon: "🍚",
			},
			{
				name: "Fresh Fruits",
				description: "Seasonal fruits and juice",
				type: "Healthy",
				icon: "🍎",
			},
		],
		lunch: [
			{
				name: "Dal Rice",
				description: "Lentil curry with steamed rice",
				type: "Traditional",
				icon: "🍛",
			},
			{
				name: "Roti & Sabzi",
				description: "Wheat bread with vegetable curry",
				type: "North Indian",
				icon: "🥘",
			},
			{
				name: "Curd Rice",
				description: "Yogurt rice with pickle",
				type: "South Indian",
				icon: "🍚",
			},
			{
				name: "Mixed Salad",
				description: "Fresh vegetables and greens",
				type: "Healthy",
				icon: "🥗",
			},
		],
		snacks: [
			{
				name: "Samosa",
				description: "Crispy pastry with potato filling",
				type: "Snack",
				icon: "🥟",
			},
			{
				name: "Sandwich",
				description: "Grilled vegetable sandwich",
				type: "Continental",
				icon: "🥪",
			},
			{
				name: "Fresh Juice",
				description: "Seasonal fruit juices",
				type: "Beverage",
				icon: "🧃",
			},
			{
				name: "Biscuits",
				description: "Assorted healthy biscuits",
				type: "Light",
				icon: "🍪",
			},
		],
		dinner: [
			{
				name: "Khichdi",
				description: "Rice and lentil comfort food",
				type: "Traditional",
				icon: "🍲",
			},
			{
				name: "Chapati & Dal",
				description: "Flatbread with lentil curry",
				type: "Indian",
				icon: "🥘",
			},
			{
				name: "Vegetable Curry",
				description: "Seasonal mixed vegetables",
				type: "Nutritious",
				icon: "🥬",
			},
			{
				name: "Warm Milk",
				description: "Fresh milk with turmeric",
				type: "Beverage",
				icon: "🥛",
			},
		],
	};

	const nutritionStats = [
		{
			label: "Balanced Nutrition",
			value: "100%",
			icon: Leaf,
			color: "text-green-500",
		},
		{
			label: "Fresh Ingredients",
			value: "Daily",
			icon: Apple,
			color: "text-red-500",
		},
		{
			label: "Hygiene Rating",
			value: "A+",
			icon: Star,
			color: "text-yellow-500",
		},
		{
			label: "Students Served",
			value: "500+",
			icon: Users,
			color: "text-blue-500",
		},
	];

	const mealTimes = [
		{
			id: "breakfast",
			name: "Breakfast",
			time: "7:00 - 9:00 AM",
			icon: Coffee,
		},
		{ id: "lunch", name: "Lunch", time: "12:30 - 2:00 PM", icon: ChefHat },
		{
			id: "snacks",
			name: "Evening Snacks",
			time: "4:00 - 5:30 PM",
			icon: Apple,
		},
		{ id: "dinner", name: "Dinner", time: "7:00 - 9:00 PM", icon: Users },
	];

	return (
		<section className="py-16 lg:py-24">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 mb-6">
						<ChefHat className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Cafeteria Menu</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">
							Nutritious & Delicious
						</span>
						<br />
						Meals Every Day
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Our expert chefs prepare fresh, healthy, and delicious meals daily.
						We focus on balanced nutrition to fuel your child&apos;s growth and
						learning.
					</p>
				</motion.div>

				{/* Nutrition Stats */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
				>
					{nutritionStats.map((stat, index) => {
						const StatIcon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
							>
								<Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
									<CardContent className="p-4">
										<StatIcon
											className={`w-8 h-8 mx-auto mb-2 ${stat.color}`}
										/>
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

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Meal Time Navigation */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="lg:col-span-1"
					>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Clock className="w-5 h-5 mr-2 text-primary" />
									Meal Timings
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{mealTimes.map((meal) => {
									const MealIcon = meal.icon;
									return (
										<motion.button
											key={meal.id}
											onClick={() => setSelectedMeal(meal.id)}
											className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
												selectedMeal === meal.id
													? "bg-primary text-primary-foreground shadow-lg"
													: "bg-muted hover:bg-muted/80"
											}`}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<div className="flex items-center">
												<MealIcon
													className={`w-5 h-5 mr-3 ${
														selectedMeal === meal.id
															? "text-white"
															: "text-primary"
													}`}
												/>
												<div>
													<div className="font-semibold">{meal.name}</div>
													<div
														className={`text-sm ${
															selectedMeal === meal.id
																? "text-white/80"
																: "text-muted-foreground"
														}`}
													>
														{meal.time}
													</div>
												</div>
											</div>
										</motion.button>
									);
								})}
							</CardContent>
						</Card>

						{/* Today's Special */}
						<Card className="mt-6 border-accent/20">
							<CardHeader>
								<CardTitle className="text-accent">
									Today&apos;s Special
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center">
										<span className="text-2xl mr-3">🍛</span>
										<div>
											<div className="font-semibold text-foreground">
												Rajma Chawal
											</div>
											<div className="text-sm text-muted-foreground">
												Kidney bean curry with rice
											</div>
										</div>
									</div>
									<div className="flex items-center">
										<span className="text-2xl mr-3">🥮</span>
										<div>
											<div className="font-semibold text-foreground">
												Gulab Jamun
											</div>
											<div className="text-sm text-muted-foreground">
												Sweet dessert
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Menu Display */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="lg:col-span-2"
					>
						<Card>
							<CardHeader>
								<CardTitle className="capitalize">
									{selectedMeal} Menu
								</CardTitle>
							</CardHeader>
							<CardContent>
								<motion.div
									key={selectedMeal}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
									className="grid md:grid-cols-2 gap-4"
								>
									{menuData[selectedMeal as keyof typeof menuData].map(
										(item, index) => (
											<motion.div
												key={item.name}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3, delay: 0.1 * index }}
												className="group"
											>
												<Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-border/50">
													<CardContent className="p-4">
														<div className="flex items-start">
															<span className="text-3xl mr-3 group-hover:scale-110 transition-transform duration-300">
																{item.icon}
															</span>
															<div className="flex-1">
																<div className="flex items-center justify-between mb-1">
																	<h4 className="font-semibold text-foreground">
																		{item.name}
																	</h4>
																	<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
																		{item.type}
																	</span>
																</div>
																<p className="text-sm text-muted-foreground">
																	{item.description}
																</p>
															</div>
														</div>
													</CardContent>
												</Card>
											</motion.div>
										)
									)}
								</motion.div>

								{/* Weekly Schedule Preview */}
								<div className="mt-8 p-4 bg-muted/50 rounded-lg">
									<h4 className="font-semibold text-foreground mb-3 flex items-center">
										<Calendar className="w-4 h-4 mr-2" />
										This Week&apos;s Highlights
									</h4>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
										<div className="text-center">
											<div className="font-medium text-foreground">Monday</div>
											<div className="text-muted-foreground">Chole Bhature</div>
										</div>
										<div className="text-center">
											<div className="font-medium text-foreground">
												Wednesday
											</div>
											<div className="text-muted-foreground">Pav Bhaji</div>
										</div>
										<div className="text-center">
											<div className="font-medium text-foreground">Friday</div>
											<div className="text-muted-foreground">
												Dosa & Chutney
											</div>
										</div>
										<div className="text-center">
											<div className="font-medium text-foreground">Sunday</div>
											<div className="text-muted-foreground">Ice Cream Day</div>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="grid grid-cols-2 gap-3 mt-6">
									<Button variant="outline" className="justify-start">
										<Calendar className="w-4 h-4 mr-2" />
										Full Weekly Menu
									</Button>
									<Button className="justify-start bg-gradient-to-r from-orange-500 to-red-500 text-white">
										<ChefHat className="w-4 h-4 mr-2" />
										Request Special Diet
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
