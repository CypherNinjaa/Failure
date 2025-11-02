import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Mail, Phone, Clock, CheckCircle, AlertCircle } from "lucide-react";
import ContactSubmissionActions from "@/components/ContactSubmissionActions";

type ContactSubmission = {
	id: number;
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	type: string;
	status: "NEW" | "PENDING" | "RESOLVED";
	createdAt: Date;
	notes?: string | null;
	resolvedAt?: Date | null;
	resolvedBy?: string | null;
};

const columns = [
	{
		header: "Name & Email",
		accessor: "info",
	},
	{
		header: "Subject",
		accessor: "subject",
		className: "hidden md:table-cell",
	},
	{
		header: "Type",
		accessor: "type",
		className: "hidden lg:table-cell",
	},
	{
		header: "Status",
		accessor: "status",
	},
	{
		header: "Submitted",
		accessor: "createdAt",
		className: "hidden md:table-cell",
	},
	{
		header: "Actions",
		accessor: "actions",
	},
];

const ContactSubmissionsPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		return (
			<div className="p-4 flex items-center justify-center h-full">
				<p className="text-xl text-muted-foreground">Unauthorized access!</p>
			</div>
		);
	}

	const { page, ...queryParams } = searchParams;
	const p = page ? parseInt(page) : 1;

	// URL PARAMS CONDITION
	const query: any = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case "search":
						query.OR = [
							{ name: { contains: value, mode: "insensitive" } },
							{ email: { contains: value, mode: "insensitive" } },
							{ subject: { contains: value, mode: "insensitive" } },
						];
						break;
					case "status":
						query.status = value;
						break;
					case "type":
						query.type = value;
						break;
					default:
						break;
				}
			}
		}
	}

	const [submissions, count] = await prisma.$transaction([
		prisma.contactSubmission.findMany({
			where: query,
			orderBy: { createdAt: "desc" },
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.contactSubmission.count({ where: query }),
	]);

	const renderRow = (item: ContactSubmission) => {
		const getStatusColor = (status: string) => {
			switch (status) {
				case "NEW":
					return "bg-blue-100 text-blue-700";
				case "PENDING":
					return "bg-yellow-100 text-yellow-700";
				case "RESOLVED":
					return "bg-green-100 text-green-700";
				default:
					return "bg-gray-100 text-gray-700";
			}
		};

		const getTypeLabel = (type: string) => {
			const labels: { [key: string]: string } = {
				general: "General",
				admissions: "Admissions",
				academics: "Academics",
				facilities: "Facilities",
				support: "Support",
				other: "Other",
			};
			return labels[type] || type;
		};

		return (
			<tr
				key={item.id}
				className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
			>
				<td className="flex items-center gap-4 p-4">
					<div className="flex flex-col">
						<h3 className="font-semibold">{item.name}</h3>
						<p className="text-xs text-gray-500 flex items-center gap-1">
							<Mail className="w-3 h-3" />
							{item.email}
						</p>
						<p className="text-xs text-gray-500 flex items-center gap-1 lg:hidden">
							<Phone className="w-3 h-3" />
							{item.phone}
						</p>
					</div>
				</td>
				<td className="hidden md:table-cell">
					<div className="text-sm font-medium">{item.subject}</div>
					<div className="text-xs text-gray-500 truncate max-w-xs">
						{item.message.substring(0, 60)}...
					</div>
				</td>
				<td className="hidden lg:table-cell">
					<span className="px-2 py-1 rounded-full text-xs bg-gray-100">
						{getTypeLabel(item.type)}
					</span>
				</td>
				<td>
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
							item.status
						)}`}
					>
						{item.status}
					</span>
				</td>
				<td className="hidden md:table-cell">
					<div className="text-xs flex items-center gap-1">
						<Clock className="w-3 h-3" />
						{new Date(item.createdAt).toLocaleDateString()}
					</div>
				</td>
				<td>
					<ContactSubmissionActions submission={item} />
				</td>
			</tr>
		);
	};

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between">
				<h1 className="hidden md:block text-lg font-semibold">
					Contact Submissions
				</h1>
				<div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
					<TableSearch />
					<div className="flex items-center gap-4 self-end">
						<div className="flex gap-2 text-xs">
							<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
								<Image src="/filter.png" alt="" width={14} height={14} />
							</button>
							<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
								<Image src="/sort.png" alt="" width={14} height={14} />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* STATS */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
				<div className="bg-blue-50 p-4 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">New</p>
							<p className="text-2xl font-bold text-blue-600">
								{submissions.filter((s: any) => s.status === "NEW").length}
							</p>
						</div>
						<AlertCircle className="w-8 h-8 text-blue-600" />
					</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Pending</p>
							<p className="text-2xl font-bold text-yellow-600">
								{submissions.filter((s: any) => s.status === "PENDING").length}
							</p>
						</div>
						<Clock className="w-8 h-8 text-yellow-600" />
					</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Resolved</p>
							<p className="text-2xl font-bold text-green-600">
								{submissions.filter((s: any) => s.status === "RESOLVED").length}
							</p>
						</div>
						<CheckCircle className="w-8 h-8 text-green-600" />
					</div>
				</div>
			</div>

			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={submissions} />
			{/* PAGINATION */}
			<Pagination page={p} count={count} />
		</div>
	);
};

export default ContactSubmissionsPage;
