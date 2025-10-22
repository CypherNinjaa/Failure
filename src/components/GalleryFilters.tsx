"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function GalleryFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const category = searchParams.get("category");
	const status = searchParams.get("status");

	const handleCategoryChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value) {
			params.set("category", value);
		} else {
			params.delete("category");
		}
		router.push(`?${params.toString()}`);
	};

	const handleStatusChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value) {
			params.set("status", value);
		} else {
			params.delete("status");
		}
		router.push(`?${params.toString()}`);
	};

	return (
		<>
			{/* Filter by Category */}
			<select
				className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				value={category || ""}
				onChange={(e) => handleCategoryChange(e.target.value)}
			>
				<option value="">All Categories</option>
				<option value="FACILITY">Facilities</option>
				<option value="EVENT">Events</option>
				<option value="ACTIVITY">Activities</option>
				<option value="ACHIEVEMENT">Achievements</option>
			</select>

			{/* Filter by Status */}
			<select
				className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				value={status || ""}
				onChange={(e) => handleStatusChange(e.target.value)}
			>
				<option value="">All Status</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>
		</>
	);
}
