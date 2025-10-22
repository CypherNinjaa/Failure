import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, TestimonialStatus } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import TestimonialReviewActions from "@/components/TestimonialReviewActions";

type TestimonialList = {
	id: number;
	name: string;
	role: string;
	avatar: string;
	content: string;
	rating: number;
	status: TestimonialStatus;
	isPublished: boolean;
	createdAt: Date;
	email: string | null;
	phone: string | null;
};

const TestimonialListPage = async ({
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
			header: "Role",
			accessor: "role",
			className: "hidden md:table-cell",
		},
		{
			header: "Content",
			accessor: "content",
			className: "hidden lg:table-cell",
		},
		{
			header: "Rating",
			accessor: "rating",
			className: "hidden md:table-cell",
		},
		{
			header: "Status",
			accessor: "status",
		},
		{
			header: "Submitted",
			accessor: "createdAt",
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

	const renderRow = (item: TestimonialList) => (
		<tr
			key={item.id}
			className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
		>
			<td className="flex items-center gap-4 p-4">
				<div className="flex flex-col">
					<h3 className="font-semibold">{item.name}</h3>
					<p className="text-xs text-gray-500">
						<span className="text-2xl mr-1">{item.avatar}</span>
					</p>
				</div>
			</td>
			<td className="hidden md:table-cell">{item.role}</td>
			<td className="hidden lg:table-cell">
				<p className="line-clamp-2 max-w-md">{item.content}</p>
			</td>
			<td className="hidden md:table-cell">
				<div className="flex items-center gap-1">
					{Array.from({ length: item.rating }).map((_, i) => (
						<span key={i}>⭐</span>
					))}
				</div>
			</td>
			<td>
				<span
					className={`px-2 py-1 rounded-full text-xs font-semibold ${
						item.status === "APPROVED"
							? "bg-green-100 text-green-700"
							: item.status === "REJECTED"
							? "bg-red-100 text-red-700"
							: "bg-yellow-100 text-yellow-700"
					}`}
				>
					{item.status}
				</span>
			</td>
			<td className="hidden lg:table-cell">
				{new Intl.DateTimeFormat("en-US").format(item.createdAt)}
			</td>
			<td>
				<div className="flex items-center gap-2">
					{(role === "admin" || role === "media-coordinator") && (
						<>
							<TestimonialReviewActions
								testimonialId={item.id}
								currentStatus={item.status}
							/>
							<FormContainer table="testimonial" type="update" data={item} />
							<FormContainer table="testimonial" type="delete" id={item.id} />
						</>
					)}
				</div>
			</td>
		</tr>
	);

	const { page, ...queryParams } = searchParams;
	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: Prisma.TestimonialWhereInput = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.OR = [
							{ name: { contains: value, mode: "insensitive" } },
							{ role: { contains: value, mode: "insensitive" } },
							{ content: { contains: value, mode: "insensitive" } },
						];
						break;
					case "status":
						query.status = value as TestimonialStatus;
						break;
					default:
						break;
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.testimonial.findMany({
			where: query,
			orderBy: {
				createdAt: "desc",
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.testimonial.count({ where: query }),
	]);

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					All Testimonials
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

export default TestimonialListPage;
