import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SettingsPageClient from "@/components/SettingsPageClient";
import { getUserNotificationPreferences } from "@/lib/notificationActions";

const SettingsPage = async () => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (!userId) {
		redirect("/sign-in");
	}

	// Fetch user's notification preferences
	const notificationResult = await getUserNotificationPreferences();

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			<div className="max-w-6xl mx-auto">
				<div className="mb-6">
					<h1 className="text-2xl font-semibold mb-2">⚙️ Settings</h1>
					<p className="text-gray-600">
						Manage your account preferences and system settings
					</p>
				</div>

				<SettingsPageClient
					notificationPreferences={
						notificationResult.success
							? JSON.parse(JSON.stringify(notificationResult.data))
							: []
					}
					userRole={role || "student"}
				/>
			</div>
		</div>
	);
};

export default SettingsPage;
