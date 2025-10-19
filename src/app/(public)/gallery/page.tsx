import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { GalleryHero } from "@/components/ui/gallery-hero";
import { FilterableAlbums } from "@/components/ui/filterable-albums";
import { VideoGallery } from "@/components/ui/video-gallery";
import { VirtualTour } from "@/components/ui/virtual-tour";

export default function GalleryPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />

			<main className="pt-20">
				{/* Hero Section */}
				<GalleryHero />

				{/* Filterable Albums */}
				<FilterableAlbums />

				{/* Video Gallery */}
				<VideoGallery />

				{/* 360° Virtual School Tour */}
				<VirtualTour />
			</main>

			<ModernFooter />
		</div>
	);
}
