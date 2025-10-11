import prisma from "@/lib/prisma";
import FinanceChart from "./FinanceChart";

const FinanceChartContainer = async () => {
	const currentYear = new Date().getFullYear();
	const startOfYear = new Date(currentYear, 0, 1);
	const endOfYear = new Date(currentYear + 1, 0, 1);

	// Get all months data for the current year
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

	// Fetch all income for current year
	const incomeRecords = await prisma.income.findMany({
		where: {
			date: {
				gte: startOfYear,
				lt: endOfYear,
			},
		},
		select: {
			amount: true,
			date: true,
		},
	});

	// Fetch all expenses for current year
	const expenseRecords = await prisma.expense.findMany({
		where: {
			date: {
				gte: startOfYear,
				lt: endOfYear,
			},
		},
		select: {
			amount: true,
			date: true,
		},
	});

	// Fetch all approved payments (student fees) for current year
	const paymentRecords = await prisma.payment.findMany({
		where: {
			createdAt: {
				gte: startOfYear,
				lt: endOfYear,
			},
			approvalStatus: "APPROVED",
		},
		select: {
			amount: true,
			createdAt: true,
		},
	});

	// Fetch all salary payments for current year
	const salaryRecords = await prisma.salary.findMany({
		where: {
			year: currentYear,
		},
		select: {
			amount: true,
			month: true,
		},
	});

	// Initialize income and expense by month
	const incomeByMonth: { [key: number]: number } = {};
	const expenseByMonth: { [key: number]: number } = {};

	// Group income by month
	incomeRecords.forEach((record) => {
		const month = new Date(record.date).getMonth() + 1; // 1-12
		incomeByMonth[month] = (incomeByMonth[month] || 0) + record.amount;
	});

	// Add payments (student fees) to income
	paymentRecords.forEach((record) => {
		const month = new Date(record.createdAt).getMonth() + 1; // 1-12
		incomeByMonth[month] = (incomeByMonth[month] || 0) + record.amount;
	});

	// Group expenses by month
	expenseRecords.forEach((record) => {
		const month = new Date(record.date).getMonth() + 1; // 1-12
		expenseByMonth[month] = (expenseByMonth[month] || 0) + record.amount;
	});

	// Add salaries to expenses
	salaryRecords.forEach((record) => {
		const month = record.month; // Already 1-12
		expenseByMonth[month] = (expenseByMonth[month] || 0) + record.amount;
	});

	// Build chart data for all 12 months
	const chartData = monthNames.map((name, index) => {
		const monthNumber = index + 1; // 1-12
		return {
			name,
			income: Math.round(incomeByMonth[monthNumber] || 0),
			expense: Math.round(expenseByMonth[monthNumber] || 0),
		};
	});

	return <FinanceChart data={chartData} />;
};

export default FinanceChartContainer;
