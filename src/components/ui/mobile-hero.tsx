"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function MobileHero() {
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
						<Sparkles className="w-4 h-4 text-yellow-500" />
						<span className="text-sm font-semibold text-muted-foreground">
							🌟 Building Tomorrow&apos;s Leaders Today
						</span>
					</motion.div>

					{/* Main Heading */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="space-y-4"
					>
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
							<span className="text-foreground">Welcome to</span>
							<br />
							<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
								Happy Child School
							</span>
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							Where innovation meets education! We nurture young minds with
							cutting-edge facilities, expert teachers, and a curriculum
							designed for the digital age.
						</p>
					</motion.div>

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
					>
						<Button
							size="lg"
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
							asChild
						>
							<Link href="/admissions" className="flex items-center gap-2">
								🎓 Apply for Admission
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</Link>
						</Button>

						<Button
							size="lg"
							variant="outline"
							className="border-2 border-primary text-primary hover:bg-primary/10 rounded-2xl px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
							asChild
						>
							<Link href="/virtual-tour">🏫 Virtual Tour</Link>
						</Button>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
