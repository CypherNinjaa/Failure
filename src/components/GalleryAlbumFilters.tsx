"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function GalleryAlbumFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleFilterChange = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		router.push(`?${params.toString()}`);
	};

	return (
		<div className="flex gap-2">
			<select
				className="px-3 py-1 border border-gray-300 rounded-md text-xs"
				value={searchParams.get("type") || ""}
				onChange={(e) => handleFilterChange("type", e.target.value)}
			>
				<option value="">All Types</option>
				<option value="IMAGE">Images</option>
				<option value="VIDEO">Videos</option>
			</select>

			<select
				className="px-3 py-1 border border-gray-300 rounded-md text-xs"
				value={searchParams.get("category") || ""}
				onChange={(e) => handleFilterChange("category", e.target.value)}
			>
				<option value="">All Categories</option>
				<option value="EVENTS">Events</option>
				<option value="SPORTS">Sports</option>
				<option value="ACADEMICS">Academics</option>
				<option value="CULTURAL">Cultural</option>
				<option value="ACHIEVEMENTS">Achievements</option>
				<option value="TESTIMONIALS">Testimonials</option>
			</select>

			<select
				className="px-3 py-1 border border-gray-300 rounded-md text-xs"
				value={searchParams.get("featured") || ""}
				onChange={(e) => handleFilterChange("featured", e.target.value)}
			>
				<option value="">All Items</option>
				<option value="true">Featured Only</option>
			</select>
		</div>
	);
}
