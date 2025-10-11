import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { FeeStructure, Class, Grade, Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type FeeStructureList = FeeStructure & {
	class: Class | null;
	grade: Grade | null;
};

const FeeStructureListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	const columns = [
		{
			header: "Fee Name",
			accessor: "name",
		},
		{
			header: "Amount",
			accessor: "amount",
			className: "hidden md:table-cell",
		},
		{
			header: "Frequency",
			accessor: "frequency",
			className: "hidden md:table-cell",
		},
		{
			header: "Type",
			accessor: "feeType",
			className: "hidden lg:table-cell",
		},
		{
			header: "Class",
			accessor: "class",
			className: "hidden lg:table-cell",
		},
		{
			header: "Grade",
			accessor: "grade",
			className: "hidden lg:table-cell",
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

	const renderRow = (item: FeeStructureList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="flex items-center gap-4 p-4">{item.name}</td>
			<td className="hidden md:table-cell">₹{item.amount}</td>
			<td className="hidden md:table-cell">
				{item.frequency.replace("_", " ")}
			</td>
			<td className="hidden lg:table-cell">{item.feeType}</td>
			<td className="hidden lg:table-cell">{item.class?.name || "-"}</td>
			<td className="hidden lg:table-cell">
				{item.grade ? `Grade ${item.grade.level}` : "-"}
			</td>
			{role === "admin" && (
				<td>
					<div className="flex items-center gap-2">
						<FormContainer table="feeStructure" type="update" data={item} />
						<FormContainer table="feeStructure" type="delete" id={item.id} />
					</div>
				</td>
			)}
		</tr>
	);

	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.FeeStructureWhereInput = {};

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

	const [data, count] = await prisma.$transaction([
		prisma.feeStructure.findMany({
			where: query,
			include: {
				class: true,
				grade: true,
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.feeStructure.count({ where: query }),
	]);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					All Fee Structures
				</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					{role === "admin" && (
						<FormContainer table="feeStructure" type="create" />
					)}
				</div>
			</div>
			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={data} />
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default FeeStructureListPage;
