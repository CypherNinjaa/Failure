import {
	PrismaClient,
	NotificationGroup,
	NotificationPriority,
} from "@prisma/client";

const prisma = new PrismaClient();

async function seedNotificationCategories() {
	console.log("🔔 Seeding notification categories (38 total)...");

	const categories: Array<{
		key: string;
		name: string;
		description: string;
		category: NotificationGroup;
		icon: string;
		defaultEnabled: boolean;
		applicableRoles: string[];
		supportedChannels: { push: boolean; email: boolean };
		priority: NotificationPriority;
		displayOrder: number;
	}> = [
		// ============================================
		// FINANCE CATEGORY (7 notifications)
		// ============================================
		{
			key: "FEE_OVERDUE",
			name: "Overdue Fee Alert",
			description: "Get notified when fees are overdue",
			category: "FINANCE",
			icon: "💰",
			defaultEnabled: true,
			applicableRoles: ["parent", "admin"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 1,
		},
		{
			key: "FEE_DUE_SOON",
			name: "Fee Due Soon",
			description: "Reminder that fee payment is due in 3 days",
			category: "FINANCE",
			icon: "⏰",
			defaultEnabled: true,
			applicableRoles: ["parent", "admin"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 2,
		},
		{
			key: "PAYMENT_APPROVED",
			name: "Payment Approved",
			description: "Your online payment has been approved",
			category: "FINANCE",
			icon: "✅",
			defaultEnabled: true,
			applicableRoles: ["parent"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 3,
		},
		{
			key: "PAYMENT_REJECTED",
			name: "Payment Rejected",
			description: "Your online payment was rejected",
			category: "FINANCE",
			icon: "❌",
			defaultEnabled: true,
			applicableRoles: ["parent"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 4,
		},
		{
			key: "RECEIPT_GENERATED",
			name: "Receipt Ready",
			description: "Payment receipt is available for download",
			category: "FINANCE",
			icon: "🧾",
			defaultEnabled: true,
			applicableRoles: ["parent"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 5,
		},
		{
			key: "FEE_ASSIGNED",
			name: "New Fee Assigned",
			description: "A new fee has been assigned to your child",
			category: "FINANCE",
			icon: "📝",
			defaultEnabled: true,
			applicableRoles: ["parent"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 6,
		},
		{
			key: "PAYMENT_REMINDER",
			name: "Weekly Payment Reminder",
			description: "Weekly reminder for pending payments",
			category: "FINANCE",
			icon: "🔔",
			defaultEnabled: false,
			applicableRoles: ["parent"],
			supportedChannels: { push: true, email: true },
			priority: "LOW",
			displayOrder: 7,
		},

		// ============================================
		// ACADEMICS CATEGORY (8 notifications)
		// ============================================
		{
			key: "EXAM_SCHEDULED",
			name: "Exam Scheduled",
			description: "A new exam has been scheduled",
			category: "ACADEMICS",
			icon: "📝",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 10,
		},
		{
			key: "EXAM_REMINDER",
			name: "Exam Tomorrow",
			description: "Reminder that exam is tomorrow",
			category: "ACADEMICS",
			icon: "⏰",
			defaultEnabled: true,
			applicableRoles: ["student", "parent"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 11,
		},
		{
			key: "RESULT_PUBLISHED",
			name: "Results Published",
			description: "Exam results are now available",
			category: "ACADEMICS",
			icon: "📊",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 12,
		},
		{
			key: "ASSIGNMENT_CREATED",
			name: "New Assignment",
			description: "A new assignment has been posted",
			category: "ACADEMICS",
			icon: "📚",
			defaultEnabled: true,
			applicableRoles: ["student", "parent"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 13,
		},
		{
			key: "ASSIGNMENT_DUE_SOON",
			name: "Assignment Due Soon",
			description: "Assignment deadline is in 2 days",
			category: "ACADEMICS",
			icon: "⚠️",
			defaultEnabled: true,
			applicableRoles: ["student", "parent"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 14,
		},
		{
			key: "ASSIGNMENT_GRADED",
			name: "Assignment Graded",
			description: "Your assignment has been graded",
			category: "ACADEMICS",
			icon: "✅",
			defaultEnabled: true,
			applicableRoles: ["student", "parent"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 15,
		},
		{
			key: "MCQ_TEST_AVAILABLE",
			name: "New MCQ Test",
			description: "A new MCQ test is available",
			category: "ACADEMICS",
			icon: "🎯",
			defaultEnabled: true,
			applicableRoles: ["student", "parent"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 16,
		},
		{
			key: "MCQ_RESULT_READY",
			name: "MCQ Results Ready",
			description: "Your MCQ test has been graded",
			category: "ACADEMICS",
			icon: "📈",
			defaultEnabled: true,
			applicableRoles: ["student", "parent"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 17,
		},

		// ============================================
		// ATTENDANCE CATEGORY (5 notifications)
		// ============================================
		{
			key: "ATTENDANCE_MARKED",
			name: "Attendance Recorded",
			description: "Daily attendance has been marked",
			category: "ATTENDANCE",
			icon: "✅",
			defaultEnabled: false,
			applicableRoles: ["parent"],
			supportedChannels: { push: true, email: true },
			priority: "LOW",
			displayOrder: 20,
		},
		{
			key: "ATTENDANCE_ABSENT",
			name: "Absence Alert",
			description: "Your child was marked absent",
			category: "ATTENDANCE",
			icon: "❌",
			defaultEnabled: true,
			applicableRoles: ["parent", "admin"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 21,
		},
		{
			key: "ATTENDANCE_LATE",
			name: "Late Arrival",
			description: "Your child arrived late to school",
			category: "ATTENDANCE",
			icon: "⏰",
			defaultEnabled: true,
			applicableRoles: ["parent"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 22,
		},
		{
			key: "ATTENDANCE_PATTERN",
			name: "Low Attendance Warning",
			description: "Attendance is below 75%",
			category: "ATTENDANCE",
			icon: "⚠️",
			defaultEnabled: true,
			applicableRoles: ["parent", "admin"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 23,
		},
		{
			key: "TEACHER_ATTENDANCE",
			name: "Teacher Check-in",
			description: "Your attendance has been recorded",
			category: "ATTENDANCE",
			icon: "👨‍🏫",
			defaultEnabled: false,
			applicableRoles: ["teacher"],
			supportedChannels: { push: true, email: false },
			priority: "LOW",
			displayOrder: 24,
		},

		// ============================================
		// ACHIEVEMENT CATEGORY (6 notifications)
		// ============================================
		{
			key: "BADGE_EARNED",
			name: "Badge Unlocked",
			description: "You've earned a new badge!",
			category: "ACHIEVEMENT",
			icon: "🏅",
			defaultEnabled: true,
			applicableRoles: ["student", "parent"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 30,
		},
		{
			key: "LEADERBOARD_RANK_UP",
			name: "Rank Improved",
			description: "Your leaderboard rank has improved",
			category: "ACHIEVEMENT",
			icon: "📈",
			defaultEnabled: true,
			applicableRoles: ["student"],
			supportedChannels: { push: true, email: false },
			priority: "MEDIUM",
			displayOrder: 31,
		},
		{
			key: "LEADERBOARD_TOP_10",
			name: "Top 10 Achievement",
			description: "You've entered the top 10!",
			category: "ACHIEVEMENT",
			icon: "🏆",
			defaultEnabled: true,
			applicableRoles: ["student", "parent"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 32,
		},
		{
			key: "PERFECT_SCORE",
			name: "Perfect Score",
			description: "You scored 100% on a test!",
			category: "ACHIEVEMENT",
			icon: "💯",
			defaultEnabled: true,
			applicableRoles: ["student", "parent"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 33,
		},
		{
			key: "TEACHER_RATING_RECEIVED",
			name: "Rating Received",
			description: "You've received a new rating from a student",
			category: "ACHIEVEMENT",
			icon: "⭐",
			defaultEnabled: true,
			applicableRoles: ["teacher"],
			supportedChannels: { push: true, email: false },
			priority: "LOW",
			displayOrder: 34,
		},
		{
			key: "TEACHER_LEADERBOARD_RANK",
			name: "Teacher Rank Update",
			description: "Your teaching rank has been updated",
			category: "ACHIEVEMENT",
			icon: "👨‍🏫",
			defaultEnabled: true,
			applicableRoles: ["teacher"],
			supportedChannels: { push: true, email: false },
			priority: "LOW",
			displayOrder: 35,
		},

		// ============================================
		// EVENTS CATEGORY (4 notifications)
		// ============================================
		{
			key: "EVENT_CREATED",
			name: "New Event",
			description: "A new school event has been announced",
			category: "EVENTS",
			icon: "🎉",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 40,
		},
		{
			key: "EVENT_REMINDER",
			name: "Event Reminder",
			description: "Event is starting soon",
			category: "EVENTS",
			icon: "⏰",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 41,
		},
		{
			key: "EVENT_CANCELLED",
			name: "Event Cancelled",
			description: "An event has been cancelled",
			category: "EVENTS",
			icon: "❌",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 42,
		},
		{
			key: "EVENT_UPDATED",
			name: "Event Updated",
			description: "Event details have changed",
			category: "EVENTS",
			icon: "📝",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 43,
		},

		// ============================================
		// ANNOUNCEMENTS CATEGORY (3 notifications)
		// ============================================
		{
			key: "ANNOUNCEMENT_GENERAL",
			name: "School Announcement",
			description: "School-wide announcement",
			category: "ANNOUNCEMENTS",
			icon: "📢",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher", "admin"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 50,
		},
		{
			key: "ANNOUNCEMENT_CLASS",
			name: "Class Announcement",
			description: "Announcement specific to your class",
			category: "ANNOUNCEMENTS",
			icon: "📣",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 51,
		},
		{
			key: "ANNOUNCEMENT_URGENT",
			name: "Urgent Announcement",
			description: "Critical announcement requiring immediate attention",
			category: "ANNOUNCEMENTS",
			icon: "🚨",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher", "admin"],
			supportedChannels: { push: true, email: true },
			priority: "CRITICAL",
			displayOrder: 52,
		},

		// ============================================
		// COMMUNICATION CATEGORY (3 notifications)
		// ============================================
		{
			key: "MESSAGE_RECEIVED",
			name: "New Message",
			description: "You have a new message in your inbox",
			category: "COMMUNICATION",
			icon: "💬",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher", "admin"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 60,
		},
		{
			key: "NEW_CONVERSATION",
			name: "New Conversation",
			description: "Someone started a conversation with you",
			category: "COMMUNICATION",
			icon: "💭",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher", "admin"],
			supportedChannels: { push: true, email: true },
			priority: "MEDIUM",
			displayOrder: 61,
		},
		{
			key: "REPLY_RECEIVED",
			name: "Message Reply",
			description: "Someone replied to your message",
			category: "COMMUNICATION",
			icon: "↩️",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher", "admin"],
			supportedChannels: { push: true, email: false },
			priority: "LOW",
			displayOrder: 62,
		},

		// ============================================
		// SYSTEM CATEGORY (2 notifications)
		// ============================================
		{
			key: "SYSTEM_MAINTENANCE",
			name: "System Maintenance",
			description: "Scheduled system maintenance notification",
			category: "SYSTEM",
			icon: "🔧",
			defaultEnabled: true,
			applicableRoles: ["student", "parent", "teacher", "admin"],
			supportedChannels: { push: true, email: true },
			priority: "HIGH",
			displayOrder: 70,
		},
		{
			key: "SYSTEM_UPDATE",
			name: "System Update",
			description: "New features or updates available",
			category: "SYSTEM",
			icon: "✨",
			defaultEnabled: false,
			applicableRoles: ["student", "parent", "teacher", "admin"],
			supportedChannels: { push: true, email: false },
			priority: "LOW",
			displayOrder: 71,
		},
	];

	// Insert all categories
	for (const category of categories) {
		await prisma.notificationCategory.upsert({
			where: { key: category.key },
			update: category,
			create: category,
		});
	}

	console.log(`✅ Seeded ${categories.length} notification categories`);
}

// Run seeding
seedNotificationCategories()
	.catch((e) => {
		console.error("❌ Error seeding notification categories:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
