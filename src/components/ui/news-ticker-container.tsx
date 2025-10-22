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

		// If no items in database, return null (don't show news ticker)
		if (newsItems.length === 0) {
			return null;
		}

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

		return <NewsTickerClient newsItems={clientNewsItems} />;
	} catch (error) {
		// If table doesn't exist yet or database error, don't show news ticker
		console.error("Error fetching news ticker items:", error);
		return null;
	}
}
