import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format date to readable string (hydration-safe)
 */
export function formatDate(date: Date | string): string {
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/**
 * Format date for blog posts (hydration-safe)
 */
export function formatBlogDate(date: Date | string): string {
	const d = new Date(date);
	// Use a consistent format that works on both server and client
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
		timeZone: "UTC", // Ensures consistent formatting
	};
	return d.toLocaleDateString("en-US", options);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
	const d = new Date(date);
	return d.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Format currency
 */
export function formatCurrency(amount: number | string): string {
	const num = typeof amount === "string" ? parseFloat(amount) : amount;
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
	}).format(num);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(obtained: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((obtained / total) * 100);
}

/**
 * Get grade from percentage
 */
export function getGrade(percentage: number): string {
	if (percentage >= 90) return "A+";
	if (percentage >= 80) return "A";
	if (percentage >= 70) return "B+";
	if (percentage >= 60) return "B";
	if (percentage >= 50) return "C+";
	if (percentage >= 40) return "C";
	if (percentage >= 33) return "D";
	return "F";
}

/**
 * Get grade color for UI
 */
export function getGradeColor(grade: string): string {
	switch (grade) {
		case "A+":
		case "A":
			return "text-green-600";
		case "B+":
		case "B":
			return "text-blue-600";
		case "C+":
		case "C":
			return "text-yellow-600";
		case "D":
			return "text-orange-600";
		case "F":
			return "text-red-600";
		default:
			return "text-gray-600";
	}
}

/**
 * Generate random color for avatars
 */
export function generateAvatarColor(): string {
	const colors = [
		"bg-red-500",
		"bg-blue-500",
		"bg-green-500",
		"bg-yellow-500",
		"bg-purple-500",
		"bg-pink-500",
		"bg-indigo-500",
		"bg-teal-500",
	];
	return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

/**
 * Truncate text
 */
export function truncateText(text: string, length: number): string {
	if (text.length <= length) return text;
	return text.slice(0, length) + "...";
}

/**
 * Sleep utility for demos
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
	const today = new Date();
	const d = new Date(date);
	return (
		d.getDate() === today.getDate() &&
		d.getMonth() === today.getMonth() &&
		d.getFullYear() === today.getFullYear()
	);
}

/**
 * Check if date is in current week
 */
export function isThisWeek(date: Date | string): boolean {
	const today = new Date();
	const d = new Date(date);
	const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
	const endOfWeek = new Date(
		today.setDate(today.getDate() - today.getDay() + 6)
	);
	return d >= startOfWeek && d <= endOfWeek;
}

/**
 * Get time difference in a readable format
 */
export function getTimeAgo(date: Date | string): string {
	const now = new Date();
	const d = new Date(date);
	const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

	if (diffInSeconds < 60) return "Just now";
	if (diffInSeconds < 3600)
		return `${Math.floor(diffInSeconds / 60)} minutes ago`;
	if (diffInSeconds < 86400)
		return `${Math.floor(diffInSeconds / 3600)} hours ago`;
	if (diffInSeconds < 2592000)
		return `${Math.floor(diffInSeconds / 86400)} days ago`;
	if (diffInSeconds < 31536000)
		return `${Math.floor(diffInSeconds / 2592000)} months ago`;
	return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

// IT APPEARS THAT BIG CALENDAR SHOWS THE LAST WEEK WHEN THE CURRENT DAY IS A WEEKEND.
// FOR THIS REASON WE'LL GET THE LAST WEEK AS THE REFERENCE WEEK.
// IN THE TUTORIAL WE'RE TAKING THE NEXT WEEK AS THE REFERENCE WEEK.

const getLatestMonday = (): Date => {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
	const latestMonday = today;
	latestMonday.setDate(today.getDate() - daysSinceMonday);
	return latestMonday;
};

export const adjustScheduleToCurrentWeek = (
	lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
	const latestMonday = getLatestMonday();

	return lessons.map((lesson) => {
		const lessonDayOfWeek = lesson.start.getDay();

		const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

		const adjustedStartDate = new Date(latestMonday);

		adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday);
		adjustedStartDate.setHours(
			lesson.start.getHours(),
			lesson.start.getMinutes(),
			lesson.start.getSeconds()
		);
		const adjustedEndDate = new Date(adjustedStartDate);
		adjustedEndDate.setHours(
			lesson.end.getHours(),
			lesson.end.getMinutes(),
			lesson.end.getSeconds()
		);

		return {
			title: lesson.title,
			start: adjustedStartDate,
			end: adjustedEndDate,
		};
	});
};
