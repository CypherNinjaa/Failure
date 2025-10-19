"use client";

import { motion } from "framer-motion";
import {
	Facebook,
	Twitter,
	Instagram,
	Youtube,
	Linkedin,
	MessageCircle,
	Send,
	Phone,
	ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export function SocialMedia() {
	const socialLinks = [
		{
			name: "Facebook",
			icon: Facebook,
			url: "https://facebook.com/happychildschool",
			color: "from-blue-600 to-blue-700",
			hoverColor: "hover:from-blue-700 hover:to-blue-800",
			followers: "12.5K",
			description: "Daily updates and school events",
		},
		{
			name: "Instagram",
			icon: Instagram,
			url: "https://instagram.com/happychildschool",
			color: "from-pink-500 to-rose-500",
			hoverColor: "hover:from-pink-600 hover:to-rose-600",
			followers: "8.2K",
			description: "Photos and stories from campus life",
		},
		{
			name: "Twitter",
			icon: Twitter,
			url: "https://twitter.com/happychildschool",
			color: "from-sky-400 to-sky-500",
			hoverColor: "hover:from-sky-500 hover:to-sky-600",
			followers: "5.8K",
			description: "Latest news and announcements",
		},
		{
			name: "YouTube",
			icon: Youtube,
			url: "https://youtube.com/happychildschool",
			color: "from-red-500 to-red-600",
			hoverColor: "hover:from-red-600 hover:to-red-700",
			followers: "15.3K",
			description: "Educational content and virtual tours",
		},
		{
			name: "LinkedIn",
			icon: Linkedin,
			url: "https://linkedin.com/company/happychildschool",
			color: "from-blue-700 to-blue-800",
			hoverColor: "hover:from-blue-800 hover:to-blue-900",
			followers: "3.1K",
			description: "Professional updates and achievements",
		},
	];

	const instantMessaging = [
		{
			name: "WhatsApp",
			icon: MessageCircle,
			url: "https://wa.me/919876543210",
			color: "from-green-500 to-green-600",
			hoverColor: "hover:from-green-600 hover:to-green-700",
			label: "Chat with us",
			available: "Available 9 AM - 6 PM",
		},
		{
			name: "Telegram",
			icon: Send,
			url: "https://t.me/happychildschool",
			color: "from-blue-500 to-blue-600",
			hoverColor: "hover:from-blue-600 hover:to-blue-700",
			label: "Join our channel",
			available: "Updates & Notifications",
		},
		{
			name: "Call Us",
			icon: Phone,
			url: "tel:+919876543210",
			color: "from-purple-500 to-purple-600",
			hoverColor: "hover:from-purple-600 hover:to-purple-700",
			label: "Call directly",
			available: "Mon-Fri 9 AM - 5 PM",
		},
	];

	return (
		<section className="py-16">
			<div className="max-w-6xl mx-auto">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Stay{" "}
						<span className="text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Connected
						</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Follow us on social media for the latest updates, events, and
						behind-the-scenes content from our school community.
					</p>
				</motion.div>

				{/* Social Media Links */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="mb-12"
				>
					<h3 className="text-2xl font-bold text-center text-foreground mb-8">
						Follow Us
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
						{socialLinks.map((social, index) => (
							<motion.div
								key={social.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Card className="p-6 text-center hover:shadow-xl transition-all duration-300 bg-card border-border group cursor-pointer">
									<a
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className="block"
									>
										<div
											className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${social.color} ${social.hoverColor} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
										>
											<social.icon className="w-8 h-8 text-white" />
										</div>
										<h4 className="font-bold text-lg text-foreground mb-1">
											{social.name}
										</h4>
										<p className="text-sm text-muted-foreground mb-2">
											{social.followers} followers
										</p>
										<p className="text-xs text-muted-foreground">
											{social.description}
										</p>
										<div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<div className="flex items-center justify-center text-primary text-sm font-medium">
												<ExternalLink className="w-4 h-4 mr-1" />
												Visit Page
											</div>
										</div>
									</a>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Instant Messaging */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<h3 className="text-2xl font-bold text-center text-foreground mb-8">
						Instant Connect
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{instantMessaging.map((platform, index) => (
							<motion.div
								key={platform.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Card className="p-6 hover:shadow-xl transition-all duration-300 bg-card border-border group cursor-pointer">
									<a
										href={platform.url}
										target="_blank"
										rel="noopener noreferrer"
										className="block"
									>
										<div className="flex items-center mb-4">
											<div
												className={`w-12 h-12 bg-gradient-to-r ${platform.color} ${platform.hoverColor} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 mr-4`}
											>
												<platform.icon className="w-6 h-6 text-white" />
											</div>
											<div className="flex-1">
												<h4 className="font-bold text-lg text-foreground">
													{platform.name}
												</h4>
												<p className="text-sm text-muted-foreground">
													{platform.label}
												</p>
											</div>
											<ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
										</div>
										<div className="bg-muted/50 rounded-lg p-3">
											<p className="text-sm text-muted-foreground">
												{platform.available}
											</p>
										</div>
									</a>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className="text-center mt-12"
				>
					<Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-border">
						<h3 className="text-2xl font-bold text-foreground mb-4">
							Join Our Community
						</h3>
						<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
							Be part of our growing community of students, parents, and
							educators. Get the latest updates, participate in discussions, and
							celebrate our achievements together.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.a
								href="https://facebook.com/happychildschool"
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
							>
								<Facebook className="w-5 h-5 mr-2" />
								Follow on Facebook
							</motion.a>
							<motion.a
								href="https://instagram.com/happychildschool"
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
							>
								<Instagram className="w-5 h-5 mr-2" />
								Follow on Instagram
							</motion.a>
						</div>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}
