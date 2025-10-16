/**
 * Export Data Page
 * Admin page for exporting all types of data
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
	exportStudents,
	exportTeachers,
	exportParents,
	exportClasses,
	exportSubjects,
	exportLessons,
	exportExams,
	exportAssignments,
	exportAttendance,
	exportResults,
	exportEvents,
	exportAnnouncements,
	exportStudentLeaderboard,
	exportTeacherLeaderboard,
	exportMCQTests,
	exportMCQTestAttempts,
	exportFeeStructures,
	exportStudentFees,
	exportTransactions,
	exportSalaries,
	exportIncome,
	exportExpenses,
} from "@/lib/exportActions";
import { exportToExcel, getDateRange, DateRange } from "@/lib/exportUtils";
import { toast } from "react-toastify";

type ExportCategory = {
	id: string;
	name: string;
	icon: string;
	description: string;
	exportFunction: (
		startDate?: Date,
		endDate?: Date,
		filters?: any
	) => Promise<any[]>;
};

const ExportDataPage = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [dateRange, setDateRange] = useState<DateRange>("this_month");
	const [isExporting, setIsExporting] = useState(false);

	// Manual date selection
	const [useManualDate, setUseManualDate] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	// Filters
	const [classes, setClasses] = useState<any[]>([]);
	const [students, setStudents] = useState<any[]>([]);
	const [teachers, setTeachers] = useState<any[]>([]);
	const [parents, setParents] = useState<any[]>([]);

	const [selectedClass, setSelectedClass] = useState<string>("");
	const [selectedStudent, setSelectedStudent] = useState<string>("");
	const [selectedTeacher, setSelectedTeacher] = useState<string>("");
	const [selectedParent, setSelectedParent] = useState<string>("");

	// Load filter options
	useEffect(() => {
		const loadFilters = async () => {
			try {
				const response = await fetch("/api/export-filters");
				const data = await response.json();
				setClasses(data.classes || []);
				setStudents(data.students || []);
				setTeachers(data.teachers || []);
				setParents(data.parents || []);
			} catch (error) {
				console.error("Failed to load filters:", error);
			}
		};
		loadFilters();
	}, []);

	const categories: ExportCategory[] = [
		{
			id: "students",
			name: "Students",
			icon: "/student.png",
			description:
				"Export student records with class, grade, and parent information",
			exportFunction: exportStudents,
		},
		{
			id: "teachers",
			name: "Teachers",
			icon: "/teacher.png",
			description: "Export teacher records with subjects and classes",
			exportFunction: exportTeachers,
		},
		{
			id: "parents",
			name: "Parents",
			icon: "/parent.png",
			description: "Export parent records with children information",
			exportFunction: exportParents,
		},
		{
			id: "classes",
			name: "Classes",
			icon: "/class.png",
			description: "Export class records with student counts",
			exportFunction: exportClasses,
		},
		{
			id: "subjects",
			name: "Subjects",
			icon: "/subject.png",
			description: "Export all subjects with teachers",
			exportFunction: exportSubjects,
		},
		{
			id: "lessons",
			name: "Lessons/Schedule",
			icon: "/lesson.png",
			description: "Export lesson schedules and timetables",
			exportFunction: exportLessons,
		},
		{
			id: "exams",
			name: "Exams",
			icon: "/exam.png",
			description: "Export exam records with results count",
			exportFunction: exportExams,
		},
		{
			id: "assignments",
			name: "Assignments",
			icon: "/assignment.png",
			description: "Export assignment records with submissions",
			exportFunction: exportAssignments,
		},
		{
			id: "attendance",
			name: "Attendance Records",
			icon: "/attendance.png",
			description: "Export student attendance records",
			exportFunction: exportAttendance,
		},
		{
			id: "results",
			name: "Results/Grades",
			icon: "/result.png",
			description: "Export exam and assignment results",
			exportFunction: exportResults,
		},
		{
			id: "events",
			name: "Events",
			icon: "/calendar.png",
			description: "Export school events calendar",
			exportFunction: exportEvents,
		},
		{
			id: "announcements",
			name: "Announcements",
			icon: "/announcement.png",
			description: "Export all announcements",
			exportFunction: exportAnnouncements,
		},
		{
			id: "student-leaderboard",
			name: "Student Leaderboard",
			icon: "/exam.png",
			description: "Export student rankings and scores",
			exportFunction: exportStudentLeaderboard,
		},
		{
			id: "teacher-leaderboard",
			name: "Teacher Rankings",
			icon: "/exam.png",
			description: "Export teacher ratings and rankings",
			exportFunction: exportTeacherLeaderboard,
		},
		{
			id: "mcq-tests",
			name: "MCQ Tests",
			icon: "/test.png",
			description: "Export MCQ test records",
			exportFunction: exportMCQTests,
		},
		{
			id: "mcq-attempts",
			name: "MCQ Test Results",
			icon: "/test.png",
			description: "Export student MCQ test attempts and scores",
			exportFunction: exportMCQTestAttempts,
		},
		{
			id: "fee-structures",
			name: "Fee Structures",
			icon: "/finance.png",
			description: "Export fee structures by grade",
			exportFunction: exportFeeStructures,
		},
		{
			id: "student-fees",
			name: "Student Fees",
			icon: "/finance.png",
			description: "Export student fee records and payment status",
			exportFunction: exportStudentFees,
		},
		{
			id: "transactions",
			name: "Transactions",
			icon: "/finance.png",
			description: "Export all payment transactions",
			exportFunction: exportTransactions,
		},
		{
			id: "salaries",
			name: "Teacher Salaries",
			icon: "/finance.png",
			description: "Export teacher salary records",
			exportFunction: exportSalaries,
		},
		{
			id: "income",
			name: "Income Records",
			icon: "/finance.png",
			description: "Export school income records",
			exportFunction: exportIncome,
		},
		{
			id: "expenses",
			name: "Expense Records",
			icon: "/finance.png",
			description: "Export school expense records",
			exportFunction: exportExpenses,
		},
	];

	const handleExport = async () => {
		if (!selectedCategory) {
			toast.error("Please select a category to export");
			return;
		}

		setIsExporting(true);

		try {
			const category = categories.find((c) => c.id === selectedCategory);
			if (!category) return;

			// Determine date range
			let start: Date | undefined;
			let end: Date | undefined;

			if (useManualDate) {
				if (startDate) start = new Date(startDate);
				if (endDate) {
					end = new Date(endDate);
					end.setHours(23, 59, 59, 999); // End of day
				}
			} else {
				const range = getDateRange(dateRange);
				start = range?.start;
				end = range?.end;
			}

			// Build filters
			const filters: any = {};
			if (selectedClass) filters.classId = parseInt(selectedClass);
			if (selectedStudent) filters.studentId = selectedStudent;
			if (selectedTeacher) filters.teacherId = selectedTeacher;
			if (selectedParent) filters.parentId = selectedParent;

			const data = await category.exportFunction(start, end, filters);

			if (data.length === 0) {
				toast.warning("No data found for the selected filters");
				setIsExporting(false);
				return;
			}

			exportToExcel(data, category.id, category.name);
			toast.success(`Successfully exported ${data.length} records to Excel`);
		} catch (error: any) {
			console.error("Export error:", error);
			toast.error(error.message || "Failed to export data");
		} finally {
			setIsExporting(false);
		}
	};

	const dateRangeOptions = [
		{ value: "all", label: "All Time" },
		{ value: "today", label: "Today" },
		{ value: "yesterday", label: "Yesterday" },
		{ value: "this_week", label: "This Week" },
		{ value: "last_week", label: "Last Week" },
		{ value: "this_month", label: "This Month" },
		{ value: "last_month", label: "Last Month" },
		{ value: "this_year", label: "This Year" },
		{ value: "last_year", label: "Last Year" },
	];

	return (
		<div className="bg-white p-4 md:p-6 rounded-xl flex-1 m-4 mt-0">
			{/* HEADER */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
						<Image src="/download.png" alt="Export" width={28} height={28} />
						Export Data
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Export school data to Excel spreadsheets
					</p>
				</div>
			</div>

			{/* DATE RANGE SELECTOR */}
			<div className="mb-6 bg-lamaSkyLight p-4 rounded-lg">
				<div className="flex items-center justify-between mb-3">
					<label className="block text-sm font-semibold text-gray-700">
						Select Date Range
					</label>
					<button
						onClick={() => setUseManualDate(!useManualDate)}
						className="text-xs font-medium text-lamaSky hover:text-lamaPurple transition-colors flex items-center gap-1"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						{useManualDate ? "Use Presets" : "Manual Selection"}
					</button>
				</div>

				{useManualDate ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-medium text-gray-600 mb-1">
								Start Date
							</label>
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaSky focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-600 mb-1">
								End Date
							</label>
							<input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaSky focus:border-transparent"
							/>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
						{dateRangeOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => setDateRange(option.value as DateRange)}
								className={`px-4 py-2 rounded-lg font-medium transition-all ${
									dateRange === option.value
										? "bg-lamaSky text-white shadow-md"
										: "bg-white text-gray-700 hover:bg-gray-50"
								}`}
							>
								{option.label}
							</button>
						))}
					</div>
				)}
			</div>

			{/* FILTERS */}
			<div className="mb-6 bg-lamaPurpleLight p-4 rounded-lg">
				<h3 className="text-sm font-semibold text-gray-700 mb-3">
					Filter by Specific Records (Optional)
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label className="block text-xs font-medium text-gray-600 mb-1">
							Class
						</label>
						<select
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent text-sm"
						>
							<option value="">All Classes</option>
							{classes.map((cls) => (
								<option key={cls.id} value={cls.id}>
									{cls.name} - Grade {cls.grade?.level}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-600 mb-1">
							Student
						</label>
						<select
							value={selectedStudent}
							onChange={(e) => setSelectedStudent(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent text-sm"
						>
							<option value="">All Students</option>
							{students.map((student) => (
								<option key={student.id} value={student.id}>
									{student.name} {student.surname} ({student.class?.name})
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-600 mb-1">
							Teacher
						</label>
						<select
							value={selectedTeacher}
							onChange={(e) => setSelectedTeacher(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent text-sm"
						>
							<option value="">All Teachers</option>
							{teachers.map((teacher) => (
								<option key={teacher.id} value={teacher.id}>
									{teacher.name} {teacher.surname}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-600 mb-1">
							Parent
						</label>
						<select
							value={selectedParent}
							onChange={(e) => setSelectedParent(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lamaPurple focus:border-transparent text-sm"
						>
							<option value="">All Parents</option>
							{parents.map((parent) => (
								<option key={parent.id} value={parent.id}>
									{parent.name} {parent.surname}
								</option>
							))}
						</select>
					</div>
				</div>

				{(selectedClass ||
					selectedStudent ||
					selectedTeacher ||
					selectedParent) && (
					<button
						onClick={() => {
							setSelectedClass("");
							setSelectedStudent("");
							setSelectedTeacher("");
							setSelectedParent("");
						}}
						className="mt-3 text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
					>
						<svg
							className="w-4 h-4"
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
						Clear All Filters
					</button>
				)}
			</div>

			{/* CATEGORIES GRID */}
			<div className="mb-6">
				<h2 className="text-lg font-semibold text-gray-700 mb-4">
					Select Data Category
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => setSelectedCategory(category.id)}
							className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all hover:shadow-md ${
								selectedCategory === category.id
									? "border-lamaSky bg-lamaSkyLight shadow-md"
									: "border-gray-200 bg-white hover:border-lamaPurple"
							}`}
						>
							<div className="flex items-center gap-3 w-full mb-2">
								<Image
									src={category.icon}
									alt={category.name}
									width={24}
									height={24}
									className={
										selectedCategory === category.id
											? "brightness-0 saturate-100"
											: ""
									}
								/>
								<h3 className="font-semibold text-gray-800">{category.name}</h3>
							</div>
							<p className="text-xs text-gray-600 text-left">
								{category.description}
							</p>
						</button>
					))}
				</div>
			</div>

			{/* EXPORT BUTTON */}
			<div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
				<button
					onClick={handleExport}
					disabled={!selectedCategory || isExporting}
					className="px-8 py-3 bg-gradient-to-r from-lamaSky to-lamaPurple text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center gap-2"
				>
					{isExporting ? (
						<>
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Exporting...
						</>
					) : (
						<>
							<Image
								src="/result.png"
								alt="Export"
								width={20}
								height={20}
								className="brightness-0 invert"
							/>
							Export to Excel
						</>
					)}
				</button>
			</div>

			{/* INFO BOX */}
			<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
					<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clipRule="evenodd"
						/>
					</svg>
					Export Information
				</h3>
				<ul className="text-sm text-blue-700 space-y-1">
					<li>✓ Exports are generated in Excel (.xlsx) format</li>
					<li>
						✓ Files include professional formatting and auto-sized columns
					</li>
					<li>✓ Use preset date ranges or select custom start/end dates</li>
					<li>
						✓ Filter by specific class, student, teacher, or parent (optional)
					</li>
					<li>
						✓ Combine date ranges with filters for precise data extraction
					</li>
					<li>✓ Some categories export all records regardless of filters</li>
					<li>
						✓ Downloaded files are named with timestamp for easy organization
					</li>
				</ul>
			</div>
		</div>
	);
};

export default ExportDataPage;
