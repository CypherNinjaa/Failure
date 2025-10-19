"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart, Lightbulb } from "lucide-react";

export function VisionMission() {
	const values = [
		{
			icon: Heart,
			title: "Compassion",
			description:
				"We foster empathy, kindness, and care for others in our learning community.",
			color: "from-pink-500 to-rose-500",
		},
		{
			icon: Lightbulb,
			title: "Innovation",
			description:
				"We embrace creativity and new ideas to enhance the learning experience.",
			color: "from-yellow-500 to-orange-500",
		},
		{
			icon: Target,
			title: "Excellence",
			description:
				"We strive for the highest standards in all aspects of education and character development.",
			color: "from-blue-500 to-indigo-500",
		},
		{
			icon: Eye,
			title: "Integrity",
			description:
				"We maintain honesty, transparency, and moral principles in all our actions.",
			color: "from-green-500 to-emerald-500",
		},
	];

	return (
		<section className="py-16 md:py-24 bg-muted/30">
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
						<Target className="w-4 h-4 text-primary" />
						<span className="text-sm font-semibold text-muted-foreground">
							Our Guiding Principles
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
						Vision, Mission &{" "}
						<span className="text-gradient-primary">Core Values</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						The principles that guide our educational philosophy and shape the
						future of our students.
					</p>
				</motion.div>

				{/* Vision & Mission Cards */}
				<div className="grid md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
					{/* Vision Card */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						whileHover={{ y: -8 }}
						className="relative"
					>
						<div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
							{/* Background decoration */}
							<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full -translate-y-8 translate-x-8"></div>
							<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full translate-y-6 -translate-x-6"></div>

							{/* Content */}
							<div className="relative z-10">
								<div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
									<Eye className="w-8 h-8 " />
								</div>
								<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
									Our <span className="text-gradient-primary">Vision</span>
								</h3>
								<p className="text-muted-foreground leading-relaxed text-lg">
									To be a globally recognized institution that nurtures
									confident, compassionate, and capable individuals who will
									become tomorrow&apos;s leaders, innovators, and positive
									change-makers in our interconnected world.
								</p>

								{/* Quote */}
								<div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border-l-4 border-primary">
									<p className="text-foreground font-medium italic">
										&quot;Every child has the potential to change the
										world.&quot;
									</p>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Mission Card */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						viewport={{ once: true }}
						whileHover={{ y: -8 }}
						className="relative"
					>
						<div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
							{/* Background decoration */}
							<div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full -translate-y-6 -translate-x-6"></div>
							<div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/10 to-accent/10 rounded-full translate-y-4 translate-x-4"></div>

							{/* Content */}
							<div className="relative z-10">
								<div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
									<Target className="w-8 h-8 " />
								</div>
								<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
									Our <span className="text-gradient-accent">Mission</span>
								</h3>
								<p className="text-muted-foreground leading-relaxed text-lg mb-4">
									To provide exceptional, holistic education that combines
									academic excellence with character development, critical
									thinking, and creativity.
								</p>

								{/* Mission Points */}
								<ul className="space-y-2">
									{[
										"Foster a love for lifelong learning",
										"Develop critical thinking and problem-solving skills",
										"Nurture social and emotional intelligence",
										"Celebrate diversity and promote inclusion",
									].map((point, index) => (
										<motion.li
											key={point}
											initial={{ opacity: 0, x: 20 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
											viewport={{ once: true }}
											className="flex items-center gap-3 text-muted-foreground"
										>
											<div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full"></div>
											{point}
										</motion.li>
									))}
								</ul>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Core Values */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
						Our <span className="text-gradient-primary">Core Values</span>
					</h3>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						The fundamental beliefs that shape our educational approach and
						community culture.
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
					{values.map((value, index) => (
						<motion.div
							key={value.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -8, scale: 1.02 }}
							className="group"
						>
							<div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
								{/* Icon */}
								<motion.div
									whileHover={{ scale: 1.1, rotate: 5 }}
									className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
								>
									<value.icon className="w-8 h-8 text-white" />
								</motion.div>

								{/* Title */}
								<h4 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
									{value.title}
								</h4>

								{/* Description */}
								<p className="text-muted-foreground leading-relaxed text-sm">
									{value.description}
								</p>

								{/* Decorative line */}
								<div
									className={`w-8 h-1 bg-gradient-to-r ${value.color} rounded-full mx-auto mt-4 group-hover:w-12 transition-all duration-300`}
								></div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.8 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border/50 max-w-4xl mx-auto">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Join Our Mission
						</h3>
						<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
							Be part of a community dedicated to shaping bright futures and
							making a positive impact on the world.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-gradient-to-r from-primary to-secondary  px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
							>
								Apply for Admission
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-card/80 backdrop-blur-sm text-foreground px-8 py-3 rounded-xl font-semibold border border-border hover:shadow-lg transition-all duration-300"
							>
								Learn More
							</motion.button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
