import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
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
		<div className="bg-white p-3 md:p-4 rounded-md flex-1 m-2 md:m-4 mt-0">
			<div className="max-w-7xl mx-auto">
				<div className="mb-4 md:mb-6">
					<div className="flex items-center gap-3 mb-2">
						<Image
							src="/setting.png"
							alt="Settings"
							width={28}
							height={28}
							className="w-6 h-6 md:w-7 md:h-7"
						/>
						<h1 className="text-xl md:text-2xl font-semibold">Settings</h1>
					</div>
					<p className="text-sm md:text-base text-gray-600">
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
