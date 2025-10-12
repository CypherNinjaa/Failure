"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
	updateNotificationPreference,
	bulkUpdateNotificationPreferences,
} from "@/lib/notificationActions";

type NotificationCategory = {
	id: string;
	key: string;
	name: string;
	description: string | null;
	category: string;
	icon: string | null;
	defaultEnabled: boolean;
	applicableRoles: any; // JsonValue from Prisma
	supportedChannels: any; // JsonValue from Prisma
	priority: string;
	displayOrder: number;
	isActive: boolean;
	userPreference: {
		isEnabled: boolean;
		channels: any; // JsonValue from Prisma
		frequency: string;
		quietHoursEnabled: boolean;
		quietHoursStart: string;
		quietHoursEnd: string;
	};
};

const NotificationSettingsClient = ({
	preferences,
	userRole,
}: {
	preferences: NotificationCategory[];
	userRole: string;
}) => {
	const [loading, setLoading] = useState(false);
	const [settings, setSettings] = useState(preferences);
	const [globalEnabled, setGlobalEnabled] = useState(true);
	const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
	const [quietHoursStart, setQuietHoursStart] = useState("22:00");
	const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");

	// Group by category
	const groupedSettings = settings.reduce((acc, pref) => {
		if (!acc[pref.category]) {
			acc[pref.category] = [];
		}
		acc[pref.category].push(pref);
		return acc;
	}, {} as Record<string, NotificationCategory[]>);

	// Category icons
	const categoryIcons: Record<string, string> = {
		FINANCE: "💰",
		ACADEMICS: "📚",
		ATTENDANCE: "📅",
		ACHIEVEMENT: "🏆",
		EVENTS: "🎉",
		ANNOUNCEMENTS: "📢",
		COMMUNICATION: "💬",
		SYSTEM: "⚙️",
	};

	const handleToggleNotification = async (
		categoryKey: string,
		currentEnabled: boolean
	) => {
		setLoading(true);

		const result = await updateNotificationPreference(categoryKey, {
			isEnabled: !currentEnabled,
		});

		if (result.success) {
			setSettings((prev) =>
				prev.map((s) =>
					s.key === categoryKey
						? {
								...s,
								userPreference: {
									...s.userPreference,
									isEnabled: !currentEnabled,
								},
						  }
						: s
				)
			);
			toast.success("Notification preference updated");
		} else {
			toast.error("Failed to update preference");
		}

		setLoading(false);
	};

	const handleToggleChannel = async (
		categoryKey: string,
		channel: "push" | "email",
		currentChannels: { push: boolean; email: boolean }
	) => {
		setLoading(true);

		const newChannels = {
			...currentChannels,
			[channel]: !currentChannels[channel],
		};

		const result = await updateNotificationPreference(categoryKey, {
			channels: newChannels,
		});

		if (result.success) {
			setSettings((prev) =>
				prev.map((s) =>
					s.key === categoryKey
						? {
								...s,
								userPreference: {
									...s.userPreference,
									channels: newChannels,
								},
						  }
						: s
				)
			);
			toast.success("Channel preference updated");
		} else {
			toast.error("Failed to update channel");
		}

		setLoading(false);
	};

	const handleToggleAll = async (enabled: boolean) => {
		setLoading(true);
		setGlobalEnabled(enabled);

		const updates = settings.map((s) => ({
			categoryKey: s.key,
			isEnabled: enabled,
			channels: s.userPreference.channels,
		}));

		const result = await bulkUpdateNotificationPreferences(updates);

		if (result.success) {
			setSettings((prev) =>
				prev.map((s) => ({
					...s,
					userPreference: {
						...s.userPreference,
						isEnabled: enabled,
					},
				}))
			);
			toast.success(
				enabled ? "All notifications enabled" : "All notifications disabled"
			);
		} else {
			toast.error("Failed to update preferences");
		}

		setLoading(false);
	};

	const handleUpdateQuietHours = async () => {
		setLoading(true);

		// Update quiet hours for all categories
		const updates = settings.map((s) =>
			updateNotificationPreference(s.key, {
				quietHoursEnabled,
				quietHoursStart,
				quietHoursEnd,
			})
		);

		const results = await Promise.all(updates);

		if (results.every((r) => r.success)) {
			toast.success("Quiet hours updated");
		} else {
			toast.error("Failed to update quiet hours");
		}

		setLoading(false);
	};

	return (
		<div className="space-y-6">
			{/* Global Settings */}
			<div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
				<h2 className="text-lg font-semibold mb-4">⚙️ Global Settings</h2>

				<div className="space-y-4">
					{/* Master Switch */}
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Enable All Notifications</p>
							<p className="text-sm text-gray-600">
								Master switch to enable/disable all notifications
							</p>
						</div>
						<button
							onClick={() => handleToggleAll(!globalEnabled)}
							disabled={loading}
							className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
								globalEnabled ? "bg-lamaPurple" : "bg-gray-300"
							} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
						>
							<span
								className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
									globalEnabled ? "translate-x-7" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					{/* Quiet Hours */}
					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-3">
							<div>
								<p className="font-medium">Quiet Hours</p>
								<p className="text-sm text-gray-600">
									Don&apos;t send push notifications during these hours
								</p>
							</div>
							<button
								onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
								disabled={loading}
								className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
									quietHoursEnabled ? "bg-lamaPurple" : "bg-gray-300"
								} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
							>
								<span
									className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
										quietHoursEnabled ? "translate-x-7" : "translate-x-1"
									}`}
								/>
							</button>
						</div>

						{quietHoursEnabled && (
							<div className="flex gap-4 items-end">
								<div className="flex-1">
									<label className="text-sm text-gray-600">Start Time</label>
									<input
										type="time"
										value={quietHoursStart}
										onChange={(e) => setQuietHoursStart(e.target.value)}
										className="w-full mt-1 p-2 border rounded-md"
									/>
								</div>
								<div className="flex-1">
									<label className="text-sm text-gray-600">End Time</label>
									<input
										type="time"
										value={quietHoursEnd}
										onChange={(e) => setQuietHoursEnd(e.target.value)}
										className="w-full mt-1 p-2 border rounded-md"
									/>
								</div>
								<button
									onClick={handleUpdateQuietHours}
									disabled={loading}
									className="px-4 py-2 bg-lamaPurple text-white rounded-md hover:bg-lamaPurpleLight disabled:opacity-50"
								>
									Save
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Category-wise Settings */}
			{Object.entries(groupedSettings).map(([category, notifications]) => (
				<div
					key={category}
					className="bg-white border-2 border-gray-200 rounded-lg p-6"
				>
					<h2 className="text-lg font-semibold mb-4">
						{categoryIcons[category] || "🔔"} {category.replace("_", " ")}
					</h2>

					<div className="space-y-4">
						{notifications.map((notif) => (
							<div
								key={notif.key}
								className="flex items-start justify-between border-b pb-4 last:border-b-0 last:pb-0"
							>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<span className="text-xl">{notif.icon}</span>
										<div>
											<p className="font-medium">{notif.name}</p>
											<p className="text-sm text-gray-600">
												{notif.description}
											</p>
											{notif.priority === "HIGH" && (
												<span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
													High Priority
												</span>
											)}
											{notif.priority === "CRITICAL" && (
												<span className="inline-block mt-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
													Critical
												</span>
											)}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-4">
									{/* Channel Toggles */}
									<div className="flex gap-2">
										{notif.supportedChannels.push && (
											<button
												onClick={() =>
													handleToggleChannel(
														notif.key,
														"push",
														notif.userPreference.channels
													)
												}
												disabled={loading || !notif.userPreference.isEnabled}
												className={`p-2 rounded-md border-2 transition-colors ${
													notif.userPreference.channels.push &&
													notif.userPreference.isEnabled
														? "bg-lamaPurple text-white border-lamaPurple"
														: "bg-white text-gray-400 border-gray-300"
												} ${
													loading || !notif.userPreference.isEnabled
														? "opacity-50 cursor-not-allowed"
														: ""
												}`}
												title="Push Notifications"
											>
												🔔
											</button>
										)}
										{notif.supportedChannels.email && (
											<button
												onClick={() =>
													handleToggleChannel(
														notif.key,
														"email",
														notif.userPreference.channels
													)
												}
												disabled={loading || !notif.userPreference.isEnabled}
												className={`p-2 rounded-md border-2 transition-colors ${
													notif.userPreference.channels.email &&
													notif.userPreference.isEnabled
														? "bg-blue-500 text-white border-blue-500"
														: "bg-white text-gray-400 border-gray-300"
												} ${
													loading || !notif.userPreference.isEnabled
														? "opacity-50 cursor-not-allowed"
														: ""
												}`}
												title="Email Notifications"
											>
												📧
											</button>
										)}
									</div>

									{/* Master Toggle */}
									<button
										onClick={() =>
											handleToggleNotification(
												notif.key,
												notif.userPreference.isEnabled
											)
										}
										disabled={loading}
										className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
											notif.userPreference.isEnabled
												? "bg-green-500"
												: "bg-gray-300"
										} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
									>
										<span
											className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
												notif.userPreference.isEnabled
													? "translate-x-7"
													: "translate-x-1"
											}`}
										/>
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			))}

			{/* Info Box */}
			<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
				<p className="text-sm text-blue-800">
					<strong>💡 Tip:</strong> Toggle the main switch to enable/disable a
					notification type, then choose your preferred channels (🔔 Push or 📧
					Email). Critical notifications may bypass your preferences for
					important updates.
				</p>
			</div>
		</div>
	);
};

export default NotificationSettingsClient;
