"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Menu,
	X,
	Home,
	BookOpen,
	Users,
	MapPin,
	Phone,
	LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
	className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
	const [isOpen, setIsOpen] = useState(false);

	const navItems = [
		{ href: "/", label: "Home", icon: Home },
		{ href: "/about", label: "About", icon: Users },
		{ href: "/academics", label: "Academics", icon: BookOpen },
		{ href: "/facilities", label: "Facilities", icon: MapPin },
		{ href: "/admissions", label: "Admissions", icon: Users },
		{ href: "/contact", label: "Contact", icon: Phone },
	];

	return (
		<div className={cn("lg:hidden", className)}>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setIsOpen(!isOpen)}
				className="h-10 w-10 p-0 hover:bg-primary/10"
			>
				{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</Button>

			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
						onClick={() => setIsOpen(false)}
					/>

					{/* Navigation Panel */}
					<div className="fixed top-0 right-0 h-full w-72 bg-card border-l border-border shadow-xl z-50 transform transition-transform duration-300 ease-out">
						<div className="flex flex-col h-full">
							{/* Header */}
							<div className="flex items-center justify-between p-6 border-b border-border">
								<div className="flex items-center space-x-2">
									<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
										<span className="text-white font-bold text-sm">HCS</span>
									</div>
									<span className="font-semibold text-lg">Menu</span>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsOpen(false)}
									className="h-8 w-8 p-0"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>

							{/* Navigation Items */}
							<nav className="flex-1 p-4 space-y-2">
								{navItems.map((item) => {
									const Icon = item.icon;
									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={() => setIsOpen(false)}
											className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary/10 transition-colors group touch-target"
										>
											<Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
											<span className="font-medium group-hover:text-primary transition-colors">
												{item.label}
											</span>
										</Link>
									);
								})}
							</nav>

							{/* Footer Actions */}
							<div className="p-4 border-t border-border space-y-3">
								<Button
									asChild
									variant="outline"
									className="w-full justify-start space-x-2"
									onClick={() => setIsOpen(false)}
								>
									<Link href="/sign-in">
										<LogIn className="h-4 w-4" />
										<span>Portal Login</span>
									</Link>
								</Button>
								<Button
									asChild
									className="w-full bg-primary hover:bg-primary/90"
									onClick={() => setIsOpen(false)}
								>
									<Link href="/admissions">Apply Now</Link>
								</Button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
