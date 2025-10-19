"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ContactHero() {
	return (
		<section className="relative min-h-[60vh] md:min-h-[70vh] pt-20 pb-16 overflow-hidden">
			{/* Background with gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
			<div className="absolute inset-0 bg-black/20" />

			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<motion.div
					className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
					animate={{
						x: [0, 30, 0],
						y: [0, -20, 0],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-xl"
					animate={{
						x: [0, -40, 0],
						y: [0, 30, 0],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>

			<div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
				<div className="max-w-4xl mx-auto text-center text-white">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="space-y-6"
					>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
							Get in{" "}
							<span className="text-gradient-accent bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
								Touch
							</span>
						</h1>
						<p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
							We&apos;re here to help and answer any questions you might have.
							Connect with us and let&apos;s start building your child&apos;s
							bright future together.
						</p>
					</motion.div>

					{/* Quick contact cards */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12"
					>
						{[
							{
								icon: Phone,
								title: "Call Us",
								value: "+91 98765 43210",
								color: "from-green-400 to-blue-500",
							},
							{
								icon: Mail,
								title: "Email",
								value: "info@happychildschool.edu",
								color: "from-purple-400 to-pink-500",
							},
							{
								icon: MapPin,
								title: "Visit Us",
								value: "123 Education Street, City",
								color: "from-yellow-400 to-orange-500",
							},
							{
								icon: Clock,
								title: "Office Hours",
								value: "Mon-Fri 9AM-5PM",
								color: "from-cyan-400 to-blue-500",
							},
						].map((item, index) => (
							<Card
								key={index}
								className="bg-white/10 backdrop-blur-md border-white/20 p-4 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
							>
								<div
									className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center`}
								>
									<item.icon className="w-6 h-6 text-white" />
								</div>
								<h3 className="font-semibold text-sm text-white mb-1">
									{item.title}
								</h3>
								<p className="text-xs text-blue-100">{item.value}</p>
							</Card>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
