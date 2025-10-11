"use client";

import { useRouter, useSearchParams } from "next/navigation";

type SubjectFilterProps = {
	subjects: { id: number; name: string }[];
};

const SubjectFilter = ({ subjects }: SubjectFilterProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentSubject = searchParams.get("subject");

	const handleChange = (value: string) => {
		const url = new URL(window.location.href);
		if (value) {
			url.searchParams.set("subject", value);
		} else {
			url.searchParams.delete("subject");
		}
		router.push(url.pathname + url.search);
	};

	return (
		<div className="flex items-center gap-2">
			<label className="text-sm font-medium text-gray-600">
				Filter by Subject:
			</label>
			<select
				className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent"
				value={currentSubject || ""}
				onChange={(e) => handleChange(e.target.value)}
			>
				<option value="">All Subjects</option>
				{subjects.map((subject) => (
					<option key={subject.id} value={subject.id}>
						{subject.name}
					</option>
				))}
			</select>
		</div>
	);
};

export default SubjectFilter;
