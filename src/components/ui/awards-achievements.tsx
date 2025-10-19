"use client";

import { motion } from "framer-motion";
import { Award, Trophy, Medal, Star } from "lucide-react";

export function AwardsAchievements() {
	const awards = [
		{
			year: "2024",
			title: "National Education Excellence Award",
			organization: "Ministry of Education",
			description:
				"Recognized as the leading educational institution for innovative teaching methods and outstanding student performance.",
			category: "Academic Excellence",
			icon: Trophy,
			color: "from-primary to-accent",
		},
		{
			year: "2023",
			title: "Best STEM Education Program",
			organization: "National Science Foundation",
			description:
				"Awarded for implementing cutting-edge STEM curriculum and achieving exceptional results in science and mathematics.",
			category: "STEM Education",
			icon: Medal,
			color: "from-primary to-secondary",
		},
		{
			year: "2023",
			title: "Environmental Sustainability Award",
			organization: "Green Schools Alliance",
			description:
				"Recognized for outstanding commitment to environmental education and sustainable campus practices.",
			category: "Sustainability",
			icon: Award,
			color: "from-accent to-primary",
		},
		{
			year: "2022",
			title: "Digital Innovation in Education",
			organization: "EdTech Excellence Foundation",
			description:
				"Honored for successfully integrating technology in education and creating engaging digital learning experiences.",
			category: "Technology",
			icon: Star,
			color: "from-secondary to-accent",
		},
		{
			year: "2022",
			title: "Outstanding Sports Achievement",
			organization: "State Athletic Association",
			description:
				"Awarded for exceptional performance in inter-school sports competitions and promoting physical fitness.",
			category: "Sports",
			icon: Trophy,
			color: "from-red-500 to-pink-500",
		},
		{
			year: "2021",
			title: "Community Service Excellence",
			organization: "National Volunteer Foundation",
			description:
				"Recognized for outstanding community outreach programs and social responsibility initiatives.",
			category: "Community Service",
			icon: Award,
			color: "from-teal-500 to-cyan-500",
		},
	];

	const achievements = [
		{
			metric: "98%",
			description: "Board Exam Pass Rate",
			detail: "Consistently high academic performance",
		},
		{
			metric: "150+",
			description: "National Competition Winners",
			detail: "Students excelling in various competitions",
		},
		{
			metric: "25+",
			description: "International Awards",
			detail: "Global recognition for excellence",
		},
		{
			metric: "100%",
			description: "University Placement",
			detail: "All graduates admitted to top universities",
		},
	];

	const studentAchievements = [
		{
			name: "International Math Olympiad",
			year: "2024",
			winners: "5 Gold Medals",
			icon: "🥇",
		},
		{
			name: "National Science Fair",
			year: "2024",
			winners: "3 First Prizes",
			icon: "🔬",
		},
		{
			name: "Model UN Conference",
			year: "2023",
			winners: "Best Delegation",
			icon: "🌍",
		},
		{
			name: "Robotics Championship",
			year: "2023",
			winners: "State Champions",
			icon: "🤖",
		},
		{
			name: "Literary Festival",
			year: "2024",
			winners: "6 National Awards",
			icon: "📚",
		},
		{
			name: "Art & Design Contest",
			year: "2024",
			winners: "10 Regional Winners",
			icon: "🎨",
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
						<Award className="w-4 h-4 text-primary" />
						<span className="text-sm font-semibold text-muted-foreground">
							Recognition & Excellence
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
						Awards & <span className="text-gradient-primary">Achievements</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Our commitment to excellence has been recognized by prestigious
						organizations and reflected in our students&apos; outstanding
						achievements.
					</p>
				</motion.div>

				{/* Achievement Metrics */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto"
				>
					{achievements.map((achievement, index) => (
						<motion.div
							key={achievement.description}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -8, scale: 1.05 }}
							className="text-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
						>
							<motion.div
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								transition={{
									duration: 0.8,
									delay: 0.6 + index * 0.1,
									type: "spring",
									bounce: 0.5,
								}}
								viewport={{ once: true }}
								className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2"
							>
								{achievement.metric}
							</motion.div>
							<div className="text-sm font-semibold text-foreground mb-1">
								{achievement.description}
							</div>
							<div className="text-xs text-muted-foreground">
								{achievement.detail}
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Awards Wall */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<div className="text-center mb-12">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Recent <span className="text-gradient-accent">Awards</span>
						</h3>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Recognition from leading educational organizations validates our
							commitment to excellence.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{awards.map((award, index) => (
							<motion.div
								key={`${award.year}-${award.title}`}
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
										className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${award.color} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`}
									></div>

									{/* Content */}
									<div className="relative z-10">
										{/* Header */}
										<div className="flex items-start justify-between mb-6">
											<motion.div
												whileHover={{ scale: 1.1, rotate: 5 }}
												className={`w-16 h-16 bg-gradient-to-br ${award.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
											>
												<award.icon className="w-8 h-8 text-white" />
											</motion.div>
											<div className="text-right">
												<div className="text-2xl font-bold text-gradient-primary">
													{award.year}
												</div>
												<div className="text-sm text-muted-foreground">
													{award.category}
												</div>
											</div>
										</div>

										{/* Title */}
										<h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
											{award.title}
										</h4>

										{/* Organization */}
										<p className="text-primary font-semibold mb-4 text-sm">
											{award.organization}
										</p>

										{/* Description */}
										<p className="text-muted-foreground text-sm leading-relaxed">
											{award.description}
										</p>

										{/* Decorative line */}
										<div
											className={`w-8 h-1 bg-gradient-to-r ${award.color} rounded-full mt-6 group-hover:w-full transition-all duration-500`}
										></div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Student Achievements */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<div className="text-center mb-12">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Student{" "}
							<span className="text-gradient-primary">Achievements</span>
						</h3>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Our students consistently excel in national and international
							competitions across various fields.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{studentAchievements.map((achievement, index) => (
							<motion.div
								key={achievement.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{ y: -4, scale: 1.02 }}
								className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300"
							>
								<div className="flex items-center gap-4 mb-4">
									<div className="text-3xl">{achievement.icon}</div>
									<div className="flex-1">
										<h4 className="font-semibold text-foreground text-sm">
											{achievement.name}
										</h4>
										<p className="text-xs text-muted-foreground">
											{achievement.year}
										</p>
									</div>
								</div>
								<div className="text-primary font-bold text-sm">
									{achievement.winners}
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Recognition Timeline */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.8 }}
					viewport={{ once: true }}
					className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border/50"
				>
					<div className="text-center mb-8">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Legacy of Excellence
						</h3>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Our journey of recognition spans over two decades, with consistent
							acknowledgment of our educational excellence and innovation.
						</p>
					</div>

					<div className="flex flex-wrap justify-center gap-6">
						{["2024", "2023", "2022", "2021", "2020"].map((year, index) => (
							<motion.div
								key={year}
								initial={{ opacity: 0, scale: 0 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{
									duration: 0.6,
									delay: 1.0 + index * 0.1,
									type: "spring",
									bounce: 0.5,
								}}
								viewport={{ once: true }}
								whileHover={{ scale: 1.1 }}
								className="flex flex-col items-center p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 hover:shadow-lg transition-all duration-300"
							>
								<div className="text-2xl font-bold text-gradient-primary mb-1">
									{year}
								</div>
								<div className="text-xs text-muted-foreground">
									Multiple Awards
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.0 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="max-w-4xl mx-auto">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Join Our Legacy of Excellence
						</h3>
						<p className="text-muted-foreground mb-6">
							Become part of an institution with a proven track record of
							nurturing champions and leaders.
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-gradient-to-r from-primary to-secondary  px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
						>
							Apply for Admission
						</motion.button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
