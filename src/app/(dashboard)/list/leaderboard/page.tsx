import { calculateLeaderboard } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";

const LeaderboardPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { classId, subjectId, period } = searchParams;

	// Calculate date range based on period
	let startDate: Date | undefined;
	let endDate: Date | undefined;

	if (period === "week") {
		startDate = new Date();
		startDate.setDate(startDate.getDate() - 7);
	} else if (period === "month") {
		startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 1);
	} else if (period === "year") {
		startDate = new Date();
		startDate.setFullYear(startDate.getFullYear() - 1);
	}

	const leaderboard = await calculateLeaderboard({
		classId: classId,
		subjectId: subjectId,
		startDate,
		endDate,
	});

	const getMedalIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return "🥇";
			case 2:
				return "🥈";
			case 3:
				return "🥉";
			default:
				return null;
		}
	};

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* HEADER */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold flex items-center gap-3">
					🏆 Top Performers Leaderboard
				</h1>
			</div>

			{/* FILTERS */}
			<div className="flex flex-wrap gap-4 mb-6">
				<select
					className="px-4 py-2 rounded-md border border-gray-300 text-sm"
					defaultValue={classId || ""}
				>
					<option value="">All Classes</option>
					{/* TODO: Dynamically populate classes */}
					<option value="1">Class 1A</option>
					<option value="2">Class 1B</option>
				</select>

				<select
					className="px-4 py-2 rounded-md border border-gray-300 text-sm"
					defaultValue={subjectId || ""}
				>
					<option value="">All Subjects</option>
					{/* TODO: Dynamically populate subjects */}
					<option value="1">Mathematics</option>
					<option value="2">Science</option>
				</select>

				<select
					className="px-4 py-2 rounded-md border border-gray-300 text-sm"
					defaultValue={period || "all"}
				>
					<option value="all">All Time</option>
					<option value="week">Last 7 Days</option>
					<option value="month">Last 30 Days</option>
					<option value="year">Last Year</option>
				</select>
			</div>

			{/* LEADERBOARD TABLE */}
			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b-2 border-gray-200 bg-gray-50">
							<th className="text-left py-4 px-4 font-semibold text-gray-700">
								Rank
							</th>
							<th className="text-left py-4 px-4 font-semibold text-gray-700">
								Student
							</th>
							<th className="text-left py-4 px-4 font-semibold text-gray-700 hidden md:table-cell">
								Class
							</th>
							<th className="text-center py-4 px-4 font-semibold text-gray-700">
								Avg Score
							</th>
							<th className="text-center py-4 px-4 font-semibold text-gray-700 hidden lg:table-cell">
								Tests
							</th>
							<th className="text-center py-4 px-4 font-semibold text-gray-700 hidden lg:table-cell">
								Best Score
							</th>
							<th className="text-left py-4 px-4 font-semibold text-gray-700 hidden xl:table-cell">
								Badges
							</th>
						</tr>
					</thead>
					<tbody>
						{leaderboard.length === 0 ? (
							<tr>
								<td colSpan={7} className="text-center py-12 text-gray-500">
									No data available. Complete some MCQ tests to see the
									leaderboard!
								</td>
							</tr>
						) : (
							leaderboard.map((entry) => {
								const medal = getMedalIcon(entry.rank);
								const isTopThree = entry.rank <= 3;

								return (
									<tr
										key={entry.studentId}
										className={`border-b border-gray-100 hover:bg-lamaPurpleLight transition-colors ${
											isTopThree ? "bg-yellow-50" : ""
										}`}
									>
										{/* Rank */}
										<td className="py-4 px-4">
											<div className="flex items-center gap-2">
												{medal ? (
													<span className="text-3xl">{medal}</span>
												) : (
													<span className="text-xl font-bold text-gray-600 w-8 text-center">
														{entry.rank}
													</span>
												)}
											</div>
										</td>

										{/* Student */}
										<td className="py-4 px-4">
											<div className="flex items-center gap-3">
												<Image
													src={entry.studentImg || "/noAvatar.png"}
													alt={entry.studentName}
													width={40}
													height={40}
													className="rounded-full object-cover"
												/>
												<div>
													<p className="font-semibold text-gray-800">
														{entry.studentName} {entry.studentSurname}
													</p>
												</div>
											</div>
										</td>

										{/* Class */}
										<td className="py-4 px-4 hidden md:table-cell">
											<span className="text-gray-600">
												{entry.className || "N/A"}
											</span>
										</td>

										{/* Average Score */}
										<td className="py-4 px-4 text-center">
											<div className="flex flex-col items-center">
												<span className="text-2xl font-bold text-lamaPurple">
													{entry.averageScore.toFixed(1)}%
												</span>
											</div>
										</td>

										{/* Tests */}
										<td className="py-4 px-4 text-center hidden lg:table-cell">
											<span className="px-3 py-1 rounded-full bg-lamaSkyLight text-lamaSky font-medium text-sm">
												{entry.totalTests} tests
											</span>
										</td>

										{/* Best Score */}
										<td className="py-4 px-4 text-center hidden lg:table-cell">
											<span className="font-semibold text-green-600">
												{entry.bestScore.toFixed(1)}%
											</span>
										</td>

										{/* Badges */}
										<td className="py-4 px-4 hidden xl:table-cell">
											<div className="flex gap-2 flex-wrap">
												{entry.badges.length === 0 ? (
													<span className="text-gray-400 text-sm">
														No badges yet
													</span>
												) : (
													entry.badges.map((badge) => (
														<div
															key={badge.id}
															className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
															style={{
																backgroundColor: `${badge.color}20`,
																color: badge.color,
															}}
															title={badge.name}
														>
															{badge.icon && <span>{badge.icon}</span>}
															<span>{badge.name}</span>
														</div>
													))
												)}
											</div>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* STATS SUMMARY */}
			{leaderboard.length > 0 && (
				<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
						<h3 className="text-sm font-medium text-gray-600 mb-1">
							Top Score
						</h3>
						<p className="text-2xl font-bold text-yellow-700">
							{leaderboard[0].averageScore.toFixed(1)}%
						</p>
						<p className="text-xs text-gray-600 mt-1">
							{leaderboard[0].studentName} {leaderboard[0].studentSurname}
						</p>
					</div>

					<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
						<h3 className="text-sm font-medium text-gray-600 mb-1">
							Average Score
						</h3>
						<p className="text-2xl font-bold text-blue-700">
							{(
								leaderboard.reduce((sum, e) => sum + e.averageScore, 0) /
								leaderboard.length
							).toFixed(1)}
							%
						</p>
						<p className="text-xs text-gray-600 mt-1">Across all students</p>
					</div>

					<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
						<h3 className="text-sm font-medium text-gray-600 mb-1">
							Total Students
						</h3>
						<p className="text-2xl font-bold text-purple-700">
							{leaderboard.length}
						</p>
						<p className="text-xs text-gray-600 mt-1">Active participants</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default LeaderboardPage;
