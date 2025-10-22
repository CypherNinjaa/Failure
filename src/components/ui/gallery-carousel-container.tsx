import prisma from "@/lib/prisma";
import { GalleryCarouselClient } from "./gallery-carousel-client";

// Fallback gallery items (used when database is empty or not migrated yet)
const fallbackGalleryItems = [
	{
		id: 1,
		type: "image" as const,
		src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop&crop=center",
		title: "Modern Science Laboratory",
		description: "State-of-the-art equipment for hands-on learning",
		location: "Science Building, 2nd Floor",
		category: "facility" as const,
	},
	{
		id: 2,
		type: "image" as const,
		src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
		title: "Annual Sports Day 2024",
		description: "Students showcasing their athletic talents",
		location: "Main Sports Ground",
		category: "event" as const,
	},
	{
		id: 3,
		type: "video" as const,
		src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&crop=center",
		title: "Art & Craft Workshop",
		description: "Creative minds at work in our art studio",
		location: "Creative Arts Center",
		category: "activity" as const,
	},
	{
		id: 4,
		type: "image" as const,
		src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop&crop=center",
		title: "Digital Learning Hub",
		description: "Interactive smart classrooms with latest technology",
		location: "Technology Wing",
		category: "facility" as const,
	},
	{
		id: 5,
		type: "image" as const,
		src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
		title: "National Award Winners",
		description: "Our students excelling at national competitions",
		location: "Assembly Hall",
		category: "achievement" as const,
	},
	{
		id: 6,
		type: "image" as const,
		src: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=800&h=600&fit=crop&crop=center",
		title: "Cultural Festival Performance",
		description: "Vibrant cultural performances by talented students",
		location: "Main Auditorium",
		category: "event" as const,
	},
];

export async function GalleryCarousel() {
	let galleryItems = fallbackGalleryItems;

	try {
		// Try to fetch gallery items from database
		const dbItems = await prisma.galleryItem.findMany({
			where: {
				isActive: true,
			},
			orderBy: [{ displayOrder: "desc" }, { createdAt: "desc" }],
		});

		// If we have items in the database, use them
		if (dbItems && dbItems.length > 0) {
			galleryItems = dbItems.map((item) => ({
				id: item.id,
				type: item.type.toLowerCase() as "image" | "video",
				src: item.src,
				title: item.title,
				description: item.description,
				location: item.location || undefined,
				category: item.category.toLowerCase() as
					| "facility"
					| "event"
					| "activity"
					| "achievement",
			}));
		}
	} catch (error) {
		// If table doesn't exist or any error occurs, use fallback items
		console.log(
			"Gallery items not fetched from database (table may not exist yet), using fallback items"
		);
	}

	return <GalleryCarouselClient galleryItems={galleryItems} />;
}
