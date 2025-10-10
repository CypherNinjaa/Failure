"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { publishMCQTest } from "@/lib/actions";

const PublishTestButton = ({
	testId,
	isPublished,
}: {
	testId: number;
	isPublished: boolean;
}) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handlePublish = async () => {
		if (
			!confirm(
				isPublished
					? "Are you sure you want to unpublish this test? Students will not be able to access it."
					: "Are you sure you want to publish this test? Students will be able to take it."
			)
		) {
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append("id", testId.toString());
		formData.append("isPublished", (!isPublished).toString());

		const result = await publishMCQTest(
			{ success: false, error: false, message: "" },
			formData
		);
		setLoading(false);

		if (result.success) {
			toast.success(
				isPublished
					? "Test unpublished successfully!"
					: "Test published successfully!"
			);
			router.refresh();
		} else {
			toast.error(result.message || "Failed to update test status");
		}
	};

	return (
		<button
			onClick={handlePublish}
			disabled={loading}
			className={`px-4 py-2 rounded-md font-semibold text-sm ${
				isPublished
					? "bg-yellow-500 hover:bg-yellow-600 text-white"
					: "bg-green-500 hover:bg-green-600 text-white"
			} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
		>
			{loading ? "Processing..." : isPublished ? "🔒 Unpublish" : "🚀 Publish"}
		</button>
	);
};

export default PublishTestButton;
