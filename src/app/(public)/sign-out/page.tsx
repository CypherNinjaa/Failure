"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignOutPage() {
	const { isLoaded, isSignedIn } = useAuth();
	const { signOut } = useClerk();
	const router = useRouter();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isLoaded) return;

		// If not signed in, redirect to home
		if (!isSignedIn) {
			console.log("[Sign Out] User already signed out, redirecting to home");
			router.replace("/");
			return;
		}

		// Perform sign out
		const performSignOut = async () => {
			if (isSigningOut) return;
			
			setIsSigningOut(true);
			console.log("[Sign Out] Starting sign out process");

			try {
				// Sign out from Clerk
				await signOut();
				
				// Clear any local storage items
				localStorage.removeItem("pwa-install-dismissed");
				localStorage.removeItem("pwa-install-date");
				localStorage.removeItem("pwa-page-views");
				localStorage.removeItem("pwa-performance-metrics");
				
				// Clear session storage
				sessionStorage.clear();

				console.log("[Sign Out] Sign out successful");

				// Redirect to home page
				setTimeout(() => {
					router.replace("/");
				}, 500);
			} catch (err) {
				console.error("[Sign Out] Error during sign out:", err);
				setError("Failed to sign out. Please try again.");
				setIsSigningOut(false);
			}
		};

		performSignOut();
	}, [isLoaded, isSignedIn, signOut, router, isSigningOut]);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center max-w-md">
					<div className="text-red-500 text-6xl mb-4">⚠️</div>
					<h2 className="text-xl font-semibold mb-2">Sign Out Error</h2>
					<p className="text-muted-foreground mb-4">{error}</p>
					<button
						onClick={() => window.location.href = "/"}
						className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
					>
						Go to Home
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
				<h2 className="text-xl font-semibold mb-2">Signing you out</h2>
				<p className="text-muted-foreground">
					Please wait while we sign you out...
				</p>
				<div className="mt-4 flex justify-center gap-1">
					<div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
					<div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
					<div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
				</div>
			</div>
		</div>
	);
}
