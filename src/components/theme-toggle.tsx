"use client";

import { useTheme } from "@/lib/theme-provider-new";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button
				variant="outline"
				size="sm"
				className="w-10 h-10 rounded-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
			>
				<Monitor className="h-4 w-4" />
			</Button>
		);
	}

	const cycleTheme = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	};

	const getIcon = () => {
		if (theme === "system") {
			return <Monitor className="h-4 w-4 text-purple-500" />;
		}
		return resolvedTheme === "light" ? (
			<Sun className="h-4 w-4 text-yellow-500" />
		) : (
			<Moon className="h-4 w-4 text-blue-400" />
		);
	};

	const getTooltipText = () => {
		if (theme === "light") return "Switch to Dark Mode";
		if (theme === "dark") return "Switch to System Mode";
		return "Switch to Light Mode";
	};

	const getBorderColor = () => {
		if (theme === "system")
			return "border-purple-400/30 shadow-[0_0_8px_rgba(168,85,247,0.3)]";
		return resolvedTheme === "dark"
			? "border-blue-400/30 shadow-[0_0_8px_rgba(96,165,250,0.3)]"
			: "border-yellow-400/30 shadow-[0_0_8px_rgba(251,191,36,0.3)]";
	};

	return (
		<div className="relative group">
			<Button
				variant="outline"
				size="sm"
				onClick={cycleTheme}
				className="w-10 h-10 rounded-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:scale-110 active:scale-95 relative overflow-hidden"
				title={getTooltipText()}
			>
				<div className="relative z-10 transition-transform duration-300 group-hover:rotate-12">
					{getIcon()}
				</div>

				{/* Animated background effect */}
				<div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				{/* Theme indicator ring */}
				<div
					className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${getBorderColor()}`}
				/>
			</Button>

			{/* Tooltip */}
			<div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-border shadow-lg">
				{getTooltipText()}
			</div>
		</div>
	);
}
