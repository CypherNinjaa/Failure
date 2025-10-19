"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
	Calendar,
	User,
	Clock,
	Eye,
	Heart,
	MessageCircle,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface BlogPost {
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
	comments: number;
	featured: boolean;
	tags: string[];
}

interface BlogGridProps {
	selectedCategory?: string | null;
}

export function BlogGrid({ selectedCategory }: BlogGridProps) {
	const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">(
		"latest"
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const postsPerPage = 6;

	// Mock blog posts data
	const mockBlogPosts: BlogPost[] = useMemo(
		() => [
			{
				id: "1",
				title: "The Future of Digital Learning in Primary Education",
				excerpt:
					"Exploring how technology is reshaping the way young students learn and interact with educational content in the modern classroom.",
				author: "Dr. Jennifer Smith",
				date: "2024-01-15",
				readTime: "6 min read",
				category: "Education",
				image: "/api/placeholder/400/250",
				views: 1420,
				likes: 89,
				comments: 23,
				featured: false,
				tags: ["Technology", "Primary Education", "Digital Learning"],
			},
			{
				id: "2",
				title: "Student Mental Health: Building Resilience in Schools",
				excerpt:
					"A comprehensive guide to supporting student wellbeing and creating a positive learning environment for all students.",
				author: "Ms. Sarah Johnson",
				date: "2024-01-12",
				readTime: "8 min read",
				category: "Student Life",
				image: "/api/placeholder/400/250",
				views: 980,
				likes: 156,
				comments: 45,
				featured: true,
				tags: ["Mental Health", "Wellbeing", "Support"],
			},
			{
				id: "3",
				title: "Celebrating Our Science Fair Winners",
				excerpt:
					"Highlighting the innovative projects and creative minds that made this year's science fair a tremendous success.",
				author: "Mr. David Chen",
				date: "2024-01-10",
				readTime: "4 min read",
				category: "Achievements",
				image: "/api/placeholder/400/250",
				views: 750,
				likes: 67,
				comments: 12,
				featured: false,
				tags: ["Science", "Innovation", "Students"],
			},
			{
				id: "4",
				title: "Parent-Teacher Collaboration: Keys to Success",
				excerpt:
					"Strategies for building strong partnerships between families and educators to support student achievement.",
				author: "Ms. Emily Rodriguez",
				date: "2024-01-08",
				readTime: "5 min read",
				category: "Community",
				image: "/api/placeholder/400/250",
				views: 920,
				likes: 134,
				comments: 38,
				featured: false,
				tags: ["Parents", "Teachers", "Collaboration"],
			},
			{
				id: "5",
				title: "Innovative Art Projects Transform Our Hallways",
				excerpt:
					"See how our students' creativity has brought color and life to every corner of our school campus.",
				author: "Ms. Lisa Kim",
				date: "2024-01-05",
				readTime: "3 min read",
				category: "Student Life",
				image: "/api/placeholder/400/250",
				views: 680,
				likes: 95,
				comments: 18,
				featured: false,
				tags: ["Art", "Creativity", "Campus"],
			},
			{
				id: "6",
				title: "New Playground Equipment Installation Complete",
				excerpt:
					"Our new state-of-the-art playground equipment is now ready for students to enjoy during recess and after school.",
				author: "Mr. Robert Wilson",
				date: "2024-01-03",
				readTime: "2 min read",
				category: "Announcements",
				image: "/api/placeholder/400/250",
				views: 540,
				likes: 78,
				comments: 9,
				featured: false,
				tags: ["Playground", "Facilities", "Safety"],
			},
		],
		[]
	); // Simulate loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setBlogPosts(mockBlogPosts);
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, [mockBlogPosts]);

	// Filter and search posts
	useEffect(() => {
		let filtered = blogPosts;

		// Filter by category
		if (selectedCategory) {
			filtered = filtered.filter(
				(post) => post.category.toLowerCase() === selectedCategory.toLowerCase()
			);
		}

		// Filter by search query
		if (searchQuery) {
			filtered = filtered.filter(
				(post) =>
					post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.tags.some((tag) =>
						tag.toLowerCase().includes(searchQuery.toLowerCase())
					)
			);
		}

		// Sort posts
		switch (sortBy) {
			case "popular":
				filtered.sort((a, b) => b.views - a.views);
				break;
			case "trending":
				filtered.sort((a, b) => b.likes - a.likes);
				break;
			case "latest":
			default:
				filtered.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
				);
				break;
		}

		setFilteredPosts(filtered);
		setCurrentPage(1);
	}, [blogPosts, selectedCategory, searchQuery, sortBy]);

	// Pagination
	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
	const currentPosts = filteredPosts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage
	);

	// Skeleton Loader
	const SkeletonCard = () => (
		<div className="bg-card rounded-2xl overflow-hidden shadow-lg animate-pulse">
			<div className="h-48 bg-gray-200 dark:bg-gray-700" />
			<div className="p-6 space-y-4">
				<div className="flex items-center space-x-2">
					<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
				</div>
				<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
				<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
				<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
				<div className="flex justify-between">
					<div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="flex space-x-2">
						<div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<section className="py-16 bg-background">
			<div className="container mx-auto px-4">
				{/* Section Header with Filters */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="mb-12"
				>
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								Latest Articles
							</h2>
							<p className="text-muted-foreground">
								{selectedCategory
									? `Showing articles in ${selectedCategory}`
									: "Discover insights from our school community"}
							</p>
						</div>

						{/* Search and Filter Controls */}
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="relative">
								<Input
									type="text"
									placeholder="Search articles..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-4 pr-4 py-2 rounded-xl border-2 w-full sm:w-64"
								/>
							</div>

							<select
								value={sortBy}
								onChange={(e) =>
									setSortBy(e.target.value as "latest" | "popular" | "trending")
								}
								className="px-4 py-2 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none"
							>
								<option value="latest">Latest</option>
								<option value="popular">Most Popular</option>
								<option value="trending">Trending</option>
							</select>
						</div>
					</div>

					{/* Results Info */}
					<div className="mt-6 text-sm text-muted-foreground">
						{loading
							? "Loading articles..."
							: `Showing ${currentPosts.length} of ${filteredPosts.length} articles`}
					</div>
				</motion.div>

				{/* Blog Posts Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
					{loading
						? Array.from({ length: 6 }).map((_, index) => (
								<SkeletonCard key={index} />
						  ))
						: currentPosts.map((post, index) => (
								<motion.article
									key={post.id}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="group cursor-pointer"
								>
									<div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
										{/* Article Image */}
										<div className="relative h-48 overflow-hidden">
											<div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
											<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

											{/* Category Badge */}
											<div className="absolute top-4 left-4 z-10">
												<Badge className="bg-white/90 text-gray-800 hover:bg-white">
													{post.category}
												</Badge>
											</div>

											{/* Featured Badge */}
											{post.featured && (
												<div className="absolute top-4 right-4 z-10">
													<Badge className="bg-yellow-500 text-white">
														Featured
													</Badge>
												</div>
											)}
										</div>

										{/* Article Content */}
										<div className="p-6">
											{/* Meta Info */}
											<div className="flex items-center text-xs text-muted-foreground mb-3 space-x-4">
												<div className="flex items-center">
													<User className="w-3 h-3 mr-1" />
													{post.author}
												</div>
												<div className="flex items-center">
													<Calendar className="w-3 h-3 mr-1" />
													{new Date(post.date).toLocaleDateString()}
												</div>
												<div className="flex items-center">
													<Clock className="w-3 h-3 mr-1" />
													{post.readTime}
												</div>
											</div>

											{/* Title */}
											<h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
												{post.title}
											</h3>

											{/* Excerpt */}
											<p className="text-muted-foreground text-sm mb-4 line-clamp-3">
												{post.excerpt}
											</p>

											{/* Tags */}
											<div className="flex flex-wrap gap-1 mb-4">
												{post.tags.slice(0, 2).map((tag, tagIndex) => (
													<span
														key={tagIndex}
														className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-lg"
													>
														{tag}
													</span>
												))}
											</div>

											{/* Footer */}
											<div className="flex items-center justify-between">
												<Link href={`/blog/${post.id}`}>
													<Button
														variant="ghost"
														size="sm"
														className="group/btn p-0 h-auto font-medium text-primary hover:text-primary"
													>
														Read More
														<ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
													</Button>
												</Link>

												<div className="flex items-center space-x-3 text-xs text-muted-foreground">
													<div className="flex items-center">
														<Eye className="w-4 h-4 mr-1" />
														{post.views}
													</div>
													<div className="flex items-center">
														<Heart className="w-4 h-4 mr-1" />
														{post.likes}
													</div>
													<div className="flex items-center">
														<MessageCircle className="w-4 h-4 mr-1" />
														{post.comments}
													</div>
												</div>
											</div>
										</div>
									</div>
								</motion.article>
						  ))}
				</div>

				{/* Pagination */}
				{!loading && totalPages > 1 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="flex justify-center"
					>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}
							>
								Previous
							</Button>

							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(page) => (
									<Button
										key={page}
										variant={page === currentPage ? "default" : "outline"}
										size="sm"
										onClick={() => setCurrentPage(page)}
										className={page === currentPage ? "bg-primary" : ""}
									>
										{page}
									</Button>
								)
							)}

							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setCurrentPage((prev) => Math.min(prev + 1, totalPages))
								}
								disabled={currentPage === totalPages}
							>
								Next
							</Button>
						</div>
					</motion.div>
				)}

				{/* No Results */}
				{!loading && filteredPosts.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center py-12"
					>
						<div className="text-6xl mb-4">📝</div>
						<h3 className="text-xl font-semibold text-foreground mb-2">
							No articles found
						</h3>
						<p className="text-muted-foreground mb-4">
							Try adjusting your search or filters to find what you&apos;re
							looking for.
						</p>
						<Button
							variant="outline"
							onClick={() => {
								setSearchQuery("");
								setSortBy("latest");
							}}
						>
							Clear Filters
						</Button>
					</motion.div>
				)}
			</div>
		</section>
	);
}
