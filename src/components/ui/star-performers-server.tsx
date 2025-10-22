import { calculateLeaderboard } from "@/lib/actions";
import StarPerformersClient from "./star-performers-client";

export default async function StarPerformers() {
	try {
		// Fetch top 3 students using the same leaderboard calculation
		const leaderboard = await calculateLeaderboard({});

		// Get only the top 3
		const topStudents = leaderboard.slice(0, 3);

		// Transform the data to match the expected format
		const studentsToDisplay = topStudents.map((entry) => ({
			id: entry.studentId,
			rank: entry.rank,
			averageScore: entry.averageScore,
			totalTests: entry.totalTests,
			bestScore: entry.bestScore,
			student: {
				id: entry.studentId,
				name: entry.studentName,
				surname: entry.studentSurname,
				img: entry.studentImg,
				class: {
					name: entry.className || "N/A",
				},
				grade: {
					level: parseInt(entry.className?.match(/\d+/)?.[0] || "0"),
				},
			},
		}));

		return <StarPerformersClient students={studentsToDisplay} />;
	} catch (error) {
		console.error("Error fetching star performers:", error);
		// Return empty array on error
		return <StarPerformersClient students={[]} />;
	}
}
