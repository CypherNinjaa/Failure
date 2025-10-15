import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import UpdatePrompt from "@/components/UpdatePrompt";
import OfflineIndicator from "@/components/OfflineIndicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "HCS - Happy Child School",
	description:
		"Happy Child School Management System - Manage students, teachers, attendance, and more",
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
		icon: "/icons/icon-192x192.png",
		shortcut: "/icons/icon-192x192.png",
		apple: "/icons/icon-192x192.png",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
	themeColor: "#2979FF",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<head>
					<link rel="manifest" href="/manifest.json" />
					<meta name="theme-color" content="#2979FF" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta name="apple-mobile-web-app-title" content="HCS School" />
					<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
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
				<body className={inter.className}>
					<UpdatePrompt />
					<OfflineIndicator />
					{children}
					<PWAInstallPrompt />
					<ToastContainer position="bottom-right" theme="dark" />
				</body>
			</html>
		</ClerkProvider>
	);
}
