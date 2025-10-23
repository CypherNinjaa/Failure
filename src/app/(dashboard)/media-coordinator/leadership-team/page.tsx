import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, LeadershipMember } from "@prisma/client";
import Image from "next/image";

type LeadershipMemberList = LeadershipMember;

const LeadershipTeamListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.LeadershipMemberWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.OR = [
							{ name: { contains: value, mode: "insensitive" } },
							{ position: { contains: value, mode: "insensitive" } },
							{ specialization: { contains: value, mode: "insensitive" } },
						];
						break;
					case "category":
						query.category = value;
						break;
					default:
						break;
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.leadershipMember.findMany({
			where: query,
			orderBy: { displayOrder: "asc" },
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.leadershipMember.count({ where: query }),
	]);

	const columns = [
		{
			header: "Name",
			accessor: "name",
		},
		{
			header: "Position",
			accessor: "position",
		},
		{
			header: "Category",
			accessor: "category",
			className: "hidden md:table-cell",
		},
		{
			header: "Email",
			accessor: "email",
			className: "hidden lg:table-cell",
		},
		{
			header: "Specialization",
			accessor: "specialization",
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

	const renderRow = (item: LeadershipMemberList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="flex items-center gap-4 p-4">
				<div className="text-2xl">{item.photo}</div>
				<div className="flex flex-col">
					<h3 className="font-semibold">{item.name}</h3>
				</div>
			</td>
			<td>{item.position}</td>
			<td className="hidden md:table-cell">
				<span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs capitalize">
					{item.category}
				</span>
			</td>
			<td className="hidden lg:table-cell">{item.email || "N/A"}</td>
			<td className="hidden lg:table-cell">
				<p className="line-clamp-1">{item.specialization || "N/A"}</p>
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
					<FormModal table="leadershipMember" type="update" data={item} />
					<FormModal table="leadershipMember" type="delete" id={item.id} />
				</div>
			</td>
		</tr>
	);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					Leadership Team
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
						<FormModal table="leadershipMember" type="create" />
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

export default LeadershipTeamListPage;
