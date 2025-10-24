"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

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
		// { name: "Academics", href: "/academics" },
		// { name: "Activities", href: "/co-curricular" },
		// { name: "Facilities", href: "/facilities" },
		{ name: "Admissions", href: "/admissions" },
		// { name: "News", href: "/news" },
		// { name: "Blog", href: "/blog" },
		{ name: "Gallery", href: "/gallery" },
		{ name: "Contact", href: "/contact" },
	];

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return (
			<header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg shadow-lg border-b border-border">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16 md:h-20 gap-4">
						<Link href="/" className="flex items-center gap-3 min-w-fit">
							<Image
								src="/logo.png"
								alt="Happy Child School Logo"
								width={48}
								height={48}
								className="w-10 h-10 md:w-12 md:h-12 object-contain flex-shrink-0"
							/>
							<div className="hidden sm:flex sm:flex-col">
								<h1 className="font-bold text-xl md:text-2xl whitespace-nowrap bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
									Happy Child School
								</h1>
								<p className="text-xs text-muted-foreground whitespace-nowrap">
									Excellence in Education
								</p>
							</div>
						</Link>
						<div className="flex items-center space-x-2 md:space-x-4">
							<div className="hidden sm:flex items-center space-x-2">
								<Button variant="ghost" size="sm" asChild>
									<Link href="/sign-in">Portal Login</Link>
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
				<div className="flex items-center justify-between h-16 md:h-20 gap-4">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3 group min-w-fit">
						<Image
							src="/logo.png"
							alt="Happy Child School Logo"
							width={48}
							height={48}
							className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
						/>
						<div className="hidden sm:flex sm:flex-col">
							<h1 className="font-bold text-xl md:text-2xl whitespace-nowrap bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
								Happy Child School
							</h1>
							<p className="text-xs text-muted-foreground whitespace-nowrap">
								Excellence in Education
							</p>
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
						<div className="hidden sm:flex items-center space-x-2">
							<Button
								variant="ghost"
								size="sm"
								className="text-foreground hover:text-primary"
								asChild
							>
								<Link href="/sign-in">Portal Login</Link>
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
										href="/sign-in"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Portal Login
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
