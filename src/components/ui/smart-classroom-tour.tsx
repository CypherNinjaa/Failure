"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
	Play,
	X,
	Monitor,
	Wifi,
	Camera,
	Users,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SmartClassroomTour() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);

	const classroomFeatures = [
		{
			title: "Interactive Smart Boards",
			description:
				"75-inch 4K interactive displays with touch functionality for engaging lessons",
			image: "/api/placeholder/600/400",
			icon: Monitor,
			color: "from-blue-500 to-cyan-500",
		},
		{
			title: "High-Speed WiFi",
			description:
				"Gigabit internet connectivity ensuring seamless online learning experience",
			image: "/api/placeholder/600/400",
			icon: Wifi,
			color: "from-green-500 to-teal-500",
		},
		{
			title: "HD Document Cameras",
			description:
				"Professional document cameras for crystal clear presentation of materials",
			image: "/api/placeholder/600/400",
			icon: Camera,
			color: "from-purple-500 to-pink-500",
		},
		{
			title: "Collaborative Spaces",
			description:
				"Flexible seating arrangements designed for group work and discussions",
			image: "/api/placeholder/600/400",
			icon: Users,
			color: "from-orange-500 to-red-500",
		},
	];

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % classroomFeatures.length);
	};

	const prevSlide = () => {
		setCurrentSlide(
			(prev) => (prev - 1 + classroomFeatures.length) % classroomFeatures.length
		);
	};

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
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
						<Monitor className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Virtual Tour</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Smart Classrooms</span>
						<br />
						of the Future
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Step inside our technology-enhanced learning spaces where innovation
						meets education. Experience how we blend traditional teaching with
						cutting-edge technology.
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
					{/* Virtual Tour Video/Image */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="relative order-2 lg:order-1"
					>
						<Card className="overflow-hidden shadow-xl">
							<CardContent className="p-0 relative">
								<div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
									{/* Background Pattern */}
									<div className="absolute inset-0 opacity-10">
										<div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-lg transform rotate-12"></div>
										<div className="absolute top-1/2 right-1/4 w-24 h-24 bg-secondary rounded-lg transform -rotate-12"></div>
										<div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-accent rounded-lg transform rotate-45"></div>
									</div>

									{!isVideoPlaying ? (
										<>
											<Button
												size="lg"
												className="bg-white/90 text-primary hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
												onClick={() => setIsVideoPlaying(true)}
											>
												<Play className="w-6 h-6 mr-2" />
												Take Virtual Tour
											</Button>
											<div className="absolute top-4 right-4 bg-white/90 text-primary px-3 py-1 rounded-full text-sm font-medium">
												360° Tour
											</div>
										</>
									) : (
										<div className="absolute inset-0 bg-black flex items-center justify-center">
											<Button
												variant="ghost"
												size="sm"
												className="absolute top-4 right-4 text-white hover:bg-white/20"
												onClick={() => setIsVideoPlaying(false)}
											>
												<X className="w-5 h-5" />
											</Button>
											<div className="text-white text-center">
												<div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
												<p>Loading Virtual Tour...</p>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Tour Stats */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="grid grid-cols-3 gap-4 mt-6"
						>
							{[
								{ number: "25+", label: "Smart Classrooms" },
								{ number: "360°", label: "Virtual Experience" },
								{ number: "4K", label: "Display Quality" },
							].map((stat, index) => (
								<Card
									key={index}
									className="text-center bg-card/50 backdrop-blur"
								>
									<CardContent className="p-4">
										<div className="text-2xl font-bold text-primary mb-1">
											{stat.number}
										</div>
										<div className="text-sm text-muted-foreground">
											{stat.label}
										</div>
									</CardContent>
								</Card>
							))}
						</motion.div>
					</motion.div>

					{/* Features Showcase */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="order-1 lg:order-2"
					>
						<Card className="border-primary/20 shadow-lg">
							<CardContent className="p-6">
								{/* Feature Navigation */}
								<div className="flex justify-between items-center mb-6">
									<h3 className="text-xl font-bold text-foreground">
										Classroom Features
									</h3>
									<div className="flex space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={prevSlide}
											className="w-8 h-8 p-0"
										>
											<ChevronLeft className="w-4 h-4" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={nextSlide}
											className="w-8 h-8 p-0"
										>
											<ChevronRight className="w-4 h-4" />
										</Button>
									</div>
								</div>

								{/* Current Feature */}
								<motion.div
									key={currentSlide}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3 }}
									className="space-y-4"
								>
									{(() => {
										const CurrentIcon = classroomFeatures[currentSlide].icon;
										return (
											<>
												<div className="flex items-center mb-4">
													<div
														className={`w-12 h-12 bg-gradient-to-r ${classroomFeatures[currentSlide].color} rounded-xl flex items-center justify-center mr-4`}
													>
														<CurrentIcon className="w-6 h-6 text-white" />
													</div>
													<h4 className="text-lg font-semibold text-foreground">
														{classroomFeatures[currentSlide].title}
													</h4>
												</div>

												<p className="text-muted-foreground">
													{classroomFeatures[currentSlide].description}
												</p>

												{/* Feature Preview */}
												<div className="aspect-video rounded-lg bg-gradient-to-br from-muted/50 to-primary/10 flex items-center justify-center">
													<div
														className={`w-16 h-16 bg-gradient-to-r ${classroomFeatures[currentSlide].color} rounded-2xl flex items-center justify-center animate-pulse`}
													>
														<CurrentIcon className="w-8 h-8 text-white" />
													</div>
												</div>
											</>
										);
									})()}
								</motion.div>

								{/* Feature Indicators */}
								<div className="flex justify-center space-x-2 mt-6">
									{classroomFeatures.map((_, index) => (
										<button
											key={index}
											onClick={() => setCurrentSlide(index)}
											className={`w-2 h-2 rounded-full transition-all duration-300 ${
												index === currentSlide
													? "bg-primary w-6"
													: "bg-muted-foreground/30"
											}`}
										/>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Quick Access */}
						<div className="grid grid-cols-2 gap-3 mt-6">
							<Button variant="outline" className="justify-start">
								<Camera className="w-4 h-4 mr-2" />
								Live View
							</Button>
							<Button variant="outline" className="justify-start">
								<Users className="w-4 h-4 mr-2" />
								Book Tour
							</Button>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
