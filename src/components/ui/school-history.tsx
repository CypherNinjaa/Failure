"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export function SchoolHistory() {
	const timelineEvents = [
		{
			year: "1999",
			title: "Foundation",
			description:
				"Happy Child School was established with a vision to provide quality education in a nurturing environment.",
			icon: "🏫",
		},
		{
			year: "2003",
			title: "First Graduation",
			description:
				"Our first batch of students graduated with outstanding results, setting the foundation for excellence.",
			icon: "🎓",
		},
		{
			year: "2008",
			title: "Campus Expansion",
			description:
				"Expanded our campus to include state-of-the-art science labs and computer facilities.",
			icon: "🔬",
		},
		{
			year: "2012",
			title: "Sports Complex",
			description:
				"Added a modern sports complex with swimming pool, basketball court, and football ground.",
			icon: "🏆",
		},
		{
			year: "2016",
			title: "Digital Learning",
			description:
				"Introduced smart classrooms and digital learning platforms for enhanced education.",
			icon: "💻",
		},
		{
			year: "2020",
			title: "Online Excellence",
			description:
				"Successfully transitioned to hybrid learning during the pandemic without compromising quality.",
			icon: "🌐",
		},
		{
			year: "2024",
			title: "AI Integration",
			description:
				"Pioneered AI-assisted learning and personalized education pathways for students.",
			icon: "🤖",
		},
	];

	return (
		<section className="py-16 md:py-24 bg-muted/30">
			<div className="container px-4">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 px-6 py-3 bg-card/90 backdrop-blur-sm rounded-full shadow-lg border border-border mb-6">
						<Clock className="w-4 h-4 text-primary" />
						<span className="text-sm font-semibold text-muted-foreground">
							Our Journey Through Time
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
						<span className="text-gradient-primary">25 Years</span> of
						Excellence
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						From humble beginnings to becoming a leading educational
						institution, discover the milestones that shaped our journey.
					</p>
				</motion.div>

				<div className="relative max-w-6xl mx-auto">
					{/* Timeline Line - Enhanced with colorful gradient and better visibility */}
					<div className="absolute left-4 md:left-1/2 top-0 bottom-0 transform md:-translate-x-1/2 z-0">
						{/* Main colorful gradient line */}
						<div className="w-3 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-xl"></div>
						{/* Second gradient layer for more colors */}
						<div className="absolute top-1/3 w-3 h-2/3 bg-gradient-to-b from-orange-500 via-yellow-500 to-green-500 rounded-full mix-blend-overlay opacity-80"></div>
						{/* Third gradient layer */}
						<div className="absolute top-2/3 w-3 h-1/3 bg-gradient-to-b from-cyan-500 via-indigo-500 to-violet-500 rounded-full mix-blend-overlay opacity-70"></div>
						{/* Animated glow effect */}
						<div className="absolute inset-0 w-3 bg-gradient-to-b from-cyan-300 via-violet-300 to-rose-300 rounded-full blur-lg opacity-50 animate-pulse"></div>
						{/* Outer glow for better visibility in both themes */}
						<div className="absolute -inset-2 w-7 bg-gradient-to-b from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl"></div>
					</div>

					{/* Timeline Events */}
					<div className="space-y-12">
						{timelineEvents.map((event, index) => (
							<motion.div
								key={event.year}
								initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.8, delay: index * 0.1 }}
								viewport={{ once: true }}
								className={`relative flex items-center ${
									index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
								} flex-col md:flex-row`}
							>
								{/* Timeline Dot - Enhanced with colorful design */}
								<div className="absolute left-4 md:left-1/2 w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full border-4 border-background shadow-2xl transform md:-translate-x-1/2 z-10">
									<div className="absolute inset-1 bg-gradient-to-br from-cyan-400 to-violet-400 rounded-full animate-pulse"></div>
									<div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full animate-ping"></div>
								</div>

								{/* Content Card */}
								<div
									className={`w-full md:w-5/12 ml-12 md:ml-0 ${
										index % 2 === 0
											? "md:mr-auto md:pr-8"
											: "md:ml-auto md:pl-8"
									}`}
								>
									<motion.div
										whileHover={{ scale: 1.02, y: -4 }}
										className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300"
									>
										<div className="flex items-center gap-3 mb-4">
											<div className="text-3xl">{event.icon}</div>
											<div>
												<div className="text-2xl font-bold text-gradient-primary">
													{event.year}
												</div>
												<div className="text-lg font-semibold text-foreground">
													{event.title}
												</div>
											</div>
										</div>
										<p className="text-muted-foreground leading-relaxed">
											{event.description}
										</p>
									</motion.div>
								</div>

								{/* Spacer for desktop */}
								<div className="hidden md:block w-5/12"></div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border/50">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Be Part of Our Continuing Story
						</h3>
						<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
							As we look toward the future, we invite you to join our community
							and help us write the next chapter of excellence in education.
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
						>
							Join Our Community
						</motion.button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
