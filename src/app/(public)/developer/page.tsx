"use client";

import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import {
	Code2,
	Terminal,
	Rocket,
	Heart,
	Github,
	Linkedin,
	Mail,
	Globe,
	Award,
	Zap,
	Database,
	Server,
	Smartphone,
	CheckCircle2,
	Star,
	Coffee,
	Target,
	Lock,
	Shield,
	Cpu,
	KeyRound,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

// Coding Puzzle Component
function CodingPuzzleSection() {
	const [userAnswer, setUserAnswer] = useState("");
	const [showDeveloper, setShowDeveloper] = useState(false);
	const [attempts, setAttempts] = useState(0);
	const [hint, setHint] = useState("");
	const [mounted, setMounted] = useState(false);

	const puzzles = useMemo(
		() => [
			{
				question: "What is the output? console.log(typeof typeof 1)",
				answer: "string",
				hint: "typeof returns a string, what's the type of a string?",
			},
			{
				question: "Complete: const reverse = str => str.[...]()",
				answer: "split('').reverse().join('')",
				hint: "Think about array methods: split, reverse, join",
			},
			{
				question: "What does [1,2,3].reduce((a,b) => a+b, 0) return?",
				answer: "6",
				hint: "It's summing all numbers in the array",
			},
		],
		[]
	);

	const [currentPuzzle, setCurrentPuzzle] = useState(puzzles[0]);

	useEffect(() => {
		setMounted(true);
		setCurrentPuzzle(puzzles[Math.floor(Math.random() * puzzles.length)]);
	}, [puzzles]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setAttempts(attempts + 1);

		if (
			userAnswer.toLowerCase().trim() ===
			currentPuzzle.answer.toLowerCase().trim()
		) {
			setShowDeveloper(true);
		} else {
			setHint(attempts >= 1 ? currentPuzzle.hint : "Try again! 🤔");
		}
	};

	return (
		<section className="py-16 lg:py-24 bg-slate-900 relative overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
			<motion.div
				className="absolute inset-0 opacity-20"
				animate={{
					backgroundPosition: ["0% 0%", "100% 100%"],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					repeatType: "reverse",
				}}
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
				}}
			/>

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-4xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-sm font-mono mb-4 border border-cyan-500/20">
							<KeyRound className="w-4 h-4" />
							<span>🎯 Developer Challenge</span>
						</div>
						<h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
							Solve the Puzzle to Meet the Developer
						</h2>
						<p className="text-slate-300 text-lg">
							Prove your coding skills and unlock a special reveal! 🔓
						</p>
					</motion.div>

					<AnimatePresence mode="wait">
						{!showDeveloper ? (
							<motion.div
								key="puzzle"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="bg-slate-800/50 backdrop-blur border-2 border-purple-500/30 rounded-2xl p-8 shadow-2xl"
							>
								<div className="flex items-center gap-3 mb-6">
									<div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
										<Lock className="w-6 h-6 text-purple-400" />
									</div>
									<div>
										<h3 className="text-xl font-bold text-white">
											Coding Challenge
										</h3>
										<p className="text-sm text-slate-400">
											Attempt {attempts}/3
										</p>
									</div>
								</div>

								<div className="bg-slate-950 rounded-lg p-6 mb-6 border border-slate-700 font-mono">
									<p className="text-green-400 text-sm mb-2">
										{`// Coding Puzzle`}
									</p>
									<p className="text-white">{currentPuzzle.question}</p>
								</div>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div>
										<input
											type="text"
											value={userAnswer}
											onChange={(e) => setUserAnswer(e.target.value)}
											placeholder="Type your answer here..."
											className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
										/>
									</div>

									{hint && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
										>
											<p className="text-yellow-400 text-sm">💡 Hint: {hint}</p>
										</motion.div>
									)}

									<motion.button
										type="submit"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
									>
										<Terminal className="w-5 h-5" />
										Submit Answer
									</motion.button>
								</form>

								<p className="text-slate-500 text-xs text-center mt-4">
									Answer correctly to reveal the developer behind this amazing
									project! 🚀
								</p>
							</motion.div>
						) : (
							<motion.div
								key="reveal"
								initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
								animate={{ opacity: 1, scale: 1, rotateY: 0 }}
								transition={{ type: "spring", duration: 1 }}
								className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 border-2 border-purple-500 shadow-2xl relative overflow-hidden"
							>
								{/* Celebration particles */}
								<motion.div
									className="absolute inset-0"
									initial={{ opacity: 0 }}
									animate={{ opacity: [0, 1, 0] }}
									transition={{ duration: 2 }}
								>
									{[...Array(20)].map((_, i) => (
										<motion.div
											key={i}
											className="absolute w-2 h-2 bg-yellow-400 rounded-full"
											initial={{
												x: "50%",
												y: "50%",
											}}
											animate={{
												x: `${Math.random() * 100}%`,
												y: `${Math.random() * 100}%`,
												opacity: [1, 0],
											}}
											transition={{
												duration: 2,
												delay: i * 0.1,
											}}
										/>
									))}
								</motion.div>

								<div className="text-center mb-6 relative z-10">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.3, type: "spring" }}
										className="inline-block"
									>
										<div className="text-6xl mb-4">🎉</div>
									</motion.div>
									<h3 className="text-3xl font-bold text-white mb-2">
										Congratulations! 🎊
									</h3>
									<p className="text-purple-200">
										You&apos;ve unlocked the developer reveal!
									</p>
								</div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
									className="flex flex-col md:flex-row items-center gap-8 bg-slate-900/50 backdrop-blur rounded-xl p-6 relative z-10"
								>
									<motion.div
										whileHover={{ scale: 1.05, rotate: 3 }}
										className="relative"
									>
										<div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl shadow-purple-500/50">
											<Image
												src="/vikash.jpg"
												alt="Vikash - Full Stack Developer"
												width={160}
												height={160}
												className="object-cover"
											/>
										</div>
										<motion.div
											className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
											animate={{
												rotate: [0, 360],
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
												ease: "linear",
											}}
										>
											<Award className="w-6 h-6 text-white" />
										</motion.div>
									</motion.div>

									<div className="flex-1 text-center md:text-left">
										<h4 className="text-2xl font-bold text-white mb-2">
											Vikash
										</h4>
										<p className="text-purple-300 mb-4">
											Full-Stack Developer & Education Revolutionary
										</p>
										<div className="flex flex-wrap gap-2 justify-center md:justify-start">
											<span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
												Next.js Expert
											</span>
											<span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
												Open Source
											</span>
											<span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
												Education Advocate
											</span>
										</div>
										<p className="text-slate-300 mt-4 text-sm leading-relaxed">
											&quot;Built this entire school management system free of
											cost to revolutionize education and make enterprise-level
											technology accessible to all institutions.&quot;
										</p>
									</div>
								</motion.div>

								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1 }}
									className="mt-6 text-center relative z-10"
								>
									<p className="text-purple-200 text-sm">
										🎯 Challenge completed! Scroll down to connect with the
										developer.
									</p>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}

export default function DeveloperPage() {
	const [typedText, setTypedText] = useState("");
	const [currentLineIndex, setCurrentLineIndex] = useState(0);
	const [matrixChars, setMatrixChars] = useState<string[]>([]);

	const terminalLines = useMemo(
		() => [
			"Initializing developer portfolio...",
			"Loading credentials...",
			"Establishing secure connection...",
			"Access granted. Welcome!",
		],
		[]
	);

	// Typing effect for terminal
	useEffect(() => {
		if (currentLineIndex < terminalLines.length) {
			const currentLine = terminalLines[currentLineIndex];
			if (typedText.length < currentLine.length) {
				const timeout = setTimeout(() => {
					setTypedText(currentLine.substring(0, typedText.length + 1));
				}, 50);
				return () => clearTimeout(timeout);
			} else {
				const timeout = setTimeout(() => {
					setCurrentLineIndex(currentLineIndex + 1);
					setTypedText("");
				}, 1000);
				return () => clearTimeout(timeout);
			}
		}
	}, [typedText, currentLineIndex, terminalLines]);

	// Matrix rain effect
	useEffect(() => {
		const chars = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const interval = setInterval(() => {
			setMatrixChars(
				Array.from({ length: 50 }, () =>
					chars.charAt(Math.floor(Math.random() * chars.length))
				)
			);
		}, 100);
		return () => clearInterval(interval);
	}, []);

	const techStack = [
		{ name: "Next.js 14", category: "Frontend", color: "bg-black text-white" },
		{
			name: "TypeScript",
			category: "Language",
			color: "bg-blue-600 text-white",
		},
		{
			name: "React 18",
			category: "Library",
			color: "bg-cyan-500 text-white",
		},
		{
			name: "Prisma ORM",
			category: "Database",
			color: "bg-slate-800 text-white",
		},
		{
			name: "PostgreSQL",
			category: "Database",
			color: "bg-blue-700 text-white",
		},
		{
			name: "Tailwind CSS",
			category: "Styling",
			color: "bg-teal-500 text-white",
		},
		{
			name: "Clerk Auth",
			category: "Authentication",
			color: "bg-purple-600 text-white",
		},
		{
			name: "Cloudinary",
			category: "Media",
			color: "bg-indigo-600 text-white",
		},
		{
			name: "Framer Motion",
			category: "Animation",
			color: "bg-pink-600 text-white",
		},
		{
			name: "Node.js",
			category: "Runtime",
			color: "bg-green-600 text-white",
		},
		{
			name: "Railway",
			category: "Hosting",
			color: "bg-purple-700 text-white",
		},
		{
			name: "Vercel",
			category: "Deployment",
			color: "bg-black text-white",
		},
	];

	const features = [
		{
			icon: Terminal,
			title: "Full-Stack Architecture",
			description:
				"Built with Next.js 14 App Router, Server Actions, and Server Components for optimal performance",
			color: "text-blue-600",
			bgColor: "bg-blue-50",
		},
		{
			icon: Database,
			title: "Robust Database Design",
			description:
				"PostgreSQL with Prisma ORM, complex relations, and optimized queries for scalability",
			color: "text-green-600",
			bgColor: "bg-green-50",
		},
		{
			icon: Server,
			title: "Role-Based Access Control",
			description:
				"Secure authentication with Clerk, granular permissions for Admin, Teacher, Student, Parent roles",
			color: "text-purple-600",
			bgColor: "bg-purple-50",
		},
		{
			icon: Smartphone,
			title: "Progressive Web App",
			description:
				"Installable PWA with offline support, push notifications, and native app-like experience",
			color: "text-orange-600",
			bgColor: "bg-orange-50",
		},
		{
			icon: Zap,
			title: "Real-Time Features",
			description:
				"Live notifications, messaging system, attendance tracking, and dynamic leaderboards",
			color: "text-yellow-600",
			bgColor: "bg-yellow-50",
		},
		{
			icon: Award,
			title: "Gamification System",
			description:
				"Student badges, achievements, points system, and teacher awards to boost engagement",
			color: "text-pink-600",
			bgColor: "bg-pink-50",
		},
	];

	const stats = [
		{ value: "50+", label: "Database Tables", icon: Database },
		{ value: "100+", label: "Components Built", icon: Code2 },
		{ value: "30+", label: "API Endpoints", icon: Server },
		{ value: "Free", label: "For Schools", icon: Heart },
	];

	const achievements = [
		"Revolutionized school management with modern web technologies",
		"Built comprehensive RBAC system with 5 distinct user roles",
		"Implemented advanced attendance tracking with face recognition",
		"Created dynamic gallery system with Cloudinary integration",
		"Developed real-time messaging and notification infrastructure",
		"Designed gamification engine with badges and leaderboards",
		"Integrated payment processing with transaction history",
		"Built anti-cheating system for online MCQ examinations",
		"Implemented PWA features for mobile-first experience",
		"Open-sourced for educational institutions worldwide",
	];

	return (
		<div className="min-h-screen bg-slate-950 relative overflow-hidden">
			{/* Matrix Rain Background */}
			<div className="fixed inset-0 pointer-events-none opacity-10 z-0">
				{matrixChars.map((char, i) => (
					<motion.div
						key={i}
						initial={{ y: -100 }}
						animate={{ y: "100vh" }}
						transition={{
							duration: Math.random() * 3 + 2,
							repeat: Infinity,
							delay: Math.random() * 2,
						}}
						className="absolute text-green-500 font-mono text-sm"
						style={{
							left: `${(i * 100) / 50}%`,
							top: `${Math.random() * 100}%`,
						}}
					>
						{char}
					</motion.div>
				))}
			</div>

			{/* Floating particles */}
			<div className="fixed inset-0 pointer-events-none z-0">
				{Array.from({ length: 20 }).map((_, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 bg-purple-500 rounded-full"
						initial={{
							x:
								typeof window !== "undefined"
									? Math.random() * window.innerWidth
									: 0,
							y:
								typeof window !== "undefined"
									? Math.random() * window.innerHeight
									: 0,
						}}
						animate={{
							x:
								typeof window !== "undefined"
									? Math.random() * window.innerWidth
									: 0,
							y:
								typeof window !== "undefined"
									? Math.random() * window.innerHeight
									: 0,
						}}
						transition={{
							duration: Math.random() * 10 + 10,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>
				))}
			</div>

			<ModernHeader />

			<main className="pt-20 relative z-10">
				{/* Hero Section - Hacker Terminal with Photo */}
				<section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 lg:py-32">
					{/* Animated scanlines */}
					<motion.div
						className="absolute inset-0 opacity-10"
						animate={{
							backgroundPosition: ["0% 0%", "0% 100%"],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "linear",
						}}
						style={{
							backgroundImage:
								"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(96, 165, 250, 0.3) 2px, rgba(96, 165, 250, 0.3) 4px)",
						}}
					/>

					{/* Glitch effect overlay */}
					<motion.div
						className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
						animate={{
							opacity: [0.5, 0.8, 0.5],
							x: [0, 2, -2, 0],
						}}
						transition={{
							duration: 0.2,
							repeat: Infinity,
							repeatDelay: 5,
						}}
					/>

					<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />

					<div className="container mx-auto px-4 relative z-10">
						<div className="max-w-6xl mx-auto">
							<div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
								{/* Developer Photo with Holographic Effect */}
								<motion.div
									initial={{ opacity: 0, x: -50 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.8 }}
									className="relative group"
								>
									<div className="relative">
										{/* Glowing border animation */}
										<motion.div
											className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl opacity-75 blur-lg"
											animate={{
												rotate: [0, 360],
											}}
											transition={{
												duration: 8,
												repeat: Infinity,
												ease: "linear",
											}}
										/>

										{/* Photo container */}
										<div className="relative bg-slate-900 rounded-2xl p-2 overflow-hidden">
											<Image
												src="/vikash.jpg"
												alt="Developer - Vikash"
												width={500}
												height={500}
												className="rounded-xl w-full h-auto object-cover"
											/>

											{/* Holographic overlay */}
											<motion.div
												className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20"
												animate={{
													opacity: [0.3, 0.6, 0.3],
												}}
												transition={{
													duration: 3,
													repeat: Infinity,
												}}
											/>

											{/* Scanning line effect */}
											<motion.div
												className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent h-1"
												animate={{
													top: ["0%", "100%"],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "linear",
												}}
											/>
										</div>

										{/* Floating badges around photo */}
										<motion.div
											className="absolute -top-4 -right-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
											animate={{
												y: [0, -10, 0],
												rotate: [0, 5, -5, 0],
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
											}}
										>
											<Code2 className="w-4 h-4 inline mr-1" />
											Full Stack
										</motion.div>

										<motion.div
											className="absolute -bottom-4 -left-4 bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
											animate={{
												y: [0, 10, 0],
												rotate: [0, -5, 5, 0],
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
												delay: 1,
											}}
										>
											<Zap className="w-4 h-4 inline mr-1" />
											Open Source
										</motion.div>
									</div>
								</motion.div>

								{/* Terminal Window */}
								<motion.div
									initial={{ opacity: 0, x: 50 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.8, delay: 0.2 }}
									className="bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700"
								>
									{/* Terminal Header */}
									<div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-700">
										<div className="flex items-center gap-2">
											<motion.div
												className="w-3 h-3 rounded-full bg-red-500"
												animate={{ opacity: [1, 0.5, 1] }}
												transition={{ duration: 2, repeat: Infinity }}
											/>
											<motion.div
												className="w-3 h-3 rounded-full bg-yellow-500"
												animate={{ opacity: [1, 0.5, 1] }}
												transition={{
													duration: 2,
													repeat: Infinity,
													delay: 0.3,
												}}
											/>
											<motion.div
												className="w-3 h-3 rounded-full bg-green-500"
												animate={{ opacity: [1, 0.5, 1] }}
												transition={{
													duration: 2,
													repeat: Infinity,
													delay: 0.6,
												}}
											/>
										</div>
										<div className="text-slate-400 text-sm font-mono flex items-center gap-2">
											<Lock className="w-3 h-3" />
											~/developer-portfolio
										</div>
										<div className="w-20" />
									</div>

									{/* Terminal Content */}
									<div className="p-6 lg:p-10 font-mono text-sm lg:text-base min-h-[400px]">
										<div className="space-y-4">
											{/* Animated terminal lines */}
											{terminalLines
												.slice(0, currentLineIndex)
												.map((line, i) => (
													<motion.div
														key={i}
														initial={{ opacity: 0, x: -20 }}
														animate={{ opacity: 1, x: 0 }}
														className="text-green-400 flex items-center gap-2"
													>
														<Terminal className="w-4 h-4" />
														{line}
													</motion.div>
												))}
											{currentLineIndex < terminalLines.length && (
												<div className="text-green-400 flex items-center gap-2">
													<Terminal className="w-4 h-4" />
													{typedText}
													<motion.span
														animate={{ opacity: [1, 0] }}
														transition={{
															duration: 0.5,
															repeat: Infinity,
														}}
													>
														▋
													</motion.span>
												</div>
											)}

											{currentLineIndex >= terminalLines.length && (
												<>
													<div className="flex items-center gap-2 text-green-400 mt-8">
														<span>$</span>
														<span className="text-white">whoami</span>
													</div>
													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														transition={{ delay: 0.5 }}
														className="text-cyan-400 ml-4"
													>
														<div className="mb-6">
															<motion.h1
																className="text-3xl lg:text-5xl font-bold mb-2 text-white"
																animate={{
																	textShadow: [
																		"0 0 20px rgba(96, 165, 250, 0.5)",
																		"0 0 40px rgba(96, 165, 250, 0.8)",
																		"0 0 20px rgba(96, 165, 250, 0.5)",
																	],
																}}
																transition={{
																	duration: 2,
																	repeat: Infinity,
																}}
															>
																Vikash Kumar
															</motion.h1>
															<p className="text-xl text-purple-400">
																Full-Stack Developer & Education Advocate
															</p>
															<motion.div
																className="flex gap-2 mt-4 flex-wrap"
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																transition={{ delay: 1 }}
															>
																<span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
																	Available for Collaboration
																</span>
																<motion.span
																	className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30"
																	animate={{ scale: [1, 1.05, 1] }}
																	transition={{
																		duration: 2,
																		repeat: Infinity,
																	}}
																>
																	Open Source Contributor
																</motion.span>
															</motion.div>
														</div>
													</motion.div>

													<div className="flex items-center gap-2 text-green-400 mt-8">
														<span>$</span>
														<span className="text-white">cat mission.txt</span>
													</div>
													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														transition={{ delay: 1.5 }}
														className="ml-4 text-slate-300 leading-relaxed space-y-2"
													>
														<p className="flex items-center gap-2">
															<Shield className="w-4 h-4 text-cyan-400" />
															<span>
																Built enterprise-grade school management system{" "}
																<span className="text-yellow-400 font-bold">
																	FREE
																</span>{" "}
																for education
															</span>
														</p>
														<p className="flex items-center gap-2">
															<Rocket className="w-4 h-4 text-purple-400" />
															<span>
																Revolutionizing education with cutting-edge
																technology
															</span>
														</p>
													</motion.div>
												</>
											)}
										</div>
									</div>
								</motion.div>
							</div>

							{/* Stats Grid with Glitch Effect */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 2 }}
								className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
							>
								{stats.map((stat, index) => (
									<motion.div
										key={index}
										className="relative bg-slate-900/50 backdrop-blur rounded-lg p-4 border border-slate-700 overflow-hidden group"
										whileHover={{ scale: 1.05, borderColor: "#a855f7" }}
									>
										<motion.div
											className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10"
											animate={{
												x: ["-100%", "100%"],
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
												repeatDelay: 2,
											}}
										/>
										<stat.icon className="w-6 h-6 text-purple-400 mb-2 relative z-10" />
										<div className="text-2xl font-bold text-white relative z-10">
											{stat.value}
										</div>
										<div className="text-xs text-slate-400 relative z-10">
											{stat.label}
										</div>
									</motion.div>
								))}
							</motion.div>
						</div>
					</div>
				</section>

				{/* Coding Puzzle Easter Egg */}
				<CodingPuzzleSection />

				{/* Tech Stack Section */}
				<section className="py-16 lg:py-24 bg-slate-900 relative">
					{/* Animated circuits background */}
					<motion.div
						className="absolute inset-0 opacity-5"
						animate={{
							backgroundPosition: ["0% 0%", "100% 100%"],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							repeatType: "reverse",
						}}
						style={{
							backgroundImage:
								"radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.5) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.5) 0%, transparent 50%)",
						}}
					/>

					<div className="container mx-auto px-4 relative z-10">
						<div className="max-w-6xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="text-center mb-12"
							>
								<div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full text-sm font-mono mb-4 border border-purple-500/20">
									<Cpu className="w-4 h-4 animate-pulse" />
									<span>Technology Arsenal</span>
								</div>
								<motion.h2
									className="text-3xl lg:text-5xl font-bold text-white mb-4"
									animate={{
										backgroundPosition: ["0%", "100%"],
									}}
									transition={{
										duration: 3,
										repeat: Infinity,
										repeatType: "reverse",
									}}
									style={{
										backgroundImage:
											"linear-gradient(90deg, #fff, #a855f7, #06b6d4, #fff)",
										backgroundSize: "200% auto",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
									}}
								>
									Cutting-Edge Tech Stack
								</motion.h2>
								<p className="text-slate-400 text-lg">
									Built with modern technologies for maximum performance and
									scalability
								</p>
							</motion.div>

							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{techStack.map((tech, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, scale: 0.8 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.05 }}
										whileHover={{
											scale: 1.1,
											rotate: [0, -5, 5, 0],
											transition: { duration: 0.3 },
										}}
										className="group relative bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-purple-500 transition-all duration-300 cursor-pointer"
									>
										<div className="text-center relative z-10">
											<motion.div
												className={`inline-block ${tech.color} px-3 py-1 rounded-lg text-sm font-bold mb-2`}
												whileHover={{
													boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
												}}
											>
												{tech.name}
											</motion.div>
											<p className="text-xs text-slate-400">{tech.category}</p>
										</div>
										<motion.div
											className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
											animate={{
												x: ["-100%", "100%"],
											}}
											transition={{
												duration: 1.5,
												repeat: Infinity,
											}}
										/>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Features Showcase */}
				<section className="py-16 lg:py-24 bg-slate-950 relative overflow-hidden">
					{/* Particle connections background */}
					<div className="absolute inset-0 opacity-10">
						{Array.from({ length: 10 }).map((_, i) => (
							<motion.div
								key={i}
								className="absolute w-px h-px bg-purple-500 rounded-full"
								initial={{
									x: Math.random() * 100 + "%",
									y: Math.random() * 100 + "%",
								}}
								animate={{
									scale: [1, 2, 1],
									opacity: [0.3, 1, 0.3],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									delay: i * 0.2,
								}}
							/>
						))}
					</div>

					<div className="container mx-auto px-4 relative z-10">
						<div className="max-w-6xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="text-center mb-12"
							>
								<div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-mono mb-4 border border-blue-500/20">
									<Rocket className="w-4 h-4 animate-bounce" />
									<span>System Architecture</span>
								</div>
								<h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
									Enterprise-Grade Features
								</h2>
								<p className="text-slate-400 text-lg">
									Every feature engineered for reliability and user experience
								</p>
							</motion.div>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{features.map((feature, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.1 }}
										whileHover={{
											y: -10,
											boxShadow: "0 20px 60px rgba(168, 85, 247, 0.3)",
										}}
										className={`${feature.bgColor} dark:bg-slate-800 rounded-xl p-6 border-2 border-transparent hover:border-purple-500 transition-all duration-300 group relative overflow-hidden`}
									>
										<motion.div
											className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity"
											animate={{
												scale: [1, 1.2, 1],
											}}
											transition={{
												duration: 2,
												repeat: Infinity,
											}}
										/>
										<div
											className={`w-12 h-12 ${feature.bgColor} dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10`}
										>
											<feature.icon className={`w-6 h-6 ${feature.color}`} />
										</div>
										<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">
											{feature.title}
										</h3>
										<p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
											{feature.description}
										</p>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Achievements Section */}
				<section className="py-16 lg:py-24 bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 relative overflow-hidden">
					{/* Glowing orbs */}
					<motion.div
						className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.6, 0.3],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
						}}
					/>
					<motion.div
						className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
						animate={{
							scale: [1.2, 1, 1.2],
							opacity: [0.6, 0.3, 0.6],
						}}
						transition={{
							duration: 5,
							repeat: Infinity,
						}}
					/>

					<div className="container mx-auto px-4 relative z-10">
						<div className="max-w-4xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="text-center mb-12"
							>
								<div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-sm font-mono mb-4 border border-yellow-500/20">
									<Award className="w-4 h-4" />
									<span>Key Achievements</span>
								</div>
								<h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
									Project Milestones
								</h2>
								<p className="text-slate-300 text-lg">
									Building the future of educational technology
								</p>
							</motion.div>

							<div className="grid md:grid-cols-2 gap-4">
								{achievements.map((achievement, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.05 }}
										whileHover={{ scale: 1.02, x: 5 }}
										className="flex items-start gap-3 bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700 hover:border-green-500 transition-all group"
									>
										<motion.div
											animate={{
												rotate: [0, 360],
												scale: [1, 1.2, 1],
											}}
											transition={{
												duration: 2,
												repeat: Infinity,
												delay: index * 0.1,
											}}
										>
											<CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
										</motion.div>
										<span className="text-slate-300 group-hover:text-white transition-colors">
											{achievement}
										</span>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Impact Section */}
				<section className="py-16 lg:py-24 bg-slate-900 relative">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto text-center">
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-sm font-mono mb-6 border border-red-500/20"
							>
								<motion.div
									animate={{
										scale: [1, 1.3, 1],
									}}
									transition={{
										duration: 1,
										repeat: Infinity,
									}}
								>
									<Heart className="w-4 h-4" />
								</motion.div>
								<span>Open Source Contribution</span>
							</motion.div>
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="text-3xl lg:text-5xl font-bold text-white mb-6"
							>
								Built with ❤️ for Education
							</motion.h2>
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.3 }}
								className="text-slate-300 text-lg leading-relaxed space-y-4 mb-8"
							>
								<p>
									This isn&apos;t just another school management system.
									It&apos;s a mission to democratize access to world-class
									educational technology.
								</p>
								<motion.p
									className="text-xl text-purple-400 font-semibold"
									animate={{
										textShadow: [
											"0 0 10px rgba(168, 85, 247, 0.5)",
											"0 0 20px rgba(168, 85, 247, 0.8)",
											"0 0 10px rgba(168, 85, 247, 0.5)",
										],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
									}}
								>
									Every line of code written to empower students, teachers, and
									schools worldwide — completely free of cost.
								</motion.p>
								<p>
									By leveraging modern web technologies and cloud
									infrastructure, I&apos;ve created a platform that rivals
									expensive commercial solutions, but remains accessible to
									institutions regardless of their budget.
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.5 }}
								className="flex flex-wrap justify-center gap-4 mb-8"
							>
								<motion.div
									className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg px-6 py-3 flex items-center gap-2"
									whileHover={{ scale: 1.1, rotate: 2 }}
								>
									<Coffee className="w-5 h-5 text-white" />
									<span className="text-white font-semibold">
										Countless Hours
									</span>
								</motion.div>
								<motion.div
									className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg px-6 py-3 flex items-center gap-2"
									whileHover={{ scale: 1.1, rotate: -2 }}
								>
									<Star className="w-5 h-5 text-white" />
									<span className="text-white font-semibold">
										Passion Project
									</span>
								</motion.div>
								<motion.div
									className="bg-gradient-to-r from-pink-600 to-red-600 rounded-lg px-6 py-3 flex items-center gap-2"
									whileHover={{ scale: 1.1, rotate: 2 }}
								>
									<Target className="w-5 h-5 text-white" />
									<span className="text-white font-semibold">
										Education First
									</span>
								</motion.div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* Contact/Connect Section */}
				<section className="py-16 lg:py-24 bg-slate-950 relative overflow-hidden">
					{/* Animated grid background */}
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
							backgroundImage:
								"radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.15) 1px, transparent 0)",
							backgroundSize: "40px 40px",
						}}
					/>

					<div className="container mx-auto px-4 relative z-10">
						<div className="max-w-4xl mx-auto">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 lg:p-12 border border-purple-500/20 shadow-2xl relative overflow-hidden"
							>
								{/* Animated border glow */}
								<motion.div
									className="absolute inset-0 border-2 border-purple-500/50 rounded-2xl"
									animate={{
										boxShadow: [
											"0 0 20px rgba(168, 85, 247, 0.3)",
											"0 0 40px rgba(168, 85, 247, 0.6)",
											"0 0 20px rgba(168, 85, 247, 0.3)",
										],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
									}}
								/>
								<div className="text-center mb-8 relative z-10">
									<h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
										Let&apos;s Connect
									</h2>
									<p className="text-slate-300 text-lg">
										Interested in collaborating or want to learn more about the
										project?
									</p>
								</div>
								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
									<motion.a
										href="https://github.com/CypherNinjaa"
										target="_blank"
										rel="noopener noreferrer"
										whileHover={{ scale: 1.1, y: -5 }}
										whileTap={{ scale: 0.95 }}
										className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg p-4 transition-all group"
									>
										<Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
										<span>GitHub</span>
									</motion.a>
									<motion.a
										href="https://www.linkedin.com/in/vikashintech/"
										target="_blank"
										rel="noopener noreferrer"
										whileHover={{ scale: 1.1, y: -5 }}
										whileTap={{ scale: 0.95 }}
										className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 transition-all group"
									>
										<Linkedin className="w-5 h-5 group-hover:rotate-12 transition-transform" />
										<span>LinkedIn</span>
									</motion.a>
									<motion.a
										href="mailto:vikashkelly@gmail.com"
										whileHover={{ scale: 1.1, y: -5 }}
										whileTap={{ scale: 0.95 }}
										className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-4 transition-all group"
									>
										<Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
										<span>Email</span>
									</motion.a>
								</div>{" "}
								<motion.div
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.5 }}
									className="mt-8 text-center relative z-10"
								>
									<p className="text-slate-300 text-sm">
										🚀 Open to collaboration • 💼 Available for consulting • 🎓
										Education advocate
									</p>
								</motion.div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* Code Snippet Footer */}
				<section className="py-12 bg-slate-900 border-t border-slate-800">
					<div className="container mx-auto px-4">
						<div className="max-w-4xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="bg-slate-950 rounded-lg p-6 border border-slate-800 font-mono text-sm relative overflow-hidden"
							>
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-transparent"
									animate={{
										x: ["-100%", "100%"],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										repeatDelay: 3,
									}}
								/>
								<div className="flex items-center gap-2 text-green-400 mb-2 relative z-10">
									<span>$</span>
									<span className="text-white">git commit -m</span>
									<span className="text-yellow-400">
										&quot;Revolutionizing education, one commit at a time
										🚀&quot;
									</span>
								</div>
								<div className="text-slate-500 ml-4 relative z-10">
									[main 1a2b3c4] Revolutionizing education, one commit at a time
									🚀
								</div>
								<div className="text-slate-500 ml-4 relative z-10">
									1000+ files changed, 50000+ insertions(+)
								</div>
							</motion.div>
						</div>
					</div>
				</section>
			</main>

			<ModernFooter />
		</div>
	);
}
