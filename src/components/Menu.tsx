import { currentUser } from "@clerk/nextjs/server";
import MenuClient from "./MenuClient";

const menuItems = [
	{
		title: "MENU",
		items: [
			{
				icon: "/home.png",
				label: "Home",
				href: "/sign-in",
				visible: ["admin", "teacher", "student", "parent", "media-coordinator"],
			},
			{
				icon: "/teacher.png",
				label: "Teachers",
				href: "/list/teachers",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/student.png",
				label: "Students",
				href: "/list/students",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/parent.png",
				label: "Parents",
				href: "/list/parents",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/subject.png",
				label: "Subjects",
				href: "/list/subjects",
				visible: ["admin"],
			},
			{
				icon: "/class.png",
				label: "Classes",
				href: "/list/classes",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/lesson.png",
				label: "Lessons",
				href: "/list/lessons",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/exam.png",
				label: "Exams",
				href: "/list/exams",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/assignment.png",
				label: "Assignments",
				href: "/list/assignments",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/result.png",
				label: "Results",
				href: "/list/results",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/exam.png",
				label: "MCQ Tests",
				href: "/list/mcq-tests",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/exam.png",
				label: "MCQ Tests",
				href: "/student/mcq-tests",
				visible: ["student"],
			},
			{
				icon: "/exam.png",
				label: "Leaderboard",
				href: "/list/leaderboard",
				visible: ["admin", "teacher", "student"],
			},
			{
				icon: "/exam.png",
				label: "Teacher Rankings",
				href: "/list/teacher-leaderboard",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/exam.png",
				label: "Badges",
				href: "/list/badges",
				visible: ["admin"],
			},
			{
				icon: "/warning.png",
				label: "Penalty Management",
				href: "/admin/penalty-management",
				visible: ["admin"],
			},
			{
				icon: "/attendance.png",
				label: "Attendance",
				href: "/list/attendance",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/attendance.png",
				label: "Teacher Attendance",
				href: "/list/teacher-attendance",
				visible: ["admin"],
			},
			{
				icon: "/calendar.png",
				label: "Cron Jobs",
				href: "/admin/cron-jobs",
				visible: ["admin"],
			},
			{
				icon: "/download.png",
				label: "Export Data",
				href: "/admin/export-data",
				visible: ["admin"],
			},
			{
				icon: "/attendance.png",
				label: "My Attendance",
				href: "/teacher/attendance",
				visible: ["teacher"],
			},
			{
				icon: "/route.png",
				label: "Locations",
				href: "/list/locations",
				visible: ["admin"],
			},
			{
				icon: "/calendar.png",
				label: "Events",
				href: "/list/events",
				visible: ["admin", "teacher", "student", "parent"],
			},
		],
	},
	{
		title: "MEDIA",
		items: [
			{
				icon: "/singleClass.png",
				label: "Gallery Management",
				href: "/media-coordinator/gallery",
				visible: ["media-coordinator", "admin"],
			},
		],
	},
	{
		title: "FINANCE",
		items: [
			{
				icon: "/finance.png",
				label: "Fee Structures",
				href: "/list/fee-structures",
				visible: ["admin"],
			},
			{
				icon: "/finance.png",
				label: "Assign Fees",
				href: "/list/assign-fees",
				visible: ["admin"],
			},
			{
				icon: "/finance.png",
				label: "Student Fees",
				href: "/list/student-fees",
				visible: ["admin"],
			},
			{
				icon: "/finance.png",
				label: "Record Payment",
				href: "/admin/record-payment",
				visible: ["admin"],
			},
			{
				icon: "/finance.png",
				label: "Payment Approvals",
				href: "/admin/payment-approvals",
				visible: ["admin"],
			},
			{
				icon: "/finance.png",
				label: "Transactions",
				href: "/admin/transactions",
				visible: ["admin"],
			},
			{
				icon: "/setting.png",
				label: "Payment Config",
				href: "/admin/payment-config",
				visible: ["admin"],
			},
			{
				icon: "/finance.png",
				label: "Salaries",
				href: "/list/salaries",
				visible: ["admin"],
			},
			{
				icon: "/finance.png",
				label: "Income",
				href: "/list/income",
				visible: ["admin"],
			},
			{
				icon: "/finance.png",
				label: "Expenses",
				href: "/list/expenses",
				visible: ["admin"],
			},
			{
				icon: "/finance.png",
				label: "My Fees",
				href: "/parent/fees",
				visible: ["parent"],
			},
			{
				icon: "/finance.png",
				label: "Payment History",
				href: "/parent/transactions",
				visible: ["parent"],
			},
		],
	},
	{
		title: "OTHER",
		items: [
			{
				icon: "/message.png",
				label: "Messages",
				href: "/list/messages",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/announcement.png",
				label: "Announcements",
				href: "/list/announcements",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/notification.png",
				label: "Send Notifications",
				href: "/admin-notifications",
				visible: ["admin"],
			},
			{
				icon: "/profile.png",
				label: "Profile",
				href: "/profile",
				visible: ["admin", "teacher", "student", "parent", "media-coordinator"],
			},
			{
				icon: "/setting.png",
				label: "Settings",
				href: "/settings",
				visible: ["admin", "teacher", "student", "parent", "media-coordinator"],
			},
			{
				icon: "/singleClass.png",
				label: "Sync Queue",
				href: "#offline-queue",
				visible: ["admin", "teacher", "student", "parent", "media-coordinator"],
			},
			{
				icon: "/cache.png",
				label: "Cache Manager",
				href: "#cache-settings",
				visible: ["admin", "teacher", "student", "parent", "media-coordinator"],
			},
			{
				icon: "/logout.png",
				label: "Logout",
				href: "/sign-out",
				visible: ["admin", "teacher", "student", "parent", "media-coordinator"],
			},
		],
	},
];

const Menu = async () => {
	const user = await currentUser();
	const role = user?.publicMetadata.role as string;
	const userId = user?.id || null;

	return <MenuClient menuItems={menuItems} role={role} userId={userId} />;
};

export default Menu;
