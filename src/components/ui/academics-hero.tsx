"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, Trophy } from "lucide-react";

export function AcademicsHero() {
	return (
		<section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-background via-muted/30 to-primary/5 overflow-hidden">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 pointer-events-none">
				<motion.div
					className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
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
					className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl"
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
				<motion.div
					className="absolute top-1/2 left-1/2 w-40 h-40 bg-accent/5 rounded-full blur-2xl"
					animate={{
						scale: [1, 1.2, 1],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-4xl mx-auto text-center">
					{/* Hero Content */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="space-y-6"
					>
						{/* Icon and Badge */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="flex justify-center"
						>
							<div className="relative">
								<div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
									<GraduationCap className="w-10 h-10 md:w-12 md:h-12 " />
								</div>
								<div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
									<Trophy className="w-3 h-3 text-white" />
								</div>
							</div>
						</motion.div>

						{/* Title */}
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient-primary leading-tight"
						>
							Academic Excellence
						</motion.h1>

						{/* Subtitle */}
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
						>
							Nurturing young minds through innovative curricula, cutting-edge
							teaching methodologies, and comprehensive academic programs
							designed for holistic development.
						</motion.p>

						{/* Stats Cards */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.6 }}
							className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 max-w-4xl mx-auto"
						>
							{[
								{
									icon: BookOpen,
									value: "20+",
									label: "Subjects Offered",
									color: "from-blue-500 to-blue-600",
								},
								{
									icon: Users,
									value: "3",
									label: "Academic Levels",
									color: "from-purple-500 to-purple-600",
								},
								{
									icon: Trophy,
									value: "95%",
									label: "Success Rate",
									color: "from-green-500 to-green-600",
								},
							].map((stat, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
									className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
								>
									<div
										className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
									>
										<stat.icon className="w-6 h-6 " />
									</div>
									<div className="text-3xl font-bold text-foreground mb-2">
										{stat.value}
									</div>
									<div className="text-muted-foreground font-medium">
										{stat.label}
									</div>
								</motion.div>
							))}
						</motion.div>

						{/* Floating Action Indicator */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 1, delay: 1.2 }}
							className="mt-12"
						>
							<motion.div
								animate={{ y: [0, -8, 0] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="w-8 h-8 mx-auto border-2 border-primary rounded-full flex items-center justify-center"
							>
								<motion.div
									animate={{ scale: [1, 1.2, 1] }}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										ease: "easeInOut",
									}}
									className="w-2 h-2 bg-primary rounded-full"
								/>
							</motion.div>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
