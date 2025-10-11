"use client";

import { submitTeacherRating } from "@/lib/actions";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type TeacherRatingFormProps = {
	teacherId: string;
	teacherName: string;
	testId?: string;
	subjectId?: number;
	onClose: () => void;
};

const TeacherRatingForm = ({
	teacherId,
	teacherName,
	testId,
	subjectId,
	onClose,
}: TeacherRatingFormProps) => {
	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [comment, setComment] = useState("");

	const [state, formAction] = useFormState(submitTeacherRating, {
		success: false,
		error: false,
	});

	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			toast.success("Thank you for rating your teacher!");
			onClose();
			router.refresh();
		}
	}, [state.success, onClose, router]);

	useEffect(() => {
		if (state.error) {
			toast.error("Failed to submit rating. Please try again.");
		}
	}, [state.error]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (rating === 0) {
			toast.error("Please select a rating!");
			return;
		}

		const formData = new FormData(e.currentTarget);
		formAction(formData);
	};

	const renderStars = () => {
		return [1, 2, 3, 4, 5].map((star) => (
			<button
				key={star}
				type="button"
				className={`text-5xl transition-all transform hover:scale-110 ${
					star <= (hoveredRating || rating)
						? "text-yellow-400"
						: "text-gray-300"
				}`}
				onMouseEnter={() => setHoveredRating(star)}
				onMouseLeave={() => setHoveredRating(0)}
				onClick={() => setRating(star)}
			>
				★
			</button>
		));
	};

	const getRatingLabel = (r: number) => {
		switch (r) {
			case 1:
				return "Poor";
			case 2:
				return "Fair";
			case 3:
				return "Good";
			case 4:
				return "Very Good";
			case 5:
				return "Excellent";
			default:
				return "Select a rating";
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
				>
					✕
				</button>

				{/* Header */}
				<div className="text-center mb-6">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						Rate Your Teacher
					</h2>
					<p className="text-lg text-lamaPurple font-semibold">{teacherName}</p>
					<p className="text-sm text-gray-500 mt-1">
						Your feedback helps improve teaching quality
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Hidden Fields */}
					<input type="hidden" name="teacherId" value={teacherId} />
					{testId && <input type="hidden" name="testId" value={testId} />}
					{subjectId && (
						<input type="hidden" name="subjectId" value={subjectId} />
					)}
					<input type="hidden" name="rating" value={rating} />

					{/* Star Rating */}
					<div className="flex flex-col items-center space-y-3">
						<div className="flex gap-2">{renderStars()}</div>
						<p
							className={`text-lg font-semibold transition-all ${
								rating > 0 ? "text-lamaPurple" : "text-gray-400"
							}`}
						>
							{getRatingLabel(hoveredRating || rating)}
						</p>
					</div>

					{/* Comment (Optional) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Additional Feedback (Optional)
						</label>
						<textarea
							name="comment"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent resize-none"
							rows={4}
							placeholder="Share your thoughts about the teaching..."
						/>
						<p className="text-xs text-gray-500 mt-1">
							✓ Your rating is anonymous
						</p>
					</div>

					{/* Buttons */}
					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
						>
							Skip
						</button>
						<button
							type="submit"
							disabled={rating === 0}
							className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
								rating === 0
									? "bg-gray-300 text-gray-500 cursor-not-allowed"
									: "bg-lamaPurple text-white hover:bg-opacity-90"
							}`}
						>
							Submit Rating
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TeacherRatingForm;
