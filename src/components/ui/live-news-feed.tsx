"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
	RefreshCw,
	Clock,
	User,
	Eye,
	Heart,
	Share2,
	MessageCircle,
	Pin,
	Zap,
	Bell,
	Calendar,
	BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
	id: number;
	title: string;
	excerpt: string;
	category: string;
	author: string;
	publishedAt: string;
	readTime: string;
	views: number;
	likes: number;
	comments: number;
	isPinned: boolean;
	image: string;
	tags: string[];
}

const mockNewsData: NewsItem[] = [
	{
		id: 1,
		title: "Annual Sports Day 2024 - A Grand Success!",
		excerpt:
			"Our students showcased exceptional talent and sportsmanship during the annual sports day celebration...",
		category: "events",
		author: "Mr. Rajesh Kumar",
		publishedAt: "2024-03-25T10:30:00Z",
		readTime: "3 min read",
		views: 1248,
		likes: 89,
		comments: 23,
		isPinned: true,
		image: "from-green-500 to-teal-600",
		tags: ["sports", "annual", "competition"],
	},
	{
		id: 2,
		title: "New Digital Library Launch",
		excerpt:
			"We're excited to announce the launch of our state-of-the-art digital library with over 10,000 e-books...",
		category: "announcements",
		author: "Ms. Priya Sharma",
		publishedAt: "2024-03-24T14:15:00Z",
		readTime: "2 min read",
		views: 856,
		likes: 67,
		comments: 15,
		isPinned: false,
		image: "from-blue-500 to-purple-600",
		tags: ["library", "digital", "resources"],
	},
	{
		id: 3,
		title: "Science Exhibition Winners Announced",
		excerpt:
			"Congratulations to all participants! The science exhibition showcased incredible innovation...",
		category: "academics",
		author: "Dr. Anil Verma",
		publishedAt: "2024-03-23T16:45:00Z",
		readTime: "4 min read",
		views: 1567,
		likes: 124,
		comments: 45,
		isPinned: false,
		image: "from-purple-500 to-pink-600",
		tags: ["science", "exhibition", "winners"],
	},
	{
		id: 4,
		title: "Parent-Teacher Meeting Schedule",
		excerpt:
			"Important notice: The next parent-teacher meeting is scheduled for March 30th...",
		category: "announcements",
		author: "Administration",
		publishedAt: "2024-03-22T09:00:00Z",
		readTime: "1 min read",
		views: 2134,
		likes: 45,
		comments: 12,
		isPinned: true,
		image: "from-orange-500 to-red-600",
		tags: ["meeting", "parents", "teachers"],
	},
	{
		id: 5,
		title: "Cultural Fest 2024 Preparations Begin",
		excerpt:
			"Students are actively preparing for our annual cultural festival with exciting performances...",
		category: "events",
		author: "Ms. Kavya Reddy",
		publishedAt: "2024-03-21T11:20:00Z",
		readTime: "3 min read",
		views: 945,
		likes: 78,
		comments: 28,
		isPinned: false,
		image: "from-pink-500 to-rose-600",
		tags: ["cultural", "festival", "preparation"],
	},
	{
		id: 6,
		title: "New Safety Protocols Implemented",
		excerpt:
			"Enhanced safety measures have been implemented across the campus to ensure student wellbeing...",
		category: "announcements",
		author: "Security Team",
		publishedAt: "2024-03-20T08:30:00Z",
		readTime: "2 min read",
		views: 1789,
		likes: 92,
		comments: 18,
		isPinned: false,
		image: "from-teal-500 to-green-600",
		tags: ["safety", "protocols", "campus"],
	},
];

export function LiveNewsFeed() {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [lastUpdated, setLastUpdated] = useState(new Date());
	const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		// Simulate initial loading
		setTimeout(() => {
			setIsLoading(false);
			setNewsItems(mockNewsData);
		}, 2000);

		// Auto-refresh every 30 seconds
		const interval = setInterval(() => {
			refreshNews();
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	const categories = [
		{ id: "all", name: "All News", icon: Zap, count: mockNewsData.length },
		{
			id: "announcements",
			name: "Announcements",
			icon: Bell,
			count: mockNewsData.filter((item) => item.category === "announcements")
				.length,
		},
		{
			id: "events",
			name: "Events",
			icon: Calendar,
			count: mockNewsData.filter((item) => item.category === "events").length,
		},
		{
			id: "academics",
			name: "Academics",
			icon: BookOpen,
			count: mockNewsData.filter((item) => item.category === "academics")
				.length,
		},
	];

	const refreshNews = async () => {
		setIsRefreshing(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setLastUpdated(new Date());
		setIsRefreshing(false);
	};

	const filteredNews =
		selectedCategory === "all"
			? newsItems
			: newsItems.filter((item) => item.category === selectedCategory);

	const pinnedNews = filteredNews.filter((item) => item.isPinned);
	const regularNews = filteredNews.filter((item) => !item.isPinned);

	const formatTimeAgo = (dateString: string) => {
		const now = new Date();
		const past = new Date(dateString);
		const diffInHours = Math.floor(
			(now.getTime() - past.getTime()) / (1000 * 60 * 60)
		);

		if (diffInHours < 1) return "Just now";
		if (diffInHours < 24) return `${diffInHours}h ago`;
		return `${Math.floor(diffInHours / 24)}d ago`;
	};

	// Skeleton loader component
	const NewsCardSkeleton = () => (
		<Card className="overflow-hidden">
			<CardContent className="p-6">
				<div className="flex items-center justify-between mb-4">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-4 w-16" />
				</div>
				<Skeleton className="h-6 w-full mb-3" />
				<Skeleton className="h-4 w-full mb-2" />
				<Skeleton className="h-4 w-3/4 mb-4" />
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-24" />
					<div className="flex space-x-4">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-12" />
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// Prevent hydration mismatch
	if (!isMounted) {
		return (
			<section className="py-16 lg:py-24 bg-muted/30">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
							Live News Feed
						</h2>
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
					<div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
						<RefreshCw
							className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
						/>
						<span className="text-sm font-medium">Live Updates</span>
					</div>

					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						<span className="text-gradient-primary">Latest</span> News Feed
					</h2>

					<div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
						<div className="flex items-center">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
							<span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={refreshNews}
							disabled={isRefreshing}
							className="hover:bg-accent/10"
						>
							<RefreshCw
								className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
							/>
							Refresh
						</Button>
					</div>
				</motion.div>

				{/* Category Filter */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="flex flex-wrap justify-center gap-3 mb-8"
				>
					{categories.map((category, index) => {
						const CategoryIcon = category.icon;
						return (
							<motion.button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-300 ${
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
								<CategoryIcon className="w-4 h-4 mr-2" />
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
							</motion.button>
						);
					})}
				</motion.div>

				{/* News Content */}
				<div className="space-y-8">
					{/* Pinned News */}
					{pinnedNews.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						>
							<h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
								<Pin className="w-5 h-5 mr-2 text-accent" />
								Pinned News
							</h3>
							<div className="grid md:grid-cols-2 gap-6">
								{isLoading
									? Array.from({ length: 2 }).map((_, index) => (
											<NewsCardSkeleton key={index} />
									  ))
									: pinnedNews.map((item, index) => (
											<motion.div
												key={item.id}
												initial={{ opacity: 0, scale: 0.9 }}
												whileInView={{ opacity: 1, scale: 1 }}
												transition={{ duration: 0.5, delay: 0.1 * index }}
												viewport={{ once: true }}
												className="group"
											>
												<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border-2 border-accent/20">
													<CardContent className="p-6">
														<div className="flex items-center justify-between mb-4">
															<span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
																{item.category.toUpperCase()}
															</span>
															<div className="flex items-center text-xs text-muted-foreground">
																<Clock className="w-3 h-3 mr-1" />
																{formatTimeAgo(item.publishedAt)}
															</div>
														</div>

														<div
															className={`h-32 bg-gradient-to-br ${item.image} rounded-lg mb-4 flex items-center justify-center`}
														>
															<Zap className="w-8 h-8 text-white/70" />
														</div>

														<h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
															{item.title}
														</h3>
														<p className="text-muted-foreground text-sm mb-4 line-clamp-2">
															{item.excerpt}
														</p>

														<div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
															<div className="flex items-center">
																<User className="w-3 h-3 mr-1" />
																{item.author}
															</div>
															<span>{item.readTime}</span>
														</div>

														<div className="flex items-center justify-between">
															<div className="flex space-x-4 text-xs text-muted-foreground">
																<span className="flex items-center">
																	<Eye className="w-3 h-3 mr-1" />
																	{item.views}
																</span>
																<span className="flex items-center">
																	<Heart className="w-3 h-3 mr-1" />
																	{item.likes}
																</span>
																<span className="flex items-center">
																	<MessageCircle className="w-3 h-3 mr-1" />
																	{item.comments}
																</span>
															</div>
															<Button
																size="sm"
																variant="ghost"
																className="text-xs"
															>
																<Share2 className="w-3 h-3 mr-1" />
																Share
															</Button>
														</div>
													</CardContent>
												</Card>
											</motion.div>
									  ))}
							</div>
						</motion.div>
					)}

					{/* Regular News */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h3 className="text-xl font-bold text-foreground mb-6">
							Latest Updates
						</h3>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{isLoading ? (
								Array.from({ length: 6 }).map((_, index) => (
									<NewsCardSkeleton key={index} />
								))
							) : (
								<AnimatePresence mode="popLayout">
									{regularNews.map((item, index) => (
										<motion.div
											key={item.id}
											layout
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											transition={{ duration: 0.3, delay: 0.1 * index }}
											className="group"
										>
											<Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
												<CardContent className="p-6">
													<div className="flex items-center justify-between mb-4">
														<span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded">
															{item.category.toUpperCase()}
														</span>
														<div className="flex items-center text-xs text-muted-foreground">
															<Clock className="w-3 h-3 mr-1" />
															{formatTimeAgo(item.publishedAt)}
														</div>
													</div>

													<div
														className={`h-24 bg-gradient-to-br ${item.image} rounded mb-4 flex items-center justify-center`}
													>
														<Zap className="w-6 h-6 text-white/70" />
													</div>

													<h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">
														{item.title}
													</h3>
													<p className="text-muted-foreground text-sm mb-3 line-clamp-2">
														{item.excerpt}
													</p>

													<div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
														<div className="flex items-center">
															<User className="w-3 h-3 mr-1" />
															{item.author}
														</div>
														<span>{item.readTime}</span>
													</div>

													<div className="flex items-center justify-between">
														<div className="flex space-x-3 text-xs text-muted-foreground">
															<span className="flex items-center">
																<Eye className="w-3 h-3 mr-1" />
																{item.views}
															</span>
															<span className="flex items-center">
																<Heart className="w-3 h-3 mr-1" />
																{item.likes}
															</span>
														</div>
														<Button
															size="sm"
															variant="ghost"
															className="text-xs"
														>
															Read More
														</Button>
													</div>
												</CardContent>
											</Card>
										</motion.div>
									))}
								</AnimatePresence>
							)}
						</div>
					</motion.div>
				</div>

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
						<RefreshCw className="w-4 h-4 mr-2" />
						Load More News
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
