"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Users,
	Brain,
	Palette,
	Calculator,
	Globe,
	Microscope,
	Music,
	ArrowRight,
	Star,
	Award,
	Calendar,
} from "lucide-react";

export function CurriculumOverview() {
	const curriculumLevels = [
		{
			title: "Primary Level",
			subtitle: "1st - 5th Grade",
			description:
				"Building strong foundations through play-based learning, fundamental literacy, and numeracy skills development.",
			icon: Users,
			color: "from-blue-500 to-blue-600",
			bgGradient: "from-blue-50 to-blue-100",
			darkBgGradient: "from-blue-950 to-blue-900",
			features: [
				"Interactive storytelling and reading",
				"Hands-on mathematical concepts",
				"Creative arts and crafts",
				"Basic science exploration",
				"Physical education and games",
				"Moral values and character building",
			],
			subjects: [
				{ name: "English", icon: BookOpen },
				{ name: "Mathematics", icon: Calculator },
				{ name: "Science", icon: Microscope },
				{ name: "Arts", icon: Palette },
				{ name: "Music", icon: Music },
				{ name: "Physical Education", icon: Users },
			],
			highlights: {
				approach: "Play-based Learning",
				focus: "Foundation Building",
				assessment: "Continuous Assessment",
			},
		},
		{
			title: "Middle School",
			subtitle: "6th - 8th Grade",
			description:
				"Transitioning to comprehensive learning with subject specialization, critical thinking, and enhanced academic rigor.",
			icon: Brain,
			color: "from-purple-500 to-purple-600",
			bgGradient: "from-purple-50 to-purple-100",
			darkBgGradient: "from-purple-950 to-purple-900",
			features: [
				"Subject-specific specialization",
				"Project-based learning",
				"Laboratory experiments",
				"Digital literacy programs",
				"Leadership development",
				"Community service projects",
			],
			subjects: [
				{ name: "Advanced English", icon: BookOpen },
				{ name: "Algebra & Geometry", icon: Calculator },
				{ name: "Physics & Chemistry", icon: Microscope },
				{ name: "Social Studies", icon: Globe },
				{ name: "Computer Science", icon: Brain },
				{ name: "Fine Arts", icon: Palette },
			],
			highlights: {
				approach: "Project-based Learning",
				focus: "Critical Thinking",
				assessment: "Portfolio Assessment",
			},
		},
		{
			title: "High School",
			subtitle: "9th - 10th Grade",
			description:
				"Preparing for board examinations with comprehensive subject mastery, career guidance, and university preparation.",
			icon: Award,
			color: "from-green-500 to-green-600",
			bgGradient: "from-green-50 to-green-100",
			darkBgGradient: "from-green-950 to-green-900",
			features: [
				"Board exam preparation",
				"Stream selection guidance",
				"Advanced laboratory work",
				"Research methodology",
				"Career counseling",
				"University admission support",
			],
			subjects: [
				{ name: "Literature & Language", icon: BookOpen },
				{ name: "Advanced Mathematics", icon: Calculator },
				{ name: "Physics, Chemistry, Biology", icon: Microscope },
				{ name: "History & Geography", icon: Globe },
				{ name: "Information Technology", icon: Brain },
				{ name: "Economics", icon: Star },
			],
			highlights: {
				approach: "Research-based Learning",
				focus: "Academic Excellence",
				assessment: "Board Preparation",
			},
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
		},
	};

	return (
		<section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
						<BookOpen className="w-4 h-4" />
						Curriculum Overview
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						Comprehensive Academic
						<span className="text-gradient-primary"> Programs</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
						Our thoughtfully designed curriculum ensures progressive learning
						from primary through high school, fostering intellectual growth,
						creativity, and critical thinking at every stage.
					</p>
				</motion.div>

				{/* Curriculum Levels */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="space-y-12 md:space-y-16"
				>
					{curriculumLevels.map((level, index) => (
						<motion.div key={index} variants={itemVariants} className="group">
							<div
								className={`relative rounded-3xl overflow-hidden ${
									index % 2 === 0 ? "" : "md:flex-row-reverse"
								}`}
							>
								{/* Background Gradient */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${level.bgGradient} dark:${level.darkBgGradient} opacity-50`}
								/>

								<div
									className={`relative grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12 ${
										index % 2 === 0 ? "" : "md:grid-cols-2"
									}`}
								>
									{/* Content Section */}
									<div
										className={`space-y-6 ${
											index % 2 === 0 ? "" : "md:order-2"
										}`}
									>
										{/* Header */}
										<div className="space-y-4">
											<div
												className={`inline-flex items-center gap-3 bg-gradient-to-r ${level.color} text-white px-6 py-3 rounded-2xl shadow-lg`}
											>
												<level.icon className="w-6 h-6" />
												<span className="font-semibold">{level.subtitle}</span>
											</div>
											<h3 className="text-3xl md:text-4xl font-bold text-foreground">
												{level.title}
											</h3>
											<p className="text-lg text-muted-foreground leading-relaxed">
												{level.description}
											</p>
										</div>

										{/* Highlights */}
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
											{Object.entries(level.highlights).map(([key, value]) => (
												<div
													key={key}
													className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 text-center"
												>
													<div className="text-sm text-muted-foreground capitalize mb-1">
														{key}
													</div>
													<div className="font-semibold text-foreground">
														{value}
													</div>
												</div>
											))}
										</div>

										{/* Features */}
										<div className="space-y-3">
											<h4 className="text-lg font-semibold text-foreground mb-4">
												Key Features:
											</h4>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												{level.features.map((feature, featureIndex) => (
													<motion.div
														key={featureIndex}
														initial={{ opacity: 0, x: -20 }}
														whileInView={{ opacity: 1, x: 0 }}
														viewport={{ once: true }}
														transition={{
															duration: 0.5,
															delay: featureIndex * 0.1,
														}}
														className="flex items-center gap-3 text-foreground"
													>
														<div
															className={`w-2 h-2 bg-gradient-to-r ${level.color} rounded-full flex-shrink-0`}
														/>
														<span className="text-sm md:text-base">
															{feature}
														</span>
													</motion.div>
												))}
											</div>
										</div>
									</div>

									{/* Subjects Grid */}
									<div className={`${index % 2 === 0 ? "" : "md:order-1"}`}>
										<div className="space-y-6">
											<h4 className="text-xl font-semibold text-foreground mb-6">
												Core Subjects:
											</h4>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
												{level.subjects.map((subject, subjectIndex) => (
													<motion.div
														key={subjectIndex}
														initial={{ opacity: 0, scale: 0.8 }}
														whileInView={{ opacity: 1, scale: 1 }}
														viewport={{ once: true }}
														transition={{
															duration: 0.5,
															delay: subjectIndex * 0.1,
															type: "spring",
															stiffness: 100,
														}}
														className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 group/subject"
													>
														<div
															className={`w-12 h-12 bg-gradient-to-r ${level.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover/subject:scale-110 transition-transform duration-300`}
														>
															<subject.icon className="w-6 h-6 text-white" />
														</div>
														<div className="text-sm font-medium text-foreground line-clamp-2">
															{subject.name}
														</div>
													</motion.div>
												))}
											</div>

											{/* Action Button */}
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												whileInView={{ opacity: 1, y: 0 }}
												viewport={{ once: true }}
												transition={{ duration: 0.6, delay: 0.4 }}
												className="pt-4"
											>
												<button
													className={`inline-flex items-center gap-2 bg-gradient-to-r ${level.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 group/btn`}
												>
													<span>View Detailed Syllabus</span>
													<ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
												</button>
											</motion.div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.3 }}
					className="text-center mt-16"
				>
					<div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border">
						<div className="max-w-3xl mx-auto">
							<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
								Ready to Explore Our Academic Programs?
							</h3>
							<p className="text-muted-foreground mb-8 text-lg">
								Download our comprehensive curriculum guide or schedule a campus
								visit to learn more about our innovative teaching approach.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<button className="bg-gradient-to-r from-primary to-secondary  px-8 py-4 rounded-xl font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
									<BookOpen className="w-5 h-5" />
									Download Curriculum Guide
								</button>
								<button className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2">
									<Calendar className="w-5 h-5" />
									Schedule Campus Visit
								</button>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
