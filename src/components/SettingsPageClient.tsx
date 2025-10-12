"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const tabs: { id: SettingTab; label: string; icon: string }[] = [
		{ id: "notifications", label: "Notifications", icon: "/notification.png" },
		{ id: "profile", label: "Profile", icon: "/profile.png" },
		{ id: "privacy", label: "Privacy", icon: "/setting.png" },
		{ id: "appearance", label: "Appearance", icon: "/view.png" },
	];

	return (
		<div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
			{/* Sidebar Tabs - Horizontal scroll on mobile, vertical on desktop */}
			<div className="w-full lg:w-64 flex-shrink-0">
				{/* Mobile: Horizontal scrollable tabs */}
				<div className="lg:hidden overflow-x-auto pb-2">
					<div className="flex gap-2 min-w-max">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
									activeTab === tab.id
										? "bg-lamaPurple text-white font-medium"
										: "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
								}`}
							>
								<Image src={tab.icon} alt={tab.label} width={18} height={18} />
								<span className="text-sm">{tab.label}</span>
							</button>
						))}
					</div>
				</div>

				{/* Desktop: Vertical tabs */}
				<div className="hidden lg:block bg-gray-50 border-2 border-gray-200 rounded-lg p-2">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg mb-1 last:mb-0 transition-colors ${
								activeTab === tab.id
									? "bg-lamaPurple text-white font-medium"
									: "hover:bg-gray-200 text-gray-700"
							}`}
						>
							<Image
								src={tab.icon}
								alt={tab.label}
								width={20}
								height={20}
								className={activeTab === tab.id ? "brightness-0 invert" : ""}
							/>
							{tab.label}
						</button>
					))}
				</div>

				{/* Info Box - Hidden on mobile */}
				<div className="hidden lg:block mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
					<div className="flex items-start gap-2">
						<Image
							src="/message.png"
							alt="Info"
							width={16}
							height={16}
							className="mt-0.5"
						/>
						<p className="text-xs text-blue-800">
							<strong>Tip:</strong> Settings are saved automatically when you
							make changes.
						</p>
					</div>
				</div>
			</div>

			{/* Content Area */}
			<div className="flex-1 min-w-0">
				{activeTab === "notifications" && (
					<div>
						<div className="flex items-center gap-2 mb-4">
							<Image
								src="/notification.png"
								alt="Notifications"
								width={24}
								height={24}
							/>
							<h2 className="text-lg md:text-xl font-semibold">
								Notification Settings
							</h2>
						</div>
						<NotificationSettingsClient
							preferences={notificationPreferences}
							userRole={userRole}
						/>
					</div>
				)}

				{activeTab === "profile" && (
					<div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 md:p-8">
						<div className="flex items-center gap-2 mb-4">
							<Image src="/profile.png" alt="Profile" width={24} height={24} />
							<h2 className="text-lg md:text-xl font-semibold">
								Profile Settings
							</h2>
						</div>
						<p className="text-sm md:text-base text-gray-600 mb-6">
							Profile settings coming soon. You can manage your personal
							information, contact details, and profile picture here.
						</p>
						<div className="space-y-3 md:space-y-4">
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
					<div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 md:p-8">
						<div className="flex items-center gap-2 mb-4">
							<Image src="/setting.png" alt="Privacy" width={24} height={24} />
							<h2 className="text-lg md:text-xl font-semibold">
								Privacy Settings
							</h2>
						</div>
						<p className="text-sm md:text-base text-gray-600 mb-6">
							Privacy settings coming soon. Control who can see your information
							and how your data is used.
						</p>
						<div className="space-y-3 md:space-y-4">
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
					<div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 md:p-8">
						<div className="flex items-center gap-2 mb-4">
							<Image src="/view.png" alt="Appearance" width={24} height={24} />
							<h2 className="text-lg md:text-xl font-semibold">
								Appearance Settings
							</h2>
						</div>
						<p className="text-sm md:text-base text-gray-600 mb-6">
							Appearance settings coming soon. Customize how the app looks and
							feels.
						</p>
						<div className="space-y-3 md:space-y-4">
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
