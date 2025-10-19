"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
	const { isSignedIn, user, isLoaded } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (isLoaded && isSignedIn && user) {
			// Get user role and redirect to appropriate dashboard
			const role = (user.publicMetadata?.role as string) || "student";
			router.push(`/${role}`);
		}
	}, [isLoaded, isSignedIn, user, router]);

	// Show loading state while checking authentication
	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	// If already signed in, don't show the sign-in form (redirect happening)
	if (isSignedIn) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Redirecting to dashboard...</p>
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
						<SignIn
							appearance={{
								elements: {
									rootBox: "w-full max-w-md",
									card: "shadow-xl border border-border",
									headerTitle: "text-foreground",
									headerSubtitle: "text-muted-foreground",
									formButtonPrimary:
										"bg-primary hover:bg-primary/90 text-primary-foreground",
									formFieldInput: "border-input bg-background text-foreground",
									footerActionLink: "text-primary hover:text-primary/90",
									identityPreviewText: "text-foreground",
									formFieldLabel: "text-foreground",
								},
							}}
							routing="hash"
							forceRedirectUrl="/auth-callback"
							fallbackRedirectUrl="/auth-callback"
						/>
					</div>
				</div>
			</main>

			<ModernFooter />
		</div>
	);
}
