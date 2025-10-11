import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Badge, Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

type BadgeList = Badge & {
	_count: { studentBadges: number };
};

const BadgeListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.BadgeWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.name = { contains: value, mode: "insensitive" };
						break;
					default:
						break;
				}
			}
		}
	}

	const [badges, count] = await prisma.$transaction([
		prisma.badge.findMany({
			where: query,
			include: {
				_count: {
					select: { studentBadges: true },
				},
			},
			orderBy: {
				priority: "asc",
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.badge.count({ where: query }),
	]);

	const columns = [
		{
			header: "Icon",
			accessor: "icon",
			className: "hidden md:table-cell",
		},
		{
			header: "Badge Name",
			accessor: "name",
		},
		{
			header: "Description",
			accessor: "description",
			className: "hidden lg:table-cell",
		},
		{
			header: "Color",
			accessor: "color",
			className: "hidden md:table-cell",
		},
		{
			header: "Students",
			accessor: "students",
			className: "hidden lg:table-cell",
		},
		{
			header: "Status",
			accessor: "status",
		},
		...(role === "admin"
			? [
					{
						header: "Actions",
						accessor: "action",
					},
			  ]
			: []),
	];

	const renderRow = (item: BadgeList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="hidden md:table-cell">
				<div className="text-3xl">{item.icon || "🏅"}</div>
			</td>
			<td className="font-semibold">{item.name}</td>
			<td className="hidden lg:table-cell">
				<div className="text-xs text-gray-600 line-clamp-2">
					{item.description || "No description"}
				</div>
			</td>
			<td className="hidden md:table-cell">
				<div className="flex items-center gap-2">
					<div
						className="w-8 h-8 rounded-full border-2"
						style={{ backgroundColor: item.color }}
					></div>
					<span className="text-xs text-gray-500">{item.color}</span>
				</div>
			</td>
			<td className="hidden lg:table-cell">
				<span className="px-3 py-1 rounded-full bg-lamaSkyLight text-lamaSky text-xs font-medium">
					{item._count.studentBadges} students
				</span>
			</td>
			<td>
				{item.isActive ? (
					<span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
						Active
					</span>
				) : (
					<span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
						Inactive
					</span>
				)}
			</td>
			<td>
				<div className="flex items-center gap-2">
					{role === "admin" && (
						<>
							<FormModal table="badge" type="update" data={item} />
							<FormModal table="badge" type="delete" id={item.id} />
						</>
					)}
				</div>
			</td>
		</tr>
	);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">All Badges</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					<div className="flex items-center gap-4 self-end">
						<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
							<Image src="/filter.png" alt="" width={14} height={14} />
						</button>
						<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
							<Image src="/sort.png" alt="" width={14} height={14} />
						</button>
						{role === "admin" && <FormModal table="badge" type="create" />}
					</div>
				</div>
			</div>
			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={badges} />
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default BadgeListPage;
