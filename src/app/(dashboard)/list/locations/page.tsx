import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import FormModal from "@/components/FormModal";

type LocationList = {
	id: number;
	name: string;
	address: string | null;
	latitude: number;
	longitude: number;
	radius: number;
	isActive: boolean;
	_count: {
		teacherAttendances: number;
	};
};

const LocationsListPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only admins can access this page
	if (role !== "admin") {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
					<p className="text-red-800">
						Access denied. Only administrators can manage locations.
					</p>
				</div>
			</div>
		);
	}

	const columns = [
		{
			header: "Location Name",
			accessor: "name",
		},
		{
			header: "Address",
			accessor: "address",
			className: "hidden md:table-cell",
		},
		{
			header: "Coordinates",
			accessor: "coordinates",
			className: "hidden lg:table-cell",
		},
		{
			header: "Radius (m)",
			accessor: "radius",
			className: "hidden md:table-cell",
		},
		{
			header: "Status",
			accessor: "isActive",
		},
		{
			header: "Usage",
			accessor: "usage",
			className: "hidden xl:table-cell",
		},
		{
			header: "Actions",
			accessor: "action",
		},
	];

	const renderRow = (item: LocationList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="p-4">
				<div className="flex flex-col">
					<span className="font-medium">{item.name}</span>
					<span className="text-xs text-gray-500 md:hidden">
						{item.address || "No address"}
					</span>
				</div>
			</td>
			<td className="hidden md:table-cell">
				<span className="text-sm text-gray-600">{item.address || "N/A"}</span>
			</td>
			<td className="hidden lg:table-cell">
				<div className="flex flex-col text-xs text-gray-600">
					<span>Lat: {item.latitude.toFixed(6)}</span>
					<span>Lon: {item.longitude.toFixed(6)}</span>
				</div>
			</td>
			<td className="hidden md:table-cell">
				<span className="text-sm">{item.radius}m</span>
			</td>
			<td>
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold ${
						item.isActive
							? "bg-green-100 text-green-800"
							: "bg-gray-100 text-gray-800"
					}`}
				>
					{item.isActive ? "Active" : "Inactive"}
				</span>
			</td>
			<td className="hidden xl:table-cell">
				<span className="text-sm text-gray-600">
					{item._count.teacherAttendances} records
				</span>
			</td>
			<td>
				<div className="flex items-center gap-2">
					<FormModal table="location" type="update" data={item} />
					<FormModal table="location" type="delete" id={item.id} />
				</div>
			</td>
		</tr>
	);

	const resolvedSearchParams = await searchParams;
	const { page, ...queryParams } = resolvedSearchParams;

	const p = page ? parseInt(page) : 1;

	// Build query
	const query: any = {};

	if (queryParams.search) {
		query.OR = [
			{ name: { contains: queryParams.search, mode: "insensitive" } },
			{ address: { contains: queryParams.search, mode: "insensitive" } },
		];
	}

	const [data, count] = await prisma.$transaction([
		prisma.location.findMany({
			where: query,
			include: {
				_count: {
					select: {
						teacherAttendances: true,
					},
				},
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
			orderBy: {
				createdAt: "desc",
			},
		}),
		prisma.location.count({ where: query }),
	]);

	// Fetch attendance time settings
	const attendanceSettings = await prisma.attendanceSettings.findFirst({
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* ATTENDANCE TIME SETTINGS */}
			<div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
						<svg
							className="w-5 h-5 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Attendance Time Window
					</h2>
				</div>

				{attendanceSettings ? (
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
						<div className="flex items-center gap-6">
							<div>
								<p className="text-xs text-gray-500 mb-1">Start Time</p>
								<p className="text-xl font-bold text-green-700">
									{attendanceSettings.startTime}
								</p>
							</div>
							<div className="text-gray-400 text-2xl">→</div>
							<div>
								<p className="text-xs text-gray-500 mb-1">End Time</p>
								<p className="text-xl font-bold text-red-700">
									{attendanceSettings.endTime}
								</p>
							</div>
							<div
								className={`px-3 py-1 rounded-full text-xs font-semibold ${
									attendanceSettings.isActive
										? "bg-green-100 text-green-800"
										: "bg-gray-100 text-gray-800"
								}`}
							>
								{attendanceSettings.isActive ? "Active ✓" : "Inactive"}
							</div>
						</div>
						<Link
							href="/admin/attendance-settings"
							className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
						>
							Edit Time Window
						</Link>
					</div>
				) : (
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-600">
							No time window set. Teachers can mark attendance anytime.
						</p>
						<Link
							href="/admin/attendance-settings"
							className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
						>
							Set Time Window
						</Link>
					</div>
				)}

				<div className="mt-3 text-xs text-gray-600 flex items-start gap-2">
					<svg
						className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>
						Teachers can only mark attendance during this time window. Outside
						these hours, the attendance system will be disabled.
					</span>
				</div>
			</div>

			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					Attendance Locations
				</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					<div className="flex items-center gap-4 self-end">
						<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
							<Image src="/filter.png" alt="" width={14} height={14} />
						</button>
						<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
							<Image src="/sort.png" alt="" width={14} height={14} />
						</button>
						<FormModal table="location" type="create" />
					</div>
				</div>
			</div>
			{/* INFO */}
			<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<h3 className="font-semibold text-blue-900 mb-2">📍 About Locations</h3>
				<p className="text-sm text-blue-800">
					Locations define where teachers can mark their attendance. Each
					location has GPS coordinates and a radius. Teachers must be within the
					radius to mark attendance.
				</p>
			</div>
			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={data} />
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default LocationsListPage;
