"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	GraduationCap,
	Users,
	Trophy,
	Star,
	ArrowRight,
	Calendar,
	MapPin,
	Clock,
	Phone,
	Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AdmissionsHero() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const stats = [
		{
			icon: Users,
			value: "2000+",
			label: "Happy Students",
			description: "Successfully enrolled",
		},
		{
			icon: GraduationCap,
			value: "95%",
			label: "Success Rate",
			description: "Academic excellence",
		},
		{
			icon: Trophy,
			value: "150+",
			label: "Awards Won",
			description: "Student achievements",
		},
		{
			icon: Star,
			value: "4.9/5",
			label: "Parent Rating",
			description: "Community satisfaction",
		},
	];

	const admissionHighlights = [
		{
			title: "Open Admissions",
			description: "Now accepting applications for Academic Year 2024-25",
			date: "Deadline: March 31, 2024",
			status: "active",
		},
		{
			title: "Entrance Test",
			description: "Scheduled for Classes 6th to 10th",
			date: "April 15, 2024",
			status: "upcoming",
		},
		{
			title: "Merit List",
			description: "Results will be announced",
			date: "April 25, 2024",
			status: "pending",
		},
	];

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
				<div className="container">
					<div className="text-center">
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
							Admissions Open
						</h1>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
			</div>

			<div className="container relative">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Content Section */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="space-y-8"
					>
						<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
							<GraduationCap className="w-4 h-4 mr-2" />
							<span className="text-sm font-medium">Admissions 2024-25</span>
						</div>

						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
							<span className="text-gradient-primary">Shape Your</span>
							<br />
							<span className="text-foreground">Future Today</span>
						</h1>

						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
							Join Happy Child School and embark on a transformative educational
							journey. We nurture young minds with world-class facilities,
							experienced faculty, and innovative teaching methods.
						</p>

						<div className="flex flex-col sm:flex-row gap-4">
							<Button
								size="lg"
								className="bg-accent hover:bg-accent/90 text-accent-foreground group"
							>
								Apply Now
								<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
							>
								Download Brochure
							</Button>
						</div>

						{/* Quick Contact */}
						<div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
							<div className="flex items-center">
								<Phone className="w-4 h-4 mr-2 text-accent" />
								<span>+91 98765 43210</span>
							</div>
							<div className="flex items-center">
								<Mail className="w-4 h-4 mr-2 text-accent" />
								<span>admissions@happychildschool.edu</span>
							</div>
						</div>
					</motion.div>

					{/* Stats and Highlights Section */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="space-y-8"
					>
						{/* Stats Grid */}
						<div className="grid grid-cols-2 gap-4">
							{stats.map((stat, index) => {
								const StatIcon = stat.icon;
								return (
									<motion.div
										key={stat.label}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
									>
										<Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/30">
											<CardContent className="p-4">
												<StatIcon className="w-8 h-8 text-accent mx-auto mb-2" />
												<div className="text-2xl font-bold text-foreground mb-1">
													{stat.value}
												</div>
												<div className="text-sm font-medium text-foreground mb-1">
													{stat.label}
												</div>
												<div className="text-xs text-muted-foreground">
													{stat.description}
												</div>
											</CardContent>
										</Card>
									</motion.div>
								);
							})}
						</div>

						{/* Admission Timeline */}
						<Card className="overflow-hidden">
							<CardContent className="p-6">
								<h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
									<Calendar className="w-5 h-5 mr-2 text-accent" />
									Admission Timeline
								</h3>
								<div className="space-y-4">
									{admissionHighlights.map((highlight, index) => (
										<motion.div
											key={highlight.title}
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
											className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
										>
											<div
												className={`w-3 h-3 rounded-full mt-2 ${
													highlight.status === "active"
														? "bg-green-500"
														: highlight.status === "upcoming"
														? "bg-yellow-500"
														: "bg-gray-400"
												}`}
											></div>
											<div className="flex-1">
												<h4 className="font-medium text-foreground">
													{highlight.title}
												</h4>
												<p className="text-sm text-muted-foreground">
													{highlight.description}
												</p>
												<div className="flex items-center mt-1 text-xs text-accent">
													<Clock className="w-3 h-3 mr-1" />
													{highlight.date}
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Quick Info */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.8 }}
							className="p-6 rounded-xl bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20"
						>
							<h3 className="font-bold text-foreground mb-2">
								Visit Our Campus
							</h3>
							<p className="text-sm text-muted-foreground mb-3">
								Schedule a personalized campus tour and experience our
								facilities firsthand.
							</p>
							<div className="flex items-center text-sm text-muted-foreground">
								<MapPin className="w-4 h-4 mr-2 text-accent" />
								<span>Sector 15, Education Hub, New Delhi</span>
							</div>
						</motion.div>
					</motion.div>
				</div>

				{/* Scroll Indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 1.2 }}
					className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
				>
					<motion.div
						animate={{ y: [0, 10, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center"
					>
						<motion.div
							animate={{ y: [0, 16, 0] }}
							transition={{ duration: 2, repeat: Infinity }}
							className="w-1 h-3 bg-accent rounded-full mt-2"
						></motion.div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
