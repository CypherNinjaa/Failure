"use client";

import { motion } from "framer-motion";
import { Calendar, User, Clock, ArrowRight, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface RelatedArticle {
	id: string;
	title: string;
	excerpt: string;
	author: string;
	date: string;
	readTime: string;
	category: string;
	views: number;
	likes: number;
	image: string;
}

interface RelatedArticlesProps {
	postId: string;
}

export function RelatedArticles({}: RelatedArticlesProps) {
	// Mock related articles data
	const relatedArticles: RelatedArticle[] = [
		{
			id: "2",
			title: "Building Character Through Co-curricular Activities",
			excerpt:
				"Discover how our diverse activities help students develop leadership skills and confidence beyond academics.",
			author: "Ms. Emily Chen",
			date: "2024-01-12",
			readTime: "6 min read",
			category: "Activities",
			views: 890,
			likes: 67,
			image: "/api/placeholder/400/250",
		},
		{
			id: "3",
			title: "Student Mental Health: Creating Supportive Learning Environments",
			excerpt:
				"A comprehensive guide to fostering student wellbeing and building resilience in educational settings.",
			author: "Dr. Michael Rodriguez",
			date: "2024-01-10",
			readTime: "8 min read",
			category: "Student Life",
			views: 1120,
			likes: 94,
			image: "/api/placeholder/400/250",
		},
		{
			id: "4",
			title: "Parent-Teacher Collaboration: Keys to Academic Success",
			excerpt:
				"Effective strategies for building strong partnerships between families and educators.",
			author: "Ms. Jennifer Smith",
			date: "2024-01-08",
			readTime: "5 min read",
			category: "Community",
			views: 750,
			likes: 82,
			image: "/api/placeholder/400/250",
		},
	];

	return (
		<section className="py-16 bg-background">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					{/* Section Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
							<span className="mr-2">📚</span>
							Related Reading
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
							You Might Also Like
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Explore more insights and stories from our school community
						</p>
					</motion.div>

					{/* Related Articles Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{relatedArticles.map((article, index) => (
							<motion.article
								key={article.id}
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
												{article.category}
											</Badge>
										</div>

										{/* Stats */}
										<div className="absolute top-4 right-4 z-10 flex space-x-2">
											<div className="flex items-center px-2 py-1 bg-black/50 rounded-lg text-white text-xs">
												<Eye className="w-3 h-3 mr-1" />
												{article.views}
											</div>
											<div className="flex items-center px-2 py-1 bg-black/50 rounded-lg text-white text-xs">
												<Heart className="w-3 h-3 mr-1" />
												{article.likes}
											</div>
										</div>
									</div>

									{/* Article Content */}
									<div className="p-6">
										{/* Meta Info */}
										<div className="flex items-center text-xs text-muted-foreground mb-3 space-x-4">
											<div className="flex items-center">
												<User className="w-3 h-3 mr-1" />
												{article.author}
											</div>
											<div className="flex items-center">
												<Calendar className="w-3 h-3 mr-1" />
												{new Date(article.date).toLocaleDateString()}
											</div>
											<div className="flex items-center">
												<Clock className="w-3 h-3 mr-1" />
												{article.readTime}
											</div>
										</div>

										{/* Title */}
										<h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
											{article.title}
										</h3>

										{/* Excerpt */}
										<p className="text-muted-foreground text-sm mb-4 line-clamp-3">
											{article.excerpt}
										</p>

										{/* Read More Button */}
										<Link href={`/blog/${article.id}`}>
											<Button
												variant="ghost"
												size="sm"
												className="group/btn p-0 h-auto font-medium text-primary hover:text-primary"
											>
												Read Article
												<ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
											</Button>
										</Link>
									</div>
								</div>
							</motion.article>
						))}
					</div>

					{/* View All Articles Button */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						viewport={{ once: true }}
						className="text-center mt-12"
					>
						<Link href="/blog">
							<Button
								size="lg"
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
							>
								View All Articles
								<ArrowRight className="w-5 h-5 ml-2" />
							</Button>
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
