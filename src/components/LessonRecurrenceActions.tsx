"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
	duplicateLessonForDate,
	toggleLessonRecurrence,
	generateRecurringLessons,
} from "@/lib/actions";

type LessonRecurrenceActionsProps = {
	lessonId: number;
	isRecurring: boolean;
	recurrenceEndDate: Date | null;
	lessonName: string;
};

const LessonRecurrenceActions = ({
	lessonId,
	isRecurring,
	recurrenceEndDate,
	lessonName,
}: LessonRecurrenceActionsProps) => {
	const router = useRouter();
	const [showDuplicateModal, setShowDuplicateModal] = useState(false);
	const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
	const [duplicateDate, setDuplicateDate] = useState("");
	const [autoRepeat, setAutoRepeat] = useState(isRecurring);
	const [endDate, setEndDate] = useState(
		recurrenceEndDate
			? new Date(recurrenceEndDate).toISOString().split("T")[0]
			: ""
	);
	const [loading, setLoading] = useState(false);

	const handleDuplicate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!duplicateDate) {
			toast.error("Please select a date");
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append("lessonId", lessonId.toString());
		formData.append("newDate", duplicateDate);

		const result = await duplicateLessonForDate(
			{ success: false, error: false },
			formData
		);

		if (result.success) {
			toast.success(result.message || "Lesson duplicated!");
			setShowDuplicateModal(false);
			setDuplicateDate("");
			router.refresh();
		} else {
			toast.error(result.message || "Failed to duplicate lesson");
		}
		setLoading(false);
	};

	const handleToggleRecurrence = async () => {
		setLoading(true);
		const formData = new FormData();
		formData.append("lessonId", lessonId.toString());
		formData.append("isRecurring", (!autoRepeat).toString());
		formData.append("recurrenceEndDate", endDate);

		const result = await toggleLessonRecurrence(
			{ success: false, error: false },
			formData
		);

		if (result.success) {
			toast.success(result.message || "Settings updated!");
			setAutoRepeat(!autoRepeat);
			router.refresh();
		} else {
			toast.error(result.message || "Failed to update settings");
		}
		setLoading(false);
	};

	const handleGenerateLessons = async () => {
		if (!autoRepeat) {
			toast.error("Please enable auto-repeat first");
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append("lessonId", lessonId.toString());

		const result = await generateRecurringLessons(
			{ success: false, error: false },
			formData
		);

		if (result.success) {
			toast.success(result.message || "Lessons generated!");
			setShowRecurrenceModal(false);
			router.refresh();
		} else {
			toast.error(result.message || "Failed to generate lessons");
		}
		setLoading(false);
	};

	return (
		<div className="flex items-center gap-2">
			{/* Duplicate Button */}
			<button
				onClick={() => setShowDuplicateModal(true)}
				className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600"
				title="Duplicate for another date"
			>
				<svg
					className="w-4 h-4 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			</button>

			{/* Auto-Repeat Button */}
			<button
				onClick={() => setShowRecurrenceModal(true)}
				className={`w-7 h-7 flex items-center justify-center rounded-full ${
					autoRepeat
						? "bg-green-500 hover:bg-green-600"
						: "bg-gray-400 hover:bg-gray-500"
				}`}
				title={autoRepeat ? "Auto-repeat ON" : "Auto-repeat OFF"}
			>
				<svg
					className="w-4 h-4 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
			</button>

			{/* Duplicate Modal */}
			{showDuplicateModal && (
				<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-800">
								Duplicate Lesson
							</h3>
							<button
								onClick={() => setShowDuplicateModal(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<p className="text-sm text-gray-600 mb-4">
							Duplicate <span className="font-semibold">{lessonName}</span> for
							a new date
						</p>

						<form onSubmit={handleDuplicate} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Select New Date
								</label>
								<input
									type="date"
									value={duplicateDate}
									onChange={(e) => setDuplicateDate(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="flex gap-3">
								<button
									type="button"
									onClick={() => setShowDuplicateModal(false)}
									className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={loading}
									className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
								>
									{loading ? "Duplicating..." : "Duplicate"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Recurrence Modal */}
			{showRecurrenceModal && (
				<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-800">
								Auto-Repeat Settings
							</h3>
							<button
								onClick={() => setShowRecurrenceModal(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<p className="text-sm text-gray-600 mb-4">
							Configure auto-repeat for{" "}
							<span className="font-semibold">{lessonName}</span>
						</p>

						<div className="space-y-4">
							{/* Toggle Auto-Repeat */}
							<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
								<div>
									<p className="font-medium text-gray-800">Auto-Repeat</p>
									<p className="text-xs text-gray-500">
										Automatically create lessons weekly
									</p>
								</div>
								<button
									onClick={handleToggleRecurrence}
									disabled={loading}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
										autoRepeat ? "bg-green-600" : "bg-gray-300"
									}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											autoRepeat ? "translate-x-6" : "translate-x-1"
										}`}
									/>
								</button>
							</div>

							{/* End Date */}
							{autoRepeat && (
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Repeat Until (Optional)
									</label>
									<input
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Leave empty to repeat indefinitely (30 days by default)
									</p>
								</div>
							)}

							{/* Generate Now Button */}
							{autoRepeat && (
								<button
									onClick={handleGenerateLessons}
									disabled={loading}
									className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
								>
									{loading ? "Generating..." : "Generate Recurring Lessons Now"}
								</button>
							)}

							<button
								onClick={() => setShowRecurrenceModal(false)}
								className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default LessonRecurrenceActions;
