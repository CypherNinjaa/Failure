import { calculateTeacherLeaderboard } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import SubjectFilter from "@/components/SubjectFilter";

const TeacherLeaderboardPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only admin and teachers can view
	if (role !== "admin" && role !== "teacher") {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-500 mb-2">
						Access Denied
					</h1>
					<p className="text-gray-600">
						Only administrators and teachers can view this page.
					</p>
				</div>
			</div>
		);
	}

	// Get filter parameters
	const subjectFilter = searchParams.subject
		? parseInt(searchParams.subject)
		: undefined;

	// Fetch leaderboard data
	const leaderboard = await calculateTeacherLeaderboard(
		subjectFilter ? { subjectId: subjectFilter } : undefined
	);

	// Fetch subjects for filter dropdown
	const subjects = await prisma.subject.findMany({
		orderBy: { name: "asc" },
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
				return `#${rank}`;
		}
	};

	const getStarDisplay = (rating: number) => {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;
		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

		return (
			<div className="flex items-center gap-1">
				{[...Array(fullStars)].map((_, i) => (
					<span key={`full-${i}`} className="text-yellow-400">
						★
					</span>
				))}
				{hasHalfStar && <span className="text-yellow-400">⯨</span>}
				{[...Array(emptyStars)].map((_, i) => (
					<span key={`empty-${i}`} className="text-gray-300">
						★
					</span>
				))}
				<span className="ml-1 text-sm font-semibold text-gray-700">
					{rating.toFixed(2)}
				</span>
			</div>
		);
	};

	return (
		<div className="bg-white p-4 rounded-xl flex-1 m-4 mt-0">
			{/* HEADER */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">
						Teacher Leaderboard
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Rankings based on student ratings and feedback
					</p>
				</div>

				{/* Subject Filter */}
				<SubjectFilter subjects={subjects} />
			</div>

			{/* LEADERBOARD */}
			{leaderboard.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">
						No ratings available yet. Encourage students to rate their teachers
						after completing tests!
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{leaderboard.map((entry) => {
						const isTopThree = entry.rank <= 3;

						return (
							<div
								key={entry.teacherId}
								className={`flex items-center gap-4 p-4 rounded-xl border-2 transition ${
									isTopThree
										? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-md"
										: "bg-white border-gray-200 hover:border-lamaPurple hover:shadow-sm"
								}`}
							>
								{/* Rank */}
								<div className="flex-shrink-0 w-16 text-center">
									<span
										className={`text-3xl font-bold ${
											isTopThree ? "text-yellow-600" : "text-gray-400"
										}`}
									>
										{getMedalIcon(entry.rank)}
									</span>
								</div>

								{/* Teacher Info */}
								<div className="flex items-center gap-3 flex-1">
									<div className="relative w-14 h-14 flex-shrink-0">
										<Image
											src={entry.teacherImg || "/noAvatar.png"}
											alt={entry.teacherName}
											width={56}
											height={56}
											className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
											unoptimized={entry.teacherImg?.startsWith("http")}
										/>
									</div>

									<div>
										<h3 className="font-semibold text-lg text-gray-800">
											{entry.teacherName} {entry.teacherSurname}
										</h3>
										{entry.subjects && entry.subjects.length > 0 && (
											<div className="flex gap-1 mt-1 flex-wrap">
												{entry.subjects.slice(0, 3).map((subject, idx) => (
													<span
														key={idx}
														className="px-2 py-0.5 bg-lamaSkyLight text-lamaSky text-xs rounded-full"
													>
														{subject}
													</span>
												))}
												{entry.subjects.length > 3 && (
													<span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
														+{entry.subjects.length - 3} more
													</span>
												)}
											</div>
										)}
									</div>
								</div>

								{/* Rating Stats */}
								<div className="flex items-center gap-6">
									{/* Average Rating */}
									<div className="text-center">
										<div className="flex items-center justify-center">
											{getStarDisplay(entry.averageRating)}
										</div>
										<p className="text-xs text-gray-500 mt-1">
											{entry.totalRatings} rating
											{entry.totalRatings !== 1 ? "s" : ""}
										</p>
									</div>

									{/* Star Distribution */}
									<div className="hidden lg:flex flex-col gap-1 text-xs">
										{[
											{
												star: 5,
												count: entry.fiveStarCount,
											},
											{
												star: 4,
												count: entry.fourStarCount,
											},
											{
												star: 3,
												count: entry.threeStarCount,
											},
											{
												star: 2,
												count: entry.twoStarCount,
											},
											{
												star: 1,
												count: entry.oneStarCount,
											},
										].map(({ star, count }) => {
											const total = entry.totalRatings;
											const percentage = total > 0 ? (count / total) * 100 : 0;

											return (
												<div key={star} className="flex items-center gap-2">
													<span className="w-8 text-gray-600">{star}★</span>
													<div className="w-24 bg-gray-200 rounded-full h-2">
														<div
															className="bg-yellow-400 h-2 rounded-full"
															style={{ width: `${percentage}%` }}
														/>
													</div>
													<span className="w-8 text-gray-600 text-right">
														{count}
													</span>
												</div>
											);
										})}
									</div>

									{/* Badges */}
									{entry.badges && entry.badges.length > 0 && (
										<div className="flex gap-2">
											{entry.badges.slice(0, 2).map((badge) => (
												<div
													key={badge.id}
													className="relative group cursor-pointer"
												>
													{badge.icon && badge.icon.startsWith("/") ? (
														<Image
															src={badge.icon}
															alt={badge.name}
															width={40}
															height={40}
															className="w-10 h-10 object-cover"
														/>
													) : (
														<div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-2xl">
															{badge.icon || "🏆"}
														</div>
													)}
													<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
														{badge.name}
													</div>
												</div>
											))}
											{entry.badges.length > 2 && (
												<div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
													+{entry.badges.length - 2}
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* LEGEND */}
			<div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
				<h3 className="font-semibold text-gray-700 mb-2">How Rankings Work</h3>
				<ul className="text-sm text-gray-600 space-y-1">
					<li>
						• Teachers are ranked by <strong>average rating</strong> (higher is
						better)
					</li>
					<li>
						• In case of a tie, the teacher with{" "}
						<strong>more total ratings</strong> ranks higher
					</li>
					<li>• All student ratings are anonymous to protect privacy</li>
					<li>
						• Badges are automatically awarded based on performance criteria
					</li>
				</ul>
			</div>
		</div>
	);
};

export default TeacherLeaderboardPage;
