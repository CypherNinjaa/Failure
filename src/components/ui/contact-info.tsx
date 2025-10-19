"use client";

import { motion } from "framer-motion";
import {
	Phone,
	Mail,
	MapPin,
	Clock,
	GraduationCap,
	Users,
	Calendar,
	Headphones,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export function ContactInfo() {
	const contactMethods = [
		{
			icon: Phone,
			title: "Phone Numbers",
			items: [
				{ label: "Main Office", value: "+91 98765 43210" },
				{ label: "Admissions", value: "+91 98765 43211" },
				{ label: "Principal", value: "+91 98765 43212" },
			],
			color: "from-green-400 to-blue-500",
		},
		{
			icon: Mail,
			title: "Email Addresses",
			items: [
				{ label: "General Inquiries", value: "info@happychildschool.edu" },
				{ label: "Admissions", value: "admissions@happychildschool.edu" },
				{ label: "Support", value: "support@happychildschool.edu" },
			],
			color: "from-purple-400 to-pink-500",
		},
		{
			icon: MapPin,
			title: "Address",
			items: [
				{ label: "Main Campus", value: "123 Education Street" },
				{ label: "City", value: "New Delhi, India" },
				{ label: "Postal Code", value: "110001" },
			],
			color: "from-yellow-400 to-orange-500",
		},
		{
			icon: Clock,
			title: "Office Hours",
			items: [
				{ label: "Monday - Friday", value: "9:00 AM - 5:00 PM" },
				{ label: "Saturday", value: "9:00 AM - 2:00 PM" },
				{ label: "Sunday", value: "Closed" },
			],
			color: "from-cyan-400 to-blue-500",
		},
	];

	const quickActions = [
		{
			icon: GraduationCap,
			title: "Admissions",
			description: "Apply for admission or get information about our programs",
			action: "Apply Now",
			color: "from-blue-500 to-purple-600",
		},
		{
			icon: Users,
			title: "Parent Portal",
			description:
				"Access your child&apos;s academic progress and school updates",
			action: "Login",
			color: "from-green-500 to-teal-600",
		},
		{
			icon: Calendar,
			title: "Schedule Visit",
			description: "Book a campus tour and meet our faculty",
			action: "Book Tour",
			color: "from-orange-500 to-red-600",
		},
		{
			icon: Headphones,
			title: "Support",
			description: "Get technical support or help with portal access",
			action: "Get Help",
			color: "from-purple-500 to-pink-600",
		},
	];

	return (
		<section className="py-16">
			<div className="max-w-6xl mx-auto">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Contact{" "}
						<span className="text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Information
						</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Multiple ways to reach us. Choose the method that works best for
						you.
					</p>
				</motion.div>

				{/* Contact Methods Grid */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
				>
					{contactMethods.map((method, index) => (
						<Card
							key={index}
							className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border"
						>
							<div
								className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center shadow-lg`}
							>
								<method.icon className="w-8 h-8 text-white" />
							</div>
							<h3 className="font-bold text-lg text-foreground mb-4">
								{method.title}
							</h3>
							<div className="space-y-2">
								{method.items.map((item, itemIndex) => (
									<div key={itemIndex} className="text-sm">
										<div className="font-medium text-muted-foreground">
											{item.label}
										</div>
										<div className="text-foreground font-medium">
											{item.value}
										</div>
									</div>
								))}
							</div>
						</Card>
					))}
				</motion.div>

				{/* Quick Actions */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<h3 className="text-2xl font-bold text-center text-foreground mb-8">
						Quick Actions
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{quickActions.map((action, index) => (
							<Card
								key={index}
								className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border group cursor-pointer"
							>
								<div
									className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
								>
									<action.icon className="w-8 h-8 text-white" />
								</div>
								<h4 className="font-bold text-lg text-foreground mb-2">
									{action.title}
								</h4>
								<p className="text-sm text-muted-foreground mb-4">
									{action.description}
								</p>
								<div
									className={`inline-block px-4 py-2 bg-gradient-to-r ${action.color} text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-300`}
								>
									{action.action}
								</div>
							</Card>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
