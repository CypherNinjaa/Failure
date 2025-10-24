import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { GalleryHero } from "@/components/ui/gallery-hero";
import FilterableAlbumsServer from "@/components/ui/filterable-albums-server";
import VideoGalleryServer from "@/components/ui/video-gallery-server";
// import { VirtualTour } from "@/components/ui/virtual-tour";
import { Suspense } from "react";

function AlbumsLoadingState() {
	return (
		<section className="py-16 lg:py-24 bg-muted/30">
			<div className="container">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						Loading Photo Albums...
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={i}
							className="aspect-[4/3] bg-muted/50 animate-pulse rounded-lg"
						/>
					))}
				</div>
			</div>
		</section>
	);
}

function VideosLoadingState() {
	return (
		<section className="py-16 lg:py-24">
			<div className="container">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
						Loading Video Gallery...
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="aspect-video bg-muted/50 animate-pulse rounded-lg"
						/>
					))}
				</div>
			</div>
		</section>
	);
}

export default function GalleryPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />

			<main className="pt-20">
				{/* Hero Section */}
				<GalleryHero />

				{/* Filterable Albums - Server Component with Suspense */}
				<Suspense fallback={<AlbumsLoadingState />}>
					<FilterableAlbumsServer />
				</Suspense>

				{/* Video Gallery - Server Component with Suspense */}
				<Suspense fallback={<VideosLoadingState />}>
					<VideoGalleryServer />
				</Suspense>

				{/* 360° Virtual School Tour */}
				{/* <VirtualTour /> */}
			</main>

			<ModernFooter />
		</div>
	);
}
