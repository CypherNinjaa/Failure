"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
	GraduationCap,
	Users,
	BookOpen,
	Settings,
	ArrowRight,
} from "lucide-react";

export function PortalAccess() {
	const portals = [
		{
			id: "student",
			name: "Student Portal",
			icon: GraduationCap,
			emoji: "🎓",
			description: "Access assignments, grades, and resources",
			href: "/portal/student",
			gradient: "from-blue-500 to-cyan-500",
			bgGradient: "from-blue-50 to-cyan-50",
			darkBgGradient: "from-blue-900/20 to-cyan-900/20",
		},
		{
			id: "teacher",
			name: "Teacher Portal",
			icon: BookOpen,
			emoji: "👨‍🏫",
			description: "Manage classes, grades, and student progress",
			href: "/portal/teacher",
			gradient: "from-purple-500 to-pink-500",
			bgGradient: "from-purple-50 to-pink-50",
			darkBgGradient: "from-purple-900/20 to-pink-900/20",
		},
		{
			id: "parent",
			name: "Parent Portal",
			icon: Users,
			emoji: "👨‍👩‍👧‍👦",
			description: "Monitor your child&apos;s academic progress",
			href: "/portal/parent",
			gradient: "from-green-500 to-emerald-500",
			bgGradient: "from-green-50 to-emerald-50",
			darkBgGradient: "from-green-900/20 to-emerald-900/20",
		},
		{
			id: "admin",
			name: "Admin Panel",
			icon: Settings,
			emoji: "⚙️",
			description: "System administration and management",
			href: "/portal/admin",
			gradient: "from-orange-500 to-red-500",
			bgGradient: "from-orange-50 to-red-50",
			darkBgGradient: "from-orange-900/20 to-red-900/20",
		},
	];

	return (
		<section className="py-16 md:py-24 bg-white dark:bg-slate-900">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
						🚀 Quick Portal Access
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Access your personalized dashboard with a single tap. Everything you
						need, right at your fingertips.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
					{portals.map((portal, index) => (
						<motion.div
							key={portal.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -8, scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<Link href={portal.href} className="group block h-full">
								<div
									className={`relative h-full bg-gradient-to-br ${portal.bgGradient} dark:${portal.darkBgGradient} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden`}
								>
									{/* Background decoration */}
									<div className="absolute top-0 right-0 w-24 h-24 opacity-10">
										<div
											className={`w-full h-full bg-gradient-to-br ${portal.gradient} rounded-full blur-xl`}
										/>
									</div>

									{/* Content */}
									<div className="relative z-10 h-full flex flex-col">
										{/* Icon */}
										<div className="mb-4">
											<div
												className={`inline-flex p-4 bg-gradient-to-br ${portal.gradient} rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
											>
												<portal.icon className="w-8 h-8 text-white" />
											</div>
										</div>

										{/* Text Content */}
										<div className="flex-1">
											<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
												{portal.name}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
												{portal.description}
											</p>
										</div>

										{/* Action */}
										<div className="flex items-center justify-between">
											<span className="text-2xl">{portal.emoji}</span>
											<div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
												Access Portal
												<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
											</div>
										</div>
									</div>

									{/* Hover effect overlay */}
									<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								</div>
							</Link>
						</motion.div>
					))}
				</div>

				{/* Additional CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
						New to Happy Child School?
					</p>
					<Link
						href="/admissions"
						className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
					>
						Start Your Journey
						<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
