import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkBadgeData() {
	console.log("🔍 Checking Badge and StudentBadge data...\n");

	// Check total badges
	const totalBadges = await prisma.badge.count();
	console.log(`📊 Total Badges: ${totalBadges}`);

	// Check total student badges
	const totalStudentBadges = await prisma.studentBadge.count();
	console.log(`🎖️  Total StudentBadge records: ${totalStudentBadges}\n`);

	// Get badges with student counts
	const badgesWithCounts = await prisma.badge.findMany({
		include: {
			_count: {
				select: { studentBadges: true },
			},
			studentBadges: {
				include: {
					student: {
						select: {
							name: true,
							surname: true,
						},
					},
				},
			},
		},
	});

	console.log("📋 Badge Details:\n");
	badgesWithCounts.forEach((badge) => {
		console.log(`🏅 ${badge.name}`);
		console.log(`   Count from _count: ${badge._count.studentBadges}`);
		console.log(`   Actual records: ${badge.studentBadges.length}`);
		if (badge.studentBadges.length > 0) {
			console.log(`   Students:`);
			badge.studentBadges.forEach((sb) => {
				console.log(
					`     - ${sb.student.name} ${
						sb.student.surname
					} (Earned: ${sb.earnedAt.toLocaleDateString()})`
				);
			});
		}
		console.log("");
	});

	await prisma.$disconnect();
}

checkBadgeData().catch((error) => {
	console.error("❌ Error:", error);
	process.exit(1);
});
