import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedLeaderboard() {
	console.log("🏆 Seeding leaderboard badges...");

	// Create default badges
	const badges = [
		// Rank-based badges
		{
			name: "🥇 Gold Medal",
			description: "Achieved 1st rank in the leaderboard",
			icon: "🥇",
			color: "#FFD700",
			badgeType: "RANK_BASED" as const,
			criteria: { type: "rank", value: 1 },
			priority: 1,
		},
		{
			name: "🥈 Silver Medal",
			description: "Achieved 2nd rank in the leaderboard",
			icon: "🥈",
			color: "#C0C0C0",
			badgeType: "RANK_BASED" as const,
			criteria: { type: "rank", value: 2 },
			priority: 2,
		},
		{
			name: "🥉 Bronze Medal",
			description: "Achieved 3rd rank in the leaderboard",
			icon: "🥉",
			color: "#CD7F32",
			badgeType: "RANK_BASED" as const,
			criteria: { type: "rank", value: 3 },
			priority: 3,
		},
		{
			name: "⭐ Top 5",
			description: "Ranked in the top 5 students",
			icon: "⭐",
			color: "#FFA500",
			badgeType: "RANK_BASED" as const,
			criteria: { type: "rank", maxValue: 5 },
			priority: 4,
		},
		{
			name: "🌟 Top 10",
			description: "Ranked in the top 10 students",
			icon: "🌟",
			color: "#4169E1",
			badgeType: "RANK_BASED" as const,
			criteria: { type: "rank", maxValue: 10 },
			priority: 5,
		},

		// Score-based badges
		{
			name: "💯 Perfect Score",
			description: "Achieved 100% average score",
			icon: "💯",
			color: "#00FF00",
			badgeType: "SCORE_BASED" as const,
			criteria: { type: "averageScore", min: 100 },
			priority: 6,
		},
		{
			name: "🎯 High Achiever",
			description: "Maintained 95%+ average score",
			icon: "🎯",
			color: "#32CD32",
			badgeType: "SCORE_BASED" as const,
			criteria: { type: "averageScore", min: 95 },
			priority: 7,
		},
		{
			name: "📚 Excellence",
			description: "Maintained 90%+ average score",
			icon: "📚",
			color: "#228B22",
			badgeType: "SCORE_BASED" as const,
			criteria: { type: "averageScore", min: 90 },
			priority: 8,
		},
		{
			name: "👍 Good Work",
			description: "Maintained 85%+ average score",
			icon: "👍",
			color: "#008000",
			badgeType: "SCORE_BASED" as const,
			criteria: { type: "averageScore", min: 85 },
			priority: 9,
		},

		// Activity-based badges
		{
			name: "📖 Knowledge Seeker",
			description: "Completed 10+ tests",
			icon: "📖",
			color: "#4B0082",
			badgeType: "ACTIVITY_BASED" as const,
			criteria: { type: "testsCompleted", min: 10 },
			priority: 10,
		},
		{
			name: "🎓 Scholar",
			description: "Completed 20+ tests",
			icon: "🎓",
			color: "#800080",
			badgeType: "ACTIVITY_BASED" as const,
			criteria: { type: "testsCompleted", min: 20 },
			priority: 11,
		},
		{
			name: "🏆 Master",
			description: "Completed 50+ tests",
			icon: "🏆",
			color: "#8B008B",
			badgeType: "ACTIVITY_BASED" as const,
			criteria: { type: "testsCompleted", min: 50 },
			priority: 12,
		},
		{
			name: "🔥 Hot Streak",
			description: "5 consecutive tests with 90%+ score",
			icon: "🔥",
			color: "#FF4500",
			badgeType: "ACTIVITY_BASED" as const,
			criteria: { type: "streak", count: 5, minScore: 90 },
			priority: 13,
		},
		{
			name: "⚡ Lightning",
			description: "10 consecutive tests with 85%+ score",
			icon: "⚡",
			color: "#FFD700",
			badgeType: "ACTIVITY_BASED" as const,
			criteria: { type: "streak", count: 10, minScore: 85 },
			priority: 14,
		},

		// Improvement badges
		{
			name: "📈 Most Improved",
			description: "Showed the highest improvement over time",
			icon: "📈",
			color: "#20B2AA",
			badgeType: "IMPROVEMENT" as const,
			criteria: { type: "improvement", method: "highest" },
			priority: 15,
		},
		{
			name: "💪 Rising Star",
			description: "Improved average score by 20+ points",
			icon: "💪",
			color: "#48D1CC",
			badgeType: "IMPROVEMENT" as const,
			criteria: { type: "improvement", minPoints: 20 },
			priority: 16,
		},
	];

	for (const badge of badges) {
		await prisma.badge.upsert({
			where: {
				id: `badge-${badge.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
			},
			update: {},
			create: badge,
		});
	}

	console.log(`✅ Created ${badges.length} default badges`);

	console.log("🎉 Leaderboard badges seeded successfully!");
}

seedLeaderboard()
	.catch((e) => {
		console.error("❌ Error seeding leaderboard:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
