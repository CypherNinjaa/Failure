import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminNotificationCenter from "@/components/AdminNotificationCenter";
import prisma from "@/lib/prisma";

const AdminNotificationsPage = async () => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		redirect("/");
	}

	// Fetch all notification categories
	const categories = await prisma.notificationCategory.findMany({
		where: { isActive: true },
		orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
	});

	return (
		<div className="flex-1 p-4 md:p-6">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold mb-2">Notification Management</h1>
				<p className="text-gray-600">
					Send notifications to users via web push and email. Perfect for
					announcements, alerts, and important updates.
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs opacity-80 mb-1">Total Categories</p>
							<p className="text-2xl font-bold">{categories.length}</p>
						</div>
						<span className="text-4xl opacity-50">📂</span>
					</div>
				</div>

				<div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs opacity-80 mb-1">Email Enabled</p>
							<p className="text-2xl font-bold">✓</p>
						</div>
						<span className="text-4xl opacity-50">📧</span>
					</div>
				</div>

				<div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs opacity-80 mb-1">Push Enabled</p>
							<p className="text-2xl font-bold">✓</p>
						</div>
						<span className="text-4xl opacity-50">🔔</span>
					</div>
				</div>

				<div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs opacity-80 mb-1">Admin Mode</p>
							<p className="text-2xl font-bold">ON</p>
						</div>
						<span className="text-4xl opacity-50">⚡</span>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<AdminNotificationCenter
				categories={JSON.parse(JSON.stringify(categories))}
			/>

			{/* Recent Activity Section */}
			<div className="mt-6 bg-white p-6 rounded-lg shadow-md">
				<h3 className="text-xl font-bold mb-4">📊 Quick Tips</h3>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
						<h4 className="font-semibold text-blue-800 mb-2">
							🎯 Best Practices
						</h4>
						<ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
							<li>Use clear, concise titles</li>
							<li>Keep messages under 200 characters for push</li>
							<li>Select appropriate notification category</li>
							<li>Test with small groups first</li>
						</ul>
					</div>

					<div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
						<h4 className="font-semibold text-green-800 mb-2">
							✅ When to Use Each Channel
						</h4>
						<ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
							<li>
								<strong>Push:</strong> Urgent updates, real-time alerts
							</li>
							<li>
								<strong>Email:</strong> Detailed info, receipts, reports
							</li>
							<li>
								<strong>Both:</strong> Critical announcements
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminNotificationsPage;
