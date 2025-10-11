import { calculateLeaderboard } from "@/lib/actions";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const StudentLeaderboardWidget = async () => {
	const { userId } = auth();

	// Get top 5 students for preview
	const leaderboard = await calculateLeaderboard({});
	const topStudents = leaderboard.slice(0, 5);

	// Find current student's position
	const currentStudentIndex = leaderboard.findIndex(
		(entry) => entry.studentId === userId
	);
	const currentStudent =
		currentStudentIndex !== -1 ? leaderboard[currentStudentIndex] : null;

	const getMedalIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return "🥇";
			case 2:
				return "🥈";
			case 3:
				return "🥉";
			default:
				return `#${rank}`;
		}
	};

	return (
		<div className="bg-white p-4 rounded-md">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold">🏆 Leaderboard</h2>
				<Link
					href="/list/leaderboard"
					className="text-xs text-lamaPurple hover:underline"
				>
					View All
				</Link>
			</div>

			{/* Current Student Position */}
			{currentStudent && (
				<div className="mb-4 p-3 bg-gradient-to-r from-lamaPurpleLight to-lamaSkyLight rounded-lg border-2 border-lamaPurple">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-2xl font-bold text-lamaPurple">
								{getMedalIcon(currentStudent.rank)}
							</span>
							<div>
								<p className="text-sm font-semibold text-gray-800">Your Rank</p>
								<p className="text-xs text-gray-600">
									{currentStudent.averageScore.toFixed(1)}% avg
								</p>
							</div>
						</div>
						<div className="flex gap-1">
							{currentStudent.badges.slice(0, 2).map((badge) => (
								<span key={badge.id} className="text-lg" title={badge.name}>
									{badge.icon || "🏅"}
								</span>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Top 5 List */}
			<div className="space-y-2">
				{topStudents.length === 0 ? (
					<p className="text-center text-gray-500 text-sm py-4">
						No rankings yet. Complete MCQ tests to appear on the leaderboard!
					</p>
				) : (
					topStudents.map((entry) => {
						const isCurrentUser = entry.studentId === userId;
						return (
							<div
								key={entry.studentId}
								className={`flex items-center justify-between p-2 rounded-lg transition-all ${
									isCurrentUser
										? "bg-lamaPurpleLight border border-lamaPurple"
										: "bg-gray-50 hover:bg-gray-100"
								}`}
							>
								<div className="flex items-center gap-2">
									<span className="text-lg font-semibold w-8 text-center">
										{getMedalIcon(entry.rank)}
									</span>
									<Image
										src={entry.studentImg || "/noAvatar.png"}
										alt={entry.studentName}
										width={28}
										height={28}
										className="rounded-full object-cover"
									/>
									<div>
										<p
											className={`text-sm font-medium ${
												isCurrentUser ? "text-lamaPurple" : "text-gray-800"
											}`}
										>
											{isCurrentUser
												? "You"
												: `${entry.studentName} ${entry.studentSurname.charAt(
														0
												  )}.`}
										</p>
										<p className="text-xs text-gray-500">
											{entry.averageScore.toFixed(1)}%
										</p>
									</div>
								</div>
								<div className="flex gap-1">
									{entry.badges.slice(0, 2).map((badge) => (
										<span
											key={badge.id}
											className="text-base"
											title={badge.name}
										>
											{badge.icon || "🏅"}
										</span>
									))}
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* View Full Leaderboard Button */}
			<Link
				href="/list/leaderboard"
				className="mt-4 block w-full text-center py-2 bg-lamaPurple text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition"
			>
				View Full Leaderboard
			</Link>
		</div>
	);
};

export default StudentLeaderboardWidget;
