"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	systemTheme: "light" | "dark" | undefined;
	resolvedTheme: "light" | "dark" | undefined;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
	systemTheme: undefined,
	resolvedTheme: undefined,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "hcs-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		// Only access localStorage on client-side
		if (typeof window !== "undefined") {
			try {
				const savedTheme = localStorage.getItem(storageKey) as Theme;
				if (
					savedTheme &&
					(savedTheme === "light" ||
						savedTheme === "dark" ||
						savedTheme === "system")
				) {
					return savedTheme;
				}
			} catch (error) {
				console.warn("Failed to load theme from localStorage:", error);
			}
		}
		return defaultTheme;
	});

	const [systemTheme, setSystemTheme] = useState<
		"light" | "dark" | undefined
	>();
	const [resolvedTheme, setResolvedTheme] = useState<
		"light" | "dark" | undefined
	>();
	const [mounted, setMounted] = useState(false);

	// Initialize theme from localStorage on mount
	useEffect(() => {
		setMounted(true);
		// No need to check localStorage again since we already did it in useState
	}, []);

	// Apply theme to DOM
	useEffect(() => {
		if (!mounted) return;

		const root = window.document.documentElement;

		// Remove all theme classes first
		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			setSystemTheme(systemTheme);
			setResolvedTheme(systemTheme);
			root.classList.add(systemTheme);
			return;
		}

		setResolvedTheme(theme);
		root.classList.add(theme);
	}, [theme, mounted]);

	// Listen for system theme changes
	useEffect(() => {
		if (!mounted) return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = () => {
			const systemTheme = mediaQuery.matches ? "dark" : "light";
			setSystemTheme(systemTheme);

			if (theme === "system") {
				setResolvedTheme(systemTheme);
				const root = window.document.documentElement;
				root.classList.remove("light", "dark");
				root.classList.add(systemTheme);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		handleChange();

		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme, mounted]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			try {
				localStorage.setItem(storageKey, theme);
			} catch (error) {
				console.warn("Failed to save theme to localStorage:", error);
			}
			setTheme(theme);
		},
		systemTheme,
		resolvedTheme,
	};

	// Prevent hydration mismatch by returning a neutral state during SSR
	if (!mounted) {
		return (
			<ThemeProviderContext.Provider value={initialState}>
				{children}
			</ThemeProviderContext.Provider>
		);
	}

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
