import prisma from "@/lib/prisma";
import VideoGallery from "./video-gallery";

export default async function VideoGalleryServer() {
	// Fetch VIDEO type gallery albums that are active, sorted by displayOrder and featured status
	const videos = await prisma.galleryAlbum.findMany({
		where: {
			type: "VIDEO",
			isActive: true,
		},
		orderBy: [
			{ featured: "desc" },
			{ displayOrder: "desc" },
			{ createdAt: "desc" },
		],
		select: {
			id: true,
			src: true,
			title: true,
			description: true,
			category: true,
			duration: true,
			views: true,
			featured: true,
			createdAt: true,
			thumbnail: true,
		},
	});

	// Transform data to match the client component's expected interface
	const transformedVideos = videos.map((video) => ({
		id: video.id.toString(),
		title: video.title,
		description: video.description,
		category: video.category.toLowerCase() as
			| "all"
			| "events"
			| "academics"
			| "sports"
			| "testimonials",
		duration: video.duration || "0:00",
		views: video.views,
		uploadDate: new Date(video.createdAt).toLocaleDateString(),
		thumbnail: video.src, // Using src as thumbnail
		thumbnailGradient: video.thumbnail || "from-blue-600 to-purple-600",
		featured: video.featured,
	}));

	return <VideoGallery videos={transformedVideos} />;
}
