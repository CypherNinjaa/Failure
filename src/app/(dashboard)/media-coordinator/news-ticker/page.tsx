import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import NewsTickerFilters from "@/components/NewsTickerFilters";
import { NewsTickerType, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

type NewsTickerItem = {
	id: number;
	icon: string;
	text: string;
	type: NewsTickerType;
	isActive: boolean;
	displayOrder: number;
	createdAt: Date;
};

const columns = [
	{
		header: "Icon",
		accessor: "icon",
	},
	{
		header: "Text",
		accessor: "text",
		className: "hidden md:table-cell",
	},
	{
		header: "Type",
		accessor: "type",
		className: "hidden md:table-cell",
	},
	{
		header: "Status",
		accessor: "isActive",
		className: "hidden lg:table-cell",
	},
	{
		header: "Order",
		accessor: "displayOrder",
		className: "hidden lg:table-cell",
	},
	{
		header: "Actions",
		accessor: "action",
	},
];

const renderRow = (item: NewsTickerItem) => (
	<tr
		key={item.id}
		className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
	>
		<td className="flex items-center gap-4 p-4">
			<div className="text-2xl">{item.icon}</div>
		</td>
		<td className="hidden md:table-cell">{item.text}</td>
		<td className="hidden md:table-cell">
			<span
				className={`px-2 py-1 rounded-full text-xs font-semibold ${
					item.type === "EVENT"
						? "bg-blue-100 text-blue-800"
						: item.type === "FACILITY"
						? "bg-green-100 text-green-800"
						: item.type === "ACHIEVEMENT"
						? "bg-yellow-100 text-yellow-800"
						: "bg-purple-100 text-purple-800"
				}`}
			>
				{item.type}
			</span>
		</td>
		<td className="hidden lg:table-cell">
			<span
				className={`px-2 py-1 rounded-full text-xs font-semibold ${
					item.isActive
						? "bg-green-100 text-green-800"
						: "bg-gray-100 text-gray-800"
				}`}
			>
				{item.isActive ? "Active" : "Inactive"}
			</span>
		</td>
		<td className="hidden lg:table-cell">{item.displayOrder}</td>
		<td>
			<div className="flex items-center gap-2">
				<FormModal table="newsTicker" type="update" data={item} />
				<FormModal table="newsTicker" type="delete" id={item.id} />
			</div>
		</td>
	</tr>
);

const NewsTickerListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	const { page, search, type, status } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.NewsTickerItemWhereInput = {};

	if (search) {
		query.text = { contains: search, mode: "insensitive" };
	}

	if (type && type !== "all") {
		query.type = type as NewsTickerType;
	}

	if (status) {
		query.isActive = status === "active";
	}

	const [data, count] = await prisma.$transaction([
		prisma.newsTickerItem.findMany({
			where: query,
			orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.newsTickerItem.count({ where: query }),
	]);

	// Calculate stats for the cards
	const stats = await prisma.$transaction([
		prisma.newsTickerItem.count(),
		prisma.newsTickerItem.count({ where: { isActive: true } }),
		prisma.newsTickerItem.count({ where: { isActive: false } }),
		prisma.newsTickerItem.groupBy({
			by: ["type"],
			_count: true,
		}),
	]);

	const [totalItems, activeItems, inactiveItems, byType] = stats;

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between mb-5">
				<h1 className="hidden md:block text-lg font-semibold">
					News Ticker Management
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
							<FormModal table="newsTicker" type="create" />
						)}
					</div>
				</div>
			</div>

			{/* STATS CARDS */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
				<div className="bg-lamaSky rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 text-sm">Total Items</p>
							<h3 className="text-2xl font-bold">{totalItems}</h3>
						</div>
						<div className="text-3xl">📰</div>
					</div>
				</div>

				<div className="bg-lamaYellow rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 text-sm">Active</p>
							<h3 className="text-2xl font-bold">{activeItems}</h3>
						</div>
						<div className="text-3xl">✅</div>
					</div>
				</div>

				<div className="bg-lamaPurple rounded-lg p-4 text-white">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-white text-sm opacity-80">Inactive</p>
							<h3 className="text-2xl font-bold">{inactiveItems}</h3>
						</div>
						<div className="text-3xl">⏸️</div>
					</div>
				</div>

				<div className="bg-lamaSkyLight rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-600 text-sm">Types</p>
							<h3 className="text-2xl font-bold">{byType.length}</h3>
						</div>
						<div className="text-3xl">🏷️</div>
					</div>
				</div>
			</div>

			{/* FILTER OPTIONS */}
			<NewsTickerFilters />

			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={data} />

			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default NewsTickerListPage;
