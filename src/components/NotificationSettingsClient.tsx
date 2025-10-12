"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
	updateNotificationPreference,
	bulkUpdateNotificationPreferences,
} from "@/lib/notificationActions";
import EnableNotifications from "./EnableNotifications";

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
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	// Group by category
	const groupedSettings = settings.reduce((acc, pref) => {
		if (!acc[pref.category]) {
			acc[pref.category] = [];
		}
		acc[pref.category].push(pref);
		return acc;
	}, {} as Record<string, NotificationCategory[]>);

	// Category icons mapping
	const categoryIconMap: Record<string, string> = {
		FINANCE: "/finance.png",
		ACADEMICS: "/lesson.png",
		ATTENDANCE: "/attendance.png",
		ACHIEVEMENT: "/test.png",
		EVENTS: "/calendar.png",
		ANNOUNCEMENTS: "/announcement.png",
		COMMUNICATION: "/message.png",
		SYSTEM: "/setting.png",
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
		<div className="space-y-4 md:space-y-6">
			{/* ENABLE PUSH NOTIFICATIONS - Prominent at the top */}
			<EnableNotifications />

			{/* Global Settings */}
			<div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 md:p-6">
				<div className="flex items-center gap-2 mb-4">
					<Image src="/setting.png" alt="Settings" width={20} height={20} />
					<h2 className="text-base md:text-lg font-semibold">
						Global Settings
					</h2>
				</div>

				<div className="space-y-4">
					{/* Master Switch */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div className="flex-1">
							<p className="font-medium text-sm md:text-base">
								Enable All Notifications
							</p>
							<p className="text-xs md:text-sm text-gray-600">
								Master switch to enable/disable all notifications
							</p>
						</div>
						<button
							onClick={() => handleToggleAll(!globalEnabled)}
							disabled={loading}
							className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
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
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
							<div className="flex-1">
								<p className="font-medium text-sm md:text-base">Quiet Hours</p>
								<p className="text-xs md:text-sm text-gray-600">
									Don&apos;t send push notifications during these hours
								</p>
							</div>
							<button
								onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
								disabled={loading}
								className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
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
							<div className="flex flex-col sm:flex-row gap-3 sm:items-end">
								<div className="flex-1">
									<label className="text-xs md:text-sm text-gray-600">
										Start Time
									</label>
									<input
										type="time"
										value={quietHoursStart}
										onChange={(e) => setQuietHoursStart(e.target.value)}
										className="w-full mt-1 p-2 border rounded-md text-sm"
									/>
								</div>
								<div className="flex-1">
									<label className="text-xs md:text-sm text-gray-600">
										End Time
									</label>
									<input
										type="time"
										value={quietHoursEnd}
										onChange={(e) => setQuietHoursEnd(e.target.value)}
										className="w-full mt-1 p-2 border rounded-md text-sm"
									/>
								</div>
								<button
									onClick={handleUpdateQuietHours}
									disabled={loading}
									className="w-full sm:w-auto px-4 py-2 bg-lamaPurple text-white rounded-md hover:bg-lamaPurpleLight disabled:opacity-50 text-sm"
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
					className="bg-white border-2 border-gray-200 rounded-lg p-4 md:p-6"
				>
					<div className="flex items-center gap-2 mb-4">
						<Image
							src={categoryIconMap[category] || "/notification.png"}
							alt={category}
							width={20}
							height={20}
						/>
						<h2 className="text-base md:text-lg font-semibold">
							{category.replace("_", " ")}
						</h2>
					</div>

					<div className="space-y-4">
						{notifications.map((notif) => (
							<div
								key={notif.key}
								className="flex flex-col sm:flex-row sm:items-start gap-3 border-b pb-4 last:border-b-0 last:pb-0"
							>
								<div className="flex-1 min-w-0">
									<div className="flex items-start gap-2">
										{notif.icon && (
											<span className="text-lg flex-shrink-0">
												{notif.icon}
											</span>
										)}
										<div className="min-w-0">
											<p className="font-medium text-sm md:text-base break-words">
												{notif.name}
											</p>
											<p className="text-xs md:text-sm text-gray-600 break-words">
												{notif.description}
											</p>
											{(notif.priority === "HIGH" ||
												notif.priority === "CRITICAL") && (
												<span
													className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
														notif.priority === "CRITICAL"
															? "bg-red-500 text-white"
															: "bg-red-100 text-red-600"
													}`}
												>
													{notif.priority === "CRITICAL"
														? "Critical"
														: "High Priority"}
												</span>
											)}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end">
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
														? "bg-lamaPurple border-lamaPurple"
														: "bg-white border-gray-300"
												} ${
													loading || !notif.userPreference.isEnabled
														? "opacity-50 cursor-not-allowed"
														: ""
												}`}
												title="Push Notifications"
											>
												<Image
													src="/notification.png"
													alt="Push"
													width={16}
													height={16}
													className={
														notif.userPreference.channels.push &&
														notif.userPreference.isEnabled
															? "brightness-0 invert"
															: ""
													}
												/>
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
														? "bg-blue-500 border-blue-500"
														: "bg-white border-gray-300"
												} ${
													loading || !notif.userPreference.isEnabled
														? "opacity-50 cursor-not-allowed"
														: ""
												}`}
												title="Email Notifications"
											>
												<Image
													src="/mail.png"
													alt="Email"
													width={16}
													height={16}
													className={
														notif.userPreference.channels.email &&
														notif.userPreference.isEnabled
															? "brightness-0 invert"
															: ""
													}
												/>
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
										className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${
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
			<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 md:p-4">
				<div className="flex items-start gap-2">
					<Image
						src="/message.png"
						alt="Info"
						width={16}
						height={16}
						className="mt-0.5 flex-shrink-0"
					/>
					<p className="text-xs md:text-sm text-blue-800">
						<strong>Tip:</strong> Toggle the main switch to enable/disable a
						notification type, then choose your preferred channels (Push or
						Email). Critical notifications may bypass your preferences for
						important updates.
					</p>
				</div>
			</div>
		</div>
	);
};

export default NotificationSettingsClient;
