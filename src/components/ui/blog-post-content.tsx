"use client";

import { motion } from "framer-motion";
import {
	Calendar,
	User,
	Clock,
	Eye,
	Heart,
	Share2,
	BookOpen,
	Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlogPostContentProps {
	postId: string;
}

export function BlogPostContent({ postId }: BlogPostContentProps) {
	// Mock blog post data based on ID
	const blogPost = {
		id: postId,
		title:
			"Innovative Teaching Methods: Transforming Education at Happy Child School",
		content: `
			<p>Education is constantly evolving, and at Happy Child School, we're at the forefront of implementing innovative teaching methods that engage students and enhance learning outcomes. In this article, we'll explore the revolutionary approaches we've adopted and how they're transforming the educational experience for our students.</p>

			<h2>Interactive Digital Learning</h2>
			<p>Our classrooms have been transformed into dynamic learning environments where technology meets pedagogy. We've integrated interactive whiteboards, tablets, and specialized educational software that makes learning more engaging and accessible for students of all learning styles.</p>

			<h3>Key Benefits:</h3>
			<ul>
				<li>Enhanced student engagement through multimedia content</li>
				<li>Personalized learning paths for individual student needs</li>
				<li>Real-time assessment and feedback</li>
				<li>Collaborative learning opportunities</li>
			</ul>

			<h2>Project-Based Learning</h2>
			<p>We've moved beyond traditional textbook learning to implement comprehensive project-based curricula. Students work on real-world problems, developing critical thinking skills while applying theoretical knowledge to practical situations.</p>

			<blockquote>
				"Our students are not just learning facts; they're developing the skills they need to succeed in the 21st century." - Dr. Sarah Johnson, Head of Curriculum
			</blockquote>

			<h2>Collaborative Learning Environment</h2>
			<p>Our teaching methodology emphasizes collaboration over competition. Students work in teams, learn from each other, and develop essential social skills alongside academic knowledge.</p>

			<h3>Implementation Strategies:</h3>
			<ol>
				<li>Small group discussions and peer teaching</li>
				<li>Cross-grade mentorship programs</li>
				<li>Community-based learning projects</li>
				<li>Regular reflection and feedback sessions</li>
			</ol>

			<h2>Assessment and Progress Tracking</h2>
			<p>We've revolutionized our assessment methods to provide comprehensive feedback that goes beyond traditional grades. Our new system tracks student progress in real-time and provides detailed insights into learning patterns.</p>

			<h2>Looking Ahead</h2>
			<p>As we continue to innovate, we're exploring new technologies and methodologies including virtual reality experiences, AI-powered personalized learning, and expanded community partnerships. Our commitment to educational excellence drives us to constantly improve and adapt our teaching methods.</p>

			<p>We invite parents and students to experience these innovative teaching methods firsthand. Schedule a visit to see how Happy Child School is preparing students for success in an ever-changing world.</p>
		`,
		author: "Dr. Sarah Johnson",
		date: "2024-01-15",
		readTime: "8 min read",
		category: "Education",
		tags: ["Innovation", "Teaching", "Technology", "Student Success"],
		views: 1420,
		likes: 89,
		shares: 23,
		image: "/api/placeholder/800/400",
	};

	return (
		<article className="pt-24 pb-16">
			<div className="container mx-auto px-4">
				<div className="max-w-4xl mx-auto">
					{/* Article Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="mb-8"
					>
						{/* Category Badge */}
						<div className="mb-4">
							<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
								{blogPost.category}
							</Badge>
						</div>

						{/* Title */}
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
							{blogPost.title}
						</h1>

						{/* Meta Information */}
						<div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
							<div className="flex items-center">
								<User className="w-4 h-4 mr-2" />
								<span>{blogPost.author}</span>
							</div>
							<div className="flex items-center">
								<Calendar className="w-4 h-4 mr-2" />
								<span>{new Date(blogPost.date).toLocaleDateString()}</span>
							</div>
							<div className="flex items-center">
								<Clock className="w-4 h-4 mr-2" />
								<span>{blogPost.readTime}</span>
							</div>
							<div className="flex items-center">
								<Eye className="w-4 h-4 mr-2" />
								<span>{blogPost.views} views</span>
							</div>
						</div>

						{/* Hero Image */}
						<div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
							<div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
							<div className="absolute inset-0 bg-black/20" />
							<div className="absolute bottom-4 left-4 right-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<Button
											size="sm"
											variant="secondary"
											className="bg-white/90 text-gray-800 hover:bg-white"
										>
											<Heart className="w-4 h-4 mr-2" />
											{blogPost.likes}
										</Button>
										<Button
											size="sm"
											variant="secondary"
											className="bg-white/90 text-gray-800 hover:bg-white"
										>
											<Share2 className="w-4 h-4 mr-2" />
											{blogPost.shares}
										</Button>
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Article Content */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="prose prose-lg dark:prose-invert max-w-none"
					>
						<div
							className="article-content text-foreground leading-relaxed"
							dangerouslySetInnerHTML={{ __html: blogPost.content }}
							style={{
								fontSize: "16px",
								lineHeight: "1.7",
							}}
						/>
					</motion.div>

					{/* Tags */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="mt-12 pt-8 border-t border-border"
					>
						<div className="flex items-center space-x-2 mb-4">
							<Tag className="w-5 h-5 text-muted-foreground" />
							<span className="text-sm font-medium text-muted-foreground">
								Tags:
							</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{blogPost.tags.map((tag, index) => (
								<Badge
									key={index}
									variant="outline"
									className="hover:bg-muted cursor-pointer transition-colors"
								>
									{tag}
								</Badge>
							))}
						</div>
					</motion.div>

					{/* Article Footer */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className="mt-12 pt-8 border-t border-border"
					>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
							{/* Author Info */}
							<div className="flex items-center space-x-4">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
									<User className="w-6 h-6 text-white" />
								</div>
								<div>
									<div className="font-semibold text-foreground">
										{blogPost.author}
									</div>
									<div className="text-sm text-muted-foreground">
										Head of Curriculum Development
									</div>
								</div>
							</div>

							{/* Share Buttons */}
							<div className="flex items-center space-x-3">
								<span className="text-sm text-muted-foreground mr-2">
									Share:
								</span>
								<Button size="sm" variant="outline" className="flex-shrink-0">
									<Share2 className="w-4 h-4 mr-2" />
									Share Article
								</Button>
								<Button size="sm" variant="outline" className="flex-shrink-0">
									<BookOpen className="w-4 h-4 mr-2" />
									Read More
								</Button>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Custom Styles for Article Content */}
			<style jsx>{`
				.article-content h2 {
					font-size: 1.5rem;
					font-weight: 700;
					margin: 2rem 0 1rem 0;
					color: inherit;
				}
				.article-content h3 {
					font-size: 1.25rem;
					font-weight: 600;
					margin: 1.5rem 0 0.75rem 0;
					color: inherit;
				}
				.article-content p {
					margin: 1rem 0;
					color: inherit;
				}
				.article-content ul,
				.article-content ol {
					margin: 1rem 0;
					padding-left: 1.5rem;
				}
				.article-content li {
					margin: 0.5rem 0;
					color: inherit;
				}
				.article-content blockquote {
					border-left: 4px solid #3b82f6;
					padding-left: 1rem;
					margin: 1.5rem 0;
					font-style: italic;
					color: inherit;
					background: rgba(59, 130, 246, 0.1);
					padding: 1rem;
					border-radius: 0.5rem;
				}
			`}</style>
		</article>
	);
}
