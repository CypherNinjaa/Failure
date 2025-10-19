"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	Users,
	Calendar,
	FileText,
	CheckCircle,
	AlertCircle,
	BookOpen,
	Award,
	Clock,
	Download,
	User,
	GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClassEligibility {
	class: string;
	ageRange: string;
	previousClass: string;
	documents: string[];
	specialRequirements: string[];
	subjects: string[];
	fees: string;
}

const eligibilityData: ClassEligibility[] = [
	{
		class: "Nursery",
		ageRange: "3 - 4 years",
		previousClass: "Not Required",
		documents: [
			"Birth Certificate",
			"Immunization Records",
			"Passport Size Photos",
			"Address Proof",
		],
		specialRequirements: [
			"Toilet trained",
			"Basic communication skills",
			"No previous schooling required",
		],
		subjects: ["Play Way Method", "Basic Activities", "Motor Skills"],
		fees: "₹15,000/year",
	},
	{
		class: "LKG",
		ageRange: "4 - 5 years",
		previousClass: "Nursery or equivalent",
		documents: [
			"Birth Certificate",
			"Previous School TC",
			"Immunization Records",
			"Progress Report",
			"Passport Size Photos",
		],
		specialRequirements: [
			"Basic alphabet recognition",
			"Number recognition 1-10",
			"Social interaction skills",
		],
		subjects: ["English", "Hindi", "Mathematics", "EVS", "Art & Craft"],
		fees: "₹18,000/year",
	},
	{
		class: "UKG",
		ageRange: "5 - 6 years",
		previousClass: "LKG or equivalent",
		documents: [
			"Birth Certificate",
			"Previous School TC",
			"Progress Report",
			"Character Certificate",
			"Passport Size Photos",
		],
		specialRequirements: [
			"Reading simple words",
			"Writing alphabets",
			"Basic arithmetic",
		],
		subjects: ["English", "Hindi", "Mathematics", "EVS", "Computer Basics"],
		fees: "₹20,000/year",
	},
	{
		class: "Class 1-5",
		ageRange: "6 - 11 years",
		previousClass: "UKG or equivalent grade",
		documents: [
			"Birth Certificate",
			"Transfer Certificate",
			"Previous Year Mark Sheet",
			"Character Certificate",
			"Passport Size Photos",
			"Aadhar Card Copy",
		],
		specialRequirements: [
			"Age appropriate academic skills",
			"Basic reading and writing",
			"Social behavior assessment",
		],
		subjects: ["English", "Hindi", "Mathematics", "EVS", "Computer", "Art"],
		fees: "₹25,000/year",
	},
	{
		class: "Class 6-8",
		ageRange: "11 - 14 years",
		previousClass: "Previous grade completion",
		documents: [
			"Birth Certificate",
			"Transfer Certificate",
			"Last 2 Years Mark Sheets",
			"Character Certificate",
			"Passport Size Photos",
			"Aadhar Card Copy",
		],
		specialRequirements: [
			"Entrance test (Math, English, Science)",
			"Interview with parents",
			"Academic performance review",
		],
		subjects: [
			"English",
			"Hindi",
			"Mathematics",
			"Science",
			"Social Studies",
			"Computer",
		],
		fees: "₹30,000/year",
	},
	{
		class: "Class 9-10",
		ageRange: "14 - 16 years",
		previousClass: "Class 8 completion",
		documents: [
			"Birth Certificate",
			"Transfer Certificate",
			"Class 8 Mark Sheet",
			"Character Certificate",
			"Passport Size Photos",
			"Aadhar Card Copy",
			"Migration Certificate (if applicable)",
		],
		specialRequirements: [
			"Comprehensive entrance test",
			"Minimum 70% in Class 8",
			"Interview with student and parents",
		],
		subjects: [
			"English",
			"Hindi",
			"Mathematics",
			"Science",
			"Social Studies",
			"Computer",
		],
		fees: "₹35,000/year",
	},
];

export function EligibilityCriteria() {
	const [isMounted, setIsMounted] = useState(false);
	const [selectedClass, setSelectedClass] = useState<string>("Nursery");

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-background">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							Eligibility Criteria
						</h2>
					</div>
				</div>
			</section>
		);
	}

	const selectedData = eligibilityData.find(
		(item) => item.class === selectedClass
	);

	return (
		<section className="py-16 lg:py-24 bg-background">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<Users className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Admission Requirements</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Eligibility</span> Criteria
					</h2>

					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Find out the specific requirements for your child&apos;s grade
						level. We&apos;ve outlined clear criteria to help you prepare for
						the admission process.
					</p>
				</motion.div>

				{/* Class Selection Tabs */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-3 mb-12"
				>
					{eligibilityData.map((item, index) => (
						<motion.button
							key={item.class}
							onClick={() => setSelectedClass(item.class)}
							className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
								selectedClass === item.class
									? "bg-accent text-accent-foreground shadow-lg scale-105"
									: "bg-card text-foreground hover:bg-muted border border-border"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.1 * index }}
						>
							{item.class}
						</motion.button>
					))}
				</motion.div>

				{/* Selected Class Details */}
				{selectedData && (
					<motion.div
						key={selectedClass}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="grid lg:grid-cols-2 gap-8 mb-12"
					>
						{/* Basic Information */}
						<Card className="overflow-hidden">
							<CardContent className="p-6">
								<h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
									<GraduationCap className="w-5 h-5 mr-2 text-accent" />
									{selectedData.class} - Basic Information
								</h3>

								<div className="space-y-4">
									<div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
										<div className="flex items-center">
											<Calendar className="w-4 h-4 mr-2 text-accent" />
											<span className="font-medium">Age Range</span>
										</div>
										<span className="text-accent font-bold">
											{selectedData.ageRange}
										</span>
									</div>

									<div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
										<div className="flex items-center">
											<BookOpen className="w-4 h-4 mr-2 text-accent" />
											<span className="font-medium">Previous Class</span>
										</div>
										<span className="text-muted-foreground">
											{selectedData.previousClass}
										</span>
									</div>

									<div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
										<div className="flex items-center">
											<Award className="w-4 h-4 mr-2 text-accent" />
											<span className="font-medium">Annual Fees</span>
										</div>
										<span className="text-green-600 font-bold">
											{selectedData.fees}
										</span>
									</div>
								</div>

								{/* Subjects */}
								<div className="mt-6">
									<h4 className="font-semibold text-foreground mb-3">
										Subjects Offered
									</h4>
									<div className="flex flex-wrap gap-2">
										{selectedData.subjects.map((subject, index) => (
											<span
												key={index}
												className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
											>
												{subject}
											</span>
										))}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Documents Required */}
						<Card className="overflow-hidden">
							<CardContent className="p-6">
								<h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
									<FileText className="w-5 h-5 mr-2 text-accent" />
									Required Documents
								</h3>

								<div className="space-y-3 mb-6">
									{selectedData.documents.map((document, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
											className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors duration-300"
										>
											<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
											<span className="text-muted-foreground">{document}</span>
										</motion.div>
									))}
								</div>

								<div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
									<div className="flex items-start space-x-2">
										<AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
										<div>
											<h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
												Important Note
											</h4>
											<p className="text-sm text-yellow-700 dark:text-yellow-300">
												All documents must be original for verification.
												Photocopies will be taken and originals returned.
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Special Requirements */}
						<Card className="lg:col-span-2 overflow-hidden">
							<CardContent className="p-6">
								<h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
									<User className="w-5 h-5 mr-2 text-accent" />
									Special Requirements & Assessment Criteria
								</h3>

								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<h4 className="font-semibold text-foreground mb-3">
											Academic Requirements
										</h4>
										<div className="space-y-3">
											{selectedData.specialRequirements.map(
												(requirement, index) => (
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
												)
											)}
										</div>
									</div>

									<div>
										<h4 className="font-semibold text-foreground mb-3">
											Assessment Process
										</h4>
										<div className="space-y-3">
											{selectedData.class === "Nursery" ||
											selectedData.class === "LKG" ? (
												<>
													<div className="flex items-start space-x-3">
														<div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
														<span className="text-muted-foreground">
															Informal interaction with child
														</span>
													</div>
													<div className="flex items-start space-x-3">
														<div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
														<span className="text-muted-foreground">
															Parent interaction session
														</span>
													</div>
													<div className="flex items-start space-x-3">
														<div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
														<span className="text-muted-foreground">
															Basic readiness assessment
														</span>
													</div>
												</>
											) : (
												<>
													<div className="flex items-start space-x-3">
														<div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
														<span className="text-muted-foreground">
															Written entrance test
														</span>
													</div>
													<div className="flex items-start space-x-3">
														<div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
														<span className="text-muted-foreground">
															Personal interview
														</span>
													</div>
													<div className="flex items-start space-x-3">
														<div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
														<span className="text-muted-foreground">
															Parent counseling session
														</span>
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}

				{/* Important Dates and Information */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-3 gap-6 mb-12"
				>
					<Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
						<CardContent className="p-6 text-center">
							<Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
							<h3 className="font-bold text-foreground mb-2">
								Application Period
							</h3>
							<p className="text-sm text-muted-foreground mb-2">
								January 1 - March 31, 2024
							</p>
							<div className="text-green-600 font-medium">Now Open</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
						<CardContent className="p-6 text-center">
							<Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
							<h3 className="font-bold text-foreground mb-2">
								Assessment Dates
							</h3>
							<p className="text-sm text-muted-foreground mb-2">
								April 15-20, 2024
							</p>
							<div className="text-blue-600 font-medium">As per schedule</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
						<CardContent className="p-6 text-center">
							<Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
							<h3 className="font-bold text-foreground mb-2">
								Result Declaration
							</h3>
							<p className="text-sm text-muted-foreground mb-2">
								April 25, 2024
							</p>
							<div className="text-purple-600 font-medium">Merit List</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Download Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center"
				>
					<Card className="max-w-2xl mx-auto">
						<CardContent className="p-8 bg-gradient-to-r from-accent/5 to-secondary/5">
							<h3 className="text-2xl font-bold text-foreground mb-4">
								Need More Information?
							</h3>
							<p className="text-muted-foreground mb-6">
								Download our comprehensive admission guide with detailed
								information about eligibility criteria, fee structure, and
								application process.
							</p>
							<Button
								size="lg"
								className="bg-accent hover:bg-accent/90 text-accent-foreground group"
							>
								<Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
								Download Admission Guide
							</Button>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
