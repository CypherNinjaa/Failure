import prisma from "@/lib/prisma";
import StarPerformersClient from "./star-performers-client";

export default async function StarPerformers() {
	try {
		// Fetch the latest leaderboard snapshots for top 3 students
		const topStudents = await prisma.leaderboardSnapshot.findMany({
			orderBy: [{ rank: "asc" }],
			take: 3,
			include: {
				student: {
					select: {
						id: true,
						name: true,
						surname: true,
						img: true,
						class: {
							select: {
								name: true,
							},
						},
						grade: {
							select: {
								level: true,
							},
						},
					},
				},
			},
			where: {
				// Get the most recent snapshots
				createdAt: {
					gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
				},
			},
		});

		// If no recent data, try to get any top 3
		const studentsToDisplay =
			topStudents.length > 0
				? topStudents
				: await prisma.leaderboardSnapshot.findMany({
						orderBy: [{ rank: "asc" }],
						take: 3,
						include: {
							student: {
								select: {
									id: true,
									name: true,
									surname: true,
									img: true,
									class: {
										select: {
											name: true,
										},
									},
									grade: {
										select: {
											level: true,
										},
									},
								},
							},
						},
				  });

		return <StarPerformersClient students={studentsToDisplay} />;
	} catch (error) {
		console.error("Error fetching star performers:", error);
		// Return empty array on error
		return <StarPerformersClient students={[]} />;
	}
}
