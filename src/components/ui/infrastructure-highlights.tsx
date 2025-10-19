"use client";

import { motion } from "framer-motion";
import {
	Monitor,
	Microscope,
	Calculator,
	BookOpen,
	Trophy,
	Bus,
	Wifi,
	Camera,
	Shield,
	Zap,
} from "lucide-react";

export function InfrastructureHighlights() {
	const facilities = [
		{
			title: "Smart Classrooms",
			description:
				"Interactive whiteboards, high-speed internet, and modern audio-visual equipment in every classroom.",
			icon: Monitor,
			features: [
				"Interactive Whiteboards",
				"HD Projectors",
				"Surround Sound",
				"Climate Control",
			],
			image: "🏫",
			color: "from-primary to-secondary",
		},
		{
			title: "Science Labs",
			description:
				"State-of-the-art laboratories for Physics, Chemistry, and Biology with advanced equipment.",
			icon: Microscope,
			features: [
				"Advanced Microscopes",
				"Safety Equipment",
				"Digital Sensors",
				"Research Tools",
			],
			image: "🔬",
			color: "from-accent to-primary",
		},
		{
			title: "Computer Labs",
			description:
				"Modern computer labs with latest hardware and software for coding and digital literacy.",
			icon: Monitor,
			features: [
				"Latest Computers",
				"High-Speed Internet",
				"Programming Software",
				"AI/ML Tools",
			],
			image: "💻",
			color: "from-secondary to-accent",
		},
		{
			title: "Math Labs",
			description:
				"Interactive mathematics laboratories with manipulatives and digital tools for concept visualization.",
			icon: Calculator,
			features: [
				"Interactive Tools",
				"3D Models",
				"Graphing Software",
				"Problem Solving Kits",
			],
			image: "🔢",
			color: "from-primary to-accent",
		},
		{
			title: "Library",
			description:
				"Extensive collection of books, digital resources, and quiet study spaces for research and learning.",
			icon: BookOpen,
			features: [
				"50,000+ Books",
				"Digital Database",
				"Study Rooms",
				"Research Assistance",
			],
			image: "📚",
			color: "from-accent to-secondary",
		},
		{
			title: "Sports Facilities",
			description:
				"Comprehensive sports complex with multiple courts, gymnasium, and swimming pool.",
			icon: Trophy,
			features: [
				"Swimming Pool",
				"Basketball Court",
				"Football Ground",
				"Indoor Gymnasium",
			],
			image: "🏆",
			color: "from-secondary to-primary",
		},
	];

	const additionalFeatures = [
		{
			icon: Bus,
			title: "Safe Transport",
			description: "GPS-tracked buses with trained drivers and attendants",
		},
		{
			icon: Wifi,
			title: "Campus-wide WiFi",
			description: "High-speed internet connectivity throughout the campus",
		},
		{
			icon: Camera,
			title: "Security System",
			description: "24/7 CCTV monitoring and access control systems",
		},
		{
			icon: Shield,
			title: "Safety Measures",
			description: "Fire safety systems and emergency response protocols",
		},
		{
			icon: Zap,
			title: "Green Energy",
			description: "Solar panels and energy-efficient lighting systems",
		},
	];

	return (
		<section className="py-16 md:py-24 bg-background">
			<div className="container px-4">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 px-6 py-3 bg-card/90 backdrop-blur-sm rounded-full shadow-lg border border-border mb-6">
						<Monitor className="w-4 h-4 text-primary" />
						<span className="text-sm font-semibold text-muted-foreground">
							World-Class Facilities
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
						Infrastructure{" "}
						<span className="text-gradient-primary">Highlights</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Our modern campus is equipped with cutting-edge facilities designed
						to enhance learning and provide a comprehensive educational
						experience.
					</p>
				</motion.div>

				{/* Main Facilities Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
					{facilities.map((facility, index) => (
						<motion.div
							key={facility.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -8 }}
							className="group"
						>
							<div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden h-full">
								{/* Background decoration */}
								<div
									className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${facility.color} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`}
								></div>
								<div
									className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${facility.color} opacity-5 rounded-full translate-y-6 -translate-x-6 group-hover:scale-125 transition-transform duration-500`}
								></div>

								{/* Content */}
								<div className="relative z-10">
									{/* Icon and Title */}
									<div className="flex items-center gap-4 mb-6">
										<motion.div
											whileHover={{ scale: 1.1, rotate: 5 }}
											className={`w-16 h-16 bg-gradient-to-br ${facility.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
										>
											<facility.icon className="w-8 h-8 text-white" />
										</motion.div>
										<div>
											<h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
												{facility.title}
											</h3>
											<div className="text-3xl">{facility.image}</div>
										</div>
									</div>

									{/* Description */}
									<p className="text-muted-foreground leading-relaxed mb-6">
										{facility.description}
									</p>

									{/* Features */}
									<div>
										<h4 className="text-sm font-semibold text-foreground mb-3">
											Key Features:
										</h4>
										<ul className="space-y-2">
											{facility.features.map((feature, i) => (
												<motion.li
													key={feature}
													initial={{ opacity: 0, x: 20 }}
													whileInView={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
													viewport={{ once: true }}
													className="flex items-center gap-3 text-muted-foreground text-sm"
												>
													<div
														className={`w-2 h-2 bg-gradient-to-r ${facility.color} rounded-full`}
													></div>
													{feature}
												</motion.li>
											))}
										</ul>
									</div>

									{/* Hover Effect Line */}
									<div
										className={`w-8 h-1 bg-gradient-to-r ${facility.color} rounded-full mt-6 group-hover:w-full transition-all duration-500`}
									></div>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Additional Features */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
						Additional <span className="text-gradient-accent">Features</span>
					</h3>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Our commitment to excellence extends beyond classrooms with
						comprehensive support systems.
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16 max-w-6xl mx-auto">
					{additionalFeatures.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -4, scale: 1.02 }}
							className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300"
						>
							<motion.div
								whileHover={{ scale: 1.1, rotate: 5 }}
								className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
							>
								<feature.icon className="w-6 h-6 text-white" />
							</motion.div>
							<h4 className="text-sm font-bold text-foreground mb-2">
								{feature.title}
							</h4>
							<p className="text-xs text-muted-foreground leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>

				{/* Campus Statistics */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
					className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border/50"
				>
					<div className="text-center mb-8">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Campus by Numbers
						</h3>
						<p className="text-muted-foreground">
							Our impressive infrastructure spans across a modern campus
							designed for holistic development.
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{[
							{ number: "15", label: "Acres Campus", icon: "🏢" },
							{ number: "45", label: "Classrooms", icon: "🏫" },
							{ number: "12", label: "Laboratories", icon: "🔬" },
							{ number: "24/7", label: "Security", icon: "🛡️" },
						].map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{ y: -4 }}
								className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30 hover:shadow-lg transition-all duration-300"
							>
								<div className="text-4xl mb-3">{stat.icon}</div>
								<div className="text-3xl font-bold text-foreground mb-2">
									{stat.number}
								</div>
								<div className="text-sm text-muted-foreground">
									{stat.label}
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.8 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="max-w-4xl mx-auto">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Experience Our Campus
						</h3>
						<p className="text-muted-foreground mb-6">
							Schedule a tour to see our world-class facilities and discover how
							our infrastructure supports exceptional learning experiences.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-gradient-to-r from-primary to-secondary  px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
							>
								Schedule Campus Tour
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-card/80 backdrop-blur-sm text-foreground px-8 py-3 rounded-xl font-semibold border border-border hover:shadow-lg transition-all duration-300"
							>
								Virtual Tour
							</motion.button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
