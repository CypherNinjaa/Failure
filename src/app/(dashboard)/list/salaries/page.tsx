import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Salary, Teacher, Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

type SalaryList = Salary & {
	teacher: Teacher | null;
};

const SalariesListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	const columns = [
		{
			header: "Name",
			accessor: "name",
		},
		{
			header: "Amount",
			accessor: "amount",
			className: "hidden md:table-cell",
		},
		{
			header: "Month",
			accessor: "month",
			className: "hidden md:table-cell",
		},
		{
			header: "Year",
			accessor: "year",
			className: "hidden lg:table-cell",
		},
		{
			header: "Status",
			accessor: "status",
		},
		{
			header: "Paid Date",
			accessor: "paidDate",
			className: "hidden lg:table-cell",
		},
	];

	const renderRow = (item: SalaryList) => {
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		const statusColors = {
			PAID: "bg-green-100 text-green-800",
			PENDING: "bg-yellow-100 text-yellow-800",
		};

		return (
			<tr
				key={item.id}
				className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
			>
				<td className="flex items-center gap-4 p-4">
					{item.teacher
						? `${item.teacher.name} ${item.teacher.surname}`
						: item.staffName}
				</td>
				<td className="hidden md:table-cell">₹{item.amount}</td>
				<td className="hidden md:table-cell">{monthNames[item.month - 1]}</td>
				<td className="hidden lg:table-cell">{item.year}</td>
				<td>
					<span
						className={`px-2 py-1 rounded-full text-xs font-semibold ${
							statusColors[item.status as keyof typeof statusColors]
						}`}
					>
						{item.status}
					</span>
				</td>
				<td className="hidden lg:table-cell">
					{item.paidDate
						? new Intl.DateTimeFormat("en-IN").format(item.paidDate)
						: "-"}
				</td>
			</tr>
		);
	};

	const { page, ...queryParams } = searchParams;

	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.SalaryWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.OR = [
							{
								teacher: {
									name: { contains: value, mode: "insensitive" },
								},
							},
							{
								staffName: { contains: value, mode: "insensitive" },
							},
						];
						break;
					default:
						break;
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.salary.findMany({
			where: query,
			include: {
				teacher: true,
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
			orderBy: [{ year: "desc" }, { month: "desc" }],
		}),
		prisma.salary.count({ where: query }),
	]);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">All Salaries</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					{role === "admin" && <FormContainer table="salary" type="create" />}
				</div>
			</div>
			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={data} />
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default SalariesListPage;
