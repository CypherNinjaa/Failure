"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
	Heart,
	Star,
	MessageCircle,
	Users,
	Home,
	Utensils,
	BookOpen,
	Gamepad2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function HostelLifeGallery() {
	const [activeTestimonial, setActiveTestimonial] = useState(0);

	const hostelFeatures = [
		{
			icon: Home,
			title: "Comfortable Rooms",
			description: "Spacious rooms with modern amenities",
			color: "from-blue-500 to-purple-600",
		},
		{
			icon: Utensils,
			title: "Nutritious Meals",
			description: "Healthy and delicious food options",
			color: "from-green-500 to-teal-500",
		},
		{
			icon: BookOpen,
			title: "Study Areas",
			description: "Quiet spaces for focused learning",
			color: "from-orange-500 to-red-500",
		},
		{
			icon: Gamepad2,
			title: "Recreation",
			description: "Fun activities and entertainment",
			color: "from-purple-500 to-pink-500",
		},
	];

	const testimonials = [
		{
			id: 1,
			name: "Priya Sharma",
			grade: "Class 10",
			image: "/api/placeholder/80/80",
			quote:
				"The hostel feels like a second home. The wardens are caring, and I've made lifelong friends here.",
			rating: 5,
			highlights: ["Friendly Environment", "Great Food", "Study Support"],
		},
		{
			id: 2,
			name: "Rahul Kumar",
			grade: "Class 8",
			image: "/api/placeholder/80/80",
			quote:
				"I love the evening study hours and recreational activities. It's the perfect balance of fun and learning.",
			rating: 5,
			highlights: ["Balanced Schedule", "Fun Activities", "Academic Support"],
		},
		{
			id: 3,
			name: "Anita Patel",
			grade: "Class 9",
			image: "/api/placeholder/80/80",
			quote:
				"The hostel staff takes great care of us. The rooms are clean and comfortable, and the food is delicious.",
			rating: 5,
			highlights: ["Clean Facilities", "Caring Staff", "Nutritious Food"],
		},
	];

	const galleryImages = [
		{
			id: 1,
			title: "Modern Dormitories",
			category: "Accommodation",
			image: "/api/placeholder/400/300",
		},
		{
			id: 2,
			title: "Dining Hall",
			category: "Facilities",
			image: "/api/placeholder/400/300",
		},
		{
			id: 3,
			title: "Study Room",
			category: "Academic",
			image: "/api/placeholder/400/300",
		},
		{
			id: 4,
			title: "Recreation Area",
			category: "Activities",
			image: "/api/placeholder/400/300",
		},
		{
			id: 5,
			title: "Garden Area",
			category: "Outdoor",
			image: "/api/placeholder/400/300",
		},
		{
			id: 6,
			title: "Common Room",
			category: "Social",
			image: "/api/placeholder/400/300",
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
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<Home className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Hostel Life</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						Your{" "}
						<span className="text-gradient-primary">Home Away from Home</span>
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Experience comfortable and secure living in our modern hostel
						facilities. Where students build friendships, develop independence,
						and create lasting memories.
					</p>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
				>
					{hostelFeatures.map((feature, index) => {
						const FeatureIcon = feature.icon;
						return (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
								className="group"
							>
								<Card className="text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
									<CardContent className="p-6">
										<div
											className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
										>
											<FeatureIcon className="w-8 h-8 text-white" />
										</div>
										<h3 className="font-semibold text-foreground mb-2">
											{feature.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Gallery and Testimonials */}
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Photo Gallery */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h3 className="text-2xl font-bold text-foreground mb-6">
							Hostel Gallery
						</h3>
						<div className="grid grid-cols-2 gap-4">
							{galleryImages.map((image, index) => (
								<motion.div
									key={image.id}
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5, delay: 0.1 * index }}
									viewport={{ once: true }}
									className="group cursor-pointer"
								>
									<Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
										<CardContent className="p-0">
											<div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
												{/* Placeholder Image */}
												<div className="absolute inset-0 bg-gradient-to-br from-muted to-primary/20 flex items-center justify-center">
													<Home className="w-12 h-12 text-primary/50" />
												</div>

												{/* Overlay */}
												<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
													<div className="text-white text-center">
														<h4 className="font-semibold mb-1">
															{image.title}
														</h4>
														<p className="text-sm opacity-90">
															{image.category}
														</p>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Student Testimonials */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h3 className="text-2xl font-bold text-foreground mb-6">
							Student Experiences
						</h3>

						<Card className="border-primary/20 shadow-lg">
							<CardContent className="p-6">
								<motion.div
									key={activeTestimonial}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
									className="space-y-6"
								>
									{/* Student Info */}
									<div className="flex items-center">
										<div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mr-4">
											<Users className="w-8 h-8 text-white" />
										</div>
										<div>
											<h4 className="font-semibold text-foreground">
												{testimonials[activeTestimonial].name}
											</h4>
											<p className="text-sm text-muted-foreground">
												{testimonials[activeTestimonial].grade}
											</p>
										</div>
									</div>

									{/* Rating */}
									<div className="flex space-x-1">
										{Array.from({ length: 5 }).map((_, i) => (
											<Star
												key={i}
												className={`w-5 h-5 ${
													i < testimonials[activeTestimonial].rating
														? "text-yellow-400 fill-current"
														: "text-gray-300"
												}`}
											/>
										))}
									</div>

									{/* Quote */}
									<blockquote className="text-foreground italic">
										&ldquo;{testimonials[activeTestimonial].quote}&rdquo;
									</blockquote>

									{/* Highlights */}
									<div className="flex flex-wrap gap-2">
										{testimonials[activeTestimonial].highlights.map(
											(highlight, index) => (
												<span
													key={index}
													className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
												>
													{highlight}
												</span>
											)
										)}
									</div>
								</motion.div>

								{/* Testimonial Navigation */}
								<div className="flex justify-center space-x-2 mt-6">
									{testimonials.map((_, index) => (
										<button
											key={index}
											onClick={() => setActiveTestimonial(index)}
											className={`w-3 h-3 rounded-full transition-all duration-300 ${
												index === activeTestimonial
													? "bg-primary w-8"
													: "bg-muted-foreground/30"
											}`}
										/>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<div className="grid grid-cols-2 gap-3 mt-6">
							<Button variant="outline" className="justify-start">
								<MessageCircle className="w-4 h-4 mr-2" />
								Chat with Students
							</Button>
							<Button className="justify-start bg-gradient-to-r from-accent to-accent/80">
								<Heart className="w-4 h-4 mr-2" />
								Apply for Hostel
							</Button>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
