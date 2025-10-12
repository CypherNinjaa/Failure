"use server";

import prisma from "./prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import webpush from "web-push";

// ============================================
// EMAIL CONFIGURATION (Gmail SMTP)
// ============================================

const emailTransporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
});

// ============================================
// WEB PUSH CONFIGURATION
// ============================================

webpush.setVapidDetails(
	"mailto:vk6938663@gmail.com",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

// ============================================
// HELPER FUNCTIONS
// ============================================

// Check if notification should be sent based on user preferences
async function shouldSendNotification(
	userId: string,
	categoryKey: string,
	channel: "push" | "email"
): Promise<boolean> {
	// Get user preference
	const preference = await prisma.userNotificationPreference.findUnique({
		where: {
			userId_categoryKey: {
				userId,
				categoryKey,
			},
		},
		include: {
			category: true,
		},
	});

	// If no preference exists, use category defaults
	if (!preference) {
		const category = await prisma.notificationCategory.findUnique({
			where: { key: categoryKey },
		});
		if (!category) return false;

		const channels = category.supportedChannels as {
			push: boolean;
			email: boolean;
		};
		return category.defaultEnabled && channels[channel];
	}

	// Check if notification is enabled
	if (!preference.isEnabled) return false;

	// Check if channel is enabled
	const channels = preference.channels as { push: boolean; email: boolean };
	if (!channels[channel]) return false;

	// Check digest mode (skip instant notifications if digest is enabled)
	if (
		preference.frequency !== "INSTANT" &&
		!preference.category.priority.includes("CRITICAL")
	) {
		// Queue for digest instead
		return false;
	}

	// Check quiet hours
	if (preference.quietHoursEnabled && channel === "push") {
		const now = new Date();
		const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
			.getMinutes()
			.toString()
			.padStart(2, "0")}`;

		const start = preference.quietHoursStart || "22:00";
		const end = preference.quietHoursEnd || "08:00";

		// If quiet hours span midnight
		if (start > end) {
			if (currentTime >= start || currentTime < end) {
				return false; // In quiet hours
			}
		} else {
			if (currentTime >= start && currentTime < end) {
				return false; // In quiet hours
			}
		}
	}

	return true;
}

// Get user's email from Clerk
async function getUserEmail(userId: string): Promise<string | null> {
	try {
		const { clerkClient } = await import("@clerk/nextjs/server");
		const client = clerkClient();
		const user = await client.users.getUser(userId);
		const email = user.emailAddresses[0]?.emailAddress || null;
		console.log(
			`🔍 Fetching email for user ${userId}: ${email || "NOT FOUND"}`
		);
		return email;
	} catch (error) {
		console.error("❌ Failed to get user email:", error);
		return null;
	}
}

// Send email notification
async function sendEmailNotification(
	email: string,
	title: string,
	message: string,
	metadata?: any
): Promise<boolean> {
	try {
		await emailTransporter.sendMail({
			from: '"HCS School" <vk6938663@gmail.com>',
			to: email,
			subject: title,
			html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔔 ${title}</h2>
            </div>
            <div class="content">
              <p>${message}</p>
              ${
								metadata?.actionUrl
									? `<a href="${metadata.actionUrl}" class="button">View Details</a>`
									: ""
							}
            </div>
            <div class="footer">
              <p>HCS - Happy Child School Management System</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
		});
		return true;
	} catch (error) {
		console.error("Failed to send email:", error);
		return false;
	}
}

// Send web push notification
async function sendPushNotification(
	subscription: any,
	title: string,
	message: string,
	url?: string
): Promise<boolean> {
	try {
		console.log("🚀 Sending push notification:");
		console.log(
			"  📍 Endpoint:",
			subscription.endpoint?.substring(0, 50) + "..."
		);
		console.log("  📝 Title:", title);
		console.log("  💬 Message:", message);
		console.log("  🔗 URL:", url || "/");

		const payload = JSON.stringify({
			title,
			body: message,
			icon: "/logo.png",
			url: url || "/",
		});

		console.log("📦 Payload:", payload);

		await webpush.sendNotification(subscription, payload);

		console.log("✅ Push notification sent successfully");
		return true;
	} catch (error: any) {
		console.error("❌ Failed to send push notification:");
		console.error("  Error code:", error.statusCode);
		console.error("  Error message:", error.message);
		console.error("  Error body:", error.body);
		console.error("  Full error:", error);
		return false;
	}
}

// ============================================
// USER NOTIFICATION PREFERENCES ACTIONS
// ============================================

// Get user's notification preferences
export const getUserNotificationPreferences = async () => {
	const { userId, sessionClaims } = auth();
	if (!userId) {
		return { success: false, error: true, data: null };
	}

	const role = (sessionClaims?.metadata as { role?: string })?.role;

	try {
		// Get all categories applicable to this role
		const categories = await prisma.notificationCategory.findMany({
			where: {
				isActive: true,
			},
			orderBy: {
				displayOrder: "asc",
			},
		});

		// Filter categories by role
		const applicableCategories = categories.filter((cat) => {
			const roles = cat.applicableRoles as string[];
			return roles.includes(role || "");
		});

		// Get user's preferences
		const preferences = await prisma.userNotificationPreference.findMany({
			where: {
				userId,
			},
		});

		// Build response with defaults
		const preferencesMap = new Map(preferences.map((p) => [p.categoryKey, p]));

		const result = applicableCategories.map((category) => {
			const userPref = preferencesMap.get(category.key);
			return {
				...category,
				userPreference: userPref || {
					isEnabled: category.defaultEnabled,
					channels: category.supportedChannels,
					frequency: "INSTANT",
					quietHoursEnabled: false,
					quietHoursStart: "22:00",
					quietHoursEnd: "08:00",
				},
			};
		});

		return { success: true, error: false, data: result };
	} catch (err) {
		console.error("Failed to get notification preferences:", err);
		return { success: false, error: true, data: null };
	}
};

// Update notification preference
export const updateNotificationPreference = async (
	categoryKey: string,
	settings: {
		isEnabled?: boolean;
		channels?: { push: boolean; email: boolean };
		frequency?: "INSTANT" | "DAILY_DIGEST" | "WEEKLY_DIGEST";
		quietHoursEnabled?: boolean;
		quietHoursStart?: string;
		quietHoursEnd?: string;
	}
) => {
	const { userId } = auth();
	if (!userId) {
		return { success: false, error: true };
	}

	try {
		// Get category defaults for channels if not provided
		const category = await prisma.notificationCategory.findUnique({
			where: { key: categoryKey },
		});

		if (!category) {
			console.error(`Category not found: ${categoryKey}`);
			return { success: false, error: true };
		}

		// Ensure channels is always provided
		const channelsValue =
			settings.channels ||
			(category.supportedChannels as { push: boolean; email: boolean });

		await prisma.userNotificationPreference.upsert({
			where: {
				userId_categoryKey: {
					userId,
					categoryKey,
				},
			},
			update: settings as any,
			create: {
				userId,
				categoryKey,
				channels: channelsValue as any,
				isEnabled: settings.isEnabled ?? true,
				frequency: settings.frequency ?? "INSTANT",
				quietHoursEnabled: settings.quietHoursEnabled ?? false,
				quietHoursStart: settings.quietHoursStart ?? "22:00",
				quietHoursEnd: settings.quietHoursEnd ?? "08:00",
			},
		});

		revalidatePath("/list/settings");
		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to update notification preference:", err);
		return { success: false, error: true };
	}
};

// Bulk update preferences
export const bulkUpdateNotificationPreferences = async (
	updates: Array<{
		categoryKey: string;
		isEnabled: boolean;
		channels?: { push: boolean; email: boolean };
	}>
) => {
	const { userId } = auth();
	if (!userId) {
		return { success: false, error: true };
	}

	try {
		// Get all categories for defaults
		const categories = await prisma.notificationCategory.findMany({
			where: {
				key: { in: updates.map((u) => u.categoryKey) },
			},
		});

		const categoryMap = new Map(categories.map((c) => [c.key, c]));

		await Promise.all(
			updates.map((update) => {
				const category = categoryMap.get(update.categoryKey);
				const channelsValue = update.channels ||
					(category?.supportedChannels as {
						push: boolean;
						email: boolean;
					}) || { push: true, email: true };

				return prisma.userNotificationPreference.upsert({
					where: {
						userId_categoryKey: {
							userId,
							categoryKey: update.categoryKey,
						},
					},
					update: {
						isEnabled: update.isEnabled,
						channels: channelsValue as any,
					},
					create: {
						userId,
						categoryKey: update.categoryKey,
						isEnabled: update.isEnabled,
						channels: channelsValue as any,
						frequency: "INSTANT",
						quietHoursEnabled: false,
						quietHoursStart: "22:00",
						quietHoursEnd: "08:00",
					},
				});
			})
		);

		revalidatePath("/list/settings");
		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to bulk update preferences:", err);
		return { success: false, error: true };
	}
};

// ============================================
// PUSH SUBSCRIPTION ACTIONS
// ============================================

// Subscribe to push notifications
export const subscribeToPushNotifications = async (
	subscription: {
		endpoint: string;
		keys: { p256dh: string; auth: string };
	},
	deviceInfo?: {
		userAgent?: string;
		deviceType?: string;
	}
) => {
	const { userId } = auth();
	if (!userId) {
		return { success: false, error: true };
	}

	try {
		await prisma.pushSubscription.upsert({
			where: { endpoint: subscription.endpoint },
			update: {
				keys: subscription.keys,
				userAgent: deviceInfo?.userAgent,
				deviceType: deviceInfo?.deviceType,
				isActive: true,
			},
			create: {
				userId,
				endpoint: subscription.endpoint,
				keys: subscription.keys,
				userAgent: deviceInfo?.userAgent,
				deviceType: deviceInfo?.deviceType,
			},
		});

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to save push subscription:", err);
		return { success: false, error: true };
	}
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async (endpoint: string) => {
	const { userId } = auth();
	if (!userId) {
		return { success: false, error: true };
	}

	try {
		await prisma.pushSubscription.updateMany({
			where: { userId, endpoint },
			data: { isActive: false },
		});

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to unsubscribe:", err);
		return { success: false, error: true };
	}
};

// ============================================
// SEND NOTIFICATION ACTIONS
// ============================================

// Core function to send notification to a single user
export const sendNotificationToUser = async (
	userId: string,
	categoryKey: string,
	title: string,
	message: string,
	metadata?: any,
	forceAdmin?: boolean // Admin override
) => {
	try {
		// Get category info
		const category = await prisma.notificationCategory.findUnique({
			where: { key: categoryKey },
		});

		if (!category) {
			console.error(`❌ Category not found: ${categoryKey}`);
			throw new Error(`Category ${categoryKey} not found`);
		}

		console.log(`📧 Sending notification to user ${userId}:`, {
			category: categoryKey,
			title,
			forceAdmin: !!forceAdmin,
		});

		const deliveryResults: any = {};

		// Check push notification preference
		const shouldSendPush =
			forceAdmin || (await shouldSendNotification(userId, categoryKey, "push"));

		console.log(
			`🔔 Push notification: ${shouldSendPush ? "ENABLED" : "DISABLED"}`
		);

		if (shouldSendPush) {
			// Get user's push subscriptions
			const subscriptions = await prisma.pushSubscription.findMany({
				where: { userId, isActive: true },
			});

			console.log(`📱 Found ${subscriptions.length} active push subscriptions`);

			if (subscriptions.length > 0) {
				const pushResults = await Promise.allSettled(
					subscriptions.map((sub) => {
						// Reconstruct subscription object for web-push
						const subscriptionObject = {
							endpoint: sub.endpoint,
							keys: sub.keys as { p256dh: string; auth: string },
						};
						return sendPushNotification(
							subscriptionObject,
							title,
							message,
							metadata?.actionUrl
						);
					})
				);

				const successCount = pushResults.filter(
					(r) => r.status === "fulfilled" && r.value
				).length;
				deliveryResults.push = successCount > 0 ? "success" : "failed";
				console.log(
					`✅ Push sent to ${successCount}/${subscriptions.length} devices`
				);
			} else {
				deliveryResults.push = "no_subscription";
				console.log("⚠️ No push subscriptions for user");
			}
		}

		// Check email notification preference
		const shouldSendEmail =
			forceAdmin ||
			(await shouldSendNotification(userId, categoryKey, "email"));

		console.log(
			`📧 Email notification: ${shouldSendEmail ? "ENABLED" : "DISABLED"}`
		);

		if (shouldSendEmail) {
			const email = await getUserEmail(userId);
			console.log(`📬 User email: ${email || "NOT FOUND"}`);

			if (email) {
				const emailSent = await sendEmailNotification(
					email,
					title,
					message,
					metadata
				);
				deliveryResults.email = emailSent ? "success" : "failed";
				console.log(
					`${emailSent ? "✅" : "❌"} Email ${
						emailSent ? "sent" : "failed"
					} to ${email}`
				);
			} else {
				deliveryResults.email = "no_email";
				console.log("⚠️ No email address found for user");
			}
		}

		console.log("📊 Delivery results:", deliveryResults);

		// Create notification record
		const notification = await prisma.notification.create({
			data: {
				recipientType: "STUDENT", // Will be dynamic based on user role
				recipientId: userId,
				categoryKey,
				title,
				message,
				type: "GENERAL",
				channels: deliveryResults,
				sendEmail: shouldSendEmail,
				sendWebPush: shouldSendPush,
				status: "UNREAD",
				sentAt: new Date(),
				isForced: forceAdmin || false,
				metadata,
			},
		});

		// Log the notification
		await prisma.notificationLog.create({
			data: {
				notificationId: notification.id,
				userId,
				categoryKey,
				title,
				message,
				channels: deliveryResults,
				deliveryStatus: Object.values(deliveryResults).every(
					(v) => v === "success"
				)
					? "SUCCESS"
					: Object.values(deliveryResults).some((v) => v === "success")
					? "PARTIALLY_SENT"
					: "FAILED",
				metadata,
			},
		});

		return { success: true, error: false, data: notification };
	} catch (err) {
		console.error("Failed to send notification:", err);
		return { success: false, error: true };
	}
};

// Send notification to multiple users by role
export const sendNotificationToRole = async (
	role: string,
	categoryKey: string,
	title: string,
	message: string,
	metadata?: any,
	forceAdmin?: boolean
) => {
	const { userId: adminId, sessionClaims } = auth();
	const adminRole = (sessionClaims?.metadata as { role?: string })?.role;

	if (adminRole !== "admin") {
		return { success: false, error: true };
	}

	try {
		// Get all users with this role from Clerk
		const { clerkClient } = await import("@clerk/nextjs/server");
		const client = clerkClient();
		const users = await client.users.getUserList({
			limit: 500,
		});

		const roleUsers = users.data.filter(
			(user) => user.publicMetadata.role === role
		);

		console.log(`👥 Found ${roleUsers.length} users with role: ${role}`);

		if (roleUsers.length === 0) {
			console.log(`⚠️ No users found with role: ${role}`);
			return {
				success: true,
				error: false,
				data: { total: 0, sent: 0 },
			};
		}

		// Send to each user
		const results = await Promise.allSettled(
			roleUsers.map((user) =>
				sendNotificationToUser(
					user.id,
					categoryKey,
					title,
					message,
					metadata,
					forceAdmin
				)
			)
		);

		const successCount = results.filter(
			(r) => r.status === "fulfilled" && r.value.success
		).length;

		console.log(
			`✅ Successfully sent to ${successCount}/${roleUsers.length} ${role} users`
		);

		return {
			success: true,
			error: false,
			data: { total: roleUsers.length, sent: successCount },
		};
	} catch (err) {
		console.error("Failed to send notification to role:", err);
		return { success: false, error: true };
	}
};

// Admin: Force send notification (bypass preferences)
export const adminSendNotification = async (
	recipientType: "ALL" | "STUDENT" | "PARENT" | "TEACHER" | "ADMIN",
	categoryKey: string,
	title: string,
	message: string,
	recipientId?: string,
	metadata?: any
) => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		console.error("adminSendNotification: Unauthorized access attempt");
		return { success: false, error: "Unauthorized" };
	}

	console.log("🚀 Admin Notification Request:", {
		recipientType,
		categoryKey,
		title,
		hasRecipientId: !!recipientId,
	});

	try {
		if (recipientId) {
			// Send to specific user (force send)
			console.log(`📤 Sending to specific user: ${recipientId}`);
			return await sendNotificationToUser(
				recipientId,
				categoryKey,
				title,
				message,
				metadata,
				true // Force admin override
			);
		} else {
			// Send to all users of type
			if (recipientType === "ALL") {
				// Send to all roles
				console.log("📤 Sending to ALL roles");
				const roles = ["student", "parent", "teacher", "admin"];
				const results = await Promise.all(
					roles.map((r) =>
						sendNotificationToRole(
							r,
							categoryKey,
							title,
							message,
							metadata,
							true
						)
					)
				);

				const totalSent = results.reduce(
					(sum, r) => sum + (r.data?.sent || 0),
					0
				);
				const totalUsers = results.reduce(
					(sum, r) => sum + (r.data?.total || 0),
					0
				);

				console.log(
					`✅ Sent to ${totalSent}/${totalUsers} users across all roles`
				);

				return {
					success: true,
					error: false,
					data: { total: totalUsers, sent: totalSent },
				};
			} else {
				console.log(`📤 Sending to role: ${recipientType}`);
				const result = await sendNotificationToRole(
					recipientType.toLowerCase(),
					categoryKey,
					title,
					message,
					metadata,
					true // Force admin override
				);

				console.log(
					`✅ Sent to ${result.data?.sent || 0}/${
						result.data?.total || 0
					} ${recipientType} users`
				);

				return result;
			}
		}
	} catch (err: any) {
		console.error("❌ Failed to send admin notification:", err);
		return { success: false, error: err.message || "Failed to send" };
	}
};

// ============================================
// AUTOMATED NOTIFICATION TRIGGERS
// ============================================

// Trigger: Fee overdue
export const triggerFeeOverdueNotification = async (studentFeeId: string) => {
	try {
		const studentFee = await prisma.studentFee.findUnique({
			where: { id: studentFeeId },
			include: {
				student: {
					include: {
						parent: true,
					},
				},
				feeStructure: true,
			},
		});

		if (!studentFee) return { success: false, error: true };

		const parentId = studentFee.student.parentId;
		const title = "Fee Payment Overdue ⚠️";
		const message = `The ${studentFee.feeStructure.name} for ${studentFee.student.name} ${studentFee.student.surname} is overdue. Amount: ₹${studentFee.pendingAmount}`;

		await sendNotificationToUser(parentId, "FEE_OVERDUE", title, message, {
			studentFeeId,
			amount: studentFee.pendingAmount,
			actionUrl: `/parent/fees`,
		});

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger fee overdue notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Payment approved
export const triggerPaymentApprovedNotification = async (paymentId: string) => {
	try {
		const payment = await prisma.payment.findUnique({
			where: { id: paymentId },
			include: {
				studentFee: {
					include: {
						student: {
							include: {
								parent: true,
							},
						},
						feeStructure: true,
					},
				},
			},
		});

		if (!payment) return { success: false, error: true };

		const parentId = payment.studentFee.student.parentId;
		const title = "Payment Approved ✅";
		const message = `Your payment of ₹${payment.amount} for ${payment.studentFee.feeStructure.name} has been approved. Receipt: ${payment.receiptNumber}`;

		await sendNotificationToUser(parentId, "PAYMENT_APPROVED", title, message, {
			paymentId,
			receiptNumber: payment.receiptNumber,
			actionUrl: `/parent/transactions`,
		});

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger payment approved notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Exam scheduled
export const triggerExamScheduledNotification = async (examId: number) => {
	try {
		const exam = await prisma.exam.findUnique({
			where: { id: examId },
			include: {
				lesson: {
					include: {
						class: {
							include: {
								students: {
									include: {
										parent: true,
									},
								},
							},
						},
						subject: true,
					},
				},
			},
		});

		if (!exam) return { success: false, error: true };

		const title = "New Exam Scheduled 📝";
		const message = `${exam.title} for ${
			exam.lesson.subject.name
		} has been scheduled on ${new Date(exam.startTime).toLocaleDateString()}`;

		// Send to all students and parents in the class
		const notifications = exam.lesson.class.students.flatMap((student) => [
			sendNotificationToUser(student.id, "EXAM_SCHEDULED", title, message, {
				examId,
				actionUrl: `/student/exams`,
			}),
			sendNotificationToUser(
				student.parentId,
				"EXAM_SCHEDULED",
				title,
				message,
				{
					examId,
					actionUrl: `/parent`,
				}
			),
		]);

		await Promise.all(notifications);

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger exam scheduled notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Announcement created
export const triggerAnnouncementNotification = async (
	announcementId: number
) => {
	try {
		const announcement = await prisma.announcement.findUnique({
			where: { id: announcementId },
			include: {
				class: {
					include: {
						students: {
							include: {
								parent: true,
							},
						},
						supervisor: true,
					},
				},
			},
		});

		if (!announcement) return { success: false, error: true };

		const title = `📢 ${announcement.title}`;
		const message = announcement.description;

		// Determine category based on content/class
		const categoryKey = announcement.classId
			? "ANNOUNCEMENT_CLASS"
			: "ANNOUNCEMENT_GENERAL";

		// Get all users to notify
		const { clerkClient } = await import("@clerk/nextjs/server");
		const client = clerkClient();

		if (announcement.classId && announcement.class) {
			// Send to specific class: students, parents, and class teacher
			const notifications: Promise<any>[] = [];

			// Send to all students in the class
			for (const student of announcement.class.students) {
				notifications.push(
					sendNotificationToUser(student.id, categoryKey, title, message, {
						announcementId,
						actionUrl: `/student`,
					})
				);

				// Send to their parents
				notifications.push(
					sendNotificationToUser(
						student.parentId,
						categoryKey,
						title,
						message,
						{
							announcementId,
							actionUrl: `/parent`,
						}
					)
				);
			}

			// Send to class supervisor/teacher
			if (announcement.class.supervisor) {
				notifications.push(
					sendNotificationToUser(
						announcement.class.supervisor.id,
						categoryKey,
						title,
						message,
						{
							announcementId,
							actionUrl: `/teacher`,
						}
					)
				);
			}

			await Promise.all(notifications);
		} else {
			// Send to ALL users (school-wide announcement)
			const roles = ["student", "parent", "teacher"];
			const notifications: Promise<any>[] = [];

			for (const role of roles) {
				const { data: users } = await client.users.getUserList({
					limit: 500,
				});

				const roleUsers = users.filter(
					(user) =>
						(user.publicMetadata as { role?: string })?.role === role && user.id
				);

				for (const user of roleUsers) {
					notifications.push(
						sendNotificationToUser(user.id, categoryKey, title, message, {
							announcementId,
							actionUrl: `/${role}`,
						})
					);
				}
			}

			await Promise.all(notifications);
		}

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger announcement notification:", err);
		return { success: false, error: true };
	}
};

// ============================================
// MORE AUTOMATED TRIGGERS
// ============================================

// Trigger: Assignment created
export const triggerAssignmentCreatedNotification = async (
	assignmentId: number
) => {
	try {
		const assignment = await prisma.assignment.findUnique({
			where: { id: assignmentId },
			include: {
				lesson: {
					include: {
						class: {
							include: {
								students: {
									include: { parent: true },
								},
							},
						},
						subject: true,
					},
				},
			},
		});

		if (!assignment) return { success: false, error: true };

		const title = "📚 New Assignment Posted";
		const message = `${assignment.title} for ${
			assignment.lesson.subject.name
		}. Due: ${new Date(assignment.dueDate).toLocaleDateString()}`;

		const notifications = assignment.lesson.class.students.flatMap(
			(student) => [
				sendNotificationToUser(
					student.id,
					"ASSIGNMENT_CREATED",
					title,
					message,
					{
						assignmentId,
						actionUrl: `/student/assignments`,
					}
				),
				sendNotificationToUser(
					student.parentId,
					"ASSIGNMENT_CREATED",
					title,
					message,
					{
						assignmentId,
						actionUrl: `/parent`,
					}
				),
			]
		);

		await Promise.all(notifications);
		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger assignment notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Result published
export const triggerResultPublishedNotification = async (resultId: number) => {
	try {
		const result = await prisma.result.findUnique({
			where: { id: resultId },
			include: {
				student: {
					include: { parent: true },
				},
				exam: true,
				assignment: true,
			},
		});

		if (!result) return { success: false, error: true };

		const title = "📊 Results Published";
		const itemTitle =
			result.exam?.title || result.assignment?.title || "Assessment";
		const message = `Results for ${itemTitle} are now available. Score: ${result.score}`;

		await sendNotificationToUser(
			result.studentId,
			"RESULT_PUBLISHED",
			title,
			message,
			{
				resultId,
				actionUrl: `/student/results`,
			}
		);

		await sendNotificationToUser(
			result.student.parentId,
			"RESULT_PUBLISHED",
			title,
			message,
			{
				resultId,
				actionUrl: `/parent/results`,
			}
		);

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger result notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Attendance marked absent
export const triggerAttendanceAbsentNotification = async (
	attendanceId: number
) => {
	try {
		const attendance = await prisma.attendance.findUnique({
			where: { id: attendanceId },
			include: {
				student: {
					include: { parent: true },
				},
				lesson: {
					include: { subject: true },
				},
			},
		});

		if (!attendance || attendance.present)
			return { success: false, error: true };

		const title = "❌ Absence Alert";
		const lessonInfo = attendance.lesson
			? ` for ${attendance.lesson.subject.name}`
			: "";
		const message = `${attendance.student.name} ${
			attendance.student.surname
		} was marked absent${lessonInfo} on ${new Date(
			attendance.date
		).toLocaleDateString()}`;

		await sendNotificationToUser(
			attendance.student.parentId,
			"ATTENDANCE_ABSENT",
			title,
			message,
			{
				attendanceId,
				actionUrl: `/parent/attendance`,
			}
		);

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger attendance notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: MCQ Test Available
export const triggerMCQTestAvailableNotification = async (testId: string) => {
	try {
		const test = await prisma.mCQTest.findUnique({
			where: { id: testId },
			include: {
				class: {
					include: {
						students: {
							include: { parent: true },
						},
					},
				},
				subject: true,
			},
		});

		if (!test || !test.class) return { success: false, error: true };

		const title = "🎯 New MCQ Test Available";
		const message = `${test.title} for ${
			test.subject?.name || "General"
		} is now available`;

		const notifications = test.class.students.flatMap((student) => [
			sendNotificationToUser(student.id, "MCQ_TEST_AVAILABLE", title, message, {
				testId,
				actionUrl: `/student/tests/${testId}`,
			}),
			sendNotificationToUser(
				student.parentId,
				"MCQ_TEST_AVAILABLE",
				title,
				message,
				{
					testId,
					actionUrl: `/parent`,
				}
			),
		]);

		await Promise.all(notifications);
		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger MCQ test notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: MCQ Result Ready
export const triggerMCQResultReadyNotification = async (attemptId: string) => {
	try {
		const attempt = await prisma.mCQAttempt.findUnique({
			where: { id: attemptId },
			include: {
				student: {
					include: { parent: true },
				},
				test: true,
			},
		});

		if (!attempt || !attempt.score) return { success: false, error: true };

		const title = "📈 MCQ Results Ready";
		const message = `Your test "${attempt.test.title}" has been graded. Score: ${attempt.score}%`;

		await sendNotificationToUser(
			attempt.studentId,
			"MCQ_RESULT_READY",
			title,
			message,
			{
				attemptId,
				actionUrl: `/student/tests/results/${attemptId}`,
			}
		);

		await sendNotificationToUser(
			attempt.student.parentId,
			"MCQ_RESULT_READY",
			title,
			message,
			{
				attemptId,
				actionUrl: `/parent`,
			}
		);

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger MCQ result notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Badge Earned
export const triggerBadgeEarnedNotification = async (
	studentBadgeId: string
) => {
	try {
		const studentBadge = await prisma.studentBadge.findUnique({
			where: { id: studentBadgeId },
			include: {
				student: {
					include: { parent: true },
				},
				badge: true,
			},
		});

		if (!studentBadge) return { success: false, error: true };

		const title = "🏅 Badge Unlocked!";
		const message = `Congratulations! You earned the "${studentBadge.badge.name}" badge!`;

		await sendNotificationToUser(
			studentBadge.studentId,
			"BADGE_EARNED",
			title,
			message,
			{
				badgeId: studentBadge.badgeId,
				actionUrl: `/student/achievements`,
			}
		);

		await sendNotificationToUser(
			studentBadge.student.parentId,
			"BADGE_EARNED",
			title,
			message,
			{
				badgeId: studentBadge.badgeId,
				actionUrl: `/parent`,
			}
		);

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger badge notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Event Created
export const triggerEventCreatedNotification = async (eventId: number) => {
	try {
		const event = await prisma.event.findUnique({
			where: { id: eventId },
			include: {
				class: {
					include: {
						students: {
							include: { parent: true },
						},
						supervisor: true,
					},
				},
			},
		});

		if (!event) return { success: false, error: true };

		const title = `🎉 ${event.title}`;
		const message = `${event.description}. Date: ${new Date(
			event.startTime
		).toLocaleDateString()}`;

		const { clerkClient } = await import("@clerk/nextjs/server");
		const client = clerkClient();

		if (event.classId && event.class) {
			// Class-specific event
			const notifications: Promise<any>[] = [];

			for (const student of event.class.students) {
				notifications.push(
					sendNotificationToUser(student.id, "EVENT_CREATED", title, message, {
						eventId,
						actionUrl: `/student/events`,
					}),
					sendNotificationToUser(
						student.parentId,
						"EVENT_CREATED",
						title,
						message,
						{
							eventId,
							actionUrl: `/parent/events`,
						}
					)
				);
			}

			if (event.class.supervisor) {
				notifications.push(
					sendNotificationToUser(
						event.class.supervisor.id,
						"EVENT_CREATED",
						title,
						message,
						{
							eventId,
							actionUrl: `/teacher/events`,
						}
					)
				);
			}

			await Promise.all(notifications);
		} else {
			// School-wide event - send to everyone
			const roles = ["student", "parent", "teacher"];
			const notifications: Promise<any>[] = [];

			for (const role of roles) {
				const { data: users } = await client.users.getUserList({ limit: 500 });
				const roleUsers = users.filter(
					(u) => (u.publicMetadata as { role?: string })?.role === role
				);

				for (const user of roleUsers) {
					notifications.push(
						sendNotificationToUser(user.id, "EVENT_CREATED", title, message, {
							eventId,
							actionUrl: `/${role}/events`,
						})
					);
				}
			}

			await Promise.all(notifications);
		}

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger event notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Fee Assigned
export const triggerFeeAssignedNotification = async (studentFeeId: string) => {
	try {
		const studentFee = await prisma.studentFee.findUnique({
			where: { id: studentFeeId },
			include: {
				student: {
					include: { parent: true },
				},
				feeStructure: true,
			},
		});

		if (!studentFee) return { success: false, error: true };

		const title = "📝 New Fee Assigned";
		const message = `${studentFee.feeStructure.name} (₹${
			studentFee.totalAmount
		}) has been assigned. Due: ${new Date(
			studentFee.dueDate
		).toLocaleDateString()}`;

		await sendNotificationToUser(
			studentFee.student.parentId,
			"FEE_ASSIGNED",
			title,
			message,
			{
				studentFeeId,
				actionUrl: `/parent/fees`,
			}
		);

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger fee assigned notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Payment Rejected
export const triggerPaymentRejectedNotification = async (paymentId: string) => {
	try {
		const payment = await prisma.payment.findUnique({
			where: { id: paymentId },
			include: {
				studentFee: {
					include: {
						student: {
							include: { parent: true },
						},
					},
				},
			},
		});

		if (!payment) return { success: false, error: true };

		const title = "❌ Payment Rejected";
		const message = `Your payment of ₹${payment.amount} was rejected. Reason: ${
			payment.rejectionReason || "Invalid details"
		}`;

		await sendNotificationToUser(
			payment.studentFee.student.parentId,
			"PAYMENT_REJECTED",
			title,
			message,
			{
				paymentId,
				actionUrl: `/parent/transactions`,
			}
		);

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger payment rejected notification:", err);
		return { success: false, error: true };
	}
};

// Trigger: Teacher Rating Received
export const triggerTeacherRatingNotification = async (ratingId: string) => {
	try {
		const rating = await prisma.teacherRating.findUnique({
			where: { id: ratingId },
			include: {
				teacher: true,
				student: true,
			},
		});

		if (!rating) return { success: false, error: true };

		const title = "⭐ New Rating Received";
		const stars = "⭐".repeat(rating.rating);
		const message = `You received a ${rating.rating}-star rating ${stars}`;

		await sendNotificationToUser(
			rating.teacherId,
			"TEACHER_RATING_RECEIVED",
			title,
			message,
			{
				ratingId,
				actionUrl: `/teacher/ratings`,
			}
		);

		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to trigger teacher rating notification:", err);
		return { success: false, error: true };
	}
};

// Get user's notification history
export const getUserNotifications = async (limit: number = 20) => {
	const { userId } = auth();
	if (!userId) {
		return { success: false, error: true, data: null };
	}

	try {
		const notifications = await prisma.notification.findMany({
			where: {
				recipientId: userId,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit,
		});

		return { success: true, error: false, data: notifications };
	} catch (err) {
		console.error("Failed to get notifications:", err);
		return { success: false, error: true, data: null };
	}
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
	const { userId } = auth();
	if (!userId) {
		return { success: false, error: true };
	}

	try {
		await prisma.notification.update({
			where: {
				id: notificationId,
				recipientId: userId,
			},
			data: {
				status: "READ",
				readAt: new Date(),
			},
		});

		revalidatePath("/");
		return { success: true, error: false };
	} catch (err) {
		console.error("Failed to mark notification as read:", err);
		return { success: false, error: true };
	}
};
