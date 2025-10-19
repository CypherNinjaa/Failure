"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function AuthCallbackPage() {
	const { isLoaded, userId, sessionId } = useAuth();
	const { user, isLoaded: userLoaded } = useUser();
	const router = useRouter();
	const [redirectAttempts, setRedirectAttempts] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const performRedirect = useCallback(() => {
		if (!isLoaded || !userLoaded) return;

		// If not authenticated, redirect to sign-in
		if (!userId || !sessionId) {
			console.log(
				"[Auth Callback] User not authenticated, redirecting to sign-in"
			);
			router.replace("/sign-in");
			return;
		}

		// Get user role from public metadata
		const role = (user?.publicMetadata?.role as string) || null;

		console.log("[Auth Callback] User authenticated, role:", role);

		// Redirect to appropriate dashboard based on role
		if (role && ["admin", "teacher", "student", "parent"].includes(role)) {
			console.log(`[Auth Callback] Redirecting to /${role} dashboard`);
			router.replace(`/${role}`);
		} else {
			// If no valid role is set, show error
			console.error("[Auth Callback] No valid role found");
			setError("No role assigned. Please contact administrator.");
			setTimeout(() => {
				router.replace("/");
			}, 3000);
		}
	}, [isLoaded, userLoaded, userId, sessionId, user, router]);

	useEffect(() => {
		// Wait for both auth and user to be loaded
		if (!isLoaded || !userLoaded) return;

		// Prevent infinite loops
		if (redirectAttempts >= 3) {
			setError("Failed to redirect after multiple attempts. Please try again.");
			setTimeout(() => {
				router.replace("/sign-in");
			}, 3000);
			return;
		}

		// Add a small delay to ensure session is fully established
		const timer = setTimeout(() => {
			performRedirect();
			setRedirectAttempts((prev) => prev + 1);
		}, 500);

		return () => clearTimeout(timer);
	}, [isLoaded, userLoaded, performRedirect, redirectAttempts, router]);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center max-w-md">
					<div className="text-red-500 text-6xl mb-4">⚠️</div>
					<h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
					<p className="text-muted-foreground mb-4">{error}</p>
					<p className="text-sm text-muted-foreground">
						Redirecting you to sign-in page...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
				<h2 className="text-xl font-semibold mb-2">
					Setting up your dashboard
				</h2>
				<p className="text-muted-foreground">
					Please wait while we redirect you...
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
