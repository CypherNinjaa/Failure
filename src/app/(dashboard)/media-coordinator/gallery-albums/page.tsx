import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import { Prisma } from "@prisma/client";
import GalleryAlbumFilters from "@/components/GalleryAlbumFilters";

type GalleryAlbumList = {
	id: number;
	type: string;
	src: string;
	title: string;
	description: string;
	category: string;
	eventDate: Date | null;
	photographer: string | null;
	duration: string | null;
	thumbnail: string | null;
	likes: number;
	views: number;
	featured: boolean;
	isActive: boolean;
	displayOrder: number;
};

const GalleryAlbumManagementPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only media-coordinator and admin can access this page
	if (role !== "media-coordinator" && role !== "admin") {
		return (
			<div className="p-6">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					Access Denied. Only Media Coordinators and Admins can access this
					page.
				</div>
			</div>
		);
	}

	const resolvedSearchParams = await searchParams;
	const { page, type, category, status, featured, ...queryParams } =
		resolvedSearchParams;
	const p = page ? parseInt(page) : 1;

	// Build query
	const query: Prisma.GalleryAlbumWhereInput = {};

	if (queryParams.search) {
		query.OR = [
			{ title: { contains: queryParams.search, mode: "insensitive" } },
			{ description: { contains: queryParams.search, mode: "insensitive" } },
			{ photographer: { contains: queryParams.search, mode: "insensitive" } },
		];
	}

	if (type && (type === "IMAGE" || type === "VIDEO")) {
		query.type = type as any;
	}

	if (category) {
		query.category = category as any;
	}

	if (status === "active") {
		query.isActive = true;
	} else if (status === "inactive") {
		query.isActive = false;
	}

	if (featured === "true") {
		query.featured = true;
	}

	const [data, count] = await prisma.$transaction([
		prisma.galleryAlbum.findMany({
			where: query,
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
			orderBy: [{ displayOrder: "desc" }, { createdAt: "desc" }],
		}),
		prisma.galleryAlbum.count({ where: query }),
	]);

	const columns = [
		{
			header: "Preview",
			accessor: "preview",
			className: "hidden md:table-cell",
		},
		{
			header: "Title",
			accessor: "title",
		},
		{
			header: "Category",
			accessor: "category",
			className: "hidden md:table-cell",
		},
		{
			header: "Type",
			accessor: "type",
			className: "hidden lg:table-cell",
		},
		{
			header: "Stats",
			accessor: "stats",
			className: "hidden xl:table-cell",
		},
		{
			header: "Status",
			accessor: "status",
			className: "hidden lg:table-cell",
		},
		{
			header: "Actions",
			accessor: "actions",
		},
	];

	const renderRow = (item: GalleryAlbumList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="hidden md:table-cell p-4">
				<div
					className={`relative w-16 h-16 rounded overflow-hidden ${
						item.thumbnail
							? `bg-gradient-to-br ${item.thumbnail}`
							: "bg-gray-200"
					}`}
				>
					<Image
						src={item.src}
						alt={item.title}
						fill
						className="object-cover"
						sizes="64px"
					/>
					{item.featured && (
						<div className="absolute top-1 right-1 bg-yellow-400 rounded-full p-1">
							<span className="text-xs">⭐</span>
						</div>
					)}
				</div>
			</td>
			<td className="p-4">
				<div className="flex flex-col">
					<span className="font-semibold flex items-center gap-1">
						{item.title}
						{item.featured && (
							<span className="text-yellow-500 md:hidden">⭐</span>
						)}
					</span>
					<span className="text-xs text-gray-500 md:hidden">
						{item.category}
					</span>
					{item.eventDate && (
						<span className="text-xs text-gray-400">
							{new Date(item.eventDate).toLocaleDateString()}
						</span>
					)}
					{item.photographer && (
						<span className="text-xs text-gray-400">
							📸 {item.photographer}
						</span>
					)}
					{item.duration && (
						<span className="text-xs text-gray-400">⏱️ {item.duration}</span>
					)}
				</div>
			</td>
			<td className="hidden md:table-cell p-4">
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${
						item.category === "EVENTS"
							? "bg-blue-100 text-blue-700"
							: item.category === "SPORTS"
							? "bg-green-100 text-green-700"
							: item.category === "ACADEMICS"
							? "bg-purple-100 text-purple-700"
							: item.category === "CULTURAL"
							? "bg-pink-100 text-pink-700"
							: item.category === "ACHIEVEMENTS"
							? "bg-orange-100 text-orange-700"
							: "bg-indigo-100 text-indigo-700"
					}`}
				>
					{item.category}
				</span>
			</td>
			<td className="hidden lg:table-cell p-4">
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${
						item.type === "IMAGE"
							? "bg-blue-100 text-blue-700"
							: "bg-red-100 text-red-700"
					}`}
				>
					{item.type === "IMAGE" ? "📷 Image" : "🎥 Video"}
				</span>
			</td>
			<td className="hidden xl:table-cell p-4">
				<div className="flex flex-col gap-1 text-xs">
					<span className="text-gray-600">❤️ {item.likes} likes</span>
					<span className="text-gray-600">👁️ {item.views} views</span>
				</div>
			</td>
			<td className="hidden lg:table-cell p-4">
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${
						item.isActive
							? "bg-green-100 text-green-700"
							: "bg-gray-100 text-gray-700"
					}`}
				>
					{item.isActive ? "Active" : "Inactive"}
				</span>
			</td>
			<td className="p-4">
				<div className="flex items-center gap-2">
					<FormModal table="galleryAlbum" type="update" data={item} />
					<FormModal table="galleryAlbum" type="delete" id={item.id} />
				</div>
			</td>
		</tr>
	);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between mb-4">
				<h1 className="hidden md:block text-lg font-semibold">
					Gallery Albums Management
				</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					<div className="flex items-center gap-4 self-end">
						{/* Filter Dropdowns */}
						<GalleryAlbumFilters />

						<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
							<Image src="/filter.png" alt="" width={14} height={14} />
						</button>
						<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
							<Image src="/sort.png" alt="" width={14} height={14} />
						</button>
						<FormModal table="galleryAlbum" type="create" />
					</div>
				</div>
			</div>

			{/* Info Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
				<div className="bg-blue-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-blue-600">{count}</div>
					<div className="text-xs text-gray-600">Total Albums</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-green-600">
						{data.filter((item) => item.isActive).length}
					</div>
					<div className="text-xs text-gray-600">Active</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-purple-600">
						{data.filter((item) => item.type === "IMAGE").length}
					</div>
					<div className="text-xs text-gray-600">Images</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-red-600">
						{data.filter((item) => item.type === "VIDEO").length}
					</div>
					<div className="text-xs text-gray-600">Videos</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-yellow-600">
						{data.filter((item) => item.featured).length}
					</div>
					<div className="text-xs text-gray-600">Featured</div>
				</div>
				<div className="bg-pink-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-pink-600">
						{data.reduce((sum, item) => sum + item.likes, 0)}
					</div>
					<div className="text-xs text-gray-600">Total Likes</div>
				</div>
			</div>

			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={data} />
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default GalleryAlbumManagementPage;
