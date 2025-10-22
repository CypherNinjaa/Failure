import prisma from "@/lib/prisma";
import { NewsTickerClient } from "./news-ticker-client";

export async function NewsTicker() {
	try {
		// Fetch active news ticker items from database, ordered by displayOrder
		const newsItems = await prisma.newsTickerItem.findMany({
			where: {
				isActive: true,
			},
			orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
		});

		// Transform to client format
		const clientNewsItems = newsItems.map((item) => ({
			icon: item.icon,
			text: item.text,
			type: item.type.toLowerCase() as
				| "event"
				| "facility"
				| "achievement"
				| "announcement",
		}));

		// Use fallback data if no items in database
		const fallbackItems = [
			{
				icon: "🎉",
				text: "Annual Sports Day 2025 - March 15th",
				type: "event" as const,
			},
			{
				icon: "📚",
				text: "New Smart Classrooms Inaugurated",
				type: "facility" as const,
			},
			{
				icon: "🏆",
				text: "Science Fair Winners Announced",
				type: "achievement" as const,
			},
			{
				icon: "🎭",
				text: "Cultural Festival Coming Soon",
				type: "event" as const,
			},
		];

		return (
			<NewsTickerClient
				newsItems={clientNewsItems.length > 0 ? clientNewsItems : fallbackItems}
			/>
		);
	} catch (error) {
		// If table doesn't exist yet or other error, use fallback
		console.log("News ticker using fallback data:", error);
		const fallbackItems = [
			{
				icon: "🎉",
				text: "Annual Sports Day 2025 - March 15th",
				type: "event" as const,
			},
			{
				icon: "📚",
				text: "New Smart Classrooms Inaugurated",
				type: "facility" as const,
			},
			{
				icon: "🏆",
				text: "Science Fair Winners Announced",
				type: "achievement" as const,
			},
			{
				icon: "🎭",
				text: "Cultural Festival Coming Soon",
				type: "event" as const,
			},
		];

		return <NewsTickerClient newsItems={fallbackItems} />;
	}
}
