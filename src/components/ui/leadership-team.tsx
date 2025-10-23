"use client";

import { motion } from "framer-motion";
import { Users, Mail, Phone, Linkedin, Award, Calendar } from "lucide-react";

interface Leader {
	name: string;
	position: string;
	experience: string;
	education: string;
	image: string;
	email: string;
	phone: string;
	specialization: string;
	achievements: string[];
	quote: string;
}

interface LeadershipTeamClientProps {
	leaders: Leader[];
}

export function LeadershipTeamClient({ leaders }: LeadershipTeamClientProps) {
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
						<Users className="w-4 h-4 text-primary" />
						<span className="text-sm font-semibold text-muted-foreground">
							Meet Our Leaders
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
						Leadership <span className="text-gradient-primary">Team</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Dedicated professionals with years of experience in education,
						committed to fostering excellence and innovation in learning.
					</p>
				</motion.div>

				{/* Leadership Cards */}
				<div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
					{leaders.map((leader, index) => (
						<motion.div
							key={leader.name}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="group"
						>
							<motion.div
								whileHover={{ y: -8 }}
								className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
							>
								{/* Background decoration */}
								<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
								<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-primary/5 rounded-full translate-y-6 -translate-x-6 group-hover:scale-125 transition-transform duration-500"></div>

								{/* Content */}
								<div className="relative z-10">
									{/* Header with Avatar and Basic Info */}
									<div className="flex items-start gap-6 mb-6">
										{/* Avatar */}
										<motion.div
											whileHover={{ scale: 1.1, rotate: 5 }}
											className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300"
										>
											{leader.image}
										</motion.div>

										{/* Basic Info */}
										<div className="flex-1">
											<h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
												{leader.name}
											</h3>
											<p className="text-primary font-semibold mb-2">
												{leader.position}
											</p>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<Calendar className="w-4 h-4" />
													{leader.experience}
												</div>
												<div className="flex items-center gap-1">
													<Award className="w-4 h-4" />
													Expert
												</div>
											</div>
										</div>
									</div>

									{/* Quote */}
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
										viewport={{ once: true }}
										className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 mb-6 border-l-4 border-primary group-hover:border-secondary transition-colors duration-300"
									>
										<p className="text-foreground italic font-medium">
											&quot;{leader.quote}&quot;
										</p>
									</motion.div>

									{/* Details */}
									<div className="space-y-3 mb-6">
										<div>
											<h4 className="text-sm font-semibold text-foreground mb-1">
												Education
											</h4>
											<p className="text-muted-foreground text-sm">
												{leader.education}
											</p>
										</div>
										<div>
											<h4 className="text-sm font-semibold text-foreground mb-1">
												Specialization
											</h4>
											<p className="text-muted-foreground text-sm">
												{leader.specialization}
											</p>
										</div>
										<div>
											<h4 className="text-sm font-semibold text-foreground mb-1">
												Recent Achievements
											</h4>
											<ul className="text-muted-foreground text-sm space-y-1">
												{leader.achievements.map((achievement, i) => (
													<li key={i} className="flex items-center gap-2">
														<div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
														{achievement}
													</li>
												))}
											</ul>
										</div>
									</div>

									{/* Contact Info */}
									<div className="flex items-center gap-4 pt-4 border-t border-border/50">
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-white rounded-xl flex items-center justify-center text-primary transition-all duration-300 group/btn"
										>
											<Mail className="w-4 h-4" />
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="w-10 h-10 bg-secondary/10 hover:bg-secondary hover:text-white rounded-xl flex items-center justify-center text-secondary transition-all duration-300"
										>
											<Phone className="w-4 h-4" />
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="w-10 h-10 bg-accent/10 hover:bg-accent hover:text-white rounded-xl flex items-center justify-center text-accent transition-all duration-300"
										>
											<Linkedin className="w-4 h-4" />
										</motion.button>
									</div>

									{/* Hover Overlay */}
									<motion.div
										initial={{ opacity: 0, scale: 0 }}
										whileHover={{ opacity: 1, scale: 1 }}
										className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-primary/20 pointer-events-none"
									/>
								</div>
							</motion.div>
						</motion.div>
					))}
				</div>

				{/* Team Stats */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
				>
					{[
						{ number: "100+", label: "Combined Years", icon: "🎓" },
						{ number: "15+", label: "Awards Won", icon: "🏆" },
						{ number: "5000+", label: "Students Mentored", icon: "👥" },
						{ number: "25+", label: "Programs Led", icon: "📚" },
					].map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -4 }}
							className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300"
						>
							<div className="text-3xl mb-2">{stat.icon}</div>
							<div className="text-2xl font-bold text-foreground mb-1">
								{stat.number}
							</div>
							<div className="text-sm text-muted-foreground">{stat.label}</div>
						</motion.div>
					))}
				</motion.div>

				{/* Join Leadership CTA */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border/50 max-w-4xl mx-auto">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Join Our Leadership Journey
						</h3>
						<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
							Are you passionate about education and leadership? We&apos;re
							always looking for exceptional individuals to join our team.
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-gradient-to-r from-primary to-secondary  px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
						>
							View Career Opportunities
						</motion.button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

// Backward compatibility export with default data
export function LeadershipTeam() {
	const defaultLeaders = [
		{
			name: "Dr. Sarah Johnson",
			position: "Principal & Chief Education Officer",
			experience: "25+ Years",
			education: "Ph.D. in Educational Leadership",
			image: "SJ",
			email: "sarah.johnson@school.edu",
			phone: "+1 (555) 123-4567",
			specialization: "Educational Leadership",
			achievements: ["National Education Excellence Award 2023"],
			quote: "Every child is a unique star waiting to shine.",
		},
	];

	return <LeadershipTeamClient leaders={defaultLeaders} />;
}
