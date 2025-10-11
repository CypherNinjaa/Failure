"use client";

import { gradeOpenEndedAnswer } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type GradeAnswerFormProps = {
	answerId: string;
};

const GradeAnswerForm = ({ answerId }: GradeAnswerFormProps) => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState("");

	const handleGrade = async (isCorrect: boolean) => {
		setIsSubmitting(true);

		const result = await gradeOpenEndedAnswer(
			{ success: false, error: false },
			{
				answerId,
				isCorrect,
				pointsAwarded: isCorrect ? 1 : 0,
				teacherFeedback: feedback.trim() || undefined,
			}
		);

		setIsSubmitting(false);

		if (result.success) {
			toast.success(`Marked as ${isCorrect ? "Correct" : "Incorrect"}!`);
			setFeedback("");
			router.refresh();
		} else {
			toast.error("Failed to grade answer");
		}
	};

	return (
		<div className="space-y-3">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Teacher Feedback (Optional)
				</label>
				<textarea
					value={feedback}
					onChange={(e) => setFeedback(e.target.value)}
					placeholder="Add feedback for the student..."
					rows={3}
					disabled={isSubmitting}
					className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-lamaPurple focus:outline-none resize-none disabled:opacity-50"
				/>
			</div>

			<div className="flex gap-3">
				<button
					onClick={() => handleGrade(true)}
					disabled={isSubmitting}
					className="flex-1 px-6 py-3 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{isSubmitting ? "Grading..." : "✓ Mark Correct"}
				</button>
				<button
					onClick={() => handleGrade(false)}
					disabled={isSubmitting}
					className="flex-1 px-6 py-3 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{isSubmitting ? "Grading..." : "✗ Mark Incorrect"}
				</button>
			</div>
		</div>
	);
};

export default GradeAnswerForm;
