"use client";

import { useRouter, useSearchParams } from "next/navigation";

type ParentTransactionFiltersProps = {
	students: Array<{
		id: string;
		name: string;
		surname: string;
		class: { name: string } | null;
	}>;
	currentYear: number;
};

const ParentTransactionFilters = ({
	students,
	currentYear,
}: ParentTransactionFiltersProps) => {
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
			<select
				defaultValue={searchParams.get("student") || "all"}
				className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaPurple"
				onChange={(e) => handleFilterChange("student", e.target.value)}
			>
				<option value="all">All Children</option>
				{students.map((s) => (
					<option key={s.id} value={s.id}>
						{s.name} {s.surname} - Class {s.class?.name}
					</option>
				))}
			</select>
			<select
				defaultValue={searchParams.get("status") || "all"}
				className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaPurple"
				onChange={(e) => handleFilterChange("status", e.target.value)}
			>
				<option value="all">All Status</option>
				<option value="APPROVED">Approved</option>
				<option value="PENDING">Pending</option>
				<option value="REJECTED">Rejected</option>
			</select>
			<select
				defaultValue={searchParams.get("year") || "all"}
				className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaPurple"
				onChange={(e) => handleFilterChange("year", e.target.value)}
			>
				<option value="all">All Years</option>
				{[currentYear, currentYear - 1, currentYear - 2].map((y) => (
					<option key={y} value={y}>
						{y}
					</option>
				))}
			</select>
		</div>
	);
};

export default ParentTransactionFilters;
