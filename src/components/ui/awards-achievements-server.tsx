import prisma from "@/lib/prisma";
import { AwardsAchievementsClient } from "./awards-achievements";

export async function AwardsAchievementsServer() {
	// Fetch all awards data from database
	const [awards, achievementMetrics, studentAchievements] = await Promise.all([
		prisma.award.findMany({
			where: { isActive: true },
			orderBy: { displayOrder: "asc" },
		}),
		prisma.achievementMetric.findMany({
			where: { isActive: true },
			orderBy: { displayOrder: "asc" },
		}),
		prisma.studentAchievement.findMany({
			where: { isActive: true },
			orderBy: { displayOrder: "asc" },
		}),
	]);

	// Transform awards to match component interface
	const transformedAwards = awards.map((award) => ({
		year: award.year,
		title: award.title,
		organization: award.organization,
		description: award.description,
		category: award.category,
		icon: award.icon,
		color: award.color,
	}));

	// Transform achievement metrics
	const transformedMetrics = achievementMetrics.map((metric) => ({
		metric: metric.metric,
		description: metric.description,
		detail: metric.detail,
	}));

	// Transform student achievements
	const transformedStudentAchievements = studentAchievements.map(
		(achievement) => ({
			name: achievement.name,
			year: achievement.year,
			winners: achievement.winners,
			icon: achievement.icon,
		})
	);

	return (
		<AwardsAchievementsClient
			awards={transformedAwards}
			achievements={transformedMetrics}
			studentAchievements={transformedStudentAchievements}
		/>
	);
}
