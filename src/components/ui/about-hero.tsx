"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Award, BookOpen } from "lucide-react";

export function AboutHero() {
	const stats = [
		{ icon: Users, label: "Students", value: "1,200+" },
		{ icon: BookOpen, label: "Teachers", value: "80+" },
		{ icon: Award, label: "Awards", value: "50+" },
		{ icon: GraduationCap, label: "Years", value: "25+" },
	];

	return (
		<section className="relative py-20 md:py-32 bg-background overflow-hidden">
			{/* Background gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>

			{/* Floating Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div
					className="absolute top-20 left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20"
					animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
					transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
				/>
				<motion.div
					className="absolute top-40 right-8 w-12 h-12 bg-pink-400 rounded-full opacity-20"
					animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
					transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
				/>
				<motion.div
					className="absolute bottom-32 left-8 w-20 h-20 bg-green-400 rounded-full opacity-20"
					animate={{ y: [0, -25, 0], scale: [1, 1.1, 1] }}
					transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
				/>
			</div>

			<div className="container relative z-10 px-4 py-8 md:py-16">
				<div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center gap-2 px-6 py-3 bg-card/90 backdrop-blur-sm rounded-full shadow-lg border border-border"
					>
						<GraduationCap className="w-4 h-4 text-primary" />
						<span className="text-sm font-semibold text-muted-foreground">
							✨ About Happy Child School
						</span>
					</motion.div>

					{/* Main Heading */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="space-y-4"
					>
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
							<span className="text-gradient-primary">Nurturing</span>
							<br />
							<span className="text-foreground">Young Minds Since</span>
							<br />
							<span className="text-gradient-accent">1999</span>
						</h1>
					</motion.div>

					{/* Description */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
					>
						At Happy Child School, we believe every child is a unique star
						waiting to shine. Our commitment to excellence in education has
						shaped thousands of bright futures for over two decades.
					</motion.p>

					{/* Stats */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-8"
					>
						{stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
								className="flex flex-col items-center space-y-2 p-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300"
							>
								<div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
									<stat.icon className="w-6 h-6 text-primary-foreground" />
								</div>
								<div className="text-2xl md:text-3xl font-bold text-foreground">
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground font-medium">
									{stat.label}
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
