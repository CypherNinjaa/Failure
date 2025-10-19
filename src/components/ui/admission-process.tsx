"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	FileText,
	UserCheck,
	CreditCard,
	GraduationCap,
	CheckCircle,
	Clock,
	Users,
	Calendar,
	ArrowRight,
	Download,
	Phone,
	MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdmissionStep {
	id: number;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	duration: string;
	requirements: string[];
	tips: string[];
	status: "completed" | "current" | "upcoming";
}

const admissionSteps: AdmissionStep[] = [
	{
		id: 1,
		title: "Application Submission",
		description:
			"Submit your online application form with all required documents and details.",
		icon: FileText,
		duration: "1-2 days",
		requirements: [
			"Completed application form",
			"Birth certificate copy",
			"Previous school records",
			"Passport size photographs",
			"Address proof",
		],
		tips: [
			"Fill all details accurately",
			"Upload clear document scans",
			"Keep application number safe",
		],
		status: "completed",
	},
	{
		id: 2,
		title: "Document Verification",
		description:
			"Our team will verify all submitted documents and contact you if any clarification is needed.",
		icon: UserCheck,
		duration: "2-3 days",
		requirements: [
			"Original documents for verification",
			"Parent/Guardian presence",
			"Valid contact information",
		],
		tips: [
			"Keep original documents ready",
			"Respond to verification calls promptly",
			"Ensure all documents are valid",
		],
		status: "current",
	},
	{
		id: 3,
		title: "Entrance Assessment",
		description:
			"Age-appropriate assessment to understand the student's academic level and learning needs.",
		icon: GraduationCap,
		duration: "1 day",
		requirements: [
			"Student presence mandatory",
			"Writing materials provided",
			"Comfortable clothing",
			"Water bottle",
		],
		tips: [
			"Ensure good rest before test",
			"Arrive 15 minutes early",
			"Stay calm and confident",
		],
		status: "upcoming",
	},
	{
		id: 4,
		title: "Fee Payment",
		description:
			"Complete the admission process by paying the required fees and securing your child's seat.",
		icon: CreditCard,
		duration: "Same day",
		requirements: [
			"Admission fee payment",
			"First term fee (optional)",
			"Security deposit",
			"Payment receipt",
		],
		tips: [
			"Multiple payment options available",
			"Get official receipt",
			"Keep payment proof safe",
		],
		status: "upcoming",
	},
];

export function AdmissionProcess() {
	const [isMounted, setIsMounted] = useState(false);
	const [selectedStep, setSelectedStep] = useState<number>(1);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-muted/30">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							Admission Process
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
						<CheckCircle className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Step by Step Guide</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Admission</span> Process
					</h2>

					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Follow our simple 4-step admission process to secure your
						child&apos;s future at Happy Child School. We&apos;ve made it easy
						and transparent for you.
					</p>
				</motion.div>

				{/* Process Timeline */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<div className="grid md:grid-cols-4 gap-6">
						{admissionSteps.map((step, index) => {
							const StepIcon = step.icon;
							const isSelected = selectedStep === step.id;

							return (
								<motion.div
									key={step.id}
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5, delay: 0.1 * index }}
									viewport={{ once: true }}
									className="relative cursor-pointer"
									onClick={() => setSelectedStep(step.id)}
								>
									{/* Connector Line */}
									{index < admissionSteps.length - 1 && (
										<div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border z-0">
											<div
												className={`h-full transition-all duration-500 ${
													step.status === "completed"
														? "bg-green-500 w-full"
														: step.status === "current"
														? "bg-accent w-1/2"
														: "bg-border w-0"
												}`}
											></div>
										</div>
									)}

									<Card
										className={`relative z-10 transition-all duration-300 hover:shadow-lg ${
											isSelected ? "ring-2 ring-accent shadow-lg" : ""
										} ${
											step.status === "completed"
												? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
												: step.status === "current"
												? "bg-accent/5 border-accent/30"
												: "bg-card"
										}`}
									>
										<CardContent className="p-6 text-center">
											<div
												className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 ${
													step.status === "completed"
														? "bg-green-500 text-white"
														: step.status === "current"
														? "bg-accent text-accent-foreground"
														: "bg-muted text-muted-foreground"
												}`}
											>
												{step.status === "completed" ? (
													<CheckCircle className="w-8 h-8" />
												) : (
													<StepIcon className="w-8 h-8" />
												)}
											</div>

											<h3
												className={`font-bold mb-2 transition-colors duration-300 ${
													isSelected ? "text-accent" : "text-foreground"
												}`}
											>
												{step.title}
											</h3>

											<p className="text-sm text-muted-foreground mb-3">
												{step.description}
											</p>

											<div className="flex items-center justify-center text-xs text-muted-foreground">
												<Clock className="w-3 h-3 mr-1" />
												{step.duration}
											</div>

											{step.status === "completed" && (
												<div className="mt-2 text-xs text-green-600 font-medium">
													Completed ✓
												</div>
											)}

											{step.status === "current" && (
												<div className="mt-2 text-xs text-accent font-medium animate-pulse">
													In Progress...
												</div>
											)}
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>
				</motion.div>

				{/* Selected Step Details */}
				<motion.div
					key={selectedStep}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="grid lg:grid-cols-2 gap-8 mb-16"
				>
					{(() => {
						const step = admissionSteps.find((s) => s.id === selectedStep);
						if (!step) return null;

						return (
							<>
								{/* Requirements */}
								<Card>
									<CardContent className="p-6">
										<h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
											<FileText className="w-5 h-5 mr-2 text-accent" />
											Requirements
										</h3>
										<div className="space-y-3">
											{step.requirements.map((requirement, index) => (
												<motion.div
													key={index}
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.3, delay: index * 0.1 }}
													className="flex items-start space-x-3"
												>
													<div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
													<span className="text-muted-foreground">
														{requirement}
													</span>
												</motion.div>
											))}
										</div>
									</CardContent>
								</Card>

								{/* Tips */}
								<Card>
									<CardContent className="p-6">
										<h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
											<Users className="w-5 h-5 mr-2 text-accent" />
											Helpful Tips
										</h3>
										<div className="space-y-3">
											{step.tips.map((tip, index) => (
												<motion.div
													key={index}
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.3, delay: index * 0.1 }}
													className="flex items-start space-x-3"
												>
													<div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
													<span className="text-muted-foreground">{tip}</span>
												</motion.div>
											))}
										</div>
									</CardContent>
								</Card>
							</>
						);
					})()}
				</motion.div>

				{/* Important Information */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-3 gap-6"
				>
					<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
						<CardContent className="p-6 text-center">
							<Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
							<h3 className="font-bold text-foreground mb-2">
								Application Deadline
							</h3>
							<p className="text-sm text-muted-foreground mb-3">
								Submit your application before the deadline to ensure
								consideration.
							</p>
							<div className="text-blue-600 font-medium">March 31, 2024</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
						<CardContent className="p-6 text-center">
							<Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
							<h3 className="font-bold text-foreground mb-2">Need Help?</h3>
							<p className="text-sm text-muted-foreground mb-3">
								Our admission team is here to assist you throughout the process.
							</p>
							<div className="text-green-600 font-medium">+91 98765 43210</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
						<CardContent className="p-6 text-center">
							<MapPin className="w-8 h-8 text-purple-600 mx-auto mb-3" />
							<h3 className="font-bold text-foreground mb-2">Visit Campus</h3>
							<p className="text-sm text-muted-foreground mb-3">
								Schedule a campus tour to experience our facilities firsthand.
							</p>
							<Button
								size="sm"
								className="bg-purple-600 hover:bg-purple-700 text-white"
							>
								Book Tour
							</Button>
						</CardContent>
					</Card>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-accent hover:bg-accent/90 text-accent-foreground group"
						>
							Start Application
							<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-accent text-accent hover:bg-accent hover:text-accent-foreground group"
						>
							<Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
							Download Guidelines
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
