"use client";

import { useState } from "react";
import { toast } from "react-toastify";

type CronJob = {
	endpoint: string;
	name: string;
	description: string;
	icon: string;
	schedule: string;
	color: string;
};

const cronJobs: CronJob[] = [
	{
		endpoint: "mark-absent-teachers",
		name: "Mark Absent Teachers",
		description:
			"Automatically marks teachers as absent if no attendance recorded",
		icon: "👨‍🏫",
		schedule: "Should run at 9:00 AM daily",
		color: "blue",
	},
	{
		endpoint: "process-badges",
		name: "Process Badges",
		description: "Awards and removes badges based on student performance",
		icon: "🎖️",
		schedule: "Should run at 2:00 AM daily",
		color: "green",
	},
	{
		endpoint: "expire-suspensions",
		name: "Expire Suspensions",
		description: "Automatically expires old cheating suspensions",
		icon: "🔓",
		schedule: "Should run every 6 hours",
		color: "purple",
	},
];

export default function ManualCronTriggers() {
	const [loading, setLoading] = useState<string | null>(null);
	const [lastRun, setLastRun] = useState<Record<string, string>>({});

	const getColorClasses = (color: string) => {
		const colors: Record<string, string> = {
			blue: "bg-blue-500 hover:bg-blue-600",
			green: "bg-green-500 hover:bg-green-600",
			purple: "bg-purple-500 hover:bg-purple-600",
		};
		return colors[color] || "bg-gray-500 hover:bg-gray-600";
	};

	const trigger = async (job: CronJob) => {
		setLoading(job.endpoint);
		try {
			const res = await fetch(`/api/cron/${job.endpoint}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer school_cron_2025_secure_token_vikash`,
				},
			});

			const data = await res.json();

			if (res.ok && data.success) {
				toast.success(`✅ ${job.name} completed successfully!`);
				setLastRun((prev) => ({
					...prev,
					[job.endpoint]: new Date().toLocaleString(),
				}));
			} else {
				toast.error(`❌ ${job.name} failed: ${data.error || "Unknown error"}`);
			}
		} catch (error) {
			console.error(`Error triggering ${job.name}:`, error);
			toast.error(`❌ Error triggering ${job.name}`);
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="mb-6">
				<h3 className="text-xl font-bold text-gray-800">
					Manual Cron Job Triggers
				</h3>
				<p className="text-sm text-gray-500 mt-1">
					⚠️ Vercel Free plan doesn&apos;t support automatic cron jobs. Use
					these buttons to manually trigger scheduled tasks, or set up an
					external cron service.
				</p>
				<a
					href="/Docs/VERCEL_FREE_CRON_ALTERNATIVES.md"
					className="text-xs text-blue-500 hover:underline mt-1 inline-block"
					target="_blank"
				>
					📖 View setup guide for automatic scheduling
				</a>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{cronJobs.map((job) => (
					<div
						key={job.endpoint}
						className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
					>
						<div className="flex items-start justify-between mb-3">
							<div>
								<div className="text-2xl mb-1">{job.icon}</div>
								<h4 className="font-semibold text-gray-800">{job.name}</h4>
							</div>
						</div>

						<p className="text-sm text-gray-600 mb-3">{job.description}</p>

						<div className="text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded">
							<div className="font-medium">Schedule:</div>
							<div>{job.schedule}</div>
						</div>

						{lastRun[job.endpoint] && (
							<div className="text-xs text-green-600 mb-3 bg-green-50 p-2 rounded">
								<div className="font-medium">Last run:</div>
								<div>{lastRun[job.endpoint]}</div>
							</div>
						)}

						<button
							onClick={() => trigger(job)}
							disabled={loading === job.endpoint}
							className={`w-full px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${getColorClasses(
								job.color
							)}`}
						>
							{loading === job.endpoint ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Running...
								</span>
							) : (
								`▶️ Run ${job.name}`
							)}
						</button>
					</div>
				))}
			</div>

			<div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
				<div className="flex gap-2">
					<span className="text-yellow-600 text-xl">💡</span>
					<div>
						<div className="font-semibold text-yellow-800 text-sm">
							Recommendation:
						</div>
						<p className="text-xs text-yellow-700 mt-1">
							For automatic execution, set up a free external cron service like{" "}
							<strong>cron-job.org</strong> or <strong>GitHub Actions</strong>.
							See the documentation for step-by-step instructions.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
