import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ManualCronTriggers from "@/components/ManualCronTriggers";
import AutoAbsentManagement from "@/components/AutoAbsentManagement";

const CronJobsPage = () => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only admin can access this page
	if (role !== "admin") {
		redirect("/");
	}

	return (
		<div className="flex-1 p-4 flex flex-col gap-4">
			{/* Page Header */}
			<div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
				<h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
					Automated Tasks & Cron Jobs
				</h1>
				<p className="text-xs md:text-sm text-gray-600">
					Manage and trigger automated scheduled tasks for your school system
				</p>
			</div>

			{/* Manual Cron Triggers Section */}
			<div>
				<ManualCronTriggers />
			</div>

			{/* Teacher Auto-Absent Section */}
			<div className="flex flex-col xl:flex-row gap-4">
				<div className="w-full xl:w-2/3">
					<div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
							Teacher Auto-Absent Configuration
						</h2>
						<AutoAbsentManagement />
					</div>
				</div>

				{/* Info Panel */}
				<div className="w-full xl:w-1/3">
					<div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-base md:text-lg font-semibold mb-4 text-gray-800">
							Task Information
						</h2>

						<div className="space-y-3 md:space-y-4">
							<div className="p-3 md:p-4 bg-purple-50 border border-purple-200 rounded-lg">
								<h3 className="font-semibold text-xs md:text-sm mb-2 text-purple-800">
									Automatic Schedule
								</h3>
								<p className="text-xs text-gray-700">
									The system automatically runs at 9:00 AM daily to mark absent
									teachers who didn&apos;t mark attendance.
								</p>
							</div>

							<div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<h3 className="font-semibold text-xs md:text-sm mb-2 text-blue-800">
									Badge Processing
								</h3>
								<p className="text-xs text-gray-700">
									Automatically awards and removes badges based on student
									leaderboard performance. Runs at 2:00 AM daily.
								</p>
							</div>

							<div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
								<h3 className="font-semibold text-xs md:text-sm mb-2 text-green-800">
									Suspension Expiry
								</h3>
								<p className="text-xs text-gray-700">
									Automatically expires old cheating suspensions. Runs every 6
									hours to keep student access up-to-date.
								</p>
							</div>

							<div className="p-3 md:p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
								<h3 className="font-semibold text-xs md:text-sm mb-2 text-indigo-800">
									Manual Override
								</h3>
								<p className="text-xs text-gray-700">
									Use the buttons above to run any task immediately without
									waiting for the scheduled time.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CronJobsPage;
