"use client";

import { motion } from "framer-motion";
import {
	Brain,
	Users,
	Monitor,
	Lightbulb,
	Target,
	Heart,
	Zap,
	BookOpen,
	Microscope,
	Gamepad2,
	Puzzle,
	Rocket,
	Globe,
	Award,
	Play,
	ArrowRight,
	CheckCircle,
} from "lucide-react";

export function TeachingMethodology() {
	const methodologies = [
		{
			title: "Interactive Learning",
			subtitle: "Engaging Student Participation",
			description:
				"Dynamic classroom sessions with student-teacher interaction, group discussions, and collaborative problem-solving activities.",
			icon: Users,
			color: "from-blue-500 to-blue-600",
			features: [
				"Group discussions and debates",
				"Peer-to-peer learning sessions",
				"Interactive Q&A sessions",
				"Collaborative project work",
			],
			benefits: [
				"Enhanced communication skills",
				"Better retention rates",
				"Improved critical thinking",
			],
			stats: { effectiveness: 92, satisfaction: 89 },
		},
		{
			title: "Technology Integration",
			subtitle: "Digital-First Education",
			description:
				"Smart classrooms equipped with digital boards, tablets, and educational software for immersive learning experiences.",
			icon: Monitor,
			color: "from-purple-500 to-purple-600",
			features: [
				"Smart board presentations",
				"Educational apps and software",
				"Virtual reality experiences",
				"Online assessment tools",
			],
			benefits: [
				"21st-century digital skills",
				"Visual and auditory learning",
				"Real-time progress tracking",
			],
			stats: { effectiveness: 95, satisfaction: 93 },
		},
		{
			title: "Hands-On Learning",
			subtitle: "Learning by Doing",
			description:
				"Practical experiments, field trips, and real-world applications to make learning tangible and memorable.",
			icon: Microscope,
			color: "from-green-500 to-green-600",
			features: [
				"Laboratory experiments",
				"Field trips and excursions",
				"Practical workshops",
				"Real-world case studies",
			],
			benefits: [
				"Better concept understanding",
				"Practical skill development",
				"Increased curiosity",
			],
			stats: { effectiveness: 88, satisfaction: 91 },
		},
		{
			title: "Gamified Learning",
			subtitle: "Making Education Fun",
			description:
				"Educational games, quizzes, and reward systems that make learning enjoyable and motivating for students.",
			icon: Gamepad2,
			color: "from-pink-500 to-pink-600",
			features: [
				"Educational gaming platforms",
				"Achievement badges and rewards",
				"Competitive learning challenges",
				"Progress tracking dashboards",
			],
			benefits: [
				"Increased engagement",
				"Motivation through rewards",
				"Friendly competition",
			],
			stats: { effectiveness: 90, satisfaction: 96 },
		},
		{
			title: "Personalized Learning",
			subtitle: "Individual Student Focus",
			description:
				"Adaptive learning paths tailored to each student's pace, learning style, and academic needs.",
			icon: Target,
			color: "from-orange-500 to-orange-600",
			features: [
				"Individual learning assessments",
				"Customized study plans",
				"One-on-one mentoring",
				"Flexible pacing options",
			],
			benefits: [
				"Individual attention",
				"Self-paced learning",
				"Strength-based development",
			],
			stats: { effectiveness: 94, satisfaction: 88 },
		},
		{
			title: "Creative Expression",
			subtitle: "Nurturing Creativity",
			description:
				"Art, music, drama, and creative writing activities that foster imagination and self-expression.",
			icon: Lightbulb,
			color: "from-yellow-500 to-yellow-600",
			features: [
				"Art and craft workshops",
				"Music and dance sessions",
				"Creative writing exercises",
				"Drama and storytelling",
			],
			benefits: [
				"Enhanced creativity",
				"Improved self-confidence",
				"Emotional expression",
			],
			stats: { effectiveness: 86, satisfaction: 94 },
		},
	];

	const principles = [
		{
			title: "Student-Centered Approach",
			description:
				"Every teaching method is designed keeping the student at the center of the learning process.",
			icon: Heart,
			color: "from-red-500 to-red-600",
		},
		{
			title: "Active Learning",
			description:
				"Students actively participate in the learning process rather than passively receiving information.",
			icon: Zap,
			color: "from-blue-500 to-blue-600",
		},
		{
			title: "Inclusive Education",
			description:
				"Teaching methods accommodate different learning styles, abilities, and backgrounds.",
			icon: Globe,
			color: "from-green-500 to-green-600",
		},
		{
			title: "Continuous Assessment",
			description:
				"Regular evaluation and feedback help track progress and improve learning outcomes.",
			icon: Award,
			color: "from-purple-500 to-purple-600",
		},
	];

	const stats = [
		{ label: "Teaching Methods", value: "12+", icon: BookOpen },
		{ label: "Student Satisfaction", value: "94%", icon: Heart },
		{ label: "Learning Effectiveness", value: "92%", icon: Target },
		{ label: "Technology Integration", value: "100%", icon: Monitor },
	];

	return (
		<section className="py-16 md:py-24 bg-gradient-to-b from-muted/20 to-background">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
						<Brain className="w-4 h-4" />
						Teaching Methodology
					</div>
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						Innovative Teaching
						<span className="text-gradient-secondary"> Approaches</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
						Our research-backed teaching methodologies combine traditional
						wisdom with modern innovation, creating an engaging and effective
						learning environment for every student.
					</p>
				</motion.div>

				{/* Stats Overview */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
				>
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
						>
							<div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
								<stat.icon className="w-6 h-6 " />
							</div>
							<div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
								{stat.value}
							</div>
							<div className="text-sm text-muted-foreground">{stat.label}</div>
						</motion.div>
					))}
				</motion.div>

				{/* Teaching Methodologies Grid */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
				>
					{methodologies.map((method, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
						>
							{/* Header */}
							<div className="flex items-start gap-4 mb-6">
								<div
									className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
								>
									<method.icon className="w-8 h-8 text-white" />
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-foreground mb-2">
										{method.title}
									</h3>
									<p
										className={`text-sm font-medium bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}
									>
										{method.subtitle}
									</p>
								</div>
							</div>

							{/* Description */}
							<p className="text-muted-foreground mb-6 leading-relaxed">
								{method.description}
							</p>

							{/* Features */}
							<div className="mb-6">
								<h4 className="text-sm font-semibold text-foreground mb-3">
									Key Features:
								</h4>
								<div className="space-y-2">
									{method.features.map((feature, featureIndex) => (
										<div key={featureIndex} className="flex items-center gap-3">
											<div
												className={`w-2 h-2 bg-gradient-to-r ${method.color} rounded-full flex-shrink-0`}
											/>
											<span className="text-sm text-muted-foreground">
												{feature}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Benefits */}
							<div className="mb-6">
								<h4 className="text-sm font-semibold text-foreground mb-3">
									Learning Benefits:
								</h4>
								<div className="space-y-2">
									{method.benefits.map((benefit, benefitIndex) => (
										<div key={benefitIndex} className="flex items-center gap-3">
											<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
											<span className="text-sm text-muted-foreground">
												{benefit}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-2 gap-4 mb-6">
								<div className="bg-muted/50 rounded-xl p-3 text-center">
									<div className="text-lg font-bold text-foreground">
										{method.stats.effectiveness}%
									</div>
									<div className="text-xs text-muted-foreground">
										Effectiveness
									</div>
								</div>
								<div className="bg-muted/50 rounded-xl p-3 text-center">
									<div className="text-lg font-bold text-foreground">
										{method.stats.satisfaction}%
									</div>
									<div className="text-xs text-muted-foreground">
										Satisfaction
									</div>
								</div>
							</div>

							{/* Action Button */}
							<button
								className={`w-full bg-gradient-to-r ${method.color} text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group/btn`}
							>
								<Play className="w-4 h-4" />
								<span>See in Action</span>
								<ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
							</button>
						</motion.div>
					))}
				</motion.div>

				{/* Teaching Principles */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="mb-16"
				>
					<div className="text-center mb-12">
						<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
							Our Core Teaching Principles
						</h3>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							These fundamental principles guide every aspect of our teaching
							methodology and classroom practices.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{principles.map((principle, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 group"
							>
								<div
									className={`w-14 h-14 bg-gradient-to-r ${principle.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
								>
									<principle.icon className="w-7 h-7 text-white" />
								</div>
								<h4 className="text-lg font-bold text-foreground mb-3">
									{principle.title}
								</h4>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{principle.description}
								</p>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Interactive Demo Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-border"
				>
					<div className="text-center max-w-4xl mx-auto">
						<div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
							<Rocket className="w-4 h-4" />
							Experience Our Teaching Methods
						</div>

						<h3 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
							Ready to See Our Teaching in Action?
						</h3>

						<p className="text-lg text-muted-foreground mb-8 leading-relaxed">
							Schedule a classroom observation or request a demo session to
							experience our innovative teaching methodologies firsthand. See
							how we make learning engaging, effective, and enjoyable for every
							student.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button className="bg-gradient-to-r from-primary to-secondary  px-8 py-4 rounded-xl font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
								<Monitor className="w-5 h-5" />
								Schedule Demo Class
							</button>
							<button className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2">
								<BookOpen className="w-5 h-5" />
								Download Teaching Guide
							</button>
						</div>

						{/* Feature Highlights */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
							{[
								{ icon: Brain, label: "AI-Enhanced Learning" },
								{ icon: Users, label: "Collaborative Sessions" },
								{ icon: Puzzle, label: "Problem-Based Learning" },
								{ icon: Globe, label: "Global Perspectives" },
							].map((feature, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, scale: 0.8 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className="flex flex-col items-center gap-3"
								>
									<div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
										<feature.icon className="w-6 h-6 " />
									</div>
									<span className="text-sm font-medium text-foreground text-center">
										{feature.label}
									</span>
								</motion.div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
