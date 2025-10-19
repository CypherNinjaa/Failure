import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { BlogHero } from "@/components/ui/blog-hero";
import { FeaturedArticles } from "@/components/ui/featured-articles";
import { BlogGrid } from "@/components/ui/blog-grid";
import { BlogCategories } from "@/components/ui/blog-categories";
import { BlogNewsletter } from "@/components/ui/blog-newsletter";

export default function BlogPage() {
	return (
		<main className="min-h-screen bg-background">
			<ModernHeader />

			{/* Hero Section */}
			<BlogHero />

			{/* Featured Articles Carousel */}
			<FeaturedArticles />

			{/* Blog Categories */}
			<BlogCategories />

			{/* Blog Posts Grid */}
			<BlogGrid />

			{/* Newsletter Subscription */}
			<BlogNewsletter />

			<ModernFooter />
		</main>
	);
}
