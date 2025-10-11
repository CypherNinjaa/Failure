"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
	icon: string;
	label: string;
	href: string;
};

type BottomNavProps = {
	role: string;
};

const BottomNav = ({ role }: BottomNavProps) => {
	const pathname = usePathname();
	const [showMore, setShowMore] = useState(false);

	// Define main navigation items based on role
	const getMainNavItems = (): NavItem[] => {
		if (role === "admin") {
			return [
				{ icon: "/home.png", label: "Home", href: "/admin" },
				{ icon: "/student.png", label: "Students", href: "/list/students" },
				{ icon: "/teacher.png", label: "Teachers", href: "/list/teachers" },
				{ icon: "/class.png", label: "Classes", href: "/list/classes" },
			];
		}

		if (role === "teacher") {
			return [
				{ icon: "/home.png", label: "Home", href: "/teacher" },
				{ icon: "/calendar.png", label: "Schedule", href: "/teacher" },
				{
					icon: "/attendance.png",
					label: "Attendance",
					href: "/list/attendance",
				},
				{ icon: "/exam.png", label: "Exams", href: "/list/exams" },
			];
		}

		if (role === "student") {
			return [
				{ icon: "/home.png", label: "Home", href: "/student" },
				{
					icon: "/exam.png",
					label: "MCQ Tests",
					href: "/student/mcq-tests",
				},
				{
					icon: "/exam.png",
					label: "Leaderboard",
					href: "/list/leaderboard",
				},
				{
					icon: "/attendance.png",
					label: "Attendance",
					href: "/list/attendance",
				},
			];
		}

		if (role === "parent") {
			return [
				{ icon: "/home.png", label: "Home", href: "/parent" },
				{
					icon: "/attendance.png",
					label: "Attendance",
					href: "/list/attendance",
				},
				{ icon: "/result.png", label: "Results", href: "/list/results" },
			];
		}

		return [{ icon: "/home.png", label: "Home", href: `/${role}` }];
	};

	// More menu items
	const getMoreItems = (): NavItem[] => {
		const allItems = [
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
				icon: "/assignment.png",
				label: "Assignments",
				href: "/list/assignments",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/exam.png",
				label: "Exams",
				href: "/list/exams",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/result.png",
				label: "Results",
				href: "/list/results",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/test.png",
				label: "MCQ Tests",
				href: "/list/mcq-tests",
				visible: ["admin", "teacher"],
			},
			{
				icon: "/test.png",
				label: "My MCQ Tests",
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
				label: "Badges",
				href: "/list/badges",
				visible: ["admin"],
			},
			{
				icon: "/attendance.png",
				label: "Teacher Attendance",
				href: "/list/teacher-attendance",
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
				icon: "/profile.png",
				label: "Profile",
				href: "/profile",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: "/setting.png",
				label: "Settings",
				href: "/settings",
				visible: ["admin", "teacher", "student", "parent"],
			},
		];

		return allItems
			.filter((item) => item.visible.includes(role))
			.map(({ icon, label, href }) => ({ icon, label, href }));
	};

	const mainNavItems = getMainNavItems();
	const moreItems = getMoreItems();

	const isActive = (href: string) => {
		if (href === `/${role}`) {
			return pathname === href;
		}
		return pathname.startsWith(href);
	};

	return (
		<>
			{/* Bottom Navigation Bar */}
			<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
				<div className="flex justify-around items-center h-16">
					{mainNavItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 active:scale-90 active:bg-gray-100 ${
								isActive(item.href)
									? "text-lamaPurple"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							<Image
								src={item.icon}
								alt={item.label}
								width={20}
								height={20}
								className={`transition-transform duration-200 ${
									isActive(item.href)
										? "brightness-0 saturate-100 scale-110"
										: ""
								}`}
							/>
							<span className="text-xs font-medium">{item.label}</span>
						</Link>
					))}
					<button
						onClick={() => setShowMore(!showMore)}
						className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 active:scale-90 active:bg-gray-100 ${
							showMore ? "text-lamaPurple" : "text-gray-500 hover:text-gray-700"
						}`}
					>
						<svg
							className={`w-5 h-5 transition-transform duration-200 ${
								showMore ? "scale-110" : ""
							}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
						<span className="text-xs font-medium">More</span>
					</button>
				</div>
			</nav>

			{/* More Menu Modal */}
			{showMore && (
				<div
					className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
					onClick={() => setShowMore(false)}
				>
					<div
						className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[70vh] overflow-y-auto animate-slideUp"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold">More Options</h3>
							<button
								onClick={() => setShowMore(false)}
								className="text-gray-500 hover:text-gray-700 active:scale-90 transition-transform duration-200 p-2 hover:bg-gray-100 rounded-full"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<div className="grid grid-cols-3 gap-2 p-4">
							{moreItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setShowMore(false)}
									className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 active:scale-95 active:shadow-inner ${
										isActive(item.href)
											? "bg-lamaPurpleLight text-lamaPurple"
											: "bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
									}`}
								>
									<Image
										src={item.icon}
										alt={item.label}
										width={24}
										height={24}
										className={`transition-transform duration-200 ${
											isActive(item.href)
												? "brightness-0 saturate-100 scale-110"
												: ""
										}`}
									/>
									<span className="text-xs font-medium mt-2 text-center">
										{item.label}
									</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default BottomNav;
