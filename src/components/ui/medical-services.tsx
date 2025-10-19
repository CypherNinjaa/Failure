"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
	Heart,
	Phone,
	Clock,
	User,
	Shield,
	Brain,
	Calendar,
	Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MedicalServices() {
	const [activeService, setActiveService] = useState(0);

	const medicalServices = [
		{
			id: 1,
			icon: Heart,
			title: "Primary Healthcare",
			description: "Basic medical care and first aid services available 24/7",
			features: [
				"Regular health checkups",
				"Vaccination programs",
				"First aid treatment",
				"Emergency care",
			],
			color: "from-red-500 to-pink-500",
			staff: "Dr. Priya Sharma - MBBS, Pediatrician",
		},
		{
			id: 2,
			icon: Brain,
			title: "Counseling Services",
			description:
				"Mental health support and psychological counseling for students",
			features: [
				"Individual counseling",
				"Group therapy sessions",
				"Stress management",
				"Academic guidance",
			],
			color: "from-purple-500 to-indigo-500",
			staff: "Ms. Anjali Verma - M.A. Psychology",
		},
		{
			id: 3,
			icon: Shield,
			title: "Wellness Programs",
			description:
				"Preventive care and wellness initiatives for overall health",
			features: [
				"Nutrition counseling",
				"Fitness programs",
				"Health education",
				"Hygiene awareness",
			],
			color: "from-green-500 to-teal-500",
			staff: "Mr. Rajesh Kumar - Sports Medicine",
		},
	];

	const emergencyContacts = [
		{ role: "School Nurse", name: "Sister Mary", number: "+91 98765 43210" },
		{ role: "Doctor", name: "Dr. Priya Sharma", number: "+91 98765 43211" },
		{ role: "Counselor", name: "Ms. Anjali Verma", number: "+91 98765 43212" },
		{ role: "Emergency", name: "24/7 Helpline", number: "+91 98765 43213" },
	];

	const healthStats = [
		{
			label: "Health Checkups",
			value: "100%",
			description: "Students covered annually",
		},
		{
			label: "Response Time",
			value: "<5 min",
			description: "Emergency response",
		},
		{
			label: "Satisfaction",
			value: "98%",
			description: "Parent satisfaction rate",
		},
		{ label: "Counseling", value: "24/7", description: "Support availability" },
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
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 mb-6">
						<Heart className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Health & Wellness</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Complete Medical Care</span>
						<br />& Counseling Support
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Your child&apos;s health and well-being are our top priorities. Our
						comprehensive medical and counseling services ensure every student
						receives the care they need.
					</p>
				</motion.div>

				{/* Health Statistics */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
				>
					{healthStats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.1 * index }}
							viewport={{ once: true }}
						>
							<Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
								<CardContent className="p-4">
									<div className="text-2xl font-bold text-primary mb-1">
										{stat.value}
									</div>
									<div className="font-medium text-foreground mb-1">
										{stat.label}
									</div>
									<div className="text-xs text-muted-foreground">
										{stat.description}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Services Navigation */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="lg:col-span-1 space-y-4"
					>
						{medicalServices.map((service, index) => {
							const ServiceIcon = service.icon;
							return (
								<motion.button
									key={service.id}
									onClick={() => setActiveService(index)}
									className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
										activeService === index
											? "bg-primary text-primary-foreground shadow-lg"
											: "bg-card hover:bg-muted border border-border"
									}`}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<div className="flex items-start">
										<div
											className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
												activeService === index
													? "bg-white/20"
													: `bg-gradient-to-r ${service.color}`
											}`}
										>
											<ServiceIcon
												className={`w-6 h-6 ${
													activeService === index ? "text-white" : "text-white"
												}`}
											/>
										</div>
										<div>
											<h3 className="font-semibold mb-1">{service.title}</h3>
											<p
												className={`text-sm ${
													activeService === index
														? "text-white/80"
														: "text-muted-foreground"
												}`}
											>
												{service.description}
											</p>
										</div>
									</div>
								</motion.button>
							);
						})}

						{/* Emergency Contacts */}
						<Card className="border-red-200 dark:border-red-800">
							<CardHeader>
								<CardTitle className="text-red-600 dark:text-red-400 text-lg">
									Emergency Contacts
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{emergencyContacts.map((contact, index) => (
									<div
										key={index}
										className="flex items-center justify-between"
									>
										<div>
											<div className="font-medium text-foreground text-sm">
												{contact.role}
											</div>
											<div className="text-xs text-muted-foreground">
												{contact.name}
											</div>
										</div>
										<Button size="sm" variant="outline" className="h-8 px-2">
											<Phone className="w-3 h-3" />
										</Button>
									</div>
								))}
							</CardContent>
						</Card>
					</motion.div>

					{/* Service Details */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="lg:col-span-2"
					>
						<Card className="border-primary/20 shadow-lg">
							<CardContent className="p-8">
								<motion.div
									key={activeService}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									{(() => {
										const service = medicalServices[activeService];
										const ServiceIcon = service.icon;
										return (
											<>
												{/* Service Header */}
												<div className="flex items-center mb-6">
													<div
														className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mr-6`}
													>
														<ServiceIcon className="w-8 h-8 text-white" />
													</div>
													<div>
														<h3 className="text-2xl font-bold text-foreground mb-2">
															{service.title}
														</h3>
														<p className="text-muted-foreground">
															{service.description}
														</p>
													</div>
												</div>

												{/* Features Grid */}
												<div className="grid md:grid-cols-2 gap-4 mb-6">
													{service.features.map((feature, index) => (
														<motion.div
															key={index}
															initial={{ opacity: 0, x: 20 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{ duration: 0.3, delay: 0.1 * index }}
															className="flex items-center"
														>
															<div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
															<span className="text-foreground">{feature}</span>
														</motion.div>
													))}
												</div>

												{/* Staff Information */}
												<div className="bg-muted/50 rounded-lg p-4 mb-6">
													<h4 className="font-semibold text-foreground mb-2 flex items-center">
														<User className="w-4 h-4 mr-2" />
														Medical Staff
													</h4>
													<p className="text-sm text-muted-foreground">
														{service.staff}
													</p>
												</div>

												{/* Service Hours */}
												<div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-6">
													<h4 className="font-semibold text-foreground mb-2 flex items-center">
														<Clock className="w-4 h-4 mr-2" />
														Service Hours
													</h4>
													<div className="grid md:grid-cols-2 gap-4 text-sm">
														<div>
															<div className="text-foreground font-medium">
																Regular Hours
															</div>
															<div className="text-muted-foreground">
																Monday - Friday: 8:00 AM - 6:00 PM
															</div>
														</div>
														<div>
															<div className="text-foreground font-medium">
																Emergency Care
															</div>
															<div className="text-muted-foreground">
																24/7 On-call support available
															</div>
														</div>
													</div>
												</div>

												{/* Action Buttons */}
												<div className="grid md:grid-cols-2 gap-4">
													<Button
														className={`bg-gradient-to-r ${service.color} text-white hover:opacity-90`}
													>
														<Calendar className="w-4 h-4 mr-2" />
														Book Appointment
													</Button>
													<Button variant="outline">
														<Plus className="w-4 h-4 mr-2" />
														Health Records
													</Button>
												</div>
											</>
										);
									})()}
								</motion.div>
							</CardContent>
						</Card>

						{/* Health Tips */}
						<Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 border-green-200 dark:border-green-800">
							<CardHeader>
								<CardTitle className="text-green-600 dark:text-green-400">
									Daily Health Tips
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 text-sm">
									<div className="flex items-center">
										<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
										<span className="text-foreground">
											Drink at least 8 glasses of water daily
										</span>
									</div>
									<div className="flex items-center">
										<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
										<span className="text-foreground">
											Get 8-10 hours of sleep every night
										</span>
									</div>
									<div className="flex items-center">
										<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
										<span className="text-foreground">
											Wash hands frequently throughout the day
										</span>
									</div>
									<div className="flex items-center">
										<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
										<span className="text-foreground">
											Include fruits and vegetables in every meal
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
