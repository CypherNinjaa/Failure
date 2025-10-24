"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
	Play,
	Pause,
	Volume2,
	Fullscreen,
	Clock,
	Users,
	Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoAlbum {
	id: string | number;
	title: string;
	description: string;
	category: "all" | "events" | "academics" | "sports" | "testimonials";
	duration: string;
	views: number;
	uploadDate: string;
	thumbnail: string;
	thumbnailGradient: string;
	featured: boolean;
}

interface VideoGalleryProps {
	videos?: VideoAlbum[];
}

export function VideoGallery({
	videos: providedVideos,
}: VideoGalleryProps = {}) {
	const [playingVideo, setPlayingVideo] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Default videos for backward compatibility
	const defaultVideos = [
		{
			id: 1,
			title: "Annual Day Celebration 2024",
			description:
				"A spectacular showcase of student talents and achievements during our grand annual day celebration",
			category: "events",
			duration: "15:30",
			views: 2840,
			uploadDate: "2024-03-20",
			thumbnail: "from-purple-500 to-pink-600",
			featured: true,
		},
		{
			id: 2,
			title: "Science Lab Innovation",
			description:
				"Students conducting exciting experiments and exploring the wonders of science in our modern laboratory",
			category: "academics",
			duration: "8:45",
			views: 1560,
			uploadDate: "2024-03-15",
			thumbnail: "from-blue-500 to-cyan-600",
			featured: false,
		},
		{
			id: 3,
			title: "Inter-School Cricket Match",
			description:
				"Thrilling moments from our cricket team's victory in the inter-school championship",
			category: "sports",
			duration: "12:20",
			views: 3200,
			uploadDate: "2024-03-10",
			thumbnail: "from-green-500 to-teal-600",
			featured: true,
		},
		{
			id: 4,
			title: "Parent Testimonials",
			description:
				"Heartfelt testimonials from parents sharing their experiences with our school community",
			category: "testimonials",
			duration: "6:15",
			views: 890,
			uploadDate: "2024-03-05",
			thumbnail: "from-orange-500 to-red-600",
			featured: false,
		},
		{
			id: 5,
			title: "Virtual Campus Tour",
			description:
				"Take a comprehensive virtual tour of our state-of-the-art campus facilities and infrastructure",
			category: "academics",
			duration: "18:00",
			views: 4520,
			uploadDate: "2024-02-28",
			thumbnail: "from-indigo-500 to-purple-600",
			featured: true,
		},
		{
			id: 6,
			title: "Cultural Festival Highlights",
			description:
				"Vibrant performances and cultural celebrations showcasing our diverse student community",
			category: "events",
			duration: "22:30",
			views: 2180,
			uploadDate: "2024-02-20",
			thumbnail: "from-pink-500 to-rose-600",
			featured: false,
		},
		{
			id: 7,
			title: "Student Life Documentary",
			description:
				"A day in the life of our students - from morning assembly to evening activities",
			category: "academics",
			duration: "25:45",
			views: 1750,
			uploadDate: "2024-02-15",
			thumbnail: "from-teal-500 to-green-600",
			featured: false,
		},
		{
			id: 8,
			title: "Sports Day Achievements",
			description:
				"Celebrating athletic excellence and sportsmanship during our annual sports day",
			category: "sports",
			duration: "16:20",
			views: 2960,
			uploadDate: "2024-02-10",
			thumbnail: "from-yellow-500 to-orange-600",
			featured: true,
		},
	];

	// Use provided videos or default
	const videos =
		providedVideos && providedVideos.length > 0
			? providedVideos
			: defaultVideos;

	// Calculate category counts dynamically
	const videoCategories = [
		{ id: "all", name: "All Videos", count: videos.length },
		{
			id: "events",
			name: "School Events",
			count: videos.filter((v) => v.category === "events").length,
		},
		{
			id: "academics",
			name: "Academic Life",
			count: videos.filter((v) => v.category === "academics").length,
		},
		{
			id: "sports",
			name: "Sports Highlights",
			count: videos.filter((v) => v.category === "sports").length,
		},
		{
			id: "testimonials",
			name: "Testimonials",
			count: videos.filter((v) => v.category === "testimonials").length,
		},
	];

	const filteredVideos =
		selectedCategory === "all"
			? videos
			: videos.filter((video) => video.category === selectedCategory);

	const featuredVideos = videos.filter((video) => video.featured);

	const togglePlay = (videoId: string | number) => {
		setPlayingVideo(playingVideo === String(videoId) ? null : String(videoId));
	};

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24">
				<div className="container">
					<div className="text-center mb-12">
						<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
							<Play className="w-4 h-4 mr-2" />
							<span className="text-sm font-medium">Video Gallery</span>
						</div>
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							<span className="text-gradient-primary">Watch Our</span>
							<br />
							School Stories
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Experience our vibrant school life through engaging videos.
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 lg:py-24">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<Play className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Video Gallery</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Watch Our</span>
						<br />
						School Stories
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Experience our vibrant school life through engaging videos. From
						academic achievements to cultural celebrations, every moment tells a
						story of excellence and growth.
					</p>
				</motion.div>

				{/* Featured Videos Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
						<span className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
						Featured Videos
					</h3>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{featuredVideos.slice(0, 4).map((video, index) => (
							<motion.div
								key={video.id}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
								className="group cursor-pointer"
								onClick={() => togglePlay(video.id)}
							>
								<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
									<CardContent className="p-0">
										<div className="aspect-video relative overflow-hidden">
											<div
												className={`w-full h-full bg-gradient-to-br ${video.thumbnail} flex items-center justify-center relative`}
											>
												{/* Play Button Overlay */}
												<div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors duration-300">
													<div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
														{playingVideo === video.id ? (
															<Pause className="w-8 h-8 text-white" />
														) : (
															<Play className="w-8 h-8 text-white ml-1" />
														)}
													</div>
												</div>

												{/* Duration Badge */}
												<div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center">
													<Clock className="w-3 h-3 mr-1" />
													{video.duration}
												</div>

												{/* Featured Badge */}
												<div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
													Featured
												</div>
											</div>
										</div>

										<div className="p-4">
											<h4 className="font-semibold text-foreground mb-2 line-clamp-1">
												{video.title}
											</h4>
											<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
												{video.description}
											</p>
											<div className="flex items-center justify-between text-xs text-muted-foreground">
												<div className="flex items-center">
													<Users className="w-3 h-3 mr-1" />
													{video.views.toLocaleString()} views
												</div>
												<div className="flex items-center">
													<Calendar className="w-3 h-3 mr-1" />
													{new Date(video.uploadDate).toLocaleDateString()}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Category Filter */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-2 mb-8"
				>
					{videoCategories.map((category, index) => (
						<motion.button
							key={category.id}
							onClick={() => setSelectedCategory(category.id)}
							className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
								selectedCategory === category.id
									? "bg-accent text-accent-foreground shadow-lg scale-105"
									: "bg-card text-foreground hover:bg-muted border border-border"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.1 * index }}
						>
							<span className="flex items-center">
								<Play className="w-3 h-3 mr-2" />
								{category.name}
								<span
									className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
										selectedCategory === category.id
											? "bg-white/20 text-white"
											: "bg-accent/10 text-accent"
									}`}
								>
									{category.count}
								</span>
							</span>
						</motion.button>
					))}
				</motion.div>

				{/* All Videos Grid */}
				<motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					<AnimatePresence mode="popLayout">
						{filteredVideos.map((video, index) => (
							<motion.div
								key={video.id}
								layout
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.3, delay: 0.1 * index }}
								className="group cursor-pointer"
								onClick={() => togglePlay(video.id)}
							>
								<Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
									<CardContent className="p-0">
										<div className="aspect-video relative overflow-hidden">
											<div
												className={`w-full h-full bg-gradient-to-br ${video.thumbnail} flex items-center justify-center relative`}
											>
												{/* Video Player Simulation */}
												{playingVideo === video.id ? (
													<motion.div
														initial={{ scale: 0.8 }}
														animate={{ scale: 1 }}
														className="absolute inset-0 bg-black flex items-center justify-center"
													>
														<div className="text-white text-center">
															<div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
															<p className="text-sm">Loading Video...</p>
														</div>
													</motion.div>
												) : (
													<>
														{/* Play Button */}
														<div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors duration-300">
															<div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
																<Play className="w-8 h-8 text-white ml-1" />
															</div>
														</div>

														{/* Duration */}
														<div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center">
															<Clock className="w-3 h-3 mr-1" />
															{video.duration}
														</div>

														{/* Quality Badge */}
														<div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
															HD
														</div>
													</>
												)}
											</div>
										</div>

										<div className="p-4">
											<h4 className="font-semibold text-foreground mb-2 line-clamp-1">
												{video.title}
											</h4>
											<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
												{video.description}
											</p>

											<div className="flex items-center justify-between text-xs text-muted-foreground">
												<div className="flex items-center space-x-3">
													<span className="flex items-center">
														<Users className="w-3 h-3 mr-1" />
														{video.views.toLocaleString()}
													</span>
													<span className="flex items-center">
														<Calendar className="w-3 h-3 mr-1" />
														{new Date(video.uploadDate).toLocaleDateString()}
													</span>
												</div>
												<div className="flex items-center space-x-1">
													<Volume2 className="w-3 h-3" />
													<Fullscreen className="w-3 h-3" />
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>

				{/* Video Stats */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
				>
					{[
						{ label: "Total Videos", value: "200+", icon: Play },
						{ label: "Total Views", value: "50K+", icon: Users },
						{ label: "HD Quality", value: "100%", icon: Fullscreen },
						{ label: "New Weekly", value: "5+", icon: Calendar },
					].map((stat, index) => {
						const StatIcon = stat.icon;
						return (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.1 * index }}
								viewport={{ once: true }}
							>
								<Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/30">
									<CardContent className="p-4">
										<StatIcon className="w-8 h-8 text-accent mx-auto mb-2" />
										<div className="text-2xl font-bold text-foreground mb-1">
											{stat.value}
										</div>
										<div className="text-sm text-muted-foreground">
											{stat.label}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Load More */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<Button
						size="lg"
						className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70"
					>
						<Play className="w-4 h-4 mr-2" />
						Load More Videos
					</Button>
				</motion.div>
			</div>
		</section>
	);
}

// Default export for backward compatibility
export default VideoGallery;
