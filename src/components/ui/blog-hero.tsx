"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function BlogHero() {
	const [searchQuery, setSearchQuery] = useState("");

	const stats = [
		{ icon: TrendingUp, label: "Articles", value: "200+" },
		{ icon: Users, label: "Contributors", value: "25+" },
		{ icon: Calendar, label: "Weekly Posts", value: "5+" },
	];

	return (
		<section className="relative pt-24 pb-16 overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
			<div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse" />
			<div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-1000" />
			<div
				className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full opacity-30 animate-spin"
				style={{ animationDuration: "20s" }}
			/>

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-4xl mx-auto text-center">
					{/* Main Content */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="mb-8"
					>
						<div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-6">
							<span className="mr-2">📚</span>
							School Blog & Articles
						</div>

						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
							<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
								Happy Child
							</span>
							<br />
							<span className="text-foreground">Blog</span>
						</h1>

						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
							Discover inspiring stories, educational insights, and updates from
							our vibrant school community. Join the conversation and stay
							connected!
						</p>
					</motion.div>

					{/* Search Bar */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="max-w-md mx-auto mb-12"
					>
						<div className="relative">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search articles..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 pr-4 py-3 rounded-xl border-2 bg-background/80 backdrop-blur-sm focus:border-primary transition-colors"
							/>
							<Button
								size="sm"
								className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg"
							>
								Search
							</Button>
						</div>
					</motion.div>

					{/* Stats */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
					>
						{stats.map((stat, index) => (
							<div key={index} className="text-center">
								<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl mb-3">
									<stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</div>
								<div className="text-2xl font-bold text-foreground">
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground">
									{stat.label}
								</div>
							</div>
						))}
					</motion.div>
				</div>
			</div>

			{/* Floating Elements */}
			<div className="absolute top-1/4 left-8 hidden lg:block">
				<motion.div
					animate={{ y: [-20, 20, -20] }}
					transition={{ duration: 6, repeat: Infinity }}
					className="w-6 h-6 bg-blue-400 rounded-full opacity-40"
				/>
			</div>
			<div className="absolute top-1/3 right-12 hidden lg:block">
				<motion.div
					animate={{ y: [20, -20, 20] }}
					transition={{ duration: 8, repeat: Infinity }}
					className="w-8 h-8 bg-purple-400 rounded-full opacity-40"
				/>
			</div>
			<div className="absolute bottom-1/4 left-1/4 hidden lg:block">
				<motion.div
					animate={{ y: [-15, 15, -15] }}
					transition={{ duration: 7, repeat: Infinity }}
					className="w-4 h-4 bg-pink-400 rounded-full opacity-40"
				/>
			</div>
		</section>
	);
}
