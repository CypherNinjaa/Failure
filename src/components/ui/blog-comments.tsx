"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { MessageCircle, Send, Heart, Reply, Flag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Comment {
	id: string;
	author: string;
	role: "student" | "parent" | "teacher" | "admin";
	content: string;
	date: string;
	likes: number;
	replies: Comment[];
	isLiked: boolean;
	avatar?: string;
}

interface BlogCommentsProps {
	postId: string;
}

export function BlogComments({ postId }: BlogCommentsProps) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [newComment, setNewComment] = useState("");
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [replyContent, setReplyContent] = useState("");
	const [loading, setLoading] = useState(true);
	const [currentUser] = useState({
		name: "Anonymous User",
		role: "parent" as const,
		avatar: "",
	});

	// Mock comments data
	const mockComments: Comment[] = useMemo(
		() => [
			{
				id: "1",
				author: "Sarah Johnson",
				role: "parent",
				content:
					"This is such an insightful article! As a parent, I really appreciate the practical tips shared here. My daughter has been struggling with online learning, and these strategies will definitely help.",
				date: "2024-01-15T10:30:00Z",
				likes: 12,
				isLiked: false,
				replies: [
					{
						id: "1-1",
						author: "Dr. Emily Chen",
						role: "teacher",
						content:
							"Thank you for your feedback, Sarah! I'm glad you found the article helpful. Feel free to reach out if you need any specific guidance for your daughter.",
						date: "2024-01-15T14:20:00Z",
						likes: 8,
						isLiked: true,
						replies: [],
					},
				],
			},
			{
				id: "2",
				author: "Michael Rodriguez",
				role: "student",
				content:
					"Great article! I especially liked the part about time management. I've been using some of these techniques and they really work. Thanks for sharing!",
				date: "2024-01-14T16:45:00Z",
				likes: 7,
				isLiked: false,
				replies: [],
			},
			{
				id: "3",
				author: "Jennifer Smith",
				role: "parent",
				content:
					"I wish we had access to these resources when I was in school. The digital learning tools mentioned here are amazing. Looking forward to more articles like this!",
				date: "2024-01-14T09:15:00Z",
				likes: 15,
				isLiked: true,
				replies: [
					{
						id: "3-1",
						author: "Admin Team",
						role: "admin",
						content:
							"We're constantly working to improve our digital learning platform. Stay tuned for more updates and resources!",
						date: "2024-01-14T11:30:00Z",
						likes: 5,
						isLiked: false,
						replies: [],
					},
				],
			},
		],
		[]
	); // Simulate loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setComments(mockComments);
			setLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, [postId, mockComments]);

	const handleSubmitComment = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		const comment: Comment = {
			id: Date.now().toString(),
			author: currentUser.name,
			role: currentUser.role,
			content: newComment,
			date: new Date().toISOString(),
			likes: 0,
			isLiked: false,
			replies: [],
		};

		setComments((prev) => [comment, ...prev]);
		setNewComment("");
	};

	const handleSubmitReply = (parentId: string) => {
		if (!replyContent.trim()) return;

		const reply: Comment = {
			id: `${parentId}-${Date.now()}`,
			author: currentUser.name,
			role: currentUser.role,
			content: replyContent,
			date: new Date().toISOString(),
			likes: 0,
			isLiked: false,
			replies: [],
		};

		setComments((prev) =>
			prev.map((comment) =>
				comment.id === parentId
					? { ...comment, replies: [...comment.replies, reply] }
					: comment
			)
		);

		setReplyContent("");
		setReplyingTo(null);
	};

	const handleLikeComment = (
		commentId: string,
		isReply?: boolean,
		parentId?: string
	) => {
		if (isReply && parentId) {
			setComments((prev) =>
				prev.map((comment) =>
					comment.id === parentId
						? {
								...comment,
								replies: comment.replies.map((reply) =>
									reply.id === commentId
										? {
												...reply,
												likes: reply.isLiked
													? reply.likes - 1
													: reply.likes + 1,
												isLiked: !reply.isLiked,
										  }
										: reply
								),
						  }
						: comment
				)
			);
		} else {
			setComments((prev) =>
				prev.map((comment) =>
					comment.id === commentId
						? {
								...comment,
								likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
								isLiked: !comment.isLiked,
						  }
						: comment
				)
			);
		}
	};

	const getRoleColor = (role: string) => {
		switch (role) {
			case "teacher":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
			case "parent":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
			case "student":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
			case "admin":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
		}
	};

	const CommentSkeleton = () => (
		<div className="animate-pulse">
			<div className="flex space-x-4">
				<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
				<div className="flex-1 space-y-2">
					<div className="flex items-center space-x-2">
						<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
					</div>
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
					<div className="flex space-x-4">
						<div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
					</div>
				</div>
			</div>
		</div>
	);

	const CommentItem = ({
		comment,
		isReply = false,
		parentId = "",
	}: {
		comment: Comment;
		isReply?: boolean;
		parentId?: string;
	}) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={`${isReply ? "ml-12 pl-4 border-l-2 border-muted" : ""}`}
		>
			<div className="flex space-x-4">
				{/* Avatar */}
				<div className="flex-shrink-0">
					<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
						<User className="w-5 h-5 text-white" />
					</div>
				</div>

				{/* Comment Content */}
				<div className="flex-1 min-w-0">
					{/* Header */}
					<div className="flex items-center space-x-2 mb-2">
						<span className="font-semibold text-foreground text-sm">
							{comment.author}
						</span>
						<Badge className={`text-xs ${getRoleColor(comment.role)}`}>
							{comment.role}
						</Badge>
						<span className="text-xs text-muted-foreground">
							{new Date(comment.date).toLocaleDateString()}
						</span>
					</div>

					{/* Content */}
					<p className="text-foreground text-sm mb-3 leading-relaxed">
						{comment.content}
					</p>

					{/* Actions */}
					<div className="flex items-center space-x-4 text-xs">
						<button
							onClick={() => handleLikeComment(comment.id, isReply, parentId)}
							className={`flex items-center space-x-1 transition-colors ${
								comment.isLiked
									? "text-red-500 hover:text-red-600"
									: "text-muted-foreground hover:text-red-500"
							}`}
						>
							<Heart
								className={`w-4 h-4 ${comment.isLiked ? "fill-current" : ""}`}
							/>
							<span>{comment.likes}</span>
						</button>

						{!isReply && (
							<button
								onClick={() =>
									setReplyingTo(replyingTo === comment.id ? null : comment.id)
								}
								className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
							>
								<Reply className="w-4 h-4" />
								<span>Reply</span>
							</button>
						)}

						<button className="flex items-center space-x-1 text-muted-foreground hover:text-yellow-500 transition-colors">
							<Flag className="w-4 h-4" />
							<span>Report</span>
						</button>
					</div>

					{/* Reply Form */}
					{replyingTo === comment.id && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="mt-4"
						>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSubmitReply(comment.id);
								}}
							>
								<div className="flex space-x-3">
									<div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
										<User className="w-4 h-4 text-white" />
									</div>
									<div className="flex-1">
										<Input
											placeholder="Write a reply..."
											value={replyContent}
											onChange={(e) => setReplyContent(e.target.value)}
											className="mb-2"
										/>
										<div className="flex space-x-2">
											<Button
												size="sm"
												type="submit"
												disabled={!replyContent.trim()}
											>
												<Send className="w-4 h-4 mr-1" />
												Reply
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() => setReplyingTo(null)}
											>
												Cancel
											</Button>
										</div>
									</div>
								</div>
							</form>
						</motion.div>
					)}

					{/* Replies */}
					{comment.replies.length > 0 && (
						<div className="mt-4 space-y-4">
							{comment.replies.map((reply) => (
								<CommentItem
									key={reply.id}
									comment={reply}
									isReply={true}
									parentId={comment.id}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);

	return (
		<section className="py-16 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="max-w-4xl mx-auto">
					{/* Section Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="mb-8"
					>
						<div className="flex items-center space-x-3 mb-4">
							<MessageCircle className="w-6 h-6 text-primary" />
							<h3 className="text-2xl font-bold text-foreground">
								Comments & Discussion
							</h3>
							{!loading && (
								<Badge variant="outline" className="ml-2">
									{comments.reduce(
										(acc, comment) => acc + 1 + comment.replies.length,
										0
									)}{" "}
									comments
								</Badge>
							)}
						</div>
						<p className="text-muted-foreground">
							Join the conversation! Share your thoughts and engage with our
							school community.
						</p>
					</motion.div>

					{/* Comment Form */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="mb-8"
					>
						<div className="bg-card rounded-2xl p-6 shadow-lg">
							<form onSubmit={handleSubmitComment}>
								<div className="flex space-x-4">
									<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
										<User className="w-5 h-5 text-white" />
									</div>
									<div className="flex-1">
										<Input
											placeholder="Share your thoughts on this article..."
											value={newComment}
											onChange={(e) => setNewComment(e.target.value)}
											className="mb-3"
										/>
										<div className="flex items-center justify-between">
											<div className="text-sm text-muted-foreground">
												Posting as <strong>{currentUser.name}</strong> (
												{currentUser.role})
											</div>
											<Button
												type="submit"
												disabled={!newComment.trim()}
												className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
											>
												<Send className="w-4 h-4 mr-2" />
												Post Comment
											</Button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</motion.div>

					{/* Comments List */}
					<div className="space-y-6">
						{loading ? (
							Array.from({ length: 3 }).map((_, index) => (
								<div key={index} className="bg-card rounded-2xl p-6 shadow-lg">
									<CommentSkeleton />
								</div>
							))
						) : comments.length > 0 ? (
							comments.map((comment, index) => (
								<motion.div
									key={comment.id}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
								>
									<CommentItem comment={comment} />
								</motion.div>
							))
						) : (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								className="text-center py-12 bg-card rounded-2xl"
							>
								<MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-foreground mb-2">
									No comments yet
								</h3>
								<p className="text-muted-foreground">
									Be the first to share your thoughts on this article!
								</p>
							</motion.div>
						)}
					</div>

					{/* Community Guidelines */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						viewport={{ once: true }}
						className="mt-12 bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
					>
						<h4 className="font-semibold text-foreground mb-3 flex items-center">
							<MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
							Community Guidelines
						</h4>
						<div className="text-sm text-muted-foreground space-y-1">
							<p>• Be respectful and constructive in your comments</p>
							<p>• Keep discussions relevant to the article topic</p>
							<p>• No spam, offensive language, or inappropriate content</p>
							<p>• Report any comments that violate these guidelines</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
