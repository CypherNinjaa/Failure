"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Heart,
	Share2,
	Download,
	Eye,
	Calendar,
	Camera,
	ZoomIn,
	X,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useState } from "react";

const photoWalls = [
	{
		id: 1,
		title: "Annual Day 2024",
		date: "March 15, 2024",
		totalPhotos: 150,
		views: "3.2K",
		description:
			"Spectacular performances and memorable moments from our annual day celebration.",
		coverImage: "/api/placeholder/800/600",
		category: "School Events",
		featured: true,
		photos: [
			{
				id: 101,
				src: "/api/placeholder/400/300",
				caption: "Opening ceremony dance performance",
			},
			{
				id: 102,
				src: "/api/placeholder/400/300",
				caption: "Principal's welcome speech",
			},
			{
				id: 103,
				src: "/api/placeholder/400/300",
				caption: "Student choir performance",
			},
			{
				id: 104,
				src: "/api/placeholder/400/300",
				caption: "Drama club presentation",
			},
			{
				id: 105,
				src: "/api/placeholder/400/300",
				caption: "Award ceremony moments",
			},
			{
				id: 106,
				src: "/api/placeholder/400/300",
				caption: "Cultural dance showcase",
			},
		],
	},
	{
		id: 2,
		title: "Sports Day Championship",
		date: "January 20, 2024",
		totalPhotos: 200,
		views: "2.8K",
		description:
			"Athletic excellence and team spirit captured during our inter-house sports competition.",
		coverImage: "/api/placeholder/800/600",
		category: "Sports",
		photos: [
			{
				id: 201,
				src: "/api/placeholder/400/300",
				caption: "100m sprint finals",
			},
			{
				id: 202,
				src: "/api/placeholder/400/300",
				caption: "Basketball championship",
			},
			{
				id: 203,
				src: "/api/placeholder/400/300",
				caption: "Victory celebrations",
			},
			{
				id: 204,
				src: "/api/placeholder/400/300",
				caption: "Team huddle moments",
			},
			{ id: 205, src: "/api/placeholder/400/300", caption: "Medal ceremony" },
			{ id: 206, src: "/api/placeholder/400/300", caption: "Cheering crowds" },
		],
	},
	{
		id: 3,
		title: "Science Exhibition",
		date: "February 10, 2024",
		totalPhotos: 120,
		views: "1.9K",
		description:
			"Innovative projects and scientific discoveries showcased by our brilliant students.",
		coverImage: "/api/placeholder/800/600",
		category: "Academic",
		photos: [
			{
				id: 301,
				src: "/api/placeholder/400/300",
				caption: "Robotics demonstration",
			},
			{
				id: 302,
				src: "/api/placeholder/400/300",
				caption: "Chemistry experiments",
			},
			{
				id: 303,
				src: "/api/placeholder/400/300",
				caption: "Physics models display",
			},
			{
				id: 304,
				src: "/api/placeholder/400/300",
				caption: "Environmental projects",
			},
			{
				id: 305,
				src: "/api/placeholder/400/300",
				caption: "Student presentations",
			},
			{
				id: 306,
				src: "/api/placeholder/400/300",
				caption: "Judges evaluation",
			},
		],
	},
	{
		id: 4,
		title: "Art Exhibition Gallery",
		date: "November 25, 2023",
		totalPhotos: 80,
		views: "1.5K",
		description:
			"Creative masterpieces and artistic expressions from our talented student artists.",
		coverImage: "/api/placeholder/800/600",
		category: "Arts",
		photos: [
			{
				id: 401,
				src: "/api/placeholder/400/300",
				caption: "Oil painting collection",
			},
			{
				id: 402,
				src: "/api/placeholder/400/300",
				caption: "Sculpture installations",
			},
			{
				id: 403,
				src: "/api/placeholder/400/300",
				caption: "Digital art showcase",
			},
			{
				id: 404,
				src: "/api/placeholder/400/300",
				caption: "Student artist interviews",
			},
			{
				id: 405,
				src: "/api/placeholder/400/300",
				caption: "Art appreciation session",
			},
			{
				id: 406,
				src: "/api/placeholder/400/300",
				caption: "Collaborative mural",
			},
		],
	},
	{
		id: 5,
		title: "Music Concert Evening",
		date: "December 18, 2023",
		totalPhotos: 95,
		views: "2.1K",
		description:
			"Melodious performances by our school orchestra and individual music talents.",
		coverImage: "/api/placeholder/800/600",
		category: "Music",
		photos: [
			{
				id: 501,
				src: "/api/placeholder/400/300",
				caption: "Orchestra performance",
			},
			{
				id: 502,
				src: "/api/placeholder/400/300",
				caption: "Solo piano recital",
			},
			{ id: 503, src: "/api/placeholder/400/300", caption: "Choir harmonies" },
			{ id: 504, src: "/api/placeholder/400/300", caption: "Violin ensemble" },
			{ id: 505, src: "/api/placeholder/400/300", caption: "Standing ovation" },
			{
				id: 506,
				src: "/api/placeholder/400/300",
				caption: "Backstage moments",
			},
		],
	},
	{
		id: 6,
		title: "Community Service Day",
		date: "October 5, 2023",
		totalPhotos: 110,
		views: "1.7K",
		description:
			"Students making a difference in the community through various service activities.",
		coverImage: "/api/placeholder/800/600",
		category: "Community",
		photos: [
			{
				id: 601,
				src: "/api/placeholder/400/300",
				caption: "Tree plantation drive",
			},
			{
				id: 602,
				src: "/api/placeholder/400/300",
				caption: "Elderly care visit",
			},
			{
				id: 603,
				src: "/api/placeholder/400/300",
				caption: "Beach cleanup activity",
			},
			{
				id: 604,
				src: "/api/placeholder/400/300",
				caption: "Food distribution",
			},
			{
				id: 605,
				src: "/api/placeholder/400/300",
				caption: "Teaching underprivileged kids",
			},
			{
				id: 606,
				src: "/api/placeholder/400/300",
				caption: "Group volunteer photo",
			},
		],
	},
];

const categories = [
	"All",
	"School Events",
	"Sports",
	"Academic",
	"Arts",
	"Music",
	"Community",
];

export function EventPhotoWalls() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedWall, setSelectedWall] = useState<number | null>(null);
	const [selectedPhoto, setSelectedPhoto] = useState<{
		wallId: number;
		photoIndex: number;
	} | null>(null);
	const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());

	const filteredWalls =
		selectedCategory === "All"
			? photoWalls
			: photoWalls.filter((wall) => wall.category === selectedCategory);

	const featuredWall = photoWalls.find((wall) => wall.featured);

	const handleLike = (photoId: number) => {
		const newLikedPhotos = new Set(likedPhotos);
		if (newLikedPhotos.has(photoId)) {
			newLikedPhotos.delete(photoId);
		} else {
			newLikedPhotos.add(photoId);
		}
		setLikedPhotos(newLikedPhotos);
	};

	const handlePhotoNavigation = (direction: "next" | "prev") => {
		if (!selectedPhoto) return;

		const wall = photoWalls.find((w) => w.id === selectedPhoto.wallId);
		if (!wall) return;

		const currentIndex = selectedPhoto.photoIndex;
		let newIndex;

		if (direction === "next") {
			newIndex = currentIndex < wall.photos.length - 1 ? currentIndex + 1 : 0;
		} else {
			newIndex = currentIndex > 0 ? currentIndex - 1 : wall.photos.length - 1;
		}

		setSelectedPhoto({ ...selectedPhoto, photoIndex: newIndex });
	};

	return (
		<section className="py-20 bg-background">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 text-accent font-medium text-sm mb-6">
						📸 Photo Galleries
					</div>
					<h2 className="text-3xl md:text-5xl font-bold mb-6">
						<span className="text-foreground">Event</span>{" "}
						<span className="text-gradient-cool">Photo Walls</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Relive the best moments from our school events through these
						carefully curated photo collections capturing the spirit and joy of
						our community.
					</p>
				</motion.div>

				{/* Featured Photo Wall */}
				{featuredWall && (
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						viewport={{ once: true }}
						className="mb-16"
					>
						<Card className="overflow-hidden border-0 bg-gradient-to-br from-accent to-primary p-1">
							<div className="relative bg-card rounded-lg overflow-hidden">
								<div
									className="relative aspect-[16/9] bg-muted overflow-hidden group cursor-pointer"
									onClick={() => setSelectedWall(featuredWall.id)}
								>
									{/* Featured Image */}
									<div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
										<div className="text-8xl">📷</div>
									</div>

									{/* Featured Badge */}
									<div className="absolute top-4 left-4">
										<div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
											<Camera className="w-4 h-4" />
											<span>Featured</span>
										</div>
									</div>

									{/* Photo Count */}
									<div className="absolute top-4 right-4">
										<div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
											<Eye className="w-4 h-4" />
											<span>{featuredWall.totalPhotos} photos</span>
										</div>
									</div>

									{/* Hover Overlay */}
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
										<Button
											size="lg"
											className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/30 text-white transition-all duration-300 scale-90 group-hover:scale-100"
										>
											<ZoomIn className="w-6 h-6 mr-2" />
											View Gallery
										</Button>
									</div>
								</div>

								{/* Featured Info */}
								<div className="p-6">
									<div className="flex flex-wrap items-center gap-4 mb-4">
										<span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
											{featuredWall.category}
										</span>
										<div className="flex items-center space-x-4 text-sm text-muted-foreground">
											<div className="flex items-center space-x-1">
												<Eye className="w-4 h-4" />
												<span>{featuredWall.views} views</span>
											</div>
											<div className="flex items-center space-x-1">
												<Calendar className="w-4 h-4" />
												<span>{featuredWall.date}</span>
											</div>
										</div>
									</div>
									<h3 className="text-2xl font-bold mb-3 text-foreground">
										{featuredWall.title}
									</h3>
									<p className="text-muted-foreground mb-4">
										{featuredWall.description}
									</p>

									{/* Photo Preview Grid */}
									<div className="grid grid-cols-6 gap-2">
										{featuredWall.photos.slice(0, 6).map((photo, index) => (
											<div
												key={photo.id}
												className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
												onClick={() =>
													setSelectedPhoto({
														wallId: featuredWall.id,
														photoIndex: index,
													})
												}
											>
												<div className="w-full h-full bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center text-xs">
													📸
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</Card>
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

				{/* Photo Walls Grid */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{filteredWalls
						.filter((wall) => !wall.featured)
						.map((wall, index) => (
							<motion.div
								key={wall.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Card className="group overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:shadow-xl border-0 bg-card">
									<div
										className="relative aspect-[4/3] bg-muted overflow-hidden cursor-pointer"
										onClick={() => setSelectedWall(wall.id)}
									>
										{/* Cover Image */}
										<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
											<div className="text-6xl">
												{wall.category === "Sports" && "🏆"}
												{wall.category === "Academic" && "🔬"}
												{wall.category === "Arts" && "🎨"}
												{wall.category === "Music" && "🎵"}
												{wall.category === "Community" && "🤝"}
												{wall.category === "School Events" && "🎊"}
											</div>
										</div>

										{/* Photo Count Overlay */}
										<div className="absolute top-2 right-2">
											<div className="bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
												<Camera className="w-3 h-3" />
												<span>{wall.totalPhotos}</span>
											</div>
										</div>

										{/* Hover Effect */}
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
											<Button
												size="sm"
												className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 text-white transition-all duration-300"
											>
												<ZoomIn className="w-4 h-4 mr-1" />
												View
											</Button>
										</div>
									</div>

									<div className="p-4">
										{/* Header */}
										<div className="flex items-center justify-between mb-3">
											<span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
												{wall.category}
											</span>
											<div className="flex items-center space-x-3 text-xs text-muted-foreground">
												<div className="flex items-center space-x-1">
													<Eye className="w-3 h-3" />
													<span>{wall.views}</span>
												</div>
												<div className="flex items-center space-x-1">
													<Calendar className="w-3 h-3" />
													<span>{wall.date}</span>
												</div>
											</div>
										</div>

										{/* Title */}
										<h3 className="font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
											{wall.title}
										</h3>

										{/* Description */}
										<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
											{wall.description}
										</p>

										{/* Photo Preview */}
										<div className="grid grid-cols-4 gap-1">
											{wall.photos.slice(0, 4).map((photo, idx) => (
												<div
													key={photo.id}
													className="aspect-square bg-muted rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
													onClick={() =>
														setSelectedPhoto({
															wallId: wall.id,
															photoIndex: idx,
														})
													}
												>
													<div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center text-xs">
														📷
													</div>
												</div>
											))}
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
					<div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-3xl p-8 max-w-2xl mx-auto border border-accent/20">
						<h3 className="text-2xl font-bold mb-4 text-gradient-cool">
							Capture Your Memories
						</h3>
						<p className="text-muted-foreground mb-6">
							Have photos from school events? Share them with our community and
							help create lasting memories.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-green-500 rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
								Upload Photos
							</Button>
							<Button
								variant="outline"
								className="rounded-full px-6 py-3 border-accent/20 hover:bg-accent/10"
							>
								View All Albums
							</Button>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Gallery Modal */}
			{selectedWall && (
				<div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
					<div className="bg-card rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-auto">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-2xl font-bold">
								{photoWalls.find((w) => w.id === selectedWall)?.title}
							</h3>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSelectedWall(null)}
								className="text-muted-foreground hover:text-foreground"
							>
								<X className="w-5 h-5" />
							</Button>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{photoWalls
								.find((w) => w.id === selectedWall)
								?.photos.map((photo, index) => (
									<div
										key={photo.id}
										className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
										onClick={() =>
											setSelectedPhoto({
												wallId: selectedWall,
												photoIndex: index,
											})
										}
									>
										<div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
											📸
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			)}

			{/* Photo Viewer Modal */}
			{selectedPhoto && (
				<div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
					<div className="relative w-full h-full flex items-center justify-center p-4">
						{/* Navigation Buttons */}
						<Button
							variant="ghost"
							size="lg"
							className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white"
							onClick={() => handlePhotoNavigation("prev")}
						>
							<ChevronLeft className="w-6 h-6" />
						</Button>

						<Button
							variant="ghost"
							size="lg"
							className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white"
							onClick={() => handlePhotoNavigation("next")}
						>
							<ChevronRight className="w-6 h-6" />
						</Button>

						{/* Close Button */}
						<Button
							variant="ghost"
							size="lg"
							className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white"
							onClick={() => setSelectedPhoto(null)}
						>
							<X className="w-6 h-6" />
						</Button>

						{/* Photo */}
						<div className="max-w-4xl max-h-[80vh] bg-muted rounded-lg overflow-hidden">
							<div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-8xl">
								📸
							</div>
						</div>

						{/* Photo Info */}
						<div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-4 text-white">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">
										{
											photoWalls.find((w) => w.id === selectedPhoto.wallId)
												?.photos[selectedPhoto.photoIndex]?.caption
										}
									</p>
									<p className="text-sm text-white/70">
										Photo {selectedPhoto.photoIndex + 1} of{" "}
										{
											photoWalls.find((w) => w.id === selectedPhoto.wallId)
												?.photos.length
										}
									</p>
								</div>
								<div className="flex items-center space-x-2">
									<Button
										variant="ghost"
										size="sm"
										className="text-white hover:bg-white/20"
										onClick={() => {
											const photoId = photoWalls.find(
												(w) => w.id === selectedPhoto.wallId
											)?.photos[selectedPhoto.photoIndex]?.id;
											if (photoId) handleLike(photoId);
										}}
									>
										<Heart
											className={`w-5 h-5 ${
												likedPhotos.has(
													photoWalls.find((w) => w.id === selectedPhoto.wallId)
														?.photos[selectedPhoto.photoIndex]?.id || 0
												)
													? "fill-red-500 text-red-500"
													: ""
											}`}
										/>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="text-white hover:bg-white/20"
									>
										<Share2 className="w-5 h-5" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="text-white hover:bg-white/20"
									>
										<Download className="w-5 h-5" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
