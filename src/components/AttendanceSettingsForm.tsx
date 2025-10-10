"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type AttendanceSettings = {
	id: number;
	startTime: string;
	endTime: string;
	isActive: boolean;
} | null;

const AttendanceSettingsForm = ({
	currentSettings,
}: {
	currentSettings: AttendanceSettings;
}) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [startTime, setStartTime] = useState(
		currentSettings?.startTime || "08:00"
	);
	const [endTime, setEndTime] = useState(currentSettings?.endTime || "08:45");
	const [isActive, setIsActive] = useState(currentSettings?.isActive ?? true);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await fetch("/api/attendance-settings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					startTime,
					endTime,
					isActive,
				}),
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Attendance time settings updated successfully!");
				router.refresh();
			} else {
				toast.error(result.message || "Failed to update settings");
			}
		} catch (error) {
			console.error("Error updating settings:", error);
			toast.error("Failed to update settings");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Start Time */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Start Time
				</label>
				<input
					type="time"
					value={startTime}
					onChange={(e) => setStartTime(e.target.value)}
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
					required
				/>
				<p className="text-xs text-gray-500 mt-1">
					Teachers can start marking attendance from this time
				</p>
			</div>

			{/* End Time */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					End Time
				</label>
				<input
					type="time"
					value={endTime}
					onChange={(e) => setEndTime(e.target.value)}
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
					required
				/>
				<p className="text-xs text-gray-500 mt-1">
					Attendance system will be disabled after this time
				</p>
			</div>

			{/* Active Status */}
			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					id="isActive"
					checked={isActive}
					onChange={(e) => setIsActive(e.target.checked)}
					className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
				/>
				<label htmlFor="isActive" className="text-sm font-medium text-gray-700">
					Enable time window restriction
				</label>
			</div>
			<p className="text-xs text-gray-500 ml-8">
				When disabled, teachers can mark attendance at any time
			</p>

			{/* Preview */}
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
				<h3 className="font-semibold text-gray-800 mb-2">Preview:</h3>
				<p className="text-sm text-gray-600">
					{isActive ? (
						<>
							Teachers can mark attendance between{" "}
							<span className="font-bold text-green-700">{startTime}</span> and{" "}
							<span className="font-bold text-red-700">{endTime}</span>
						</>
					) : (
						<span className="text-gray-500">
							Time restriction is disabled. Teachers can mark attendance
							anytime.
						</span>
					)}
				</p>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={loading}
				className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
			>
				{loading ? (
					<>
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
						Saving...
					</>
				) : (
					<>
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
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Save Settings
					</>
				)}
			</button>
		</form>
	);
};

export default AttendanceSettingsForm;
