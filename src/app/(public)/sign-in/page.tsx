import { SignIn } from "@clerk/nextjs";
import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";

export default function SignInPage() {
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
