"use client";

import { useState } from "react";
import NotificationSettingsClient from "./NotificationSettingsClient";

type SettingTab = "notifications" | "profile" | "privacy" | "appearance";

type NotificationCategory = {
	id: string;
	key: string;
	name: string;
	description: string | null;
	category: string;
	icon: string | null;
	defaultEnabled: boolean;
	applicableRoles: any;
	supportedChannels: any;
	priority: string;
	displayOrder: number;
	isActive: boolean;
	userPreference: {
		isEnabled: boolean;
		channels: any;
		frequency: string;
		quietHoursEnabled: boolean;
		quietHoursStart: string;
		quietHoursEnd: string;
	};
};

const SettingsPageClient = ({
	notificationPreferences,
	userRole,
}: {
	notificationPreferences: NotificationCategory[];
	userRole: string;
}) => {
	const [activeTab, setActiveTab] = useState<SettingTab>("notifications");

	const tabs: { id: SettingTab; label: string; icon: string }[] = [
		{ id: "notifications", label: "Notifications", icon: "🔔" },
		{ id: "profile", label: "Profile", icon: "👤" },
		{ id: "privacy", label: "Privacy", icon: "🔒" },
		{ id: "appearance", label: "Appearance", icon: "🎨" },
	];

	return (
		<div className="flex gap-6">
			{/* Sidebar Tabs */}
			<div className="w-64 flex-shrink-0">
				<div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-2">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
								activeTab === tab.id
									? "bg-lamaPurple text-white font-medium"
									: "hover:bg-gray-200 text-gray-700"
							}`}
						>
							<span className="text-lg mr-2">{tab.icon}</span>
							{tab.label}
						</button>
					))}
				</div>

				{/* Info Box */}
				<div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
					<p className="text-xs text-blue-800">
						<strong>💡 Tip:</strong> Settings are saved automatically when you
						make changes.
					</p>
				</div>
			</div>

			{/* Content Area */}
			<div className="flex-1">
				{activeTab === "notifications" && (
					<div>
						<h2 className="text-xl font-semibold mb-4">
							🔔 Notification Settings
						</h2>
						<NotificationSettingsClient
							preferences={notificationPreferences}
							userRole={userRole}
						/>
					</div>
				)}

				{activeTab === "profile" && (
					<div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8">
						<h2 className="text-xl font-semibold mb-4">👤 Profile Settings</h2>
						<p className="text-gray-600">
							Profile settings coming soon. You can manage your personal
							information, contact details, and profile picture here.
						</p>
						<div className="mt-6 space-y-4">
							<div className="p-4 bg-white rounded-lg border">
								<h3 className="font-medium mb-2">Personal Information</h3>
								<p className="text-sm text-gray-600">
									Update your name, email, phone number
								</p>
							</div>
							<div className="p-4 bg-white rounded-lg border">
								<h3 className="font-medium mb-2">Profile Picture</h3>
								<p className="text-sm text-gray-600">
									Upload or change your profile photo
								</p>
							</div>
							<div className="p-4 bg-white rounded-lg border">
								<h3 className="font-medium mb-2">Change Password</h3>
								<p className="text-sm text-gray-600">
									Update your account password
								</p>
							</div>
						</div>
					</div>
				)}

				{activeTab === "privacy" && (
					<div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8">
						<h2 className="text-xl font-semibold mb-4">🔒 Privacy Settings</h2>
						<p className="text-gray-600">
							Privacy settings coming soon. Control who can see your information
							and how your data is used.
						</p>
						<div className="mt-6 space-y-4">
							<div className="p-4 bg-white rounded-lg border">
								<h3 className="font-medium mb-2">Profile Visibility</h3>
								<p className="text-sm text-gray-600">
									Control who can view your profile
								</p>
							</div>
							<div className="p-4 bg-white rounded-lg border">
								<h3 className="font-medium mb-2">Data Sharing</h3>
								<p className="text-sm text-gray-600">
									Manage data sharing preferences
								</p>
							</div>
							<div className="p-4 bg-white rounded-lg border">
								<h3 className="font-medium mb-2">Activity History</h3>
								<p className="text-sm text-gray-600">
									View and manage your activity data
								</p>
							</div>
						</div>
					</div>
				)}

				{activeTab === "appearance" && (
					<div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8">
						<h2 className="text-xl font-semibold mb-4">
							🎨 Appearance Settings
						</h2>
						<p className="text-gray-600">
							Appearance settings coming soon. Customize how the app looks and
							feels.
						</p>
						<div className="mt-6 space-y-4">
							<div className="p-4 bg-white rounded-lg border">
								<h3 className="font-medium mb-2">Theme</h3>
								<p className="text-sm text-gray-600">
									Choose between light, dark, or system theme
								</p>
							</div>
							<div className="p-4 bg-white rounded-lg border">
								<h3 className="font-medium mb-2">Language</h3>
								<p className="text-sm text-gray-600">
									Select your preferred language
								</p>
							</div>
							<div className="p-4 bg-white rounded-lg border">
								<h3 className="font-medium mb-2">Font Size</h3>
								<p className="text-sm text-gray-600">
									Adjust text size for better readability
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SettingsPageClient;
