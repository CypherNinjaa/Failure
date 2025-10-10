import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AttendanceSettingsForm from "@/components/AttendanceSettingsForm";
import Link from "next/link";

const AttendanceSettingsPage = async () => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only admin can access
	if (role !== "admin") {
		redirect("/");
	}

	// Fetch current settings
	const settings = await prisma.attendanceSettings.findFirst({
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="flex-1 p-4 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
				{/* Header with Back Button */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							Attendance Time Settings
						</h1>
						<p className="text-gray-600 mt-1">
							Configure when teachers can mark attendance
						</p>
					</div>
					<Link
						href="/list/locations"
						className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
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
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						<span className="text-sm font-medium">Back to Locations</span>
					</Link>
				</div>

				{/* Info Box */}
				<div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<svg
							className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<h3 className="font-semibold text-blue-900 mb-1">
								How it works:
							</h3>
							<ul className="text-sm text-blue-800 space-y-1">
								<li>
									• Set the time window when teachers are allowed to mark
									attendance
								</li>
								<li>
									• Example: 08:00 AM to 08:45 AM means attendance can only be
									marked during that period
								</li>
								<li>• Teachers can only mark attendance for today</li>
								<li>
									• Outside the time window, the attendance system will be
									disabled
								</li>
								<li>
									• You can disable the time restriction to allow attendance
									anytime
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Current Settings Display */}
				{settings && (
					<div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
						<h3 className="font-semibold text-green-900 mb-3">
							Current Active Settings:
						</h3>
						<div className="flex items-center gap-6">
							<div>
								<p className="text-xs text-gray-600 mb-1">Start Time</p>
								<p className="text-2xl font-bold text-green-700">
									{settings.startTime}
								</p>
							</div>
							<div className="text-gray-400 text-2xl">→</div>
							<div>
								<p className="text-xs text-gray-600 mb-1">End Time</p>
								<p className="text-2xl font-bold text-red-700">
									{settings.endTime}
								</p>
							</div>
							<div
								className={`ml-auto px-4 py-2 rounded-full text-sm font-semibold ${
									settings.isActive
										? "bg-green-100 text-green-800"
										: "bg-gray-100 text-gray-800"
								}`}
							>
								{settings.isActive ? "Active ✓" : "Inactive"}
							</div>
						</div>
					</div>
				)}

				{/* Settings Form */}
				<AttendanceSettingsForm currentSettings={settings} />
			</div>
		</div>
	);
};

export default AttendanceSettingsPage;
