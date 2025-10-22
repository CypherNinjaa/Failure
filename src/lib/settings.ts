export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
	[key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
	"/admin(.*)": ["admin"],
	"/student(.*)": ["student"],
	"/teacher(.*)": ["teacher"],
	"/parent(.*)": ["parent"],
	"/media-coordinator(.*)": ["media-coordinator"],
	"/list/teachers": ["admin", "teacher"],
	"/list/students": ["admin", "teacher"],
	"/list/parents": ["admin", "teacher"],
	"/list/subjects": ["admin"],
	"/list/classes": ["admin", "teacher"],
	"/list/exams": ["admin", "teacher", "student", "parent"],
	"/list/assignments": ["admin", "teacher", "student", "parent"],
	"/list/results": ["admin", "teacher", "student", "parent"],
	"/list/attendance": ["admin", "teacher", "student", "parent"],
	"/list/events": ["admin", "teacher", "student", "parent"],
	"/list/announcements": ["admin", "teacher", "student", "parent"],
	"/list/leaderboard": ["admin", "teacher", "student"],
	"/list/badges": ["admin"],
	"/list/teacher-leaderboard": ["admin", "teacher"],
	"/list/fee-structures": ["admin"],
	"/list/assign-fees": ["admin"],
	"/list/student-fees": ["admin"],
	"/list/salaries": ["admin"],
	"/list/income": ["admin"],
	"/list/expenses": ["admin"],
	"/admin-notifications": ["admin"],
	"/media-coordinator/gallery": ["media-coordinator", "admin"],
	"/media-coordinator/news-ticker": ["media-coordinator", "admin"],
	"/profile": ["admin", "teacher", "student", "parent", "media-coordinator"],
	"/settings": ["admin", "teacher", "student", "parent", "media-coordinator"],
};
