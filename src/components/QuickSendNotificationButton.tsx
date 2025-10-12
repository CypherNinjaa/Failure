"use client";

import { useState } from "react";
import { toast } from "react-toastify";

type QuickSendNotificationProps = {
	categoryKey: string;
	defaultTitle?: string;
	defaultMessage?: string;
	recipientType?: "ALL" | "STUDENT" | "PARENT" | "TEACHER" | "ADMIN";
	buttonText?: string;
	buttonIcon?: string;
};

const QuickSendNotificationButton = ({
	categoryKey,
	defaultTitle = "",
	defaultMessage = "",
	recipientType = "ALL",
	buttonText = "Send Notification",
	buttonIcon = "📧",
}: QuickSendNotificationProps) => {
	const [showModal, setShowModal] = useState(false);
	const [title, setTitle] = useState(defaultTitle);
	const [message, setMessage] = useState(defaultMessage);
	const [sending, setSending] = useState(false);
	const [channels, setChannels] = useState({ push: true, email: true });

	const handleSend = async () => {
		if (!title || !message) {
			toast.error("Please fill title and message");
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
				setShowModal(false);
				setTitle(defaultTitle);
				setMessage(defaultMessage);
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
		<>
			<button
				onClick={() => setShowModal(true)}
				className="px-4 py-2 bg-lamaPurple text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
			>
				<span>{buttonIcon}</span>
				{buttonText}
			</button>

			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold">
									{buttonIcon} Quick Send Notification
								</h2>
								<button
									onClick={() => setShowModal(false)}
									className="text-gray-400 hover:text-gray-600 text-2xl"
								>
									×
								</button>
							</div>

							<div className="space-y-4">
								{/* Channels */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Send Via
									</label>
									<div className="flex gap-4">
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												checked={channels.push}
												onChange={(e) =>
													setChannels({ ...channels, push: e.target.checked })
												}
												className="w-5 h-5 text-lamaPurple border-gray-300 rounded"
											/>
											<span className="text-sm">🔔 Web Push</span>
										</label>
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												checked={channels.email}
												onChange={(e) =>
													setChannels({
														...channels,
														email: e.target.checked,
													})
												}
												className="w-5 h-5 text-lamaPurple border-gray-300 rounded"
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
										placeholder="Notification title"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple"
										maxLength={100}
									/>
								</div>

								{/* Message */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Message <span className="text-red-500">*</span>
									</label>
									<textarea
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										placeholder="Notification message"
										rows={5}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple resize-none"
										maxLength={500}
									/>
									<p className="mt-1 text-xs text-gray-500">
										{message.length}/500 characters
									</p>
								</div>

								{/* Info */}
								<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
									<p className="text-sm text-blue-800">
										<strong>📌 Recipients:</strong> This will be sent to{" "}
										<strong>
											{recipientType === "ALL"
												? "All Users"
												: `All ${recipientType}s`}
										</strong>
									</p>
								</div>

								{/* Buttons */}
								<div className="flex gap-3 pt-4">
									<button
										onClick={handleSend}
										disabled={sending || !title || !message}
										className="flex-1 px-6 py-3 bg-lamaPurple text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
									>
										{sending ? "Sending..." : "Send Now 📨"}
									</button>
									<button
										onClick={() => setShowModal(false)}
										className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default QuickSendNotificationButton;
