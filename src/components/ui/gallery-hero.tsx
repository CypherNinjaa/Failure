"use client";

import { motion } from "framer-motion";
import { Camera, Images, Video, VolumeX } from "lucide-react";

export function GalleryHero() {
	const features = [
		{
			icon: Images,
			title: "Photo Albums",
			description: "Thousands of memories captured",
			count: "5,000+",
		},
		{
			icon: Video,
			title: "Video Gallery",
			description: "High-quality video content",
			count: "200+",
		},
		{
			icon: Camera,
			title: "Live Events",
			description: "Real-time event coverage",
			count: "50+",
		},
		{
			icon: VolumeX,
			title: "Virtual Tours",
			description: "360° immersive experiences",
			count: "10+",
		},
	];

	return (
		<section className="relative py-20 lg:py-32 overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
			<div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500" />

			<div className="container relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
					>
						<Camera className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">School Gallery</span>
					</motion.div>

					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Memories</span>
						<br />
						That Last Forever
					</h1>

					<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
						Explore our vibrant school life through captivating photos, engaging
						videos, and immersive virtual tours. Every moment, every
						achievement, every smile - beautifully preserved for you to relive
						and cherish.
					</p>

					{/* Floating Gallery Preview */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="relative max-w-4xl mx-auto"
					>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
							{/* Preview Images */}
							{[
								{ category: "Events", color: "from-blue-400 to-purple-600" },
								{ category: "Sports", color: "from-green-400 to-teal-600" },
								{ category: "Academics", color: "from-orange-400 to-red-600" },
								{ category: "Campus", color: "from-purple-400 to-pink-600" },
							].map((item, index) => (
								<motion.div
									key={item.category}
									initial={{ opacity: 0, y: 20, rotate: -5 + index * 3 }}
									animate={{ opacity: 1, y: 0, rotate: -5 + index * 3 }}
									transition={{ duration: 0.6, delay: 0.2 * index }}
									className="group cursor-pointer"
								>
									<div className="aspect-square rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
										<div
											className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center relative`}
										>
											<Camera className="w-8 h-8 md:w-12 md:h-12 text-white/80" />
											<div className="absolute bottom-3 left-3 right-3">
												<div className="text-white font-semibold text-sm md:text-base">
													{item.category}
												</div>
												<div className="text-white/80 text-xs">
													{Math.floor(Math.random() * 50) + 20} Photos
												</div>
											</div>
											{/* Overlay */}
											<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
												<Images className="w-6 h-6 text-white" />
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				</motion.div>

				{/* Feature Stats */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
				>
					{features.map((feature, index) => {
						const FeatureIcon = feature.icon;
						return (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								className="group"
							>
								<div className="bg-card border border-border rounded-xl p-4 md:p-6 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
									<div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
										<FeatureIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
									</div>
									<div className="text-2xl md:text-3xl font-bold text-primary mb-1">
										{feature.count}
									</div>
									<h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">
										{feature.title}
									</h3>
									<p className="text-xs md:text-sm text-muted-foreground">
										{feature.description}
									</p>
								</div>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Scroll Indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 1 }}
					className="text-center mt-12"
				>
					<div className="inline-flex flex-col items-center text-muted-foreground">
						<span className="text-sm mb-2">Scroll to explore</span>
						<motion.div
							animate={{ y: [0, 10, 0] }}
							transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
							className="w-1 h-8 bg-gradient-to-b from-primary to-transparent rounded-full"
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
