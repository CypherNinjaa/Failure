"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap } from "lucide-react";

export function ModernHeader() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setMounted(true);

		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		// Set initial scroll state
		if (typeof window !== "undefined") {
			setIsScrolled(window.scrollY > 20);
		}

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navItems = [
		{ name: "Home", href: "/" },
		{ name: "About", href: "/about" },
		{ name: "Academics", href: "/academics" },
		{ name: "Activities", href: "/co-curricular" },
		{ name: "Facilities", href: "/facilities" },
		{ name: "Admissions", href: "/admissions" },
		{ name: "News", href: "/news" },
		{ name: "Blog", href: "/blog" },
		{ name: "Gallery", href: "/gallery" },
		{ name: "Contact", href: "/contact" },
	];

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return (
			<header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg shadow-lg border-b border-border">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16 md:h-20">
						<Link href="/" className="flex items-center space-x-3">
							<div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
								<GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-white" />
							</div>
							<div className="hidden sm:block">
								<div className="font-bold text-lg md:text-xl text-foreground">
									Happy Child School
								</div>
								<div className="text-xs text-muted-foreground">
									Excellence in Education
								</div>
							</div>
						</Link>
						<div className="flex items-center space-x-2 md:space-x-4">
							<ThemeToggle />
							<div className="hidden sm:flex items-center space-x-2">
								<Button variant="ghost" size="sm" asChild>
									<Link href="/sign-in">Portal Login</Link>
								</Button>
								<Button
									size="sm"
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
									asChild
								>
									<Link href="/admissions">Apply Now</Link>
								</Button>
							</div>
							<Button variant="ghost" size="sm" className="lg:hidden p-2">
								<Menu className="w-5 h-5" />
							</Button>
						</div>
					</div>
				</div>
			</header>
		);
	}

	return (
		<motion.header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-border"
					: "bg-transparent"
			}`}
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6 }}
		>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16 md:h-20">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-3 group">
						<div className="relative">
							<div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
								<GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-white" />
							</div>
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
						</div>
						<div className="hidden sm:block">
							<div className="font-bold text-lg md:text-xl text-foreground">
								Happy Child School
							</div>
							<div className="text-xs text-muted-foreground">
								Excellence in Education
							</div>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center space-x-1">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-muted ${
										isActive
											? "text-primary bg-muted"
											: "text-foreground hover:text-primary"
									}`}
								>
									{item.name}
								</Link>
							);
						})}
					</nav>

					{/* Right Section */}
					<div className="flex items-center space-x-2 md:space-x-4">
						<ThemeToggle />

						<div className="hidden sm:flex items-center space-x-2">
							<Button
								variant="ghost"
								size="sm"
								className="text-foreground hover:text-primary"
								asChild
							>
								<Link href="/sign-in">Portal Login</Link>
							</Button>

							<Button
								size="sm"
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								asChild
							>
								<Link href="/admissions">Apply Now</Link>
							</Button>
						</div>

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="sm"
							className="lg:hidden p-2"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-border"
					>
						<div className="container mx-auto px-4 py-4">
							<nav className="space-y-2">
								{navItems.map((item) => {
									const isActive = pathname === item.href;
									return (
										<Link
											key={item.name}
											href={item.href}
											className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
												isActive
													? "text-primary bg-muted"
													: "text-foreground hover:bg-muted"
											}`}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											{item.name}
										</Link>
									);
								})}
							</nav>

							<div className="flex flex-col space-y-2 pt-4 border-t border-border">
								<Button
									variant="ghost"
									className="justify-start text-foreground"
									asChild
								>
									<Link
										href="/login"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Portal Login
									</Link>
								</Button>
								<Button
									className="justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
									asChild
								>
									<Link
										href="/admissions"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Apply Now
									</Link>
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
