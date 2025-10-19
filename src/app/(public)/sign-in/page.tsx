"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
	const { isLoaded, isSignedIn, sessionId } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isRedirecting, setIsRedirecting] = useState(false);

	useEffect(() => {
		// More robust check for authenticated users
		if (isLoaded && isSignedIn && sessionId) {
			setIsRedirecting(true);

			// Check if there's a redirect URL in the query params
			const redirectUrl = searchParams.get("redirect_url");

			if (redirectUrl) {
				// Decode and validate the redirect URL
				try {
					const decodedUrl = decodeURIComponent(redirectUrl);
					// Only allow internal redirects
					if (decodedUrl.startsWith("/")) {
						router.replace(decodedUrl);
						return;
					}
				} catch (e) {
					console.error("Invalid redirect URL:", e);
				}
			}

			// Default redirect to auth callback
			router.replace("/auth-callback");
		}
	}, [isLoaded, isSignedIn, sessionId, router, searchParams]);

	// Show loading state while checking authentication
	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Checking authentication...</p>
				</div>
			</div>
		);
	}

	// If already signed in, show redirect message
	if (isSignedIn || isRedirecting) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Redirecting to dashboard...</p>
					<p className="text-xs text-muted-foreground mt-2">Please wait...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />

			<main className="pt-24 pb-16">
				<div className="container mx-auto px-4">
					<div className="flex justify-center">
						<div className="w-full max-w-md">
							<h1 className="text-3xl font-bold text-center mb-2">
								Welcome Back
							</h1>
							<p className="text-muted-foreground text-center mb-8">
								Sign in to access your dashboard
							</p>

							<SignIn
								appearance={{
									elements: {
										rootBox: "w-full",
										card: "shadow-xl border border-border",
										headerTitle: "text-foreground",
										headerSubtitle: "text-muted-foreground",
										formButtonPrimary:
											"bg-primary hover:bg-primary/90 text-primary-foreground",
										formFieldInput:
											"border-input bg-background text-foreground",
										footerActionLink: "text-primary hover:text-primary/90",
										identityPreviewText: "text-foreground",
										formFieldLabel: "text-foreground",
									},
								}}
								routing="hash"
								signUpUrl={undefined}
								forceRedirectUrl="/auth-callback"
								fallbackRedirectUrl="/auth-callback"
							/>
						</div>
					</div>
				</div>
			</main>

			<ModernFooter />
		</div>
	);
}
