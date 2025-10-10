import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";

const BADGE_CONFIG: Record<
	string,
	{ icon: string; title: string; description: string; color: string }
> = {
	FIRST_TEST: {
		icon: "🎯",
		title: "First Steps",
		description: "Completed your first test",
		color: "bg-blue-500",
	},
	"10_TESTS": {
		icon: "📚",
		title: "Dedicated Learner",
		description: "Completed 10 tests",
		color: "bg-green-500",
	},
	"50_TESTS": {
		icon: "🎓",
		title: "Knowledge Seeker",
		description: "Completed 50 tests",
		color: "bg-purple-500",
	},
	"100_POINTS": {
		icon: "💯",
		title: "Century",
		description: "Earned 100 points",
		color: "bg-yellow-500",
	},
	"500_POINTS": {
		icon: "⭐",
		title: "Star Performer",
		description: "Earned 500 points",
		color: "bg-orange-500",
	},
	"1000_POINTS": {
		icon: "🏆",
		title: "Point Master",
		description: "Earned 1000 points",
		color: "bg-red-500",
	},
	PERFECT_SCORE: {
		icon: "💎",
		title: "Perfectionist",
		description: "Scored 100% on a test",
		color: "bg-cyan-500",
	},
	HIGH_ACHIEVER: {
		icon: "🌟",
		title: "High Achiever",
		description: "Scored 90% or above",
		color: "bg-indigo-500",
	},
	TOP_10: {
		icon: "🥇",
		title: "Top 10",
		description: "Reached top 10 on leaderboard",
		color: "bg-amber-500",
	},
	TOP_3: {
		icon: "🥈",
		title: "Podium Finish",
		description: "Reached top 3 on leaderboard",
		color: "bg-gray-400",
	},
	CHAMPION: {
		icon: "👑",
		title: "Champion",
		description: "Rank #1 on leaderboard",
		color: "bg-yellow-400",
	},
};

const AchievementsPage = async () => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "student" || !userId) {
		redirect("/");
	}

	// Fetch student with achievements and points
	const student = await prisma.student.findUnique({
		where: { id: userId },
		include: {
			achievements: {
				orderBy: { earnedAt: "desc" },
			},
			points: true,
		},
	});

	if (!student) {
		redirect("/");
	}

	const earnedBadges = student.achievements || [];
	const totalBadges = Object.keys(BADGE_CONFIG).length;
	const earnedCount = earnedBadges.length;
	const progress = (earnedCount / totalBadges) * 100;

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					🏅 Your Achievements
				</h1>
				<p className="text-gray-600">
					Earn badges by completing tests and reaching milestones
				</p>
			</div>

			{/* Progress Overview */}
			<div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-8 rounded-xl shadow-lg mb-6">
				<div className="flex justify-between items-center mb-4">
					<div>
						<h2 className="text-3xl font-bold mb-2">
							{earnedCount} / {totalBadges}
						</h2>
						<p className="text-sm opacity-90">Badges Earned</p>
					</div>
					<div className="text-6xl">{progress === 100 ? "🏆" : "🎯"}</div>
				</div>
				<div className="w-full bg-white/20 rounded-full h-4 mb-2">
					<div
						className="bg-white h-4 rounded-full transition-all duration-500"
						style={{ width: `${progress}%` }}
					></div>
				</div>
				<p className="text-sm opacity-90">{progress.toFixed(0)}% Complete</p>
			</div>

			{/* Student Stats */}
			{student.points && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<div className="bg-white border rounded-lg p-4">
						<p className="text-sm text-gray-600 mb-1">Rank</p>
						<p className="text-3xl font-bold text-purple-600">
							#{student.points.rank || "N/A"}
						</p>
					</div>
					<div className="bg-white border rounded-lg p-4">
						<p className="text-sm text-gray-600 mb-1">Total Points</p>
						<p className="text-3xl font-bold text-blue-600">
							{student.points.totalPoints}
						</p>
					</div>
					<div className="bg-white border rounded-lg p-4">
						<p className="text-sm text-gray-600 mb-1">Tests Completed</p>
						<p className="text-3xl font-bold text-green-600">
							{student.points.testsCompleted}
						</p>
					</div>
					<div className="bg-white border rounded-lg p-4">
						<p className="text-sm text-gray-600 mb-1">Average Score</p>
						<p className="text-3xl font-bold text-orange-600">
							{student.points.averageScore.toFixed(1)}%
						</p>
					</div>
				</div>
			)}

			{/* Badges Grid */}
			<div className="bg-white border rounded-lg p-6">
				<h3 className="font-semibold text-gray-700 mb-4">All Badges</h3>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{Object.entries(BADGE_CONFIG).map(([type, config]) => {
						const earned = earnedBadges.find((b) => b.badgeType === type);

						return (
							<div
								key={type}
								className={`relative p-6 rounded-xl border-2 transition-all ${
									earned
										? `${config.color} text-white shadow-lg hover:scale-105`
										: "bg-gray-100 border-gray-300 opacity-60"
								}`}
							>
								{earned && (
									<div className="absolute top-2 right-2 bg-white text-green-600 rounded-full p-1">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								)}

								<div className="text-center">
									<div className="text-5xl mb-3">{config.icon}</div>
									<h4 className="font-bold text-lg mb-1">{config.title}</h4>
									<p
										className={`text-sm ${
											earned ? "opacity-90" : "text-gray-600"
										}`}
									>
										{config.description}
									</p>

									{earned && (
										<p className="text-xs mt-2 opacity-75">
											Earned on {new Date(earned.earnedAt).toLocaleDateString()}
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Recent Achievements */}
			{earnedBadges.length > 0 && (
				<div className="bg-white border rounded-lg p-6 mt-6">
					<h3 className="font-semibold text-gray-700 mb-4">
						Recent Achievements
					</h3>
					<div className="space-y-3">
						{earnedBadges.slice(0, 5).map((achievement) => {
							const config = BADGE_CONFIG[achievement.badgeType];
							if (!config) return null;

							return (
								<div
									key={achievement.id}
									className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
								>
									<div
										className={`${config.color} text-white p-3 rounded-full text-2xl`}
									>
										{config.icon}
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-gray-800">
											{config.title}
										</h4>
										<p className="text-sm text-gray-600">
											{config.description}
										</p>
									</div>
									<div className="text-sm text-gray-500">
										{new Date(achievement.earnedAt).toLocaleDateString()}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default AchievementsPage;
