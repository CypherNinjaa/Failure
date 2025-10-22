import prisma from "@/lib/prisma";
import StatsClient from "./stats-section-client";

export default async function StatsSection() {
	// Fetch active stats from database
	const stats = await prisma.statItem.findMany({
		where: { isActive: true },
		orderBy: { displayOrder: "asc" },
		select: {
			value: true,
			suffix: true,
			label: true,
			emoji: true,
			iconName: true,
			gradient: true,
		},
	});

	return <StatsClient stats={stats} />;
}
