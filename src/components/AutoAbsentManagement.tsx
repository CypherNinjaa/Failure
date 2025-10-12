"use client";

import { useState } from "react";
import Image from "next/image";

type AttendanceStatus = {
	currentTime: string;
	attendanceWindow: {
		startTime: string;
		endTime: string;
		isOpen: boolean;
	};
	totalTeachers: number;
	presentCount: number;
	absentCount: number;
	notMarkedYet: number;
	teachersNotMarked: Array<{ id: string; name: string }>;
};

type MarkAbsentResult = {
	totalTeachers: number;
	presentCount: number;
	absentCount: number;
	absentTeachers: Array<{ id: string; name: string }>;
	markedAt: string;
};

const AutoAbsentManagement = () => {
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<AttendanceStatus | null>(null);
	const [result, setResult] = useState<MarkAbsentResult | null>(null);
	const [error, setError] = useState<string>("");

	const checkStatus = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/auto-mark-absent");
			const data = await response.json();

			if (data.success) {
				setStatus(data.data);
				setResult(null);
			} else {
				setError(data.message || "Failed to fetch status");
			}
		} catch (err) {
			setError("Error checking status");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const markAbsent = async () => {
		if (
			!confirm("Are you sure you want to mark all unmarked teachers as absent?")
		) {
			return;
		}

		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/auto-mark-absent", {
				method: "POST",
			});
			const data = await response.json();

			if (data.success) {
				setResult(data.data);
				setStatus(null);
				// Refresh status after marking
				setTimeout(() => checkStatus(), 1000);
			} else {
				setError(data.message || "Failed to mark absent teachers");
			}
		} catch (err) {
			setError("Error marking absent teachers");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
						<Image
							src="/attendance.png"
							alt="Attendance"
							width={24}
							height={24}
						/>
					</div>
					<div>
						<h2 className="text-xl font-bold text-gray-800">
							Auto-Absent Management
						</h2>
						<p className="text-sm text-gray-600">
							Automatically mark teachers as absent after attendance window
							closes
						</p>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-3 mb-6">
				<button
					onClick={checkStatus}
					disabled={loading}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
				>
					<Image src="/search.png" alt="" width={16} height={16} />
					{loading ? "Checking..." : "Check Status"}
				</button>
				<button
					onClick={markAbsent}
					disabled={loading}
					className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
				>
					<Image src="/create.png" alt="" width={16} height={16} />
					{loading ? "Marking..." : "Mark Absent Now"}
				</button>
			</div>

			{/* Error Message */}
			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
					<div className="flex items-center gap-2">
						<span className="text-red-800 font-medium">Error:</span>
						<span className="text-red-600">{error}</span>
					</div>
				</div>
			)}

			{/* Status Display */}
			{status && (
				<div className="space-y-4">
					<div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
						<h3 className="font-semibold text-gray-800 mb-3">Current Status</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center justify-between p-3 bg-white rounded-lg">
								<span className="text-sm text-gray-600">Current Time:</span>
								<span className="text-sm font-medium">
									{new Date(status.currentTime).toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between p-3 bg-white rounded-lg">
								<span className="text-sm text-gray-600">Window Status:</span>
								<span
									className={`text-sm font-semibold px-3 py-1 rounded-full ${
										status.attendanceWindow.isOpen
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{status.attendanceWindow.isOpen ? "Open" : "Closed"}
								</span>
							</div>
							<div className="flex items-center justify-between p-3 bg-white rounded-lg">
								<span className="text-sm text-gray-600">Window Time:</span>
								<span className="text-sm font-medium">
									{status.attendanceWindow.startTime} -{" "}
									{status.attendanceWindow.endTime}
								</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="text-2xl font-bold text-blue-600">
								{status.totalTeachers}
							</div>
							<div className="text-sm text-gray-600">Total Teachers</div>
						</div>
						<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
							<div className="text-2xl font-bold text-green-600">
								{status.presentCount}
							</div>
							<div className="text-sm text-gray-600">Present</div>
						</div>
						<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
							<div className="text-2xl font-bold text-red-600">
								{status.absentCount}
							</div>
							<div className="text-sm text-gray-600">Absent</div>
						</div>
						<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
							<div className="text-2xl font-bold text-yellow-600">
								{status.notMarkedYet}
							</div>
							<div className="text-sm text-gray-600">Not Marked</div>
						</div>
					</div>

					{status.teachersNotMarked.length > 0 && (
						<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
							<h4 className="font-semibold text-gray-800 mb-3">
								Teachers Not Marked ({status.teachersNotMarked.length})
							</h4>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{status.teachersNotMarked.map((teacher) => (
									<div
										key={teacher.id}
										className="p-2 bg-white rounded flex items-center justify-between"
									>
										<span className="text-sm">{teacher.name}</span>
										<span className="text-xs text-gray-500">{teacher.id}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Result Display */}
			{result && (
				<div className="space-y-4">
					<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
								<span className="text-white text-xs">✓</span>
							</div>
							<h3 className="font-semibold text-green-800">
								Successfully Marked Absent Teachers
							</h3>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
							<div className="text-center">
								<div className="text-xl font-bold text-gray-800">
									{result.totalTeachers}
								</div>
								<div className="text-xs text-gray-600">Total Teachers</div>
							</div>
							<div className="text-center">
								<div className="text-xl font-bold text-green-600">
									{result.presentCount}
								</div>
								<div className="text-xs text-gray-600">Present</div>
							</div>
							<div className="text-center">
								<div className="text-xl font-bold text-red-600">
									{result.absentCount}
								</div>
								<div className="text-xs text-gray-600">Marked Absent</div>
							</div>
						</div>
						<div className="text-xs text-gray-600">
							Marked at: {new Date(result.markedAt).toLocaleString()}
						</div>
					</div>

					{result.absentTeachers.length > 0 && (
						<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
							<h4 className="font-semibold text-gray-800 mb-3">
								Absent Teachers ({result.absentTeachers.length})
							</h4>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{result.absentTeachers.map((teacher) => (
									<div
										key={teacher.id}
										className="p-2 bg-white rounded flex items-center justify-between"
									>
										<span className="text-sm">{teacher.name}</span>
										<span className="text-xs text-gray-500 px-2 py-1 bg-red-100 rounded">
											Absent
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Info Box */}
			<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<div className="flex items-start gap-2">
					<Image src="/message.png" alt="" width={16} height={16} />
					<div className="text-xs text-blue-800">
						<strong>How it works:</strong>
						<ul className="list-disc list-inside mt-2 space-y-1">
							<li>
								Teachers must mark attendance within the configured time window
							</li>
							<li>
								After the window closes, unmarked teachers can be marked as
								absent
							</li>
							<li>This can be done manually or automatically via cron job</li>
							<li>
								Cron job runs daily at 9:00 AM (configured in vercel.json)
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AutoAbsentManagement;
