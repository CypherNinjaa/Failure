import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import Image from "next/image";

type StatItem = {
	id: number;
	value: number;
	suffix: string;
	label: string;
	emoji: string;
	iconName: string;
	gradient: string;
	displayOrder: number;
	isActive: boolean;
};

const StatsListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only media-coordinator and admin can access this page
	if (role !== "media-coordinator" && role !== "admin") {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-gray-500">
					You don&apos;t have permission to view this page.
				</p>
			</div>
		);
	}

	const { page, ...queryParams } = searchParams;
	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.StatItemWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.label = { contains: value, mode: "insensitive" };
						break;
					default:
						break;
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.statItem.findMany({
			where: query,
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
			orderBy: { displayOrder: "asc" },
		}),
		prisma.statItem.count({ where: query }),
	]);

	// Calculate stats
	const totalStats = await prisma.statItem.count();
	const activeStats = await prisma.statItem.count({
		where: { isActive: true },
	});
	const inactiveStats = totalStats - activeStats;

	const columns = [
		{
			header: "Value",
			accessor: "value",
			className: "hidden md:table-cell",
		},
		{
			header: "Label",
			accessor: "label",
		},
		{
			header: "Icon",
			accessor: "icon",
			className: "hidden md:table-cell",
		},
		{
			header: "Status",
			accessor: "status",
			className: "hidden lg:table-cell",
		},
		{
			header: "Order",
			accessor: "order",
			className: "hidden lg:table-cell",
		},
		...(role === "admin" || role === "media-coordinator"
			? [
					{
						header: "Actions",
						accessor: "action",
					},
			  ]
			: []),
	];

	const renderRow = (item: StatItem) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="hidden md:table-cell px-4 py-4">
				<div className="flex items-center gap-2">
					<span className="font-bold text-lg">{item.value}</span>
					<span className="text-gray-500">{item.suffix}</span>
				</div>
			</td>
			<td className="px-4 py-4">
				<div className="flex items-center gap-2">
					<span className="text-2xl">{item.emoji}</span>
					<span className="font-medium">{item.label}</span>
				</div>
			</td>
			<td className="hidden md:table-cell px-4 py-4">
				<span className="text-xs bg-gray-100 px-2 py-1 rounded">
					{item.iconName}
				</span>
			</td>
			<td className="hidden lg:table-cell px-4 py-4">
				<span
					className={`text-xs px-2 py-1 rounded-full font-medium ${
						item.isActive
							? "bg-green-100 text-green-700"
							: "bg-red-100 text-red-700"
					}`}
				>
					{item.isActive ? "Active" : "Inactive"}
				</span>
			</td>
			<td className="hidden lg:table-cell px-4 py-4">
				<span className="text-sm">{item.displayOrder}</span>
			</td>
			<td className="px-4 py-4">
				<div className="flex items-center gap-2">
					{(role === "admin" || role === "media-coordinator") && (
						<>
							<FormContainer table="stat" type="update" data={item} />
							<FormContainer table="stat" type="delete" id={item.id} />
						</>
					)}
				</div>
			</td>
		</tr>
	);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between mb-5">
				<h1 className="text-lg font-semibold hidden md:block">
					Stats Management
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
						{(role === "admin" || role === "media-coordinator") && (
							<FormContainer table="stat" type="create" />
						)}
					</div>
				</div>
			</div>

			{/* STATS CARDS */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
				<div className="bg-lamaSkyLight p-4 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Total Stats</p>
							<h3 className="text-2xl font-bold">{totalStats}</h3>
						</div>
						<div className="bg-lamaSky p-3 rounded-full">
							<Image src="/chart.png" alt="" width={24} height={24} />
						</div>
					</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Active</p>
							<h3 className="text-2xl font-bold text-green-600">
								{activeStats}
							</h3>
						</div>
						<div className="bg-green-200 p-3 rounded-full">
							<Image src="/check.png" alt="" width={24} height={24} />
						</div>
					</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Inactive</p>
							<h3 className="text-2xl font-bold text-red-600">
								{inactiveStats}
							</h3>
						</div>
						<div className="bg-red-200 p-3 rounded-full">
							<Image src="/close.png" alt="" width={24} height={24} />
						</div>
					</div>
				</div>
			</div>

			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={data} />

			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default StatsListPage;
