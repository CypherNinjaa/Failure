import { getTeacherRatingStats } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";

const TeacherRatingWidget = async ({ teacherId }: { teacherId: string }) => {
	const stats = await getTeacherRatingStats(teacherId);

	if (!stats || !stats.leaderboard) {
		return (
			<div className="bg-white p-4 rounded-xl">
				<h2 className="text-lg font-semibold mb-4">Your Ratings</h2>
				<p className="text-gray-500 text-sm">
					No ratings yet. Students will rate you after completing tests.
				</p>
			</div>
		);
	}

	const { leaderboard, recentRatings } = stats;
	const badges = leaderboard.badges || [];

	const getStarDisplay = (rating: number) => {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

		return (
			<div className="flex items-center gap-1">
				{[...Array(fullStars)].map((_, i) => (
					<span key={`full-${i}`} className="text-yellow-400 text-2xl">
						★
					</span>
				))}
				{hasHalfStar && <span className="text-yellow-400 text-2xl">⯨</span>}
				{[...Array(emptyStars)].map((_, i) => (
					<span key={`empty-${i}`} className="text-gray-300 text-2xl">
						★
					</span>
				))}
			</div>
		);
	};

	const getRankBadge = (rank: number | null) => {
		if (rank === null || rank === undefined)
			return { text: "Unranked", color: "bg-gray-500" };
		if (rank === 1) return { text: "1st Place", color: "bg-yellow-500" };
		if (rank === 2) return { text: "2nd Place", color: "bg-gray-400" };
		if (rank === 3) return { text: "3rd Place", color: "bg-orange-600" };
		return { text: `Rank #${rank}`, color: "bg-lamaPurple" };
	};

	const rankInfo = getRankBadge(leaderboard.rank);

	return (
		<div className="bg-white p-6 rounded-xl shadow-sm">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold">Your Ratings</h2>
				<Link
					href="/list/teacher-leaderboard"
					className="text-lamaPurple hover:underline text-sm font-medium"
				>
					View Leaderboard →
				</Link>
			</div>

			{/* Overall Rating */}
			<div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-lamaPurpleLight to-lamaSkyLight rounded-lg">
				<div>
					<p className="text-sm text-gray-600 mb-1">Your Average Rating</p>
					<div className="flex items-center gap-2">
						{getStarDisplay(leaderboard.averageRating)}
						<span className="text-3xl font-bold text-gray-800 ml-2">
							{leaderboard.averageRating.toFixed(2)}
						</span>
					</div>
					<p className="text-xs text-gray-500 mt-1">
						Based on {leaderboard.totalRatings} rating
						{leaderboard.totalRatings !== 1 ? "s" : ""}
					</p>
				</div>
				<div className="text-center">
					<span
						className={`${rankInfo.color} text-white px-4 py-2 rounded-full font-bold text-sm`}
					>
						{rankInfo.text}
					</span>
				</div>
			</div>

			{/* Star Distribution */}
			<div className="mb-6">
				<p className="text-sm font-medium text-gray-600 mb-3">
					Rating Distribution
				</p>
				<div className="space-y-2">
					{[
						{ star: 5, key: "fiveStarCount" as const },
						{ star: 4, key: "fourStarCount" as const },
						{ star: 3, key: "threeStarCount" as const },
						{ star: 2, key: "twoStarCount" as const },
						{ star: 1, key: "oneStarCount" as const },
					].map(({ star, key }) => {
						const count = (leaderboard[key] as number) || 0;
						const total = leaderboard.totalRatings || 0;
						const percentage = total > 0 ? (count / total) * 100 : 0;

						return (
							<div key={star} className="flex items-center gap-2">
								<span className="w-6 text-sm font-medium text-gray-600">
									{star}★
								</span>
								<div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
									<div
										className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
										style={{ width: `${percentage}%` }}
									/>
								</div>
								<span className="w-8 text-sm text-gray-600 text-right">
									{count}
								</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Earned Badges */}
			{badges && badges.length > 0 && (
				<div className="mb-6">
					<p className="text-sm font-medium text-gray-600 mb-3">
						Your Badges ({badges.length})
					</p>
					<div className="flex gap-3 flex-wrap">
						{badges.map((badge) => (
							<div
								key={badge.id}
								className="flex flex-col items-center group cursor-pointer"
							>
								<div className="relative">
									<Image
										src={badge.badge.icon || "/badge.png"}
										alt={badge.badge.name}
										width={56}
										height={56}
										className="w-14 h-14 object-cover transition-transform group-hover:scale-110"
									/>
								</div>
								<span className="text-xs text-center mt-1 max-w-[60px] truncate">
									{badge.badge.name}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Recent Feedback */}
			{recentRatings && recentRatings.length > 0 && (
				<div>
					<p className="text-sm font-medium text-gray-600 mb-3">
						Recent Feedback
					</p>
					<div className="space-y-3 max-h-48 overflow-y-auto">
						{recentRatings
							.filter((r) => r.comment && r.comment.trim())
							.slice(0, 3)
							.map((rating) => (
								<div
									key={rating.id}
									className="p-3 bg-gray-50 rounded-lg border border-gray-200"
								>
									<div className="flex items-center gap-2 mb-1">
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<span
													key={i}
													className={`text-sm ${
														i < rating.rating
															? "text-yellow-400"
															: "text-gray-300"
													}`}
												>
													★
												</span>
											))}
										</div>
										<span className="text-xs text-gray-500">
											{rating.test?.title || "General Feedback"}
											{rating.subject && ` • ${rating.subject.name}`}
										</span>
									</div>
									<p className="text-sm text-gray-700 italic">
										&quot;{rating.comment}&quot;
									</p>
								</div>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default TeacherRatingWidget;
