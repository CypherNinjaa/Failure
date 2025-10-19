"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Music, Palette, Gamepad2, Award } from "lucide-react";

export function CoCurricularHero() {
	const floatingIcons = [
		{ Icon: Trophy, position: "top-20 left-10", delay: 0 },
		{ Icon: Music, position: "top-32 right-16", delay: 0.2 },
		{ Icon: Palette, position: "bottom-32 left-16", delay: 0.4 },
		{ Icon: Gamepad2, position: "bottom-20 right-12", delay: 0.6 },
		{ Icon: Users, position: "top-40 left-1/3", delay: 0.8 },
		{ Icon: Award, position: "bottom-40 right-1/3", delay: 1.0 },
	];

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background">
			{/* Animated Background Pattern */}
			<div className="absolute inset-0 opacity-30">
				<div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
				<div
					className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow"
					style={{ animationDelay: "1s" }}
				/>
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow"
					style={{ animationDelay: "2s" }}
				/>
			</div>

			{/* Floating Activity Icons */}
			{floatingIcons.map(({ Icon, position, delay }, index) => (
				<motion.div
					key={index}
					className={`absolute hidden lg:block ${position}`}
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay }}
				>
					<div className="relative">
						<div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg animate-float">
							<Icon className="w-8 h-8 text-pink-500" />
						</div>
						<div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-bounce-gentle" />
					</div>
				</motion.div>
			))}

			{/* Main Content */}
			<div className="container mx-auto px-4 text-center z-10">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="max-w-4xl mx-auto"
				>
					{/* Breadcrumb */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-6"
					>
						
					</motion.div>

					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary font-medium text-sm mb-6"
					>
						🎭 Beyond Academics
					</motion.div>

					{/* Main Heading */}
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
					>
						<span className="text-gradient-primary">Co-curricular</span>
						<br />
						<span className="text-foreground">Activities</span>
					</motion.h1>

					{/* Description */}
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
					>
						Discover a world of creativity, talent, and endless possibilities.
						Our comprehensive co-curricular programs are designed to nurture
						well-rounded individuals who excel beyond the classroom.
					</motion.p>

					{/* Quick Stats */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.8 }}
						className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
					>
						{[
							{ number: "25+", label: "Activities" },
							{ number: "500+", label: "Participants" },
							{ number: "50+", label: "Awards Won" },
							{ number: "12", label: "Clubs" },
						].map((stat, index) => (
							<div
								key={index}
								className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border/50"
							>
								<div className="text-2xl md:text-3xl font-bold text-gradient-primary">
									{stat.number}
								</div>
								<div className="text-sm text-muted-foreground">
									{stat.label}
								</div>
							</div>
						))}
					</motion.div>
				</motion.div>
			</div>

			{/* Scroll Indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, delay: 1.2 }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
			>
				<div className="flex flex-col items-center space-y-2">
					<span className="text-sm text-muted-foreground">
						Explore Activities
					</span>
					<div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
						<div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
					</div>
				</div>
			</motion.div>
		</section>
	);
}
