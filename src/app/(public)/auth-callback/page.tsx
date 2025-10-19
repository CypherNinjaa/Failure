"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
	const { isLoaded, userId } = useAuth();
	const { user } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (isLoaded) {
			if (!userId) {
				// If not authenticated, redirect to homepage
				router.push("/");
				return;
			}

			// Get user role from public metadata
			const role = (user?.publicMetadata?.role as string) || null;

			// Redirect to appropriate dashboard based on role
			if (role) {
				router.push(`/${role}`);
			} else {
				// If no role is set, redirect to homepage
				router.push("/");
			}
		}
	}, [isLoaded, userId, user, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-muted-foreground">
					Redirecting to your dashboard...
				</p>
			</div>
		</div>
	);
}
