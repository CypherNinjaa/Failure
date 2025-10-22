"use client";

import { useRouter, useSearchParams } from "next/navigation";

const NewsTickerFilters = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const type = searchParams.get("type");
	const status = searchParams.get("status");

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const params = new URLSearchParams(searchParams.toString());
		if (e.target.value === "all") {
			params.delete("type");
		} else {
			params.set("type", e.target.value);
		}
		router.push(`?${params.toString()}`);
	};

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const params = new URLSearchParams(searchParams.toString());
		if (e.target.value === "all") {
			params.delete("status");
		} else {
			params.set("status", e.target.value);
		}
		router.push(`?${params.toString()}`);
	};

	return (
		<div className="flex items-center gap-4 mb-5">
			<select
				className="px-4 py-2 rounded-md border border-gray-300"
				value={type || "all"}
				onChange={handleTypeChange}
			>
				<option value="all">All Types</option>
				<option value="EVENT">Event</option>
				<option value="FACILITY">Facility</option>
				<option value="ACHIEVEMENT">Achievement</option>
				<option value="ANNOUNCEMENT">Announcement</option>
			</select>

			<select
				className="px-4 py-2 rounded-md border border-gray-300"
				value={status || "all"}
				onChange={handleStatusChange}
			>
				<option value="all">All Status</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>
		</div>
	);
};

export default NewsTickerFilters;
