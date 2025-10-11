"use client";

import { useRouter, useSearchParams } from "next/navigation";

type TransactionFiltersProps = {
	currentYear: number;
};

const TransactionFilters = ({ currentYear }: TransactionFiltersProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleFilterChange = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value && value !== "all") {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		params.delete("page");
		router.push(`?${params.toString()}`);
	};

	return (
		<div className="flex flex-col md:flex-row gap-4 mb-6">
			<div className="flex-1">
				<input
					type="text"
					placeholder="Search transactions..."
					defaultValue={searchParams.get("search") || ""}
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaPurple"
					onChange={(e) => {
						const params = new URLSearchParams(searchParams.toString());
						if (e.target.value) {
							params.set("search", e.target.value);
						} else {
							params.delete("search");
						}
						router.push(`?${params.toString()}`);
					}}
				/>
			</div>
			<select
				defaultValue={searchParams.get("type") || "all"}
				className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaPurple"
				onChange={(e) => handleFilterChange("type", e.target.value)}
			>
				<option value="all">All Types</option>
				<option value="PAYMENT">Fee Payments</option>
				<option value="INCOME">Other Income</option>
				<option value="EXPENSE">Expenses</option>
				<option value="SALARY">Salaries</option>
			</select>
			<select
				defaultValue={searchParams.get("year") || currentYear.toString()}
				className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaPurple"
				onChange={(e) => handleFilterChange("year", e.target.value)}
			>
				{[currentYear, currentYear - 1, currentYear - 2].map((y) => (
					<option key={y} value={y}>
						{y}
					</option>
				))}
			</select>
			<select
				defaultValue={searchParams.get("month") || "all"}
				className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaPurple"
				onChange={(e) => handleFilterChange("month", e.target.value)}
			>
				<option value="all">All Months</option>
				{[
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December",
				].map((m, i) => (
					<option key={i} value={i + 1}>
						{m}
					</option>
				))}
			</select>
		</div>
	);
};

export default TransactionFilters;
