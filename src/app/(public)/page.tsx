"use client";

import { ModernHeader } from "@/components/ui/modern-header";
import { MobileHero } from "@/components/ui/mobile-hero";
import { NewsTicker } from "@/components/ui/news-ticker";
import { StatsSection } from "@/components/ui/stats-section";
import { GalleryCarousel } from "@/components/ui/gallery-carousel";
import { EventsSection } from "@/components/ui/events-section";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { StarPerformers } from "@/components/ui/star-performers";
import { ModernFooter } from "@/components/ui/modern-footer";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />
			<MobileHero />
			<GalleryCarousel />
			<NewsTicker />
			<StatsSection />
			<StarPerformers />
			<EventsSection />
			<TestimonialsSection />
			<ModernFooter />
		</div>
	);
}
