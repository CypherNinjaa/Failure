import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AutoAbsentManagement from "@/components/AutoAbsentManagement";

const AutoAbsentPage = () => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only admin can access this page
	if (role !== "admin") {
		redirect("/");
	}

	return (
		<div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
			<div className="w-full xl:w-2/3">
				<div className="h-full bg-white p-4 rounded-md">
					<h1 className="text-xl font-semibold mb-4">
						Teacher Attendance Auto-Management
					</h1>
					<AutoAbsentManagement />
				</div>
			</div>

			{/* Info Panel */}
			<div className="w-full xl:w-1/3">
				<div className="bg-white p-6 rounded-md">
					<h2 className="text-lg font-semibold mb-4 text-gray-800">
						Configuration Guide
					</h2>

					<div className="space-y-4">
						<div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
							<h3 className="font-semibold text-sm mb-2 text-purple-800">
								Automatic Schedule
							</h3>
							<p className="text-xs text-gray-700">
								The system automatically runs at 9:00 AM daily via Vercel Cron
								to mark absent teachers who didn&apos;t mark attendance.
							</p>
						</div>

						<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<h3 className="font-semibold text-sm mb-2 text-blue-800">
								Manual Trigger
							</h3>
							<p className="text-xs text-gray-700">
								Use the &quot;Mark Absent Now&quot; button to manually mark
								teachers as absent. This is useful for testing or when the
								attendance window just closed.
							</p>
						</div>

						<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
							<h3 className="font-semibold text-sm mb-2 text-green-800">
								Status Check
							</h3>
							<p className="text-xs text-gray-700">
								Use &quot;Check Status&quot; to see how many teachers have
								marked attendance and who hasn&apos;t without marking them
								absent.
							</p>
						</div>

						<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
							<h3 className="font-semibold text-sm mb-2 text-yellow-800">
								⚠️ Important Notes
							</h3>
							<ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
								<li>Ensure attendance window is configured properly</li>
								<li>Teachers can only mark attendance during the window</li>
								<li>Absent marking only works after window closes</li>
								<li>Already marked teachers won&apos;t be affected</li>
							</ul>
						</div>

						<div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
							<h3 className="font-semibold text-sm mb-2 text-gray-800">
								API Endpoints
							</h3>
							<div className="text-xs text-gray-700 space-y-2">
								<div>
									<code className="bg-gray-200 px-2 py-1 rounded">
										GET /api/auto-mark-absent
									</code>
									<p className="mt-1">Check status without marking</p>
								</div>
								<div>
									<code className="bg-gray-200 px-2 py-1 rounded">
										POST /api/auto-mark-absent
									</code>
									<p className="mt-1">Mark absent teachers now</p>
								</div>
								<div>
									<code className="bg-gray-200 px-2 py-1 rounded">
										GET /api/cron/mark-absent-teachers
									</code>
									<p className="mt-1">Cron endpoint (auto-scheduled)</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AutoAbsentPage;
