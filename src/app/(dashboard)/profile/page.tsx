import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const ProfilePage = async () => {
	const { sessionClaims, userId } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	console.log("🔍 Profile Page Debug:", { userId, role });

	if (!userId) {
		redirect("/sign-in");
	}

	// Fetch user data based on role
	let userData: any = null;

	if (role === "admin") {
		userData = await prisma.admin.findUnique({
			where: { id: userId },
		});
		console.log("👤 Admin data fetched:", userData ? "Found" : "NOT FOUND");
	} else if (role === "teacher") {
		userData = await prisma.teacher.findUnique({
			where: { id: userId },
			include: {
				subjects: true,
				classes: true,
				_count: {
					select: {
						lessons: true,
						teacherAttendances: true,
						ratings: true,
					},
				},
				leaderboard: {
					select: {
						rank: true,
						overallScore: true,
						averageRating: true,
					},
				},
				badges: {
					include: {
						badge: true,
					},
					orderBy: {
						earnedAt: "desc",
					},
					take: 5,
				},
			},
		});
	} else if (role === "student") {
		userData = await prisma.student.findUnique({
			where: { id: userId },
			include: {
				class: {
					include: {
						_count: {
							select: {
								students: true,
								lessons: true,
							},
						},
					},
				},
				grade: true,
				parent: true,
				_count: {
					select: {
						attendances: true,
						results: true,
						mcqAttempts: true,
					},
				},
				studentBadges: {
					include: {
						badge: true,
					},
					orderBy: {
						earnedAt: "desc",
					},
					take: 5,
				},
				leaderboardSnapshots: {
					orderBy: {
						createdAt: "desc",
					},
					take: 1,
					select: {
						rank: true,
						averageScore: true,
						totalTests: true,
						bestScore: true,
					},
				},
			},
		});
	} else if (role === "parent") {
		userData = await prisma.parent.findUnique({
			where: { id: userId },
			include: {
				students: {
					include: {
						class: true,
						grade: true,
					},
				},
			},
		});
	}

	if (!userData) {
		return notFound();
	}

	return (
		<div className="flex-1 p-4 md:p-6">
			{/* Profile Header */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
				<div className="p-4 md:p-6">
					<h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
						My Profile
					</h1>
					<p className="text-xs md:text-sm text-gray-600">
						View and manage your profile information
					</p>
				</div>
			</div>

			{/* Role-based Profile Content */}
			{role === "admin" && <AdminProfile userData={userData} userId={userId} />}
			{role === "teacher" && (
				<TeacherProfile userData={userData} userId={userId} />
			)}
			{role === "student" && (
				<StudentProfile userData={userData} userId={userId} />
			)}
			{role === "parent" && (
				<ParentProfile userData={userData} userId={userId} />
			)}
		</div>
	);
};

// Admin Profile Component
const AdminProfile = async ({ userData, userId }: any) => {
	// Fetch system statistics
	const [studentsCount, teachersCount, classesCount, parentsCount] =
		await Promise.all([
			prisma.student.count(),
			prisma.teacher.count(),
			prisma.class.count(),
			prisma.parent.count(),
		]);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
			{/* Profile Card */}
			<div className="lg:col-span-1">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<div className="flex flex-col items-center text-center">
						<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4">
							<span className="text-3xl md:text-4xl font-bold text-white">
								{userData.username.charAt(0).toUpperCase()}
							</span>
						</div>
						<h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
							Administrator
						</h2>
						<p className="text-xs md:text-sm text-gray-500 mb-4">
							@{userData.username}
						</p>
						<div className="w-full pt-4 border-t border-gray-200">
							<div className="flex items-center justify-center gap-2 text-gray-600">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								<span className="text-xs md:text-sm">User ID: {userId}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-4">
					<h3 className="text-sm md:text-base font-semibold text-gray-800 mb-4">
						Quick Actions
					</h3>
					<div className="space-y-2">
						<Link
							href="/settings"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
								<Image src="/setting.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">Settings</span>
						</Link>
						<Link
							href="/admin/cron-jobs"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
								<Image src="/calendar.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								Cron Jobs
							</span>
						</Link>
						<Link
							href="/list/students"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
								<Image src="/student.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								Manage Students
							</span>
						</Link>
						<Link
							href="/list/teachers"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
								<Image src="/teacher.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								Manage Teachers
							</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Account Information */}
			<div className="lg:col-span-2">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
						Account Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Username
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.username}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Role
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								Administrator
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								User ID
							</label>
							<p className="mt-1 text-xs md:text-sm text-gray-600 font-mono break-all">
								{userId}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Access Level
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								Full Access
							</p>
						</div>
					</div>
				</div>

				{/* System Statistics */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-4">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
						System Overview
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="p-3 md:p-4 bg-purple-50 rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-purple-600 font-medium">
									Students
								</span>
								<Image src="/student.png" alt="" width={16} height={16} />
							</div>
							<p className="text-lg md:text-2xl font-bold text-purple-700">
								{studentsCount}
							</p>
						</div>
						<div className="p-3 md:p-4 bg-blue-50 rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-blue-600 font-medium">
									Teachers
								</span>
								<Image src="/teacher.png" alt="" width={16} height={16} />
							</div>
							<p className="text-lg md:text-2xl font-bold text-blue-700">
								{teachersCount}
							</p>
						</div>
						<div className="p-3 md:p-4 bg-yellow-50 rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-yellow-600 font-medium">
									Classes
								</span>
								<Image src="/class.png" alt="" width={16} height={16} />
							</div>
							<p className="text-lg md:text-2xl font-bold text-yellow-700">
								{classesCount}
							</p>
						</div>
						<div className="p-3 md:p-4 bg-green-50 rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-green-600 font-medium">
									Parents
								</span>
								<Image src="/parent.png" alt="" width={16} height={16} />
							</div>
							<p className="text-lg md:text-2xl font-bold text-green-700">
								{parentsCount}
							</p>
						</div>
					</div>
				</div>

				{/* Permissions */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-4">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
						Permissions & Access
					</h3>
					<div className="space-y-3">
						<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
							<span className="text-xs md:text-sm text-gray-700">
								Manage Users
							</span>
							<span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
								Enabled
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
							<span className="text-xs md:text-sm text-gray-700">
								Financial Management
							</span>
							<span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
								Enabled
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
							<span className="text-xs md:text-sm text-gray-700">
								System Configuration
							</span>
							<span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
								Enabled
							</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
							<span className="text-xs md:text-sm text-gray-700">
								Reports & Analytics
							</span>
							<span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
								Enabled
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Teacher Profile Component (to be created next)
const TeacherProfile = ({ userData, userId }: any) => {
	const leaderboardData = userData.leaderboard;
	const badgesCount = userData.badges?.length || 0;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
			{/* Profile Card */}
			<div className="lg:col-span-1">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<div className="flex flex-col items-center text-center">
						{userData.img ? (
							<Image
								src={userData.img}
								alt={`${userData.name} ${userData.surname}`}
								width={128}
								height={128}
								className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200 mb-4"
							/>
						) : (
							<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4">
								<span className="text-3xl md:text-4xl font-bold text-white">
									{userData.name.charAt(0)}
									{userData.surname.charAt(0)}
								</span>
							</div>
						)}
						<h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
							{userData.name} {userData.surname}
						</h2>
						<p className="text-xs md:text-sm text-gray-500 mb-2">
							@{userData.username}
						</p>
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							Teacher
						</span>

						{/* Stats */}
						<div className="w-full mt-6 pt-4 border-t border-gray-200 space-y-3">
							{leaderboardData && (
								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-600">
										Leaderboard Rank
									</span>
									<span className="text-sm font-bold text-blue-600">
										#{leaderboardData.rank}
									</span>
								</div>
							)}
							<div className="flex items-center justify-between">
								<span className="text-xs text-gray-600">Total Lessons</span>
								<span className="text-sm font-semibold text-gray-800">
									{userData._count.lessons}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-xs text-gray-600">Badges Earned</span>
								<span className="text-sm font-semibold text-gray-800">
									{badgesCount}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-4">
					<h3 className="text-sm md:text-base font-semibold text-gray-800 mb-4">
						Quick Actions
					</h3>
					<div className="space-y-2">
						<Link
							href="/teacher/attendance"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
								<Image src="/attendance.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								Mark Attendance
							</span>
						</Link>
						<Link
							href="/list/lessons"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
								<Image src="/lesson.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								My Lessons
							</span>
						</Link>
						<Link
							href="/list/teacher-leaderboard"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
								<Image src="/exam.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">Rankings</span>
						</Link>
						<Link
							href="/settings"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
								<Image src="/setting.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">Settings</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="lg:col-span-2 space-y-4">
				{/* Personal Information */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
						Personal Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Full Name
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.name} {userData.surname}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Blood Type
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.bloodType}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Email
							</label>
							<p className="mt-1 text-xs md:text-sm text-gray-600 break-all">
								{userData.email || "Not provided"}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Phone
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.phone || "Not provided"}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Gender
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.sex}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Birthday
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{new Date(userData.birthday).toLocaleDateString()}
							</p>
						</div>
						<div className="md:col-span-2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Address
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.address}
							</p>
						</div>
					</div>
				</div>

				{/* Teaching Information */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
						Teaching Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
								Subjects
							</label>
							<div className="flex flex-wrap gap-2">
								{userData.subjects.length > 0 ? (
									userData.subjects.map((subject: any) => (
										<span
											key={subject.id}
											className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
										>
											{subject.name}
										</span>
									))
								) : (
									<span className="text-sm text-gray-500">
										No subjects assigned
									</span>
								)}
							</div>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
								Classes
							</label>
							<div className="flex flex-wrap gap-2">
								{userData.classes.length > 0 ? (
									userData.classes.map((classItem: any) => (
										<span
											key={classItem.id}
											className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
										>
											{classItem.name}
										</span>
									))
								) : (
									<span className="text-sm text-gray-500">
										No classes assigned
									</span>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Performance Stats */}
				{leaderboardData && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
						<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
							Performance Statistics
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							<div className="p-4 bg-blue-50 rounded-lg">
								<div className="flex items-center justify-between mb-2">
									<span className="text-xs text-blue-600 font-medium">
										Leaderboard Rank
									</span>
								</div>
								<p className="text-2xl font-bold text-blue-700">
									#{leaderboardData.rank}
								</p>
							</div>
							<div className="p-4 bg-purple-50 rounded-lg">
								<div className="flex items-center justify-between mb-2">
									<span className="text-xs text-purple-600 font-medium">
										Overall Score
									</span>
								</div>
								<p className="text-2xl font-bold text-purple-700">
									{leaderboardData.overallScore?.toFixed(1)}
								</p>
							</div>
							<div className="p-4 bg-yellow-50 rounded-lg">
								<div className="flex items-center justify-between mb-2">
									<span className="text-xs text-yellow-600 font-medium">
										Average Rating
									</span>
								</div>
								<p className="text-2xl font-bold text-yellow-700">
									{leaderboardData.averageRating?.toFixed(1) || "N/A"}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Badges */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-base md:text-lg font-semibold text-gray-800">
							My Badges
						</h3>
						{userData.badges && userData.badges.length > 0 && (
							<Link
								href="/teacher-badges"
								className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
							>
								View All ({userData.badges.length})
							</Link>
						)}
					</div>
					{userData.badges && userData.badges.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
							{userData.badges.slice(0, 6).map((badgeItem: any) => (
								<div
									key={badgeItem.id}
									className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-xl">
											{badgeItem.badge.icon}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs md:text-sm font-semibold text-gray-800 truncate">
												{badgeItem.badge.name}
											</p>
											<p className="text-xs text-gray-500">
												{new Date(badgeItem.earnedAt).toLocaleDateString()}
											</p>
										</div>
									</div>
									{badgeItem.badge.description && (
										<p className="mt-2 text-xs text-gray-600 line-clamp-2">
											{badgeItem.badge.description}
										</p>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 px-4">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
								<svg
									className="w-8 h-8 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
							</div>
							<p className="text-sm text-gray-600 mb-2">No badges earned yet</p>
							<p className="text-xs text-gray-500">
								Keep up the good work to earn your first badge!
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Student Profile Component (will be created)
const StudentProfile = ({ userData, userId }: any) => {
	const leaderboardData = userData.leaderboardSnapshots[0];
	const badgesCount = userData.studentBadges?.length || 0;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
			{/* Profile Card */}
			<div className="lg:col-span-1">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<div className="flex flex-col items-center text-center">
						{userData.img ? (
							<Image
								src={userData.img}
								alt={`${userData.name} ${userData.surname}`}
								width={128}
								height={128}
								className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200 mb-4"
							/>
						) : (
							<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4">
								<span className="text-3xl md:text-4xl font-bold text-white">
									{userData.name.charAt(0)}
									{userData.surname.charAt(0)}
								</span>
							</div>
						)}
						<h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
							{userData.name} {userData.surname}
						</h2>
						<p className="text-xs md:text-sm text-gray-500 mb-2">
							@{userData.username}
						</p>
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
							Student
						</span>

						{/* Stats */}
						<div className="w-full mt-6 pt-4 border-t border-gray-200 space-y-3">
							{leaderboardData && (
								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-600">
										Leaderboard Rank
									</span>
									<span className="text-sm font-bold text-green-600">
										#{leaderboardData.rank}
									</span>
								</div>
							)}
							{leaderboardData && (
								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-600">Average Score</span>
									<span className="text-sm font-semibold text-gray-800">
										{leaderboardData.averageScore?.toFixed(1)}
									</span>
								</div>
							)}
							<div className="flex items-center justify-between">
								<span className="text-xs text-gray-600">Badges Earned</span>
								<span className="text-sm font-semibold text-gray-800">
									{badgesCount}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-4">
					<h3 className="text-sm md:text-base font-semibold text-gray-800 mb-4">
						Quick Actions
					</h3>
					<div className="space-y-2">
						<Link
							href="/student/mcq-tests"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
								<Image src="/exam.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								MCQ Tests
							</span>
						</Link>
						<Link
							href="/list/leaderboard"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
								<Image src="/exam.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								Leaderboard
							</span>
						</Link>
						<Link
							href="/list/attendance"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
								<Image src="/attendance.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								Attendance
							</span>
						</Link>
						<Link
							href="/settings"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
								<Image src="/setting.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">Settings</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="lg:col-span-2 space-y-4">
				{/* Personal Information */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
						Personal Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Full Name
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.name} {userData.surname}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Blood Type
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.bloodType}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Email
							</label>
							<p className="mt-1 text-xs md:text-sm text-gray-600 break-all">
								{userData.email || "Not provided"}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Phone
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.phone || "Not provided"}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Gender
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.sex}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Birthday
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{new Date(userData.birthday).toLocaleDateString()}
							</p>
						</div>
						<div className="md:col-span-2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Address
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.address}
							</p>
						</div>
					</div>
				</div>

				{/* Academic Information */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
						Academic Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Class
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900 font-semibold">
								{userData.class.name}
							</p>
							<p className="text-xs text-gray-500 mt-1">
								{userData.class._count.students} students •{" "}
								{userData.class._count.lessons} lessons
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Grade
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900 font-semibold">
								Grade {userData.grade.level}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Parent
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.parent.name} {userData.parent.surname}
							</p>
							<p className="text-xs text-gray-500 mt-1">
								{userData.parent.phone}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Enrollment Date
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{new Date(userData.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
				</div>

				{/* Academic Stats */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
						Academic Statistics
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						<div className="p-4 bg-green-50 rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-green-600 font-medium">
									Attendance
								</span>
							</div>
							<p className="text-2xl font-bold text-green-700">
								{userData._count.attendances}
							</p>
							<p className="text-xs text-gray-500 mt-1">Records</p>
						</div>
						<div className="p-4 bg-blue-50 rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-blue-600 font-medium">
									Results
								</span>
							</div>
							<p className="text-2xl font-bold text-blue-700">
								{userData._count.results}
							</p>
							<p className="text-xs text-gray-500 mt-1">Submissions</p>
						</div>
						<div className="p-4 bg-purple-50 rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-purple-600 font-medium">
									MCQ Tests
								</span>
							</div>
							<p className="text-2xl font-bold text-purple-700">
								{userData._count.mcqAttempts}
							</p>
							<p className="text-xs text-gray-500 mt-1">Attempts</p>
						</div>
					</div>
				</div>

				{/* Badges */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-base md:text-lg font-semibold text-gray-800">
							My Badges
						</h3>
						{userData.studentBadges && userData.studentBadges.length > 0 && (
							<Link
								href="/student-badges"
								className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
							>
								View All ({userData.studentBadges.length})
							</Link>
						)}
					</div>
					{userData.studentBadges && userData.studentBadges.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
							{userData.studentBadges.slice(0, 6).map((badgeItem: any) => (
								<div
									key={badgeItem.id}
									className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-xl">
											{badgeItem.badge.icon}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs md:text-sm font-semibold text-gray-800 truncate">
												{badgeItem.badge.name}
											</p>
											<p className="text-xs text-gray-500">
												{new Date(badgeItem.earnedAt).toLocaleDateString()}
											</p>
										</div>
									</div>
									{badgeItem.badge.description && (
										<p className="mt-2 text-xs text-gray-600 line-clamp-2">
											{badgeItem.badge.description}
										</p>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 px-4">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
								<svg
									className="w-8 h-8 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
							</div>
							<p className="text-sm text-gray-600 mb-2">No badges earned yet</p>
							<p className="text-xs text-gray-500">
								Complete tests and improve your ranking to earn badges!
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Parent Profile Component (will be created)
const ParentProfile = ({ userData, userId }: any) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
			{/* Profile Card */}
			<div className="lg:col-span-1">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<div className="flex flex-col items-center text-center">
						<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-4">
							<span className="text-3xl md:text-4xl font-bold text-white">
								{userData.name.charAt(0)}
								{userData.surname.charAt(0)}
							</span>
						</div>
						<h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
							{userData.name} {userData.surname}
						</h2>
						<p className="text-xs md:text-sm text-gray-500 mb-2">
							@{userData.username}
						</p>
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
							Parent
						</span>

						{/* Stats */}
						<div className="w-full mt-6 pt-4 border-t border-gray-200 space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-xs text-gray-600">Children</span>
								<span className="text-sm font-semibold text-gray-800">
									{userData.students.length}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-xs text-gray-600">Joined</span>
								<span className="text-sm font-semibold text-gray-800">
									{new Date(userData.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-4">
					<h3 className="text-sm md:text-base font-semibold text-gray-800 mb-4">
						Quick Actions
					</h3>
					<div className="space-y-2">
						<Link
							href="/parent/fees"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
								<Image src="/finance.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">My Fees</span>
						</Link>
						<Link
							href="/parent/transactions"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
								<Image src="/finance.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								Payment History
							</span>
						</Link>
						<Link
							href="/list/announcements"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
								<Image src="/announcement.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">
								Announcements
							</span>
						</Link>
						<Link
							href="/settings"
							className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
								<Image src="/setting.png" alt="" width={16} height={16} />
							</div>
							<span className="text-xs md:text-sm text-gray-700">Settings</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="lg:col-span-2 space-y-4">
				{/* Personal Information */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
						Contact Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Full Name
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.name} {userData.surname}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Username
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.username}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Email
							</label>
							<p className="mt-1 text-xs md:text-sm text-gray-600 break-all">
								{userData.email || "Not provided"}
							</p>
						</div>
						<div>
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Phone
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.phone}
							</p>
						</div>
						<div className="md:col-span-2">
							<label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Address
							</label>
							<p className="mt-1 text-sm md:text-base text-gray-900">
								{userData.address}
							</p>
						</div>
					</div>
				</div>

				{/* Children Information */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-6">
						My Children ({userData.students.length})
					</h3>
					<div className="space-y-4">
						{userData.students.map((student: any) => (
							<div
								key={student.id}
								className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200"
							>
								<div className="flex items-start gap-4">
									<div className="flex-shrink-0">
										{student.img ? (
											<Image
												src={student.img}
												alt={`${student.name} ${student.surname}`}
												width={64}
												height={64}
												className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white"
											/>
										) : (
											<div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
												<span className="text-lg md:text-xl font-bold text-white">
													{student.name.charAt(0)}
													{student.surname.charAt(0)}
												</span>
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-2 mb-2">
											<div>
												<h4 className="text-sm md:text-base font-semibold text-gray-800">
													{student.name} {student.surname}
												</h4>
												<p className="text-xs text-gray-500">
													@{student.username}
												</p>
											</div>
											<Link
												href={`/list/students/${student.id}`}
												className="flex-shrink-0 px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
											>
												View Details
											</Link>
										</div>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mt-3">
											<div className="bg-white/70 rounded px-2 py-1.5">
												<p className="text-xs text-gray-500">Class</p>
												<p className="text-xs md:text-sm font-semibold text-gray-800">
													{student.class.name}
												</p>
											</div>
											<div className="bg-white/70 rounded px-2 py-1.5">
												<p className="text-xs text-gray-500">Grade</p>
												<p className="text-xs md:text-sm font-semibold text-gray-800">
													{student.grade.level}
												</p>
											</div>
											<div className="bg-white/70 rounded px-2 py-1.5">
												<p className="text-xs text-gray-500">Gender</p>
												<p className="text-xs md:text-sm font-semibold text-gray-800">
													{student.sex}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}

						{userData.students.length === 0 && (
							<div className="text-center py-8 text-gray-500">
								<p className="text-sm">No children registered</p>
							</div>
						)}
					</div>
				</div>

				{/* Quick Links */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
					<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
						Quick Links
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Link
							href="/list/attendance"
							className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
						>
							<Image src="/attendance.png" alt="" width={20} height={20} />
							<span className="text-xs md:text-sm font-medium text-gray-700">
								Children&apos;s Attendance
							</span>
						</Link>
						<Link
							href="/list/results"
							className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
						>
							<Image src="/result.png" alt="" width={20} height={20} />
							<span className="text-xs md:text-sm font-medium text-gray-700">
								Academic Results
							</span>
						</Link>
						<Link
							href="/list/exams"
							className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
						>
							<Image src="/exam.png" alt="" width={20} height={20} />
							<span className="text-xs md:text-sm font-medium text-gray-700">
								Upcoming Exams
							</span>
						</Link>
						<Link
							href="/list/events"
							className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
						>
							<Image src="/calendar.png" alt="" width={20} height={20} />
							<span className="text-xs md:text-sm font-medium text-gray-700">
								School Events
							</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
