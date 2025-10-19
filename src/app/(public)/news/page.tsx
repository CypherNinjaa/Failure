import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { NewsHero } from "@/components/ui/news-hero";
import { LiveNewsFeed } from "@/components/ui/live-news-feed";
import { CircularDownloads } from "@/components/ui/circular-downloads";
import { EventInvites } from "@/components/ui/event-invites";

export default function NewsPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />

			<main className="pt-20">
				{/* Hero Section */}
				<NewsHero />

				{/* Live News Feed */}
				<LiveNewsFeed />

				{/* Circular Downloads */}
				<CircularDownloads />

				{/* RSVP Event Invites */}
				<EventInvites />
			</main>

			<ModernFooter />
		</div>
	);
}
