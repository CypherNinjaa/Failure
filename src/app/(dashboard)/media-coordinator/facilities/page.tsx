import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, Facility } from "@prisma/client";
import Image from "next/image";

type FacilityList = Facility;

const FacilityListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.FacilityWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.OR = [
							{ title: { contains: value, mode: "insensitive" } },
							{ description: { contains: value, mode: "insensitive" } },
						];
						break;
					default:
						break;
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.facility.findMany({
			where: query,
			orderBy: { displayOrder: "asc" },
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.facility.count({ where: query }),
	]);

	const columns = [
		{
			header: "Title",
			accessor: "title",
		},
		{
			header: "Icon",
			accessor: "icon",
			className: "hidden md:table-cell",
		},
		{
			header: "Features Count",
			accessor: "features",
			className: "hidden lg:table-cell",
		},
		{
			header: "Status",
			accessor: "status",
			className: "hidden md:table-cell",
		},
		{
			header: "Display Order",
			accessor: "displayOrder",
			className: "hidden md:table-cell",
		},
		{
			header: "Actions",
			accessor: "action",
		},
	];

	const renderRow = (item: FacilityList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="flex items-center gap-4 p-4">
				<div className="text-2xl">{item.image}</div>
				<div className="flex flex-col">
					<h3 className="font-semibold">{item.title}</h3>
					<p className="text-xs text-gray-500 line-clamp-1">
						{item.description}
					</p>
				</div>
			</td>
			<td className="hidden md:table-cell">{item.icon}</td>
			<td className="hidden lg:table-cell">
				{Array.isArray(item.features) ? item.features.length : 0} features
			</td>
			<td className="hidden md:table-cell">
				<span
					className={`px-2 py-1 rounded-full text-xs ${
						item.isActive
							? "bg-green-100 text-green-700"
							: "bg-red-100 text-red-700"
					}`}
				>
					{item.isActive ? "Active" : "Inactive"}
				</span>
			</td>
			<td className="hidden md:table-cell">{item.displayOrder}</td>
			<td>
				<div className="flex items-center gap-2">
					<FormModal table="facility" type="update" data={item} />
					<FormModal table="facility" type="delete" id={item.id} />
				</div>
			</td>
		</tr>
	);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					Facilities Management
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
						<FormModal table="facility" type="create" />
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

export default FacilityListPage;
