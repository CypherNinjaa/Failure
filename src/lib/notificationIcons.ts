// Notification Icon Mapping for Emails
// Icons are hosted on Cloudinary: https://res.cloudinary.com/dl8ls89qe

export const CLOUDINARY_BASE_URL =
	"https://res.cloudinary.com/dl8ls89qe/image/upload";

// Helper function to generate Cloudinary URL
const getUrl = (filename: string) =>
	`${CLOUDINARY_BASE_URL}/notifications/${filename}`;

// Icon mapping for different notification types
export const notificationIcons: Record<
	string,
	{
		icon: string;
		cloudinaryPath: string;
		alt: string;
	}
> = {
	// Finance
	FEE_OVERDUE: {
		icon: "finance.png",
		cloudinaryPath: getUrl("finance.png"),
		alt: "Finance",
	},
	FEE_DUE_SOON: {
		icon: "finance.png",
		cloudinaryPath: getUrl("finance.png"),
		alt: "Finance",
	},
	PAYMENT_APPROVED: {
		icon: "finance.png",
		cloudinaryPath: getUrl("finance.png"),
		alt: "Payment Approved",
	},
	PAYMENT_REJECTED: {
		icon: "close.png",
		cloudinaryPath: getUrl("close.png"),
		alt: "Payment Rejected",
	},
	RECEIPT_GENERATED: {
		icon: "finance.png",
		cloudinaryPath: getUrl("finance.png"),
		alt: "Receipt",
	},
	FEE_ASSIGNED: {
		icon: "finance.png",
		cloudinaryPath: getUrl("finance.png"),
		alt: "Fee Assigned",
	},
	PAYMENT_REMINDER: {
		icon: "notification.png",
		cloudinaryPath: getUrl("notification.png"),
		alt: "Payment Reminder",
	},

	// Academics
	EXAM_SCHEDULED: {
		icon: "exam.png",
		cloudinaryPath: getUrl("exam.png"),
		alt: "Exam",
	},
	EXAM_REMINDER: {
		icon: "alarm.png",
		cloudinaryPath: getUrl("alarm.png"),
		alt: "Reminder",
	},
	RESULT_PUBLISHED: {
		icon: "result.png",
		cloudinaryPath: getUrl("result.png"),
		alt: "Results",
	},
	ASSIGNMENT_CREATED: {
		icon: "assignment.png",
		cloudinaryPath: getUrl("assignment.png"),
		alt: "Assignment",
	},
	ASSIGNMENT_DUE_SOON: {
		icon: "assignment.png",
		cloudinaryPath: getUrl("assignment.png"),
		alt: "Assignment Due",
	},
	ASSIGNMENT_GRADED: {
		icon: "assignment.png",
		cloudinaryPath: getUrl("assignment.png"),
		alt: "Graded",
	},
	MCQ_TEST_AVAILABLE: {
		icon: "test.png",
		cloudinaryPath: getUrl("test.png"),
		alt: "MCQ Test",
	},
	MCQ_RESULT_READY: {
		icon: "result.png",
		cloudinaryPath: getUrl("result.png"),
		alt: "MCQ Results",
	},

	// Attendance
	ATTENDANCE_MARKED: {
		icon: "attendance.png",
		cloudinaryPath: getUrl("attendance.png"),
		alt: "Attendance",
	},
	ATTENDANCE_ABSENT: {
		icon: "close.png",
		cloudinaryPath: getUrl("close.png"),
		alt: "Absent",
	},
	ATTENDANCE_LATE: {
		icon: "alarm.png",
		cloudinaryPath: getUrl("alarm.png"),
		alt: "Late",
	},
	ATTENDANCE_PATTERN: {
		icon: "attendance.png",
		cloudinaryPath: getUrl("attendance.png"),
		alt: "Attendance Alert",
	},
	TEACHER_ATTENDANCE: {
		icon: "teacher.png",
		cloudinaryPath: getUrl("teacher.png"),
		alt: "Teacher Attendance",
	},

	// Achievements
	BADGE_EARNED: {
		icon: "test.png",
		cloudinaryPath: getUrl("test.png"),
		alt: "Badge",
	},
	LEADERBOARD_RANK_UP: {
		icon: "result.png",
		cloudinaryPath: getUrl("result.png"),
		alt: "Rank Up",
	},
	LEADERBOARD_TOP_10: {
		icon: "test.png",
		cloudinaryPath: getUrl("test.png"),
		alt: "Top 10",
	},
	PERFECT_SCORE: {
		icon: "result.png",
		cloudinaryPath: getUrl("result.png"),
		alt: "Perfect Score",
	},
	TEACHER_RATING_RECEIVED: {
		icon: "teacher.png",
		cloudinaryPath: getUrl("teacher.png"),
		alt: "Rating",
	},
	TEACHER_LEADERBOARD_RANK: {
		icon: "teacher.png",
		cloudinaryPath: getUrl("teacher.png"),
		alt: "Teacher Rank",
	},

	// Events
	EVENT_CREATED: {
		icon: "calendar.png",
		cloudinaryPath: getUrl("calendar.png"),
		alt: "Event",
	},
	EVENT_REMINDER: {
		icon: "alarm.png",
		cloudinaryPath: getUrl("alarm.png"),
		alt: "Event Reminder",
	},
	EVENT_CANCELLED: {
		icon: "close.png",
		cloudinaryPath: getUrl("close.png"),
		alt: "Event Cancelled",
	},
	EVENT_UPDATED: {
		icon: "calendar.png",
		cloudinaryPath: getUrl("calendar.png"),
		alt: "Event Updated",
	},

	// Announcements
	ANNOUNCEMENT_GENERAL: {
		icon: "announcement.png",
		cloudinaryPath: getUrl("announcement.png"),
		alt: "Announcement",
	},
	ANNOUNCEMENT_CLASS: {
		icon: "announcement.png",
		cloudinaryPath: getUrl("announcement.png"),
		alt: "Class Announcement",
	},
	ANNOUNCEMENT_URGENT: {
		icon: "notification.png",
		cloudinaryPath: getUrl("notification.png"),
		alt: "Urgent",
	},

	// Communication
	MESSAGE_RECEIVED: {
		icon: "message.png",
		cloudinaryPath: getUrl("message.png"),
		alt: "Message",
	},
	REPLY_RECEIVED: {
		icon: "message.png",
		cloudinaryPath: getUrl("message.png"),
		alt: "Reply",
	},

	// System
	SYSTEM_MAINTENANCE: {
		icon: "setting.png",
		cloudinaryPath: getUrl("setting.png"),
		alt: "Maintenance",
	},
	SYSTEM_UPDATE: {
		icon: "notification.png",
		cloudinaryPath: getUrl("notification.png"),
		alt: "Update",
	},

	// Default
	DEFAULT: {
		icon: "notification.png",
		cloudinaryPath: getUrl("notification.png"),
		alt: "Notification",
	},
};

// Helper function to get icon URL for a notification type
export function getNotificationIcon(categoryKey?: string): string {
	if (!categoryKey) return notificationIcons.DEFAULT.cloudinaryPath;
	return (
		notificationIcons[categoryKey]?.cloudinaryPath ||
		notificationIcons.DEFAULT.cloudinaryPath
	);
}

// Helper function to get icon alt text
export function getNotificationIconAlt(categoryKey?: string): string {
	if (!categoryKey) return notificationIcons.DEFAULT.alt;
	return notificationIcons[categoryKey]?.alt || notificationIcons.DEFAULT.alt;
}
