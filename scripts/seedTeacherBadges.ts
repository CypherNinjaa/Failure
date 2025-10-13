import { PrismaClient, BadgeType } from "@prisma/client";

const prisma = new PrismaClient();

async function createTeacherBadges() {
	console.log("🎖️  Creating teacher badges...\n");

	const teacherBadges = [
		{
			name: "🏆 Top Teacher",
			description: "Ranked #1 on the teacher leaderboard",
			icon: "🏆",
			color: "#FFD700",
			badgeType: "RANK_BASED" as BadgeType,
			criteria: {
				type: "teacherRank",
				value: 1,
				description: "Achieved rank #1",
			},
			isActive: true,
			priority: 1,
		},
		{
			name: "🥇 Gold Medal",
			description: "Achieved 1st rank in the teacher leaderboard",
			icon: "🥇",
			color: "#FFD700",
			badgeType: "RANK_BASED" as BadgeType,
			criteria: {
				type: "teacherRank",
				value: 1,
				description: "Achieved 1st rank",
			},
			isActive: true,
			priority: 2,
		},
		{
			name: "🥈 Silver Medal",
			description: "Achieved 2nd rank in the teacher leaderboard",
			icon: "🥈",
			color: "#C0C0C0",
			badgeType: "RANK_BASED" as BadgeType,
			criteria: {
				type: "teacherRank",
				value: 2,
				description: "Achieved 2nd rank",
			},
			isActive: true,
			priority: 3,
		},
		{
			name: "🥉 Bronze Medal",
			description: "Achieved 3rd rank in the teacher leaderboard",
			icon: "🥉",
			color: "#CD7F32",
			badgeType: "RANK_BASED" as BadgeType,
			criteria: {
				type: "teacherRank",
				value: 3,
				description: "Achieved 3rd rank",
			},
			isActive: true,
			priority: 4,
		},
		{
			name: "⭐ Top 5",
			description: "Ranked in the top 5 teachers",
			icon: "⭐",
			color: "#FFA500",
			badgeType: "RANK_BASED" as BadgeType,
			criteria: {
				type: "teacherRank",
				maxValue: 5,
				description: "Ranked in top 5",
			},
			isActive: true,
			priority: 5,
		},
		{
			name: "🌟 Top 10",
			description: "Ranked in the top 10 teachers",
			icon: "🌟",
			color: "#4169E1",
			badgeType: "RANK_BASED" as BadgeType,
			criteria: {
				type: "teacherRank",
				maxValue: 10,
				description: "Ranked in top 10",
			},
			isActive: true,
			priority: 6,
		},
		{
			name: "💎 5-Star Expert",
			description: "Maintained 5.0 average rating",
			icon: "💎",
			color: "#00FF00",
			badgeType: "SCORE_BASED" as BadgeType,
			criteria: {
				type: "teacherRating",
				min: 5.0,
				description: "Perfect 5.0 rating",
			},
			isActive: true,
			priority: 7,
		},
		{
			name: "⭐ Outstanding Educator",
			description: "Maintained 4.5+ average rating",
			icon: "⭐",
			color: "#32CD32",
			badgeType: "SCORE_BASED" as BadgeType,
			criteria: {
				type: "teacherRating",
				min: 4.5,
				description: "4.5+ average rating",
			},
			isActive: true,
			priority: 8,
		},
		{
			name: "🎓 Excellent Teacher",
			description: "Maintained 4.0+ average rating",
			icon: "🎓",
			color: "#90EE90",
			badgeType: "SCORE_BASED" as BadgeType,
			criteria: {
				type: "teacherRating",
				min: 4.0,
				description: "4.0+ average rating",
			},
			isActive: true,
			priority: 9,
		},
		{
			name: "💯 100 Ratings",
			description: "Received 100+ student ratings",
			icon: "💯",
			color: "#FF6347",
			badgeType: "ACTIVITY_BASED" as BadgeType,
			criteria: {
				type: "teacherRatings",
				min: 100,
				description: "100+ total ratings",
			},
			isActive: true,
			priority: 10,
		},
		{
			name: "📚 Popular Teacher",
			description: "Received 50+ student ratings",
			icon: "📚",
			color: "#FFA500",
			badgeType: "ACTIVITY_BASED" as BadgeType,
			criteria: {
				type: "teacherRatings",
				min: 50,
				description: "50+ total ratings",
			},
			isActive: true,
			priority: 11,
		},
		{
			name: "👨‍🏫 Rated Teacher",
			description: "Received 10+ student ratings",
			icon: "👨‍🏫",
			color: "#4169E1",
			badgeType: "ACTIVITY_BASED" as BadgeType,
			criteria: {
				type: "teacherRatings",
				min: 10,
				description: "10+ total ratings",
			},
			isActive: true,
			priority: 12,
		},
		{
			name: "🌟 50 Five-Stars",
			description: "Received 50+ five-star ratings",
			icon: "🌟",
			color: "#FFD700",
			badgeType: "ACTIVITY_BASED" as BadgeType,
			criteria: {
				type: "fiveStars",
				min: 50,
				description: "50+ five-star ratings",
			},
			isActive: true,
			priority: 13,
		},
		{
			name: "✨ 25 Five-Stars",
			description: "Received 25+ five-star ratings",
			icon: "✨",
			color: "#FFA500",
			badgeType: "ACTIVITY_BASED" as BadgeType,
			criteria: {
				type: "fiveStars",
				min: 25,
				description: "25+ five-star ratings",
			},
			isActive: true,
			priority: 14,
		},
		{
			name: "⭐ 10 Five-Stars",
			description: "Received 10+ five-star ratings",
			icon: "⭐",
			color: "#4169E1",
			badgeType: "ACTIVITY_BASED" as BadgeType,
			criteria: {
				type: "fiveStars",
				min: 10,
				description: "10+ five-star ratings",
			},
			isActive: true,
			priority: 15,
		},
	];

	let created = 0;
	let skipped = 0;

	for (const badgeData of teacherBadges) {
		try {
			// Check if badge already exists
			const existing = await prisma.badge.findFirst({
				where: {
					name: badgeData.name,
				},
			});

			if (existing) {
				console.log(`⏭️  Skipped: ${badgeData.name} (already exists)`);
				skipped++;
			} else {
				await prisma.badge.create({
					data: badgeData,
				});
				console.log(`✅ Created: ${badgeData.name}`);
				created++;
			}
		} catch (error) {
			console.error(`❌ Error creating ${badgeData.name}:`, error);
		}
	}

	console.log(`\n📊 Summary:`);
	console.log(`   ✅ Created: ${created} badges`);
	console.log(`   ⏭️  Skipped: ${skipped} badges`);
	console.log(`   📝 Total: ${teacherBadges.length} badges`);

	await prisma.$disconnect();
}

createTeacherBadges().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
