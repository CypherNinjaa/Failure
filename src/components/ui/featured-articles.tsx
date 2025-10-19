"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Calendar,
	User,
	ArrowRight,
	Eye,
	Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface FeaturedArticle {
	id: string;
	title: string;
	excerpt: string;
	author: string;
	date: string;
	readTime: string;
	category: string;
	image: string;
	views: number;
	likes: number;
	featured: boolean;
}

export function FeaturedArticles() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [mounted, setMounted] = useState(false);

	const featuredArticles: FeaturedArticle[] = [
		{
			id: "1",
			title:
				"Innovative Teaching Methods: Transforming Education at Happy Child School",
			excerpt:
				"Discover how our teachers are revolutionizing learning through interactive technology and personalized approaches that engage every student.",
			author: "Dr. Sarah Johnson",
			date: "2024-01-15",
			readTime: "5 min read",
			category: "Education",
			image: "/api/placeholder/800/400",
			views: 1250,
			likes: 89,
			featured: true,
		},
		{
			id: "2",
			title: "Student Success Stories: From Dreams to Achievements",
			excerpt:
				"Follow the inspiring journeys of our alumni who have gone on to make remarkable contributions in their chosen fields.",
			author: "Ms. Emily Chen",
			date: "2024-01-12",
			readTime: "7 min read",
			category: "Success Stories",
			image: "/api/placeholder/800/400",
			views: 980,
			likes: 156,
			featured: true,
		},
		{
			id: "3",
			title: "Building Character Through Co-curricular Activities",
			excerpt:
				"How our diverse range of activities helps students develop leadership skills, teamwork, and confidence beyond the classroom.",
			author: "Mr. David Rodriguez",
			date: "2024-01-10",
			readTime: "4 min read",
			category: "Activities",
			image: "/api/placeholder/800/400",
			views: 750,
			likes: 67,
			featured: true,
		},
	];

	// Auto-play functionality
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted || !isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [mounted, isAutoPlaying, featuredArticles.length]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
		setIsAutoPlaying(false);
	};

	const prevSlide = () => {
		setCurrentSlide(
			(prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length
		);
		setIsAutoPlaying(false);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
	};

	return (
		<section className="py-16 bg-background">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
						<span className="mr-2">⭐</span>
						Featured Articles
					</div>
					<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Latest Highlights
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Stay updated with our most popular and impactful articles from the
						school community
					</p>
				</motion.div>

				{/* Carousel */}
				<div className="relative max-w-6xl mx-auto">
					<div className="relative overflow-hidden rounded-2xl">
						<motion.div
							className="flex transition-transform duration-500 ease-in-out"
							style={{ transform: `translateX(-${currentSlide * 100}%)` }}
						>
							{featuredArticles.map((article) => (
								<div key={article.id} className="w-full flex-shrink-0">
									<div className="relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
										{/* Article Image */}
										<div className="relative h-64 md:h-80 overflow-hidden">
											<div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
											<div className="absolute inset-0 bg-black/20" />

											{/* Category Badge */}
											<div className="absolute top-4 left-4 z-10">
												<Badge className="bg-white/90 text-gray-800 hover:bg-white">
													{article.category}
												</Badge>
											</div>

											{/* Stats */}
											<div className="absolute top-4 right-4 z-10 flex space-x-2">
												<div className="flex items-center px-2 py-1 bg-black/50 rounded-lg text-white text-sm">
													<Eye className="w-4 h-4 mr-1" />
													{article.views}
												</div>
												<div className="flex items-center px-2 py-1 bg-black/50 rounded-lg text-white text-sm">
													<Heart className="w-4 h-4 mr-1" />
													{article.likes}
												</div>
											</div>
										</div>

										{/* Article Content */}
										<div className="p-6 md:p-8">
											<div className="flex items-center text-sm text-muted-foreground mb-4">
												<User className="w-4 h-4 mr-2" />
												<span className="mr-4">{article.author}</span>
												<Calendar className="w-4 h-4 mr-2" />
												<span className="mr-4">
													{new Date(article.date).toLocaleDateString()}
												</span>
												<span>{article.readTime}</span>
											</div>

											<h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 line-clamp-2">
												{article.title}
											</h3>

											<p className="text-muted-foreground mb-6 line-clamp-3">
												{article.excerpt}
											</p>

											<Link href={`/blog/${article.id}`}>
												<Button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
													Read Full Article
													<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
												</Button>
											</Link>
										</div>
									</div>
								</div>
							))}
						</motion.div>
					</div>

					{/* Navigation Buttons */}
					<button
						onClick={prevSlide}
						className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
					>
						<ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
					</button>

					<button
						onClick={nextSlide}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
					>
						<ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
					</button>

					{/* Dots Indicator */}
					<div className="flex justify-center mt-8 space-x-2">
						{featuredArticles.map((_, index) => (
							<button
								key={index}
								onClick={() => goToSlide(index)}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${
									index === currentSlide
										? "bg-blue-600 w-8"
										: "bg-gray-300 dark:bg-gray-600 hover:bg-blue-400"
								}`}
							/>
						))}
					</div>

					{/* Auto-play Indicator */}
					<div className="flex justify-center mt-4">
						<button
							onClick={() => setIsAutoPlaying(!isAutoPlaying)}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{isAutoPlaying ? "⏸️ Pause" : "▶️ Play"} Auto-slide
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
