import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedLeaderboardData() {
	console.log("Starting leaderboard data seeding...");

	try {
		// Check if config already exists
		const existingConfig = await prisma.leaderboardConfig.findFirst();

		if (!existingConfig) {
			// Create leaderboard configuration
			await prisma.leaderboardConfig.create({
				data: {
					useFirstAttemptOnly: true,
					minimumTestsRequired: 1,
					showTop: 50,
					autoAwardBadges: true,
					includeIncomplete: false,
					enableTimePeriod: false,
					showStudentRank: true,
					enableClassFilter: true,
					enableSubjectFilter: true,
					allowAnonymous: false,
					showFullNames: true,
				},
			});
			console.log("✓ Leaderboard config created");
		} else {
			console.log("✓ Leaderboard config already exists");
		}

		// Create sample badges
		const badges = await Promise.all([
			prisma.badge.create({
				data: {
					name: "🥇 Top Performer",
					description: "Awarded to the #1 ranked student",
					icon: "🥇",
					color: "#FFD700",
					badgeType: "RANK_BASED",
					criteria: { type: "rank", value: 1 },
					isActive: true,
					priority: 1,
				},
			}),
			prisma.badge.create({
				data: {
					name: "🥈 Silver Medal",
					description: "Awarded to the #2 ranked student",
					icon: "🥈",
					color: "#C0C0C0",
					badgeType: "RANK_BASED",
					criteria: { type: "rank", value: 2 },
					isActive: true,
					priority: 2,
				},
			}),
			prisma.badge.create({
				data: {
					name: "🥉 Bronze Medal",
					description: "Awarded to the #3 ranked student",
					icon: "🥉",
					color: "#CD7F32",
					badgeType: "RANK_BASED",
					criteria: { type: "rank", value: 3 },
					isActive: true,
					priority: 3,
				},
			}),
			prisma.badge.create({
				data: {
					name: "⭐ Excellence Award",
					description: "Awarded for maintaining 90%+ average score",
					icon: "⭐",
					color: "#8B5CF6",
					badgeType: "SCORE_BASED",
					criteria: { type: "averageScore", min: 90 },
					isActive: true,
					priority: 4,
				},
			}),
			prisma.badge.create({
				data: {
					name: "💎 Perfect Score",
					description: "Awarded for achieving 100% on any test",
					icon: "💎",
					color: "#3B82F6",
					badgeType: "SCORE_BASED",
					criteria: { type: "bestScore", value: 100 },
					isActive: true,
					priority: 5,
				},
			}),
			prisma.badge.create({
				data: {
					name: "🔥 Active Learner",
					description: "Awarded for completing 10+ tests",
					icon: "🔥",
					color: "#EF4444",
					badgeType: "ACTIVITY_BASED",
					criteria: { type: "testsCompleted", min: 10 },
					isActive: true,
					priority: 6,
				},
			}),
			prisma.badge.create({
				data: {
					name: "📚 Knowledge Seeker",
					description: "Awarded for completing 5+ tests",
					icon: "📚",
					color: "#10B981",
					badgeType: "ACTIVITY_BASED",
					criteria: { type: "testsCompleted", min: 5 },
					isActive: true,
					priority: 7,
				},
			}),
			prisma.badge.create({
				data: {
					name: "🎯 Consistent Performer",
					description: "Awarded for maintaining 80%+ average",
					icon: "🎯",
					color: "#F59E0B",
					badgeType: "SCORE_BASED",
					criteria: { type: "averageScore", min: 80 },
					isActive: true,
					priority: 8,
				},
			}),
		]);

		console.log(`✓ Created ${badges.length} sample badges`);

		console.log("\n✅ Leaderboard seeding completed successfully!");
	} catch (error) {
		console.error("❌ Error seeding leaderboard data:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

seedLeaderboardData();
