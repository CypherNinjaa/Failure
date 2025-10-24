import prisma from "@/lib/prisma";
import FilterableAlbums from "./filterable-albums";

export default async function FilterableAlbumsServer() {
	// Fetch IMAGE type gallery albums that are active, sorted by displayOrder and featured status
	const albums = await prisma.galleryAlbum.findMany({
		where: {
			type: "IMAGE",
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
			eventDate: true,
			photographer: true,
			likes: true,
			views: true,
			thumbnail: true,
		},
	});

	// Transform data to match the client component's expected interface
	const transformedAlbums = albums.map((album) => ({
		id: album.id.toString(),
		src: album.src,
		title: album.title,
		category: album.category.toLowerCase() as
			| "all"
			| "events"
			| "sports"
			| "academics"
			| "cultural"
			| "achievements",
		date: album.eventDate ? new Date(album.eventDate).toLocaleDateString() : "",
		likes: album.likes,
		views: album.views,
		photographer: album.photographer || "",
		description: album.description,
		color: album.thumbnail || "from-blue-600 to-purple-600",
	}));

	return <FilterableAlbums albums={transformedAlbums} />;
}
