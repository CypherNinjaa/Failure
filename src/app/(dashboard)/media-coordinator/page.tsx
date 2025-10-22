import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const MediaCoordinatorPage = async () => {
	const { sessionClaims, userId } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Count gallery items by category
	const galleryStats = await prisma.galleryItem
		.groupBy({
			by: ["category"],
			_count: true,
		})
		.catch(() => []);

	const totalGalleryItems =
		(await prisma.galleryItem.count().catch(() => 0)) || 0;
	const activeGalleryItems =
		(await prisma.galleryItem
			.count({ where: { isActive: true } })
			.catch(() => 0)) || 0;

	// Get category counts
	const facilitiesCount =
		galleryStats.find((s: any) => s.category === "FACILITY")?._count || 0;
	const eventsCount =
		galleryStats.find((s: any) => s.category === "EVENT")?._count || 0;
	const activitiesCount =
		galleryStats.find((s: any) => s.category === "ACTIVITY")?._count || 0;
	const achievementsCount =
		galleryStats.find((s: any) => s.category === "ACHIEVEMENT")?._count || 0;

	return (
		<div className="p-4 flex gap-4 flex-col">
			{/* Header */}
			<div className="bg-white p-6 rounded-md shadow-md">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Media Coordinator Dashboard
				</h1>
				<p className="text-gray-600">
					Manage school gallery, images, videos, and media content
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm opacity-80 mb-1">Total Gallery Items</p>
							<p className="text-3xl font-bold">{totalGalleryItems}</p>
						</div>
						<span className="text-5xl opacity-30">🖼️</span>
					</div>
					<div className="text-sm opacity-90">
						{activeGalleryItems} active •{" "}
						{totalGalleryItems - activeGalleryItems} inactive
					</div>
				</div>

				<div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm opacity-80 mb-1">Facilities</p>
							<p className="text-3xl font-bold">{facilitiesCount}</p>
						</div>
						<span className="text-5xl opacity-30">🏫</span>
					</div>
					<div className="text-sm opacity-90">School infrastructure</div>
				</div>

				<div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm opacity-80 mb-1">Events</p>
							<p className="text-3xl font-bold">{eventsCount}</p>
						</div>
						<span className="text-5xl opacity-30">🎉</span>
					</div>
					<div className="text-sm opacity-90">School events & celebrations</div>
				</div>

				<div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
					<div className="flex items-center justify-between mb-4">
						<div>
							<p className="text-sm opacity-80 mb-1">Activities</p>
							<p className="text-3xl font-bold">{activitiesCount}</p>
						</div>
						<span className="text-5xl opacity-30">🎨</span>
					</div>
					<div className="text-sm opacity-90">Student activities</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-white p-6 rounded-md shadow-md">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<Link
						href="/media-coordinator/gallery"
						className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
					>
						<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
							<Image
								src="/singleClass.png"
								alt="Gallery"
								width={24}
								height={24}
								className="brightness-0 invert"
							/>
						</div>
						<div>
							<h3 className="font-semibold text-gray-800">Manage Gallery</h3>
							<p className="text-sm text-gray-600">
								Add, edit, or remove gallery items
							</p>
						</div>
					</Link>

					<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-50 cursor-not-allowed">
						<div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
							<span className="text-2xl">📹</span>
						</div>
						<div>
							<h3 className="font-semibold text-gray-600">Video Library</h3>
							<p className="text-sm text-gray-500">Coming soon</p>
						</div>
					</div>

					<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-50 cursor-not-allowed">
						<div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
							<span className="text-2xl">📰</span>
						</div>
						<div>
							<h3 className="font-semibold text-gray-600">News & Updates</h3>
							<p className="text-sm text-gray-500">Coming soon</p>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Activity */}
			<div className="bg-white p-6 rounded-md shadow-md">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Category Distribution
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center p-4 bg-blue-50 rounded-lg">
						<div className="text-3xl mb-2">🏫</div>
						<div className="text-2xl font-bold text-blue-600">
							{facilitiesCount}
						</div>
						<div className="text-sm text-gray-600">Facilities</div>
					</div>
					<div className="text-center p-4 bg-purple-50 rounded-lg">
						<div className="text-3xl mb-2">🎉</div>
						<div className="text-2xl font-bold text-purple-600">
							{eventsCount}
						</div>
						<div className="text-sm text-gray-600">Events</div>
					</div>
					<div className="text-center p-4 bg-orange-50 rounded-lg">
						<div className="text-3xl mb-2">🎨</div>
						<div className="text-2xl font-bold text-orange-600">
							{activitiesCount}
						</div>
						<div className="text-sm text-gray-600">Activities</div>
					</div>
					<div className="text-center p-4 bg-green-50 rounded-lg">
						<div className="text-3xl mb-2">🏆</div>
						<div className="text-2xl font-bold text-green-600">
							{achievementsCount}
						</div>
						<div className="text-sm text-gray-600">Achievements</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MediaCoordinatorPage;
