import prisma from "@/lib/prisma";
import { SchoolHistoryClient } from "./school-history";

export async function SchoolHistoryServer() {
	// Fetch timeline events from database
	const timelineEvents = await prisma.timelineEvent.findMany({
		orderBy: {
			displayOrder: "asc",
		},
	});

	// Transform to match component interface
	const events = timelineEvents.map((event) => ({
		year: event.year.toString(),
		title: event.title,
		description: event.description,
		icon: event.icon,
	}));

	return <SchoolHistoryClient timelineEvents={events} />;
}
