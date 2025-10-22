"use client";

import { approveTestimonial, rejectTestimonial } from "@/lib/actions";
import { TestimonialStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const TestimonialReviewActions = ({
	testimonialId,
	currentStatus,
}: {
	testimonialId: number;
	currentStatus: TestimonialStatus;
}) => {
	const router = useRouter();

	const handleApprove = async () => {
		try {
			const result = await approveTestimonial(testimonialId);
			if (result.success) {
				toast.success("✅ Testimonial approved and published!");
				router.refresh();
			} else {
				toast.error("❌ Failed to approve testimonial");
			}
		} catch (error) {
			toast.error("❌ Error approving testimonial");
		}
	};

	const handleReject = async () => {
		try {
			const result = await rejectTestimonial(testimonialId);
			if (result.success) {
				toast.warning("⚠️ Testimonial rejected");
				router.refresh();
			} else {
				toast.error("❌ Failed to reject testimonial");
			}
		} catch (error) {
			toast.error("❌ Error rejecting testimonial");
		}
	};

	if (currentStatus === "APPROVED") {
		return (
			<button
				onClick={handleReject}
				className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
				title="Unpublish"
			>
				Unpublish
			</button>
		);
	}

	if (currentStatus === "REJECTED") {
		return (
			<button
				onClick={handleApprove}
				className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600"
				title="Approve"
			>
				Approve
			</button>
		);
	}

	// PENDING status - show both buttons
	return (
		<div className="flex items-center gap-2">
			<button
				onClick={handleApprove}
				className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600"
				title="Approve & Publish"
			>
				✓ Approve
			</button>
			<button
				onClick={handleReject}
				className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
				title="Reject"
			>
				✗ Reject
			</button>
		</div>
	);
};

export default TestimonialReviewActions;
