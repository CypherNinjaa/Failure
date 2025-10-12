"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type NotificationCategory = {
	id: string;
	key: string;
	name: string;
	description: string | null;
	category: string;
	icon: string | null;
	defaultEnabled: boolean;
	priority: string;
};

const AdminNotificationCenter = ({
	categories,
}: {
	categories: NotificationCategory[];
}) => {
	const [recipientType, setRecipientType] = useState<
		"ALL" | "STUDENT" | "PARENT" | "TEACHER" | "ADMIN"
	>("ALL");
	const [categoryKey, setCategoryKey] = useState("");
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);
	const [testing, setTesting] = useState(false);
	const [testEmail, setTestEmail] = useState("");
	const [showTestModal, setShowTestModal] = useState(false);
	const [channels, setChannels] = useState({
		push: true,
		email: true,
	});

	// Group categories by category type
	const groupedCategories = categories.reduce((acc, cat) => {
		if (!acc[cat.category]) {
			acc[cat.category] = [];
		}
		acc[cat.category].push(cat);
		return acc;
	}, {} as Record<string, NotificationCategory[]>);

	const handleTestNotification = async () => {
		if (!testEmail) {
			toast.error("Please enter your email address");
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(testEmail)) {
			toast.error("Please enter a valid email address");
			return;
		}

		setTesting(true);
		try {
			const res = await fetch("/api/admin/test-notification", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: testEmail }),
			});

			const data = await res.json();

			if (data.success) {
				toast.success(
					`✅ Test email sent successfully to ${data.sentTo}! Check your inbox.`,
					{ autoClose: 5000 }
				);
				setShowTestModal(false);
				setTestEmail("");
			} else {
				toast.error(`❌ Test failed: ${data.error || "Unknown error"}`);
				console.error("Test error details:", data);
			}
		} catch (error) {
			console.error("Test notification error:", error);
			toast.error("Error sending test notification");
		} finally {
			setTesting(false);
		}
	};

	const handleSend = async () => {
		if (!categoryKey || !title || !message) {
			toast.error("Please fill all required fields");
			return;
		}

		setSending(true);

		try {
			const res = await fetch("/api/admin/send-notification", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					recipientType,
					categoryKey,
					title,
					message,
					channels,
				}),
			});

			const data = await res.json();

			if (data.success) {
				toast.success("Notification sent successfully! 🎉");
				// Reset form
				setTitle("");
				setMessage("");
			} else {
				toast.error("Failed to send notification");
			}
		} catch (error) {
			console.error("Send notification error:", error);
			toast.error("Error sending notification");
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex items-center gap-3 mb-6">
				<span className="text-3xl">📢</span>
				<h2 className="text-2xl font-bold">Admin Notification Center</h2>
				<button
					onClick={() => setShowTestModal(true)}
					disabled={testing}
					className="ml-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
				>
					<span>🧪</span>
					Test Email
				</button>
			</div>

			{/* Test Email Modal */}
			{showTestModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold">🧪 Test Email Notification</h3>
							<button
								onClick={() => {
									setShowTestModal(false);
									setTestEmail("");
								}}
								className="text-gray-400 hover:text-gray-600 text-2xl"
							>
								×
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Your Email Address <span className="text-red-500">*</span>
								</label>
								<input
									type="email"
									value={testEmail}
									onChange={(e) => setTestEmail(e.target.value)}
									placeholder="your-email@example.com"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
								<p className="mt-1 text-xs text-gray-500">
									📧 Gmail will send from: vk6938663@gmail.com
								</p>
							</div>

							<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
								<p className="text-sm text-blue-800">
									<strong>ℹ️ How it works:</strong>
									<br />
									• Sender: vk6938663@gmail.com (Gmail SMTP)
									<br />
									• Recipient: Your entered email
									<br />• This tests the email configuration
								</p>
							</div>

							<div className="flex gap-3">
								<button
									onClick={handleTestNotification}
									disabled={testing || !testEmail}
									className="flex-1 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
								>
									{testing ? "Sending..." : "Send Test Email 📨"}
								</button>
								<button
									onClick={() => {
										setShowTestModal(false);
										setTestEmail("");
									}}
									className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="space-y-6">
				{/* Recipient Selection */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Send To <span className="text-red-500">*</span>
					</label>
					<select
						value={recipientType}
						onChange={(e) =>
							setRecipientType(
								e.target.value as
									| "ALL"
									| "STUDENT"
									| "PARENT"
									| "TEACHER"
									| "ADMIN"
							)
						}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent"
					>
						<option value="ALL">All Users</option>
						<option value="STUDENT">All Students</option>
						<option value="PARENT">All Parents</option>
						<option value="TEACHER">All Teachers</option>
						<option value="ADMIN">All Admins</option>
					</select>
					<p className="mt-1 text-xs text-gray-500">
						⚠️ This will send to all users of the selected type
					</p>
				</div>

				{/* Notification Category */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Notification Type <span className="text-red-500">*</span>
					</label>
					<select
						value={categoryKey}
						onChange={(e) => setCategoryKey(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent"
					>
						<option value="">Select notification type...</option>
						{Object.entries(groupedCategories).map(([group, cats]) => (
							<optgroup key={group} label={group.replace(/_/g, " ")}>
								{cats.map((cat) => (
									<option key={cat.key} value={cat.key}>
										{cat.icon} {cat.name}
									</option>
								))}
							</optgroup>
						))}
					</select>
				</div>

				{/* Channels */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Send Via <span className="text-red-500">*</span>
					</label>
					<div className="flex gap-4">
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								checked={channels.push}
								onChange={(e) =>
									setChannels({ ...channels, push: e.target.checked })
								}
								className="w-5 h-5 text-lamaPurple border-gray-300 rounded focus:ring-lamaPurple"
							/>
							<span className="text-sm">🔔 Web Push</span>
						</label>
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								checked={channels.email}
								onChange={(e) =>
									setChannels({ ...channels, email: e.target.checked })
								}
								className="w-5 h-5 text-lamaPurple border-gray-300 rounded focus:ring-lamaPurple"
							/>
							<span className="text-sm">📧 Email</span>
						</label>
					</div>
				</div>

				{/* Title */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Title <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="e.g., Important Announcement"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent"
						maxLength={100}
					/>
					<p className="mt-1 text-xs text-gray-500">
						{title.length}/100 characters
					</p>
				</div>

				{/* Message */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Message <span className="text-red-500">*</span>
					</label>
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Enter your notification message..."
						rows={6}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent resize-none"
						maxLength={500}
					/>
					<p className="mt-1 text-xs text-gray-500">
						{message.length}/500 characters
					</p>
				</div>

				{/* Send Button */}
				<div className="flex items-center gap-4">
					<button
						onClick={handleSend}
						disabled={sending || !title || !message || !categoryKey}
						className="px-8 py-3 bg-lamaPurple text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
					>
						{sending ? "Sending..." : "Send Notification 📨"}
					</button>

					<button
						onClick={() => {
							setTitle("");
							setMessage("");
							setCategoryKey("");
						}}
						className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
					>
						Clear Form
					</button>
				</div>

				{/* Warning Banner */}
				<div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<span className="text-2xl">⚠️</span>
						<div>
							<h3 className="font-semibold text-yellow-800 mb-1">
								Admin Override Active
							</h3>
							<p className="text-sm text-yellow-700">
								As an admin, your notifications will bypass user preferences
								including quiet hours and channel settings. Use responsibly for
								critical updates only.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminNotificationCenter;
