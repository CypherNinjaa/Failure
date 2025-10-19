"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Mail,
	Phone,
	MapPin,
	Globe,
	Facebook,
	Twitter,
	Instagram,
	Youtube,
	Heart,
} from "lucide-react";

export function ModernFooter() {
	const quickLinks = [
		{ name: "About Us", href: "/about" },
		{ name: "Academics", href: "/academics" },
		{ name: "Admissions", href: "/admissions" },
		{ name: "Facilities", href: "/facilities" },
		{ name: "Gallery", href: "/gallery" },
		{ name: "Contact", href: "/contact" },
	];

	const portalLinks = [
		{ name: "Student Login", href: "/portal/student" },
		{ name: "Teacher Login", href: "/portal/teacher" },
		{ name: "Parent Login", href: "/portal/parent" },
		{ name: "Admin Panel", href: "/portal/admin" },
		{ name: "E-Learning", href: "/e-learning" },
		{ name: "Digital Library", href: "/library" },
	];

	const contactInfo = [
		{
			icon: MapPin,
			text: "123 Education Street, Learning City, 560001",
			color: "text-green-400",
		},
		{
			icon: Phone,
			text: "+91 98765 43210",
			color: "text-blue-400",
		},
		{
			icon: Mail,
			text: "info@happychildschool.edu",
			color: "text-purple-400",
		},
		{
			icon: Globe,
			text: "www.happychildschool.edu",
			color: "text-orange-400",
		},
	];

	const socialLinks = [
		{ icon: Facebook, href: "#", color: "hover:text-blue-400" },
		{ icon: Twitter, href: "#", color: "hover:text-sky-400" },
		{ icon: Instagram, href: "#", color: "hover:text-pink-400" },
		{ icon: Youtube, href: "#", color: "hover:text-red-400" },
	];

	return (
		<footer className="bg-slate-900 text-white relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600" />
				<motion.div
					className="absolute inset-0"
					animate={{
						backgroundPosition: ["0% 0%", "100% 100%"],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						repeatType: "reverse",
					}}
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Main Footer Content */}
				<div className="py-16">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
						{/* School Info */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="space-y-6"
						>
							<div className="flex items-center space-x-3">
								<Image
									src="/logo.png"
									alt="Happy Child School Logo"
									width={48}
									height={48}
									className="w-12 h-12 object-contain"
								/>
								<div>
									<div className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
										Happy Child School
									</div>
									<div className="text-sm text-gray-400">
										Excellence in Education
									</div>
								</div>
							</div>

							<p className="text-gray-400 leading-relaxed">
								Nurturing excellence in education since 2009. Building
								tomorrow&apos;s leaders with innovative teaching methods and
								cutting-edge technology.
							</p>

							{/* Social Links */}
							<div className="flex space-x-4">
								{socialLinks.map((social, index) => (
									<motion.a
										key={index}
										href={social.href}
										whileHover={{ scale: 1.2, y: -2 }}
										whileTap={{ scale: 0.9 }}
										className={`w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center transition-colors duration-300 ${social.color}`}
									>
										<social.icon className="w-5 h-5" />
									</motion.a>
								))}
							</div>
						</motion.div>

						{/* Quick Links */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							viewport={{ once: true }}
						>
							<h4 className="font-bold text-lg mb-6 text-blue-400">
								Quick Links
							</h4>
							<ul className="space-y-3">
								{quickLinks.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
										>
											<span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>

						{/* Portal Links */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							<h4 className="font-bold text-lg mb-6 text-purple-400">
								Student Portals
							</h4>
							<ul className="space-y-3">
								{portalLinks.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center group"
										>
											<span className="w-1 h-1 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>

						{/* Contact Info */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							viewport={{ once: true }}
						>
							<h4 className="font-bold text-lg mb-6 text-green-400">
								Contact Info
							</h4>
							<ul className="space-y-4">
								{contactInfo.map((contact, index) => (
									<li key={index} className="flex items-start space-x-3 group">
										<contact.icon
											className={`w-5 h-5 mt-0.5 ${contact.color} group-hover:scale-110 transition-transform`}
										/>
										<span className="text-gray-400 text-sm leading-relaxed group-hover:text-white transition-colors">
											{contact.text}
										</span>
									</li>
								))}
							</ul>

							{/* Newsletter Signup */}
							<div className="mt-8 p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
								<h5 className="font-semibold mb-3 text-white">Stay Updated</h5>
								<p className="text-sm text-gray-400 mb-4">
									Get the latest news and updates from our school.
								</p>
								<Button
									size="sm"
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
								>
									📧 Subscribe to Newsletter
								</Button>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Bottom Bar */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
					className="border-t border-gray-800 py-8"
				>
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-gray-400 text-sm text-center md:text-left">
							© 2025 Happy Child School. All rights reserved.
						</p>

						<div className="flex items-center gap-1 text-sm text-gray-400">
							<span>Made with</span>
							<Heart className="w-4 h-4 text-red-400 fill-current" />
							<span>for education</span>
						</div>

						<div className="flex flex-wrap items-center gap-4 text-sm">
							<Link
								href="/privacy"
								className="text-gray-400 hover:text-blue-400 transition-colors"
							>
								Privacy Policy
							</Link>
							<span className="text-gray-600">|</span>
							<Link
								href="/terms"
								className="text-gray-400 hover:text-blue-400 transition-colors"
							>
								Terms of Service
							</Link>
							<span className="text-gray-600">|</span>
							<Link
								href="/accessibility"
								className="text-gray-400 hover:text-blue-400 transition-colors"
							>
								Accessibility
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}
