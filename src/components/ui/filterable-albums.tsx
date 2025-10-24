"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
	Filter,
	Grid,
	Heart,
	Share,
	Download,
	Eye,
	Calendar,
	Users,
	Camera,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GalleryAlbum {
	id: string | number;
	src?: string; // Optional for backward compatibility
	title: string;
	category:
		| "all"
		| "events"
		| "sports"
		| "academics"
		| "cultural"
		| "achievements";
	date: string;
	likes: number;
	views: number;
	photographer: string;
	description: string;
	color: string;
}

interface FilterableAlbumsProps {
	albums?: GalleryAlbum[];
}

export function FilterableAlbums({ albums }: FilterableAlbumsProps = {}) {
	const [activeFilter, setActiveFilter] = useState("all");
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Use provided albums or fallback to hardcoded data for backward compatibility
	const defaultGalleryImages = [
		{
			id: 1,
			title: "Annual Sports Day 2024",
			category: "sports",
			date: "March 15, 2024",
			likes: 124,
			views: 1205,
			photographer: "Mr. Rahul Sharma",
			description:
				"Students showcasing their athletic prowess during the annual sports day celebration",
			color: "from-green-400 to-teal-600",
		},
		{
			id: 2,
			title: "Science Exhibition",
			category: "academics",
			date: "February 28, 2024",
			likes: 98,
			views: 856,
			photographer: "Ms. Priya Singh",
			description:
				"Young scientists presenting their innovative projects and experiments",
			color: "from-blue-400 to-purple-600",
		},
		{
			id: 3,
			title: "Cultural Festival",
			category: "cultural",
			date: "January 20, 2024",
			likes: 156,
			views: 1420,
			photographer: "Mr. Amit Kumar",
			description:
				"Vibrant performances celebrating our rich cultural diversity",
			color: "from-purple-400 to-pink-600",
		},
		{
			id: 4,
			title: "Independence Day Celebration",
			category: "events",
			date: "August 15, 2024",
			likes: 203,
			views: 1890,
			photographer: "Ms. Neha Patel",
			description:
				"Patriotic fervor and pride displayed during our Independence Day program",
			color: "from-orange-400 to-red-600",
		},
		{
			id: 5,
			title: "Academic Excellence Awards",
			category: "achievements",
			date: "April 10, 2024",
			likes: 87,
			views: 654,
			photographer: "Mr. Vikash Gupta",
			description: "Recognizing and celebrating our top-performing students",
			color: "from-yellow-400 to-orange-600",
		},
		{
			id: 6,
			title: "Art Competition Winners",
			category: "achievements",
			date: "March 5, 2024",
			likes: 92,
			views: 723,
			photographer: "Ms. Kavya Reddy",
			description: "Creative masterpieces by our talented young artists",
			color: "from-indigo-400 to-blue-600",
		},
		{
			id: 7,
			title: "Mathematics Olympiad",
			category: "academics",
			date: "February 14, 2024",
			likes: 76,
			views: 542,
			photographer: "Mr. Suresh Nair",
			description: "Brilliant minds tackling challenging mathematical problems",
			color: "from-teal-400 to-green-600",
		},
		{
			id: 8,
			title: "Dance Competition",
			category: "cultural",
			date: "December 18, 2023",
			likes: 145,
			views: 1234,
			photographer: "Ms. Ritu Sharma",
			description: "Graceful movements and energetic performances on stage",
			color: "from-pink-400 to-purple-600",
		},
		{
			id: 9,
			title: "Inter-School Tournament",
			category: "sports",
			date: "November 25, 2023",
			likes: 118,
			views: 967,
			photographer: "Mr. Raj Patel",
			description: "Competitive spirit and teamwork in action",
			color: "from-green-500 to-teal-500",
		},
		{
			id: 10,
			title: "Teacher's Day Special",
			category: "events",
			date: "September 5, 2023",
			likes: 167,
			views: 1456,
			photographer: "Student Photography Club",
			description: "Honoring our dedicated educators with love and gratitude",
			color: "from-blue-500 to-indigo-500",
		},
	];

	// Use provided albums or fallback to default
	const galleryImages =
		albums && albums.length > 0 ? albums : defaultGalleryImages;

	// Calculate filter counts dynamically
	const filters = [
		{ id: "all", name: "All Photos", count: galleryImages.length },
		{
			id: "events",
			name: "School Events",
			count: galleryImages.filter((img) => img.category === "events").length,
		},
		{
			id: "sports",
			name: "Sports Day",
			count: galleryImages.filter((img) => img.category === "sports").length,
		},
		{
			id: "academics",
			name: "Academic Activities",
			count: galleryImages.filter((img) => img.category === "academics").length,
		},
		{
			id: "cultural",
			name: "Cultural Programs",
			count: galleryImages.filter((img) => img.category === "cultural").length,
		},
		{
			id: "achievements",
			name: "Achievements",
			count: galleryImages.filter((img) => img.category === "achievements")
				.length,
		},
	];

	const filteredImages =
		activeFilter === "all"
			? galleryImages
			: galleryImages.filter((img) => img.category === activeFilter);

	// Simulate lazy loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadedImages(new Set(filteredImages.map((img) => String(img.id))));
		}, 500);
		return () => clearTimeout(timer);
	}, [filteredImages]);

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-muted/30">
				<div className="container">
					<div className="text-center mb-12">
						<div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
							<Grid className="w-4 h-4 mr-2" />
							<span className="text-sm font-medium">Photo Albums</span>
						</div>
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							<span className="text-gradient-primary">Explore Our</span>
							<br />
							Photo Collection
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Browse through our extensive collection of school memories.
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 lg:py-24 bg-muted/30">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
						<Grid className="w-4 h-4 mr-2" />
						<span className="text-sm font-medium">Photo Albums</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Explore Our</span>
						<br />
						Photo Collection
					</h2>

					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Browse through our extensive collection of school memories. Filter
						by category to find specific moments or explore all to discover
						something new.
					</p>
				</motion.div>

				{/* Filter Tabs */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-2 mb-8"
				>
					{filters.map((filter, index) => (
						<motion.button
							key={filter.id}
							onClick={() => setActiveFilter(filter.id)}
							className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
								activeFilter === filter.id
									? "bg-primary text-primary-foreground shadow-lg scale-105"
									: "bg-card text-foreground hover:bg-muted border border-border"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.1 * index }}
						>
							<span className="flex items-center">
								<Filter className="w-3 h-3 mr-2" />
								{filter.name}
								<span
									className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
										activeFilter === filter.id
											? "bg-white/20 text-white"
											: "bg-primary/10 text-primary"
									}`}
								>
									{filter.count}
								</span>
							</span>
						</motion.button>
					))}
				</motion.div>

				{/* Gallery Grid */}
				<motion.div
					layout
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					<AnimatePresence mode="popLayout">
						{filteredImages.map((image, index) => (
							<motion.div
								key={image.id}
								layout
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.3, delay: 0.1 * index }}
								className="group cursor-pointer"
								onClick={() => setSelectedImage(String(image.id))}
							>
								<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border-0 bg-card/50 backdrop-blur">
									<CardContent className="p-0">
										{/* Image Container */}
										<div className="aspect-[4/3] relative overflow-hidden">
											{loadedImages.has(String(image.id)) ? (
												<div
													className={`w-full h-full bg-gradient-to-br ${image.color} flex items-center justify-center relative`}
												>
													{/* Placeholder Image */}
													<div className="absolute inset-0 bg-black/20 flex items-center justify-center">
														<Camera className="w-12 h-12 text-white/50" />
													</div>

													{/* Overlay */}
													<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
														<div className="text-white text-center">
															<Eye className="w-8 h-8 mx-auto mb-2" />
															<span className="text-sm font-medium">
																View Gallery
															</span>
														</div>
													</div>

													{/* Category Badge */}
													<div className="absolute top-3 left-3">
														<span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-xs font-medium rounded-full">
															{
																filters.find((f) => f.id === image.category)
																	?.name
															}
														</span>
													</div>

													{/* Stats Overlay */}
													<div className="absolute bottom-3 left-3 right-3">
														<div className="flex items-center justify-between text-white/90 text-xs">
															<div className="flex items-center space-x-3">
																<span className="flex items-center">
																	<Heart className="w-3 h-3 mr-1" />
																	{image.likes}
																</span>
																<span className="flex items-center">
																	<Eye className="w-3 h-3 mr-1" />
																	{image.views}
																</span>
															</div>
															<Share className="w-3 h-3 opacity-80 hover:opacity-100 cursor-pointer" />
														</div>
													</div>
												</div>
											) : (
												<div className="w-full h-full bg-muted animate-pulse" />
											)}
										</div>

										{/* Content */}
										<div className="p-4">
											<h3 className="font-semibold text-foreground mb-2 line-clamp-1">
												{image.title}
											</h3>
											<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
												{image.description}
											</p>

											<div className="flex items-center justify-between text-xs text-muted-foreground">
												<div className="flex items-center">
													<Calendar className="w-3 h-3 mr-1" />
													{image.date}
												</div>
												<div className="flex items-center">
													<Users className="w-3 h-3 mr-1" />
													{image.photographer}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>

				{/* Load More Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<Button
						size="lg"
						className="bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
					>
						<Download className="w-4 h-4 mr-2" />
						Load More Photos
					</Button>
					<p className="text-sm text-muted-foreground mt-3">
						Showing {filteredImages.length} of{" "}
						{filters.find((f) => f.id === activeFilter)?.count} photos
					</p>
				</motion.div>

				{/* Lightbox Modal */}
				<AnimatePresence>
					{selectedImage && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
							onClick={() => setSelectedImage(null)}
						>
							<motion.div
								initial={{ scale: 0.8 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0.8 }}
								className="relative max-w-4xl w-full"
								onClick={(e) => e.stopPropagation()}
							>
								{(() => {
									const image = galleryImages.find(
										(img) => img.id === selectedImage
									);
									if (!image) return null;

									return (
										<Card className="overflow-hidden">
											<CardContent className="p-0">
												<div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
													<Camera className="w-24 h-24 text-white/50" />
												</div>
												<div className="p-6">
													<h3 className="text-xl font-bold text-foreground mb-2">
														{image.title}
													</h3>
													<p className="text-muted-foreground mb-4">
														{image.description}
													</p>
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-4 text-sm text-muted-foreground">
															<span>{image.date}</span>
															<span>•</span>
															<span>{image.photographer}</span>
														</div>
														<div className="flex items-center space-x-2">
															<Button size="sm" variant="outline">
																<Heart className="w-4 h-4 mr-2" />
																{image.likes}
															</Button>
															<Button size="sm" variant="outline">
																<Share className="w-4 h-4 mr-2" />
																Share
															</Button>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									);
								})()}
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
}

// Default export for backward compatibility
export default FilterableAlbums;
