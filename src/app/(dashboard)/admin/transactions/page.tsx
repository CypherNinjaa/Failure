import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import TransactionFilters from "@/components/TransactionFilters";

type TransactionType = "INCOME" | "EXPENSE" | "PAYMENT" | "SALARY";

const ITEM_PER_PAGE = 20;

const AdminTransactionsPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		redirect("/");
	}

	const { page, type, search, year, month } = searchParams;
	const p = page ? parseInt(page) : 1;

	// Build query for filtering
	const currentYear = new Date().getFullYear();
	const selectedYear = year ? parseInt(year) : currentYear;
	const selectedMonth = month ? parseInt(month) : undefined;

	// Fetch all transactions from different sources
	const [payments, incomes, expenses, salaries] = await Promise.all([
		prisma.payment.findMany({
			where: {
				approvalStatus: "APPROVED",
				...(selectedMonth && {
					paymentDate: {
						gte: new Date(selectedYear, selectedMonth - 1, 1),
						lt: new Date(selectedYear, selectedMonth, 1),
					},
				}),
				...(!selectedMonth && {
					paymentDate: {
						gte: new Date(selectedYear, 0, 1),
						lt: new Date(selectedYear + 1, 0, 1),
					},
				}),
			},
			include: {
				studentFee: {
					include: {
						student: true,
						feeStructure: true,
					},
				},
			},
			orderBy: { paymentDate: "desc" },
		}),
		prisma.income.findMany({
			where: {
				...(selectedMonth && {
					date: {
						gte: new Date(selectedYear, selectedMonth - 1, 1),
						lt: new Date(selectedYear, selectedMonth, 1),
					},
				}),
				...(!selectedMonth && {
					date: {
						gte: new Date(selectedYear, 0, 1),
						lt: new Date(selectedYear + 1, 0, 1),
					},
				}),
			},
			orderBy: { date: "desc" },
		}),
		prisma.expense.findMany({
			where: {
				...(selectedMonth && {
					date: {
						gte: new Date(selectedYear, selectedMonth - 1, 1),
						lt: new Date(selectedYear, selectedMonth, 1),
					},
				}),
				...(!selectedMonth && {
					date: {
						gte: new Date(selectedYear, 0, 1),
						lt: new Date(selectedYear + 1, 0, 1),
					},
				}),
			},
			orderBy: { date: "desc" },
		}),
		prisma.salary.findMany({
			where: {
				status: "PAID",
				month: selectedMonth || undefined,
				year: selectedYear,
			},
			include: {
				teacher: true,
			},
			orderBy: { paidDate: "desc" },
		}),
	]);

	// Combine all transactions into a unified format
	const allTransactions = [
		...payments.map((p) => ({
			id: p.id,
			type: "PAYMENT" as TransactionType,
			amount: p.amount,
			date: p.paymentDate,
			description: `Fee Payment - ${p.studentFee.student.name} ${p.studentFee.student.surname} (${p.studentFee.feeStructure.name})`,
			category: p.studentFee.feeStructure.feeType,
			paymentMethod: p.paymentMethod,
			receiptNumber: p.receiptNumber,
		})),
		...incomes.map((i) => ({
			id: i.id,
			type: "INCOME" as TransactionType,
			amount: i.amount,
			date: i.date,
			description: i.description,
			category: i.category,
			paymentMethod: null,
			receiptNumber: null,
		})),
		...expenses.map((e) => ({
			id: e.id,
			type: "EXPENSE" as TransactionType,
			amount: e.amount,
			date: e.date,
			description: e.description,
			category: e.category,
			paymentMethod: null,
			receiptNumber: null,
		})),
		...salaries.map((s) => ({
			id: s.id,
			type: "SALARY" as TransactionType,
			amount: s.amount,
			date: s.paidDate || new Date(),
			description: s.teacher
				? `Salary - ${s.teacher.name} ${s.teacher.surname}`
				: `Salary - ${s.staffName}`,
			category: "Staff Salary",
			paymentMethod: s.paymentMethod,
			receiptNumber: null,
		})),
	];

	// Sort by date descending
	allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

	// Filter by type if specified
	const filteredTransactions = type
		? allTransactions.filter((t) => t.type === type)
		: allTransactions;

	// Search filter
	const searchedTransactions = search
		? filteredTransactions.filter((t) =>
				(t.description || "").toLowerCase().includes(search.toLowerCase())
		  )
		: filteredTransactions;

	// Pagination
	const start = (p - 1) * ITEM_PER_PAGE;
	const end = start + ITEM_PER_PAGE;
	const paginatedTransactions = searchedTransactions.slice(start, end);

	// Calculate totals
	const totalIncome =
		payments.reduce((sum, p) => sum + p.amount, 0) +
		incomes.reduce((sum, i) => sum + i.amount, 0);
	const totalExpense =
		expenses.reduce((sum, e) => sum + e.amount, 0) +
		salaries.reduce((sum, s) => sum + s.amount, 0);
	const balance = totalIncome - totalExpense;

	// Get transaction type badge
	const getTypeBadge = (type: TransactionType) => {
		switch (type) {
			case "PAYMENT":
				return "bg-green-100 text-green-800";
			case "INCOME":
				return "bg-blue-100 text-blue-800";
			case "EXPENSE":
				return "bg-red-100 text-red-800";
			case "SALARY":
				return "bg-orange-100 text-orange-800";
		}
	};

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* Header with Balance Summary */}
			<div className="mb-6">
				<h1 className="text-xl font-semibold mb-4">Transaction History</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
						<p className="text-sm text-green-700 mb-1">Total Income</p>
						<p className="text-2xl font-bold text-green-600">
							₹{totalIncome.toFixed(2)}
						</p>
						<p className="text-xs text-green-600 mt-1">
							Payments + Other Income
						</p>
					</div>
					<div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
						<p className="text-sm text-red-700 mb-1">Total Expenses</p>
						<p className="text-2xl font-bold text-red-600">
							₹{totalExpense.toFixed(2)}
						</p>
						<p className="text-xs text-red-600 mt-1">Expenses + Salaries</p>
					</div>
					<div
						className={`border-2 rounded-lg p-4 ${
							balance >= 0
								? "bg-blue-50 border-blue-200"
								: "bg-red-50 border-red-200"
						}`}
					>
						<p
							className={`text-sm mb-1 ${
								balance >= 0 ? "text-blue-700" : "text-red-700"
							}`}
						>
							Current Balance
						</p>
						<p
							className={`text-2xl font-bold ${
								balance >= 0 ? "text-blue-600" : "text-red-600"
							}`}
						>
							₹{balance.toFixed(2)}
						</p>
						<p
							className={`text-xs mt-1 ${
								balance >= 0 ? "text-blue-600" : "text-red-600"
							}`}
						>
							{balance >= 0 ? "💰 Profit" : "📉 Loss"}
						</p>
					</div>
				</div>
			</div>

			{/* Filters */}
			<TransactionFilters currentYear={currentYear} />

			{/* Results count */}
			<div className="mb-4 text-sm text-gray-600">
				Showing {paginatedTransactions.length} of {searchedTransactions.length}{" "}
				transactions
			</div>

			{/* Transactions Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="text-left text-gray-500 text-sm border-b">
							<th className="p-3">Date</th>
							<th className="p-3">Type</th>
							<th className="p-3">Description</th>
							<th className="p-3">Category</th>
							<th className="p-3 hidden md:table-cell">Payment Method</th>
							<th className="p-3 text-right">Amount</th>
							<th className="p-3 hidden lg:table-cell">Receipt</th>
						</tr>
					</thead>
					<tbody>
						{paginatedTransactions.length === 0 ? (
							<tr>
								<td colSpan={7} className="text-center py-12 text-gray-500">
									No transactions found
								</td>
							</tr>
						) : (
							paginatedTransactions.map((transaction) => (
								<tr
									key={`${transaction.type}-${transaction.id}`}
									className="border-b hover:bg-gray-50"
								>
									<td className="p-3 text-sm">
										{new Intl.DateTimeFormat("en-IN", {
											day: "2-digit",
											month: "short",
											year: "numeric",
										}).format(transaction.date)}
									</td>
									<td className="p-3">
										<span
											className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeBadge(
												transaction.type
											)}`}
										>
											{transaction.type}
										</span>
									</td>
									<td className="p-3 text-sm">{transaction.description}</td>
									<td className="p-3 text-sm text-gray-600">
										{transaction.category}
									</td>
									<td className="p-3 text-sm text-gray-600 hidden md:table-cell">
										{transaction.paymentMethod
											? transaction.paymentMethod.replace("_", " ")
											: "-"}
									</td>
									<td
										className={`p-3 text-right font-semibold ${
											transaction.type === "PAYMENT" ||
											transaction.type === "INCOME"
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{transaction.type === "PAYMENT" ||
										transaction.type === "INCOME"
											? "+"
											: "-"}
										₹{transaction.amount.toFixed(2)}
									</td>
									<td className="p-3 text-xs text-gray-500 font-mono hidden lg:table-cell">
										{transaction.receiptNumber || "-"}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="mt-4">
				<Pagination
					page={p}
					count={Math.ceil(searchedTransactions.length / ITEM_PER_PAGE)}
				/>
			</div>
		</div>
	);
};

export default AdminTransactionsPage;
