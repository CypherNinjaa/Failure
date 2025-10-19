"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Eye, Clock, Calendar, Award } from "lucide-react";
import { useState } from "react";

const videoShowcases = [
	{
		id: 1,
		title: "Annual Day Performance 2024",
		description:
			"A spectacular showcase of talent featuring dance, music, and drama performances from students across all grades.",
		thumbnail: "/api/placeholder/600/400",
		duration: "12:45",
		category: "School Events",
		views: "2.3K",
		date: "March 2024",
		highlights: [
			"Cultural Dance",
			"Orchestra Performance",
			"Drama Play",
			"Awards Ceremony",
		],
		featured: true,
	},
	{
		id: 2,
		title: "Science Exhibition Innovation",
		description:
			"Students demonstrate their innovative science projects and experiments at the annual science fair.",
		thumbnail: "/api/placeholder/600/400",
		duration: "8:30",
		category: "Academic",
		views: "1.8K",
		date: "February 2024",
		highlights: [
			"Robotics Demo",
			"Chemistry Experiments",
			"Physics Models",
			"Environmental Projects",
		],
	},
	{
		id: 3,
		title: "Sports Day Champions",
		description:
			"Highlights from our inter-house sports competition showcasing athletic excellence and team spirit.",
		thumbnail: "/api/placeholder/600/400",
		duration: "15:20",
		category: "Sports",
		views: "3.1K",
		date: "January 2024",
		highlights: [
			"Track Events",
			"Field Games",
			"Team Sports",
			"Victory Ceremony",
		],
	},
	{
		id: 4,
		title: "Music Concert Ensemble",
		description:
			"The school orchestra and choir perform a beautiful collection of classical and contemporary pieces.",
		thumbnail: "/api/placeholder/600/400",
		duration: "25:15",
		category: "Music",
		views: "1.5K",
		date: "December 2023",
		highlights: [
			"Orchestra Performance",
			"Choir Singing",
			"Solo Acts",
			"Music Awards",
		],
	},
	{
		id: 5,
		title: "Art Exhibition Gallery Walk",
		description:
			"A virtual tour through our student art exhibition featuring paintings, sculptures, and digital art.",
		thumbnail: "/api/placeholder/600/400",
		duration: "6:45",
		category: "Visual Arts",
		views: "950",
		date: "November 2023",
		highlights: [
			"Student Paintings",
			"Sculpture Display",
			"Digital Art",
			"Artist Interviews",
		],
	},
	{
		id: 6,
		title: "Drama Club Production",
		description:
			"The school drama club presents their adaptation of a classic play with outstanding performances.",
		thumbnail: "/api/placeholder/600/400",
		duration: "45:30",
		category: "Theater",
		views: "2.7K",
		date: "October 2023",
		highlights: [
			"Stage Performance",
			"Character Acting",
			"Set Design",
			"Costume Design",
		],
	},
	{
		id: 7,
		title: "Debate Championship Finals",
		description:
			"Watch our debate team compete in the inter-school championship with impressive arguments and rebuttals.",
		thumbnail: "/api/placeholder/600/400",
		duration: "18:20",
		category: "Academic",
		views: "1.2K",
		date: "September 2023",
		highlights: [
			"Debate Competition",
			"Public Speaking",
			"Critical Thinking",
			"Award Ceremony",
		],
	},
	{
		id: 8,
		title: "Community Service Project",
		description:
			"Students engage in meaningful community service activities making a positive impact in the local area.",
		thumbnail: "/api/placeholder/600/400",
		duration: "10:15",
		category: "Community",
		views: "1.6K",
		date: "August 2023",
		highlights: [
			"Volunteer Work",
			"Environmental Cleanup",
			"Elderly Care",
			"Community Garden",
		],
	},
];

const categories = [
	"All",
	"School Events",
	"Academic",
	"Sports",
	"Music",
	"Visual Arts",
	"Theater",
	"Community",
];

export function VideoShowcases() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

	const filteredVideos =
		selectedCategory === "All"
			? videoShowcases
			: videoShowcases.filter((video) => video.category === selectedCategory);

	const featuredVideo = videoShowcases.find((video) => video.featured);

	return (
		<section className="py-20 bg-muted/20">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 text-secondary font-medium text-sm mb-6">
						🎬 Video Showcases
					</div>
					<h2 className="text-3xl md:text-5xl font-bold mb-6">
						<span className="text-foreground">Watch Our</span>{" "}
						<span className="text-gradient-accent">Activities in Action</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Experience the energy and passion of our students through these
						video highlights from various co-curricular activities and events
						throughout the year.
					</p>
				</motion.div>

				{/* Featured Video */}
				{featuredVideo && (
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						viewport={{ once: true }}
						className="mb-16"
					>
						<div className="relative group">
							<Card className="overflow-hidden border-0 bg-gradient-to-br from-secondary to-accent p-1">
								<div className="relative bg-card rounded-lg overflow-hidden">
									<div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
										{/* Video Thumbnail */}
										<div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
											<div className="text-6xl">🎭</div>
										</div>

										{/* Play Button */}
										<div className="absolute inset-0 flex items-center justify-center">
											<Button
												size="lg"
												className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/30 group-hover:scale-110 transition-all duration-300"
												onClick={() => setSelectedVideo(featuredVideo.id)}
											>
												<Play
													className="w-8 h-8 text-white ml-1"
													fill="white"
												/>
											</Button>
										</div>

										{/* Featured Badge */}
										<div className="absolute top-4 left-4">
											<div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
												<Award className="w-4 h-4" />
												<span>Featured</span>
											</div>
										</div>

										{/* Duration */}
										<div className="absolute bottom-4 right-4">
											<div className="bg-black/60 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
												<Clock className="w-3 h-3" />
												<span>{featuredVideo.duration}</span>
											</div>
										</div>
									</div>

									{/* Featured Video Info */}
									<div className="p-6">
										<div className="flex flex-wrap items-center gap-4 mb-4">
											<span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
												{featuredVideo.category}
											</span>
											<div className="flex items-center space-x-4 text-sm text-muted-foreground">
												<div className="flex items-center space-x-1">
													<Eye className="w-4 h-4" />
													<span>{featuredVideo.views} views</span>
												</div>
												<div className="flex items-center space-x-1">
													<Calendar className="w-4 h-4" />
													<span>{featuredVideo.date}</span>
												</div>
											</div>
										</div>
										<h3 className="text-2xl font-bold mb-3 text-foreground">
											{featuredVideo.title}
										</h3>
										<p className="text-muted-foreground mb-4">
											{featuredVideo.description}
										</p>
										<div className="flex flex-wrap gap-2">
											{featuredVideo.highlights.map((highlight, index) => (
												<span
													key={index}
													className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
												>
													{highlight}
												</span>
											))}
										</div>
									</div>
								</div>
							</Card>
						</div>
					</motion.div>
				)}

				{/* Category Filter */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-2 mb-12"
				>
					{categories.map((category) => (
						<Button
							key={category}
							variant={selectedCategory === category ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedCategory(category)}
							className={`rounded-full transition-all duration-300 ${
								selectedCategory === category
									? "bg-gradient-to-r from-secondary to-accent text-blue-500 shadow-lg"
									: "text-foreground hover:bg-muted hover:text-foreground border-border"
							}`}
						>
							{category}
						</Button>
					))}
				</motion.div>

				{/* Video Grid */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{filteredVideos
						.filter((video) => !video.featured)
						.map((video, index) => (
							<motion.div
								key={video.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Card className="group overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:shadow-xl border-0 bg-card">
									<div className="relative aspect-video bg-muted overflow-hidden">
										{/* Video Thumbnail */}
										<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
											<div className="text-4xl">
												{video.category === "Music" && "🎵"}
												{video.category === "Sports" && "🏆"}
												{video.category === "Academic" && "🔬"}
												{video.category === "Visual Arts" && "🎨"}
												{video.category === "Theater" && "🎭"}
												{video.category === "Community" && "🤝"}
												{video.category === "School Events" && "🎊"}
											</div>
										</div>

										{/* Play Button */}
										<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<Button
												size="lg"
												className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/30 group-hover:scale-110 transition-all duration-300"
												onClick={() => setSelectedVideo(video.id)}
											>
												<Play
													className="w-6 h-6 text-white ml-1"
													fill="white"
												/>
											</Button>
										</div>

										{/* Duration */}
										<div className="absolute bottom-2 right-2">
											<div className="bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
												<Clock className="w-3 h-3" />
												<span>{video.duration}</span>
											</div>
										</div>
									</div>

									<div className="p-4">
										{/* Category and Stats */}
										<div className="flex items-center justify-between mb-3">
											<span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
												{video.category}
											</span>
											<div className="flex items-center space-x-3 text-xs text-muted-foreground">
												<div className="flex items-center space-x-1">
													<Eye className="w-3 h-3" />
													<span>{video.views}</span>
												</div>
												<div className="flex items-center space-x-1">
													<Calendar className="w-3 h-3" />
													<span>{video.date}</span>
												</div>
											</div>
										</div>

										{/* Title */}
										<h3 className="font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
											{video.title}
										</h3>

										{/* Description */}
										<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
											{video.description}
										</p>

										{/* Highlights */}
										<div className="flex flex-wrap gap-1">
											{video.highlights.slice(0, 2).map((highlight, idx) => (
												<span
													key={idx}
													className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
												>
													{highlight}
												</span>
											))}
											{video.highlights.length > 2 && (
												<span className="text-xs text-muted-foreground px-2 py-1">
													+{video.highlights.length - 2} more
												</span>
											)}
										</div>
									</div>
								</Card>
							</motion.div>
						))}
				</motion.div>

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-3xl p-8 max-w-2xl mx-auto border border-secondary/20">
						<h3 className="text-2xl font-bold mb-4 text-gradient-accent">
							Want to See More?
						</h3>
						<p className="text-muted-foreground mb-6">
							Subscribe to our channel for the latest videos and live streams of
							school events and activities.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-orange-500 rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
								Subscribe to Channel
							</Button>
							<Button
								variant="outline"
								className="rounded-full px-6 py-3 border-secondary/20 hover:bg-secondary/10"
							>
								View All Videos
							</Button>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Video Modal Placeholder */}
			{selectedVideo && (
				<div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
					<div className="bg-card rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold">
								{videoShowcases.find((v) => v.id === selectedVideo)?.title}
							</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSelectedVideo(null)}
								className="text-muted-foreground hover:text-foreground"
							>
								✕
							</Button>
						</div>
						<div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
							<div className="text-center">
								<Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
								<p className="text-muted-foreground">
									Video player would be embedded here
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
