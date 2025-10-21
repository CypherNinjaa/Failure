import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import UpdatePrompt from "@/components/UpdatePrompt";
import OfflineIndicator from "@/components/OfflineIndicator";
import { ThemeProvider } from "@/lib/theme-provider-new";
import dynamic from "next/dynamic";
import FestivalProvider from "@/components/festival/FestivalProvider";

const PWAPerformanceMonitor = dynamic(
	() => import("@/components/PWAPerformanceMonitor"),
	{ ssr: false }
);

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
	preload: true,
});

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NODE_ENV === "production"
			? "https://happychild.in"
			: "http://localhost:3000"
	),
	title: "HCS - Happy Child School",
	description:
		"Happy Child School Management System - Manage students, teachers, attendance, and more. A comprehensive school management system providing quality education with modern facilities.",
	keywords: [
		"school",
		"education",
		"management",
		"students",
		"teachers",
		"academic excellence",
		"digital learning",
		"school portal",
	],
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "HCS School",
	},
	formatDetection: {
		telephone: false,
	},
	icons: {
		icon: "/logo.png",
		shortcut: "/logo.png",
		apple: "/logo.png",
		other: {
			rel: "apple-touch-icon-precomposed",
			url: "/logo.png",
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://happychild.in",
		title: "Happy Child School - Excellence in Education",
		description:
			"Leading educational institution providing comprehensive learning experience with modern facilities and innovative teaching methods.",
		siteName: "Happy Child School",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#417AF5" },
		{ media: "(prefers-color-scheme: dark)", color: "#5a8bff" },
	],
	colorScheme: "light dark",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: undefined,
				variables: {
					colorPrimary: "#417AF5",
				},
			}}
			signInUrl="/sign-in"
		>
			<html lang="en" suppressHydrationWarning className={inter.variable}>
				<head>
					<link rel="manifest" href="/manifest.json" />
					<meta name="theme-color" content="#417AF5" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta name="apple-mobile-web-app-title" content="HCS School" />
					<link rel="apple-touch-icon" href="/logo.png" />
					<link rel="icon" type="image/png" href="/logo.png" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossOrigin="anonymous"
					/>
					{/* Preconnect to Clerk for faster loading */}
					<link rel="preconnect" href="https://clerk.accounts.dev" />
					<link rel="dns-prefetch" href="https://clerk.accounts.dev" />
					<script
						dangerouslySetInnerHTML={{
							__html: `
								if ('serviceWorker' in navigator) {
									window.addEventListener('load', function() {
										navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
											.then(function(registration) {
												console.log('Service Worker registered successfully:', registration.scope);
												
												// Check for updates every hour
												setInterval(function() {
													registration.update();
												}, 3600000);
											})
											.catch(function(error) {
												console.log('Service Worker registration failed:', error);
											});
									});
								}
							`,
						}}
					/>
				</head>
				<body
					className={`${inter.className} min-h-screen bg-background font-sans antialiased overflow-x-hidden`}
				>
					<ThemeProvider defaultTheme="system" storageKey="hcs-theme">
						<FestivalProvider>
							<PWAPerformanceMonitor />
							<UpdatePrompt />
							<OfflineIndicator />
							<div className="relative flex min-h-screen flex-col w-full">
								<main className="flex-1 w-full">{children}</main>
							</div>
							<PWAInstallPrompt />
							<ToastContainer position="bottom-right" theme="dark" />
						</FestivalProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
