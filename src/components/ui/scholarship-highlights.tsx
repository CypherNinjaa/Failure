"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	Trophy,
	Star,
	Award,
	Target,
	Users,
	TrendingUp,
	Gift,
	Crown,
	Medal,
	Sparkles,
	GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Scholarship {
	id: number;
	title: string;
	description: string;
	amount: string;
	eligibility: string[];
	benefits: string[];
	criteria: string;
	icon: string;
	color: string;
	deadline: string;
	recipients: number;
	isPopular: boolean;
}

const scholarships: Scholarship[] = [
	{
		id: 1,
		title: "Academic Excellence Scholarship",
		description:
			"Recognizing outstanding academic performance and dedication to learning excellence.",
		amount: "Up to 100% Fee Waiver",
		eligibility: [
			"Minimum 90% in previous class",
			"Strong performance in entrance test",
			"No disciplinary issues",
		],
		benefits: [
			"Complete fee waiver for academic year",
			"Free textbooks and study materials",
			"Priority access to advanced programs",
			"Mentorship from senior faculty",
		],
		criteria: "Academic Merit",
		icon: "trophy",
		color: "from-yellow-500 to-orange-600",
		deadline: "April 30, 2024",
		recipients: 50,
		isPopular: true,
	},
	{
		id: 2,
		title: "Sports Champion Scholarship",
		description:
			"Supporting talented athletes who excel in sports while maintaining academic standards.",
		amount: "Up to 75% Fee Waiver",
		eligibility: [
			"State/National level sports participation",
			"Minimum 70% academic performance",
			"Sports achievement certificates",
		],
		benefits: [
			"75% reduction in tuition fees",
			"Free sports equipment and training",
			"Professional coaching support",
			"Competition participation funding",
		],
		criteria: "Sports Excellence",
		icon: "medal",
		color: "from-green-500 to-teal-600",
		deadline: "May 15, 2024",
		recipients: 25,
		isPopular: false,
	},
	{
		id: 3,
		title: "Need-Based Financial Aid",
		description:
			"Supporting economically disadvantaged students with financial assistance for quality education.",
		amount: "Up to 80% Fee Waiver",
		eligibility: [
			"Family income below ₹3,00,000 annually",
			"Minimum 75% in previous class",
			"Valid income certificate",
		],
		benefits: [
			"Significant fee reduction",
			"Free meals and transportation",
			"Educational material support",
			"Career counseling services",
		],
		criteria: "Financial Need",
		icon: "star",
		color: "from-blue-500 to-purple-600",
		deadline: "April 20, 2024",
		recipients: 75,
		isPopular: true,
	},
	{
		id: 4,
		title: "Leadership & Innovation Award",
		description:
			"Encouraging students who demonstrate exceptional leadership qualities and innovative thinking.",
		amount: "Up to 60% Fee Waiver",
		eligibility: [
			"Leadership roles in school/community",
			"Innovative project portfolio",
			"Recommendation from teachers",
		],
		benefits: [
			"Partial fee waiver",
			"Leadership development programs",
			"Innovation lab access",
			"Internship opportunities",
		],
		criteria: "Leadership Skills",
		icon: "crown",
		color: "from-purple-500 to-pink-600",
		deadline: "May 10, 2024",
		recipients: 30,
		isPopular: false,
	},
	{
		id: 5,
		title: "Cultural Arts Scholarship",
		description:
			"Celebrating students with exceptional talents in music, dance, drama, and visual arts.",
		amount: "Up to 50% Fee Waiver",
		eligibility: [
			"Outstanding performance in cultural arts",
			"Participation in cultural competitions",
			"Minimum 70% academic performance",
		],
		benefits: [
			"Fee reduction for artistic students",
			"Advanced arts training",
			"Performance opportunities",
			"Art supplies and instruments",
		],
		criteria: "Artistic Excellence",
		icon: "sparkles",
		color: "from-pink-500 to-rose-600",
		deadline: "May 5, 2024",
		recipients: 20,
		isPopular: false,
	},
	{
		id: 6,
		title: "Early Bird Admission Scholarship",
		description:
			"Special discount for students who complete their admission process early.",
		amount: "10-25% Fee Discount",
		eligibility: [
			"Application submitted before March 31",
			"Complete documentation",
			"Admission test qualification",
		],
		benefits: [
			"Early admission discount",
			"Priority class selection",
			"Free orientation programs",
			"Welcome kit with school supplies",
		],
		criteria: "Early Application",
		icon: "award",
		color: "from-orange-500 to-red-600",
		deadline: "March 31, 2024",
		recipients: 100,
		isPopular: true,
	},
];

export function ScholarshipHighlights() {
	const [selectedScholarship, setSelectedScholarship] =
		useState<Scholarship | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "trophy":
				return Trophy;
			case "medal":
				return Medal;
			case "star":
				return Star;
			case "crown":
				return Crown;
			case "sparkles":
				return Sparkles;
			case "award":
				return Award;
			default:
				return Trophy;
		}
	};

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-muted/30">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							Scholarship Programs
						</h2>
					</div>
				</div>
			</section>
		);
	}

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
						<Gift className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Financial Support</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Scholarship</span> Programs
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						We believe every talented student deserves quality education.
						Explore our comprehensive scholarship programs designed to support
						academic excellence.
					</p>
				</motion.div>

				{/* Scholarship Statistics */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
				>
					{[
						{ label: "Scholarships Offered", value: "6+", icon: Trophy },
						{ label: "Students Benefited", value: "300+", icon: Users },
						{ label: "Total Aid Amount", value: "₹50L+", icon: TrendingUp },
						{ label: "Success Rate", value: "95%", icon: Target },
					].map((stat, index) => {
						const StatIcon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
							>
								<Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/30">
									<CardContent className="p-4">
										<StatIcon className="w-8 h-8 text-accent mx-auto mb-2" />
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

				{/* Scholarship Cards */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
				>
					{scholarships.map((scholarship, index) => {
						const ScholarshipIcon = getIcon(scholarship.icon);

						return (
							<motion.div
								key={scholarship.id}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
								className="group"
							>
								<Card
									className={`overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full relative ${
										scholarship.isPopular ? "border-2 border-accent/50" : ""
									}`}
								>
									{scholarship.isPopular && (
										<div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium z-10">
											Popular
										</div>
									)}

									<CardContent className="p-6 flex flex-col h-full">
										{/* Header */}
										<div className="flex items-center justify-between mb-4">
											<div
												className={`p-3 rounded-lg bg-gradient-to-br ${scholarship.color}`}
											>
												<ScholarshipIcon className="w-6 h-6 text-white" />
											</div>
											<div className="text-right">
												<div className="text-sm text-muted-foreground">
													Recipients
												</div>
												<div className="text-lg font-bold text-foreground">
													{scholarship.recipients}
												</div>
											</div>
										</div>

										{/* Scholarship Image */}
										<div
											className={`h-32 bg-gradient-to-br ${scholarship.color} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}
										>
											<div className="absolute inset-0 bg-black/20"></div>
											<GraduationCap className="w-12 h-12 text-white/70 z-10" />
											<div className="absolute top-3 left-3 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-white text-xs font-medium">
												{scholarship.criteria}
											</div>
										</div>

										{/* Content */}
										<div className="flex-1">
											<h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
												{scholarship.title}
											</h3>
											<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
												{scholarship.description}
											</p>

											{/* Amount */}
											<div className="bg-accent/10 rounded-lg p-3 mb-4">
												<div className="text-xs text-accent font-medium mb-1">
													Scholarship Amount
												</div>
												<div className="text-lg font-bold text-foreground">
													{scholarship.amount}
												</div>
											</div>

											{/* Key Benefits */}
											<div className="mb-4">
												<h4 className="text-xs font-semibold text-foreground mb-2">
													Key Benefits:
												</h4>
												<div className="space-y-1">
													{scholarship.benefits
														.slice(0, 2)
														.map((benefit, benefitIndex) => (
															<div
																key={benefitIndex}
																className="flex items-center text-xs text-muted-foreground"
															>
																<div className="w-1 h-1 bg-accent rounded-full mr-2"></div>
																{benefit}
															</div>
														))}
												</div>
											</div>

											{/* Deadline */}
											<div className="text-xs text-muted-foreground mb-4">
												<span className="font-medium">Deadline:</span>{" "}
												{scholarship.deadline}
											</div>
										</div>

										{/* Action Button */}
										<Button
											onClick={() => setSelectedScholarship(scholarship)}
											className="w-full mt-auto"
											variant="outline"
										>
											View Details
										</Button>
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
					className="text-center"
				>
					<Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
						<CardContent className="p-8">
							<Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
							<h3 className="text-2xl font-bold text-foreground mb-4">
								Ready to Apply for a Scholarship?
							</h3>
							<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
								Don&apos;t miss out on these amazing opportunities! Start your
								scholarship application today and take the first step toward an
								affordable, quality education.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" className="px-8">
									Apply for Scholarship
								</Button>
								<Button variant="outline" size="lg" className="px-8">
									Download Brochure
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Scholarship Detail Modal */}
				{selectedScholarship && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
						onClick={() => setSelectedScholarship(null)}
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							<Card className="border-0">
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-6">
										<div className="flex items-center">
											<div
												className={`p-3 rounded-lg bg-gradient-to-br ${selectedScholarship.color} mr-4`}
											>
												{(() => {
													const ScholarshipIcon = getIcon(
														selectedScholarship.icon
													);
													return (
														<ScholarshipIcon className="w-6 h-6 text-white" />
													);
												})()}
											</div>
											<div>
												<h3 className="text-xl font-bold text-foreground">
													{selectedScholarship.title}
												</h3>
												<p className="text-sm text-muted-foreground">
													{selectedScholarship.criteria}
												</p>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setSelectedScholarship(null)}
											className="text-muted-foreground hover:text-foreground"
										>
											✕
										</Button>
									</div>

									<div className="space-y-6">
										<div>
											<h4 className="font-semibold text-foreground mb-2">
												Description
											</h4>
											<p className="text-muted-foreground">
												{selectedScholarship.description}
											</p>
										</div>

										<div className="grid md:grid-cols-2 gap-6">
											<div>
												<h4 className="font-semibold text-foreground mb-3">
													Eligibility Criteria
												</h4>
												<ul className="space-y-2">
													{selectedScholarship.eligibility.map(
														(item, index) => (
															<li
																key={index}
																className="flex items-start text-sm text-muted-foreground"
															>
																<div className="w-1.5 h-1.5 bg-accent rounded-full mr-3 mt-2"></div>
																{item}
															</li>
														)
													)}
												</ul>
											</div>

											<div>
												<h4 className="font-semibold text-foreground mb-3">
													Benefits & Support
												</h4>
												<ul className="space-y-2">
													{selectedScholarship.benefits.map((item, index) => (
														<li
															key={index}
															className="flex items-start text-sm text-muted-foreground"
														>
															<div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 mt-2"></div>
															{item}
														</li>
													))}
												</ul>
											</div>
										</div>

										<div className="bg-accent/5 rounded-lg p-4">
											<div className="flex justify-between items-center mb-2">
												<span className="text-sm font-medium text-foreground">
													Scholarship Amount
												</span>
												<span className="text-lg font-bold text-accent">
													{selectedScholarship.amount}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-sm text-muted-foreground">
													Application Deadline
												</span>
												<span className="text-sm font-medium text-foreground">
													{selectedScholarship.deadline}
												</span>
											</div>
										</div>

										<div className="flex space-x-3">
											<Button className="flex-1">Apply Now</Button>
											<Button variant="outline" className="flex-1">
												Download Guidelines
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>
				)}
			</div>
		</section>
	);
}
