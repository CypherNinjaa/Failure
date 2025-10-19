"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Send, Check, Bell, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BlogNewsletter() {
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubscribed(true);
			setIsLoading(false);
			setEmail("");
		}, 2000);
	};

	const benefits = [
		{
			icon: Bell,
			title: "Weekly Updates",
			description: "Get the latest articles delivered to your inbox",
		},
		{
			icon: Star,
			title: "Exclusive Content",
			description: "Access to subscriber-only educational resources",
		},
		{
			icon: Gift,
			title: "Special Events",
			description: "Early invitations to school events and workshops",
		},
	];

	if (isSubscribed) {
		return (
			<section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6 }}
						className="max-w-2xl mx-auto text-center"
					>
						<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
							<Check className="w-8 h-8 text-white" />
						</div>
						<h2 className="text-3xl font-bold text-foreground mb-4">
							Welcome to Our Community!
						</h2>
						<p className="text-muted-foreground mb-6">
							Thank you for subscribing to our newsletter. You&apos;ll receive
							our latest updates and exclusive content directly in your inbox.
						</p>
						<Button
							variant="outline"
							onClick={() => setIsSubscribed(false)}
							className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
						>
							Subscribe Another Email
						</Button>
					</motion.div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Content Side */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						>
							<div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-6">
								<Mail className="w-4 h-4 mr-2" />
								Stay Connected
							</div>

							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
								Never Miss an Update
							</h2>

							<p className="text-lg text-muted-foreground mb-8 leading-relaxed">
								Subscribe to our newsletter and be the first to know about new
								articles, school events, educational insights, and exclusive
								content from our community.
							</p>

							{/* Benefits */}
							<div className="space-y-6 mb-8">
								{benefits.map((benefit, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
										viewport={{ once: true }}
										className="flex items-start space-x-4"
									>
										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
											<benefit.icon className="w-5 h-5 text-white" />
										</div>
										<div>
											<h3 className="font-semibold text-foreground mb-1">
												{benefit.title}
											</h3>
											<p className="text-sm text-muted-foreground">
												{benefit.description}
											</p>
										</div>
									</motion.div>
								))}
							</div>

							{/* Newsletter Form */}
							<motion.form
								onSubmit={handleSubscribe}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.3 }}
								viewport={{ once: true }}
								className="space-y-4"
							>
								<div className="flex flex-col sm:flex-row gap-3">
									<div className="flex-1">
										<Input
											type="email"
											placeholder="Enter your email address"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="h-12 px-4 rounded-xl border-2 focus:border-primary"
										/>
									</div>
									<Button
										type="submit"
										disabled={isLoading || !email}
										className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
									>
										{isLoading ? (
											<div className="flex items-center">
												<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
												Subscribing...
											</div>
										) : (
											<div className="flex items-center">
												<Send className="w-5 h-5 mr-2" />
												Subscribe
											</div>
										)}
									</Button>
								</div>

								<p className="text-xs text-muted-foreground">
									By subscribing, you agree to receive educational content and
									updates. You can unsubscribe at any time.
								</p>
							</motion.form>
						</motion.div>

						{/* Visual Side */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							viewport={{ once: true }}
							className="relative"
						>
							{/* Newsletter Preview Card */}
							<div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm mx-auto">
								{/* Header */}
								<div className="flex items-center space-x-3 mb-4">
									<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
										<Mail className="w-4 h-4 text-white" />
									</div>
									<div>
										<div className="font-semibold text-foreground text-sm">
											Happy Child School
										</div>
										<div className="text-xs text-muted-foreground">
											Weekly Newsletter
										</div>
									</div>
								</div>

								{/* Content Preview */}
								<div className="space-y-3">
									<div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full" />
									<div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-4/5" />
									<div className="h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg" />
									<div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
									<div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3" />
								</div>

								{/* CTA Button Preview */}
								<div className="mt-4">
									<div className="h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
										<span className="text-white text-xs font-medium">
											Read Full Article
										</span>
									</div>
								</div>
							</div>

							{/* Floating Elements */}
							<div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-60 animate-pulse" />
							<div className="absolute -bottom-6 -left-6 w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full opacity-60 animate-pulse delay-1000" />

							{/* Background Decoration */}
							<div className="absolute inset-0 -z-10">
								<div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse" />
								<div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-500" />
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
