import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const StudentBadgesPage = async () => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (!userId || role !== "student") {
		redirect("/");
	}

	// Fetch all student badges
	const studentBadges = await prisma.studentBadge.findMany({
		where: {
			studentId: userId,
		},
		include: {
			badge: true,
		},
		orderBy: {
			earnedAt: "desc",
		},
	});

	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-6 md:mb-8">
					<Link
						href="/profile"
						className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"
					>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to Profile
					</Link>
					<h1 className="text-2xl md:text-3xl font-bold text-gray-800">
						My Badges
					</h1>
					<p className="text-sm md:text-base text-gray-600 mt-2">
						You have earned {studentBadges.length} badge
						{studentBadges.length !== 1 ? "s" : ""}
					</p>
				</div>

				{/* Badges Grid */}
				{studentBadges.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
						{studentBadges.map((badgeItem) => (
							<div
								key={badgeItem.id}
								className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
							>
								{/* Badge Icon */}
								<div className="flex justify-center mb-4">
									<div
										className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md"
										style={{
											backgroundColor: badgeItem.badge.color + "20",
											border: `3px solid ${badgeItem.badge.color}`,
										}}
									>
										{badgeItem.badge.icon}
									</div>
								</div>

								{/* Badge Info */}
								<div className="text-center">
									<h3 className="text-lg font-bold text-gray-800 mb-2">
										{badgeItem.badge.name}
									</h3>
									<p className="text-sm text-gray-600 mb-4 line-clamp-2">
										{badgeItem.badge.description}
									</p>

									{/* Badge Details */}
									<div className="space-y-2">
										{/* Criteria */}
										{badgeItem.badge.criteria && (
											<div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
												<p className="font-medium">
													{(() => {
														const criteria = badgeItem.badge.criteria as any;
														return criteria.description || "Badge criteria met";
													})()}
												</p>
											</div>
										)}

										{/* Earned Date */}
										<div className="text-xs text-gray-400">
											Earned on{" "}
											{new Date(badgeItem.earnedAt).toLocaleDateString(
												"en-US",
												{
													year: "numeric",
													month: "short",
													day: "numeric",
												}
											)}
										</div>

										{/* Badge Type */}
										<div className="flex justify-center">
											<span
												className="inline-block px-3 py-1 rounded-full text-xs font-medium"
												style={{
													backgroundColor: badgeItem.badge.color + "30",
													color: badgeItem.badge.color,
												}}
											>
												{badgeItem.badge.badgeType
													.replace("_", " ")
													.toLowerCase()
													.replace(/\b\w/g, (l) => l.toUpperCase())}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
						<div className="text-6xl mb-4">🏅</div>
						<h3 className="text-xl font-semibold text-gray-700 mb-2">
							No Badges Yet
						</h3>
						<p className="text-gray-600">
							Keep studying hard and you&apos;ll earn badges based on your
							performance!
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default StudentBadgesPage;
