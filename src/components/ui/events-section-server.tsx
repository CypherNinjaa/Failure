import prisma from "@/lib/prisma";
import EventsSectionClient from "./events-section-client";

export default async function EventsSection() {
	try {
		// Fetch upcoming events (events with startTime in the future)
		const events = await prisma.event.findMany({
			where: {
				startTime: {
					gte: new Date(), // Events starting from now onwards
				},
			},
			orderBy: {
				startTime: "asc",
			},
			take: 10, // Get up to 10 upcoming events
			include: {
				class: {
					select: {
						name: true,
					},
				},
			},
		});

		return <EventsSectionClient events={events} />;
	} catch (error) {
		console.error("Error fetching events:", error);
		// Return empty array on error
		return <EventsSectionClient events={[]} />;
	}
}
