"use client";

import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { ContactHero } from "@/components/ui/contact-hero";
import { ContactForm } from "@/components/ui/contact-form";
import { ContactMap } from "@/components/ui/contact-map";
import { ContactInfo } from "@/components/ui/contact-info";
import { SocialMedia } from "@/components/ui/social-media";

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />
			<ContactHero />
			<div className="container mx-auto px-4 py-16 space-y-16">
				<ContactInfo />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<ContactForm />
					<ContactMap />
				</div>
				<SocialMedia />
			</div>
			<ModernFooter />
		</div>
	);
}
