import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NotificationSettingsClient from "@/components/NotificationSettingsClient";
import EnableNotifications from "@/components/EnableNotifications";
import { getUserNotificationPreferences } from "@/lib/notificationActions";

const NotificationSettingsPage = async () => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (!userId) {
		redirect("/sign-in");
	}

	// Fetch user's notification preferences
	const result = await getUserNotificationPreferences();

	if (!result.success || !result.data) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-xl font-semibold mb-4">Notification Settings</h1>
				<p className="text-red-500">Failed to load notification settings.</p>
			</div>
		);
	}

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			<div className="max-w-4xl mx-auto">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold mb-2">
						🔔 Notification Settings
					</h1>
					<p className="text-gray-600">
						Manage how and when you receive notifications from HCS
					</p>
				</div>

				<NotificationSettingsClient
					preferences={JSON.parse(JSON.stringify(result.data))}
					userRole={role || "student"}
				/>
			</div>
		</div>
	);
};

export default NotificationSettingsPage;
