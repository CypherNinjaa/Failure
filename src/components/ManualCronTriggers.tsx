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
		icon: "TEACHERS",
		schedule: "Should run at 9:00 AM daily",
		color: "blue",
	},
	{
		endpoint: "process-badges",
		name: "Process Badges",
		description: "Awards and removes badges based on student performance",
		icon: "BADGES",
		schedule: "Should run at 2:00 AM daily",
		color: "green",
	},
	{
		endpoint: "expire-suspensions",
		name: "Expire Suspensions",
		description: "Automatically expires old cheating suspensions",
		icon: "SUSPEND",
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

	const getIconBadge = (icon: string, color: string) => {
		const bgColors: Record<string, string> = {
			blue: "bg-blue-100 text-blue-600",
			green: "bg-green-100 text-green-600",
			purple: "bg-purple-100 text-purple-600",
		};

		return (
			<div
				className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${
					bgColors[color] || "bg-gray-100 text-gray-600"
				} flex items-center justify-center font-bold text-xs md:text-sm`}
			>
				{icon.substring(0, 2)}
			</div>
		);
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
				toast.success(`${job.name} completed successfully!`);
				setLastRun((prev) => ({
					...prev,
					[job.endpoint]: new Date().toLocaleString(),
				}));
			} else {
				toast.error(`${job.name} failed: ${data.error || "Unknown error"}`);
			}
		} catch (error) {
			console.error(`Error triggering ${job.name}:`, error);
			toast.error(`Error triggering ${job.name}`);
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
			<div className="mb-4 md:mb-6">
				<h3 className="text-lg md:text-xl font-bold text-gray-800">
					Automated Task Controls
				</h3>
				<p className="text-xs md:text-sm text-gray-500 mt-1">
					Click the buttons below to run automated tasks manually.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
				{cronJobs.map((job) => (
					<div
						key={job.endpoint}
						className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-lg transition-shadow"
					>
						<div className="flex items-start gap-3 mb-3">
							{getIconBadge(job.icon, job.color)}
							<div className="flex-1">
								<h4 className="font-semibold text-sm md:text-base text-gray-800">
									{job.name}
								</h4>
							</div>
						</div>

						<p className="text-xs md:text-sm text-gray-600 mb-3">
							{job.description}
						</p>

						{lastRun[job.endpoint] && (
							<div className="text-xs text-green-600 mb-3 bg-green-50 p-2 rounded">
								<div className="font-medium">Last run:</div>
								<div className="mt-0.5">{lastRun[job.endpoint]}</div>
							</div>
						)}

						<button
							onClick={() => trigger(job)}
							disabled={loading === job.endpoint}
							className={`w-full px-3 md:px-4 py-2 text-white text-xs md:text-sm rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${getColorClasses(
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
								`Run ${job.name}`
							)}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
