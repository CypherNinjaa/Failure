"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
	ChevronDown,
	HelpCircle,
	Clock,
	Phone,
	Mail,
	MessageCircle,
	Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FAQ {
	id: number;
	question: string;
	answer: string;
	category: "admission" | "fees" | "academics" | "documents" | "general";
	isPopular: boolean;
}

const faqs: FAQ[] = [
	{
		id: 1,
		question: "What is the admission process for new students?",
		answer:
			"Our admission process consists of four simple steps: 1) Fill out the online application form, 2) Submit required documents, 3) Attend the admission interview/test, and 4) Complete the fee payment upon selection. The entire process typically takes 5-7 working days.",
		category: "admission",
		isPopular: true,
	},
	{
		id: 2,
		question: "What documents are required for admission?",
		answer:
			"Required documents include: Birth Certificate, Transfer Certificate (if applicable), Previous academic records/marksheet, Passport size photographs, Address proof, Parent's ID proof, and Medical certificate. All documents should be original with photocopies.",
		category: "documents",
		isPopular: true,
	},
	{
		id: 3,
		question: "What are the fee structure and payment options?",
		answer:
			"Our fee structure varies by class and includes tuition, development, and activity fees. We offer flexible payment options including quarterly, half-yearly, and annual payments. Early payment discounts and installment plans are available. Please refer to our fee structure section for detailed information.",
		category: "fees",
		isPopular: true,
	},
	{
		id: 4,
		question: "Is there an entrance examination for admission?",
		answer:
			"Yes, we conduct age-appropriate assessment tests for classes 1 and above. For nursery and KG, we have a simple interaction session. The test evaluates basic academic skills and readiness for the respective class level.",
		category: "admission",
		isPopular: true,
	},
	{
		id: 5,
		question: "What is the student-teacher ratio at your school?",
		answer:
			"We maintain an optimal student-teacher ratio of 20:1 to ensure personalized attention for each student. Our small class sizes enable better interaction, individual guidance, and effective learning outcomes.",
		category: "academics",
		isPopular: false,
	},
	{
		id: 6,
		question: "Do you provide transportation facilities?",
		answer:
			"Yes, we offer safe and reliable transportation services covering major areas of the city. Our buses are equipped with GPS tracking, first aid kits, and trained attendants. Transportation fee is separate from tuition fees.",
		category: "general",
		isPopular: false,
	},
	{
		id: 7,
		question: "What extracurricular activities are available?",
		answer:
			"We offer a wide range of activities including sports (cricket, football, basketball, swimming), arts (music, dance, painting), academics (debate, quiz, science club), and life skills programs. All students are encouraged to participate in at least one activity.",
		category: "academics",
		isPopular: false,
	},
	{
		id: 8,
		question: "Are scholarships available for deserving students?",
		answer:
			"Yes, we offer various scholarship programs including Academic Excellence (up to 100% fee waiver), Sports Championship (up to 75%), Need-based Financial Aid (up to 80%), and Leadership Awards (up to 60%). Applications are evaluated based on merit and eligibility criteria.",
		category: "fees",
		isPopular: true,
	},
	{
		id: 9,
		question: "What is the school timing and holiday schedule?",
		answer:
			"School timing is 8:00 AM to 2:30 PM for primary classes and 8:00 AM to 3:00 PM for middle and high school. We follow the state education board calendar for holidays and examinations. Summer vacation is typically from May to June.",
		category: "general",
		isPopular: false,
	},
	{
		id: 10,
		question: "Do you have hostel facilities?",
		answer:
			"Yes, we provide separate hostel facilities for boys and girls with 24/7 security, nutritious meals, study hours, recreational activities, and medical care. Hostel admission is subject to availability and separate application process.",
		category: "general",
		isPopular: false,
	},
	{
		id: 11,
		question: "What is the medium of instruction?",
		answer:
			"English is the primary medium of instruction for all subjects. We also have Hindi and regional language classes as part of the curriculum. Our teachers are proficient in multiple languages to support diverse learning needs.",
		category: "academics",
		isPopular: false,
	},
	{
		id: 12,
		question: "How can parents track their child's progress?",
		answer:
			"We provide a comprehensive parent portal where you can track attendance, academic progress, exam results, fee status, and communicate with teachers. Regular parent-teacher meetings and progress reports ensure transparent communication.",
		category: "academics",
		isPopular: true,
	},
];

export function AdmissionsFAQ() {
	const [openFAQ, setOpenFAQ] = useState<number | null>(null);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const categories = [
		{ id: "all", name: "All Questions", count: faqs.length },
		{
			id: "admission",
			name: "Admission Process",
			count: faqs.filter((f) => f.category === "admission").length,
		},
		{
			id: "fees",
			name: "Fees & Payments",
			count: faqs.filter((f) => f.category === "fees").length,
		},
		{
			id: "academics",
			name: "Academics",
			count: faqs.filter((f) => f.category === "academics").length,
		},
		{
			id: "documents",
			name: "Documents",
			count: faqs.filter((f) => f.category === "documents").length,
		},
		{
			id: "general",
			name: "General",
			count: faqs.filter((f) => f.category === "general").length,
		},
	];

	const filteredFAQs = faqs.filter((faq) => {
		const matchesCategory =
			selectedCategory === "all" || faq.category === selectedCategory;
		const matchesSearch =
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const popularFAQs = faqs.filter((faq) => faq.isPopular);

	const toggleFAQ = (id: number) => {
		setOpenFAQ(openFAQ === id ? null : id);
	};

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-background">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							Frequently Asked Questions
						</h2>
					</div>
				</div>
			</section>
		);
	}

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
						<HelpCircle className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Got Questions?</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						Frequently Asked{" "}
						<span className="text-gradient-primary">Questions</span>
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Find answers to common questions about admissions, academics, fees,
						and school policies. Still have questions? Feel free to contact us.
					</p>
				</motion.div>

				<div className="max-w-4xl mx-auto">
					{/* Search and Filter */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="mb-8"
					>
						{/* Search Bar */}
						<div className="relative mb-6">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input
								type="text"
								placeholder="Search for questions..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 h-12"
							/>
						</div>

						{/* Category Filter */}
						<div className="flex flex-wrap gap-2">
							{categories.map((category) => (
								<Button
									key={category.id}
									variant={
										selectedCategory === category.id ? "default" : "outline"
									}
									size="sm"
									onClick={() => setSelectedCategory(category.id)}
									className="text-xs"
								>
									{category.name}
									<span className="ml-1 text-xs opacity-70">
										({category.count})
									</span>
								</Button>
							))}
						</div>
					</motion.div>

					{/* Popular Questions */}
					{selectedCategory === "all" && searchQuery === "" && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="mb-8"
						>
							<h3 className="text-xl font-semibold text-foreground mb-4">
								Popular Questions
							</h3>
							<div className="grid md:grid-cols-2 gap-4">
								{popularFAQs.slice(0, 4).map((faq) => (
									<Card
										key={faq.id}
										className="cursor-pointer hover:shadow-md transition-all duration-300 border-accent/20 bg-accent/5"
										onClick={() => toggleFAQ(faq.id)}
									>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<p className="text-sm font-medium text-foreground line-clamp-2">
													{faq.question}
												</p>
												<ChevronDown className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</motion.div>
					)}

					{/* FAQ List */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="space-y-4"
					>
						{filteredFAQs.length === 0 ? (
							<Card className="text-center py-12">
								<CardContent>
									<HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<h3 className="text-lg font-semibold text-foreground mb-2">
										No questions found
									</h3>
									<p className="text-muted-foreground">
										Try adjusting your search or filter criteria
									</p>
								</CardContent>
							</Card>
						) : (
							filteredFAQs.map((faq, index) => (
								<motion.div
									key={faq.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.1 * index }}
									viewport={{ once: true }}
								>
									<Card
										className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
											faq.isPopular ? "border-accent/30" : ""
										}`}
									>
										<CardContent className="p-0">
											<motion.div
												className="cursor-pointer"
												onClick={() => toggleFAQ(faq.id)}
											>
												<div className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors duration-200">
													<div className="flex items-center flex-1">
														{faq.isPopular && (
															<div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
														)}
														<h3 className="text-base font-semibold text-foreground">
															{faq.question}
														</h3>
													</div>
													<motion.div
														animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
														transition={{ duration: 0.2 }}
													>
														<ChevronDown className="w-5 h-5 text-muted-foreground" />
													</motion.div>
												</div>
											</motion.div>

											<AnimatePresence>
												{openFAQ === faq.id && (
													<motion.div
														initial={{ height: 0, opacity: 0 }}
														animate={{ height: "auto", opacity: 1 }}
														exit={{ height: 0, opacity: 0 }}
														transition={{ duration: 0.3 }}
														className="overflow-hidden"
													>
														<div className="px-6 pb-6">
															<div className="border-t border-border pt-4">
																<p className="text-muted-foreground leading-relaxed">
																	{faq.answer}
																</p>
																<div className="mt-4 flex items-center">
																	<span
																		className={`px-2 py-1 rounded-full text-xs font-medium ${
																			faq.category === "admission"
																				? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
																				: faq.category === "fees"
																				? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
																				: faq.category === "academics"
																				? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
																				: faq.category === "documents"
																				? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
																				: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
																		}`}
																	>
																		{faq.category.charAt(0).toUpperCase() +
																			faq.category.slice(1)}
																	</span>
																</div>
															</div>
														</div>
													</motion.div>
												)}
											</AnimatePresence>
										</CardContent>
									</Card>
								</motion.div>
							))
						)}
					</motion.div>

					{/* Still Have Questions */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="mt-12"
					>
						<Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
							<CardContent className="p-8 text-center">
								<MessageCircle className="w-12 h-12 text-accent mx-auto mb-4" />
								<h3 className="text-2xl font-bold text-foreground mb-4">
									Still Have Questions?
								</h3>
								<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
									Our admission team is here to help! Get in touch with us for
									personalized assistance with your admission queries.
								</p>
								<div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
									<Card className="bg-background/50 backdrop-blur">
										<CardContent className="p-4 text-center">
											<Phone className="w-6 h-6 text-accent mx-auto mb-2" />
											<h4 className="font-semibold text-foreground mb-1">
												Call Us
											</h4>
											<p className="text-sm text-muted-foreground">
												+91 98765 43210
											</p>
										</CardContent>
									</Card>
									<Card className="bg-background/50 backdrop-blur">
										<CardContent className="p-4 text-center">
											<Mail className="w-6 h-6 text-accent mx-auto mb-2" />
											<h4 className="font-semibold text-foreground mb-1">
												Email Us
											</h4>
											<p className="text-sm text-muted-foreground">
												admissions@hcs.edu
											</p>
										</CardContent>
									</Card>
									<Card className="bg-background/50 backdrop-blur">
										<CardContent className="p-4 text-center">
											<Clock className="w-6 h-6 text-accent mx-auto mb-2" />
											<h4 className="font-semibold text-foreground mb-1">
												Office Hours
											</h4>
											<p className="text-sm text-muted-foreground">
												Mon-Sat 9AM-5PM
											</p>
										</CardContent>
									</Card>
								</div>
								<Button size="lg" className="mt-6">
									Contact Admission Team
								</Button>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
