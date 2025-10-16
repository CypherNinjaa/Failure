/**
 * Export Actions
 * Server actions for fetching data to export
 */

"use server";

import prisma from "./prisma";
import { auth } from "@clerk/nextjs/server";
import { formatDate, formatDateTime, boolToYesNo } from "./exportUtils";

/**
 * Check if user is admin
 */
const checkAdminAccess = async () => {
	const { sessionClaims } = await auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		throw new Error("Unauthorized: Admin access required");
	}
};

/**
 * Export Students Data
 */
export const exportStudents = async (
	startDate?: Date,
	endDate?: Date,
	filters?: { classId?: number; studentId?: string; parentId?: string }
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};

	// Date filter
	if (startDate && endDate) {
		where.createdAt = {
			gte: startDate,
			lte: endDate,
		};
	}

	// Apply filters
	if (filters?.classId) where.classId = filters.classId;
	if (filters?.studentId) where.id = filters.studentId;
	if (filters?.parentId) where.parentId = filters.parentId;

	const students = await prisma.student.findMany({
		where,
		include: {
			class: {
				include: {
					grade: true,
				},
			},
			parent: true,
		},
		orderBy: { createdAt: "desc" },
	});

	return students.map((student) => ({
		"Student ID": student.id,
		Username: student.username,
		Name: student.name,
		Surname: student.surname,
		Email: student.email || "",
		Phone: student.phone || "",
		Address: student.address,
		Birthdate: formatDate(student.birthday),
		Gender: student.sex,
		"Blood Type": student.bloodType || "",
		Class: student.class?.name || "",
		Grade: student.class?.grade?.level || "",
		"Parent Name": student.parent
			? `${student.parent.name} ${student.parent.surname}`
			: "",
		"Parent Email": student.parent?.email || "",
		"Parent Phone": student.parent?.phone || "",
		"Created At": formatDateTime(student.createdAt),
	}));
};

/**
 * Export Teachers Data
 */
export const exportTeachers = async (
	startDate?: Date,
	endDate?: Date,
	filters?: { teacherId?: string; classId?: number }
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};

	// Date filter
	if (startDate && endDate) {
		where.createdAt = {
			gte: startDate,
			lte: endDate,
		};
	}

	// Apply filters
	if (filters?.teacherId) where.id = filters.teacherId;

	const teachers = await prisma.teacher.findMany({
		where,
		include: {
			subjects: true,
			classes: {
				include: {
					grade: true,
				},
				...(filters?.classId && {
					where: { id: filters.classId },
				}),
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return teachers.map((teacher) => ({
		"Teacher ID": teacher.id,
		Username: teacher.username,
		Name: teacher.name,
		Surname: teacher.surname,
		Email: teacher.email || "",
		Phone: teacher.phone || "",
		Address: teacher.address,
		Birthdate: formatDate(teacher.birthday),
		Gender: teacher.sex,
		"Blood Type": teacher.bloodType || "",
		Subjects: teacher.subjects.map((s) => s.name).join(", "),
		Classes: teacher.classes
			.map((c) => `${c.name} (Grade ${c.grade.level})`)
			.join(", "),
		"Created At": formatDateTime(teacher.createdAt),
	}));
};

/**
 * Export Parents Data
 */
export const exportParents = async (
	startDate?: Date,
	endDate?: Date,
	filters?: { parentId?: string; studentId?: string }
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};

	// Date filter
	if (startDate && endDate) {
		where.createdAt = {
			gte: startDate,
			lte: endDate,
		};
	}

	// Apply filters
	if (filters?.parentId) where.id = filters.parentId;

	const parents = await prisma.parent.findMany({
		where,
		include: {
			students: {
				include: {
					class: true,
				},
				...(filters?.studentId && {
					where: { id: filters.studentId },
				}),
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return parents.map((parent) => ({
		"Parent ID": parent.id,
		Username: parent.username,
		Name: parent.name,
		Surname: parent.surname,
		Email: parent.email || "",
		Phone: parent.phone || "",
		Address: parent.address,
		Children: parent.students.map((s) => `${s.name} ${s.surname}`).join(", "),
		"Children Classes": parent.students
			.map((s) => s.class?.name || "")
			.join(", "),
		"Total Children": parent.students.length,
		"Created At": formatDateTime(parent.createdAt),
	}));
};

/**
 * Export Classes Data
 */
export const exportClasses = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const classes = await prisma.class.findMany({
		include: {
			grade: true,
			supervisor: true,
			_count: {
				select: {
					students: true,
					lessons: true,
				},
			},
		},
		orderBy: { name: "asc" },
	});

	return classes.map((cls) => ({
		"Class ID": cls.id,
		"Class Name": cls.name,
		Grade: cls.grade.level,
		Capacity: cls.capacity,
		"Students Count": cls._count.students,
		"Available Seats": cls.capacity - cls._count.students,
		Supervisor: cls.supervisor
			? `${cls.supervisor.name} ${cls.supervisor.surname}`
			: "",
		"Total Lessons": cls._count.lessons,
	}));
};

/**
 * Export Subjects Data
 */
export const exportSubjects = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const subjects = await prisma.subject.findMany({
		include: {
			teachers: true,
			_count: {
				select: {
					lessons: true,
				},
			},
		},
		orderBy: { name: "asc" },
	});

	return subjects.map((subject) => ({
		"Subject ID": subject.id,
		"Subject Name": subject.name,
		Teachers: subject.teachers.map((t) => `${t.name} ${t.surname}`).join(", "),
		"Total Teachers": subject.teachers.length,
		"Total Lessons": subject._count.lessons,
	}));
};

/**
 * Export Lessons/Schedule Data
 */
export const exportLessons = async (
	startDate?: Date,
	endDate?: Date,
	filters?: { classId?: number; teacherId?: string }
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};

	// Date filter
	if (startDate && endDate) {
		where.startTime = {
			gte: startDate,
			lte: endDate,
		};
	}

	// Apply filters
	if (filters?.classId) where.classId = filters.classId;
	if (filters?.teacherId) where.teacherId = filters.teacherId;

	const lessons = await prisma.lesson.findMany({
		where,
		include: {
			subject: true,
			class: {
				include: {
					grade: true,
				},
			},
			teacher: true,
		},
		orderBy: { startTime: "desc" },
	});

	return lessons.map((lesson) => ({
		"Lesson ID": lesson.id,
		Subject: lesson.subject.name,
		Class: lesson.class.name,
		Grade: lesson.class.grade.level,
		Teacher: `${lesson.teacher.name} ${lesson.teacher.surname}`,
		Day: lesson.day,
		"Start Time": formatDateTime(lesson.startTime),
		"End Time": formatDateTime(lesson.endTime),
	}));
};

/**
 * Export Exams Data
 */
export const exportExams = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.startTime = {
			gte: startDate,
			lte: endDate,
		};
	}

	const exams = await prisma.exam.findMany({
		where,
		include: {
			lesson: {
				include: {
					subject: true,
					class: {
						include: {
							grade: true,
						},
					},
					teacher: true,
				},
			},
			_count: {
				select: {
					results: true,
				},
			},
		},
		orderBy: { startTime: "desc" },
	});

	return exams.map((exam) => ({
		"Exam ID": exam.id,
		Title: exam.title,
		Subject: exam.lesson?.subject.name || "",
		Class: exam.lesson?.class.name || "",
		Grade: exam.lesson?.class.grade.level || "",
		Teacher: exam.lesson?.teacher
			? `${exam.lesson.teacher.name} ${exam.lesson.teacher.surname}`
			: "",
		"Start Time": formatDateTime(exam.startTime),
		"End Time": formatDateTime(exam.endTime),
		"Total Results": exam._count.results,
	}));
};

/**
 * Export Assignments Data
 */
export const exportAssignments = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.startDate = {
			gte: startDate,
			lte: endDate,
		};
	}

	const assignments = await prisma.assignment.findMany({
		where,
		include: {
			lesson: {
				include: {
					subject: true,
					class: {
						include: {
							grade: true,
						},
					},
					teacher: true,
				},
			},
			_count: {
				select: {
					results: true,
				},
			},
		},
		orderBy: { startDate: "desc" },
	});

	return assignments.map((assignment) => ({
		"Assignment ID": assignment.id,
		Title: assignment.title,
		Subject: assignment.lesson?.subject.name || "",
		Class: assignment.lesson?.class.name || "",
		Grade: assignment.lesson?.class.grade.level || "",
		Teacher: assignment.lesson?.teacher
			? `${assignment.lesson.teacher.name} ${assignment.lesson.teacher.surname}`
			: "",
		"Start Date": formatDate(assignment.startDate),
		"Due Date": formatDate(assignment.dueDate),
		"Total Submissions": assignment._count.results,
	}));
};

/**
 * Export Attendance Records
 */
export const exportAttendance = async (
	startDate?: Date,
	endDate?: Date,
	filters?: { classId?: number; studentId?: string; teacherId?: string }
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};

	// Date filter
	if (startDate && endDate) {
		where.date = {
			gte: startDate,
			lte: endDate,
		};
	}

	// Apply filters
	if (filters?.studentId) where.studentId = filters.studentId;
	if (filters?.classId) {
		where.student = {
			classId: filters.classId,
		};
	}

	const attendance = await prisma.attendance.findMany({
		where,
		include: {
			student: {
				include: {
					class: true,
				},
			},
			lesson: {
				include: {
					subject: true,
					teacher: true,
				},
			},
		},
		orderBy: { date: "desc" },
	});

	// Filter by teacher if specified
	let filteredAttendance = attendance;
	if (filters?.teacherId) {
		filteredAttendance = attendance.filter(
			(record) => record.lesson?.teacher?.id === filters.teacherId
		);
	}

	return filteredAttendance.map((record) => ({
		"Attendance ID": record.id,
		Date: formatDate(record.date),
		Student: `${record.student.name} ${record.student.surname}`,
		"Student ID": record.student.id,
		Class: record.student.class?.name || "",
		Subject: record.lesson?.subject.name || "",
		Teacher: record.lesson?.teacher
			? `${record.lesson.teacher.name} ${record.lesson.teacher.surname}`
			: "",
		Status: record.present ? "Present" : "Absent",
	}));
};

/**
 * Export Results/Grades Data
 */
export const exportResults = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	// Note: Result model doesn't have createdAt field
	const results = await prisma.result.findMany({
		include: {
			student: {
				include: {
					class: true,
				},
			},
			exam: {
				include: {
					lesson: {
						include: {
							subject: true,
							teacher: true,
						},
					},
				},
			},
			assignment: {
				include: {
					lesson: {
						include: {
							subject: true,
							teacher: true,
						},
					},
				},
			},
		},
		orderBy: { id: "desc" },
	});

	return results.map((result) => ({
		"Result ID": result.id,
		Student: `${result.student.name} ${result.student.surname}`,
		"Student ID": result.student.id,
		Class: result.student.class?.name || "",
		Type: result.exam ? "Exam" : "Assignment",
		Title: result.exam?.title || result.assignment?.title || "",
		Subject:
			result.exam?.lesson?.subject.name ||
			result.assignment?.lesson?.subject.name ||
			"",
		Score: result.score,
	}));
};

/**
 * Export Events Data
 */
export const exportEvents = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.startTime = {
			gte: startDate,
			lte: endDate,
		};
	}

	const events = await prisma.event.findMany({
		where,
		include: {
			class: {
				include: {
					grade: true,
				},
			},
		},
		orderBy: { startTime: "desc" },
	});

	return events.map((event) => ({
		"Event ID": event.id,
		Title: event.title,
		Description: event.description || "",
		Class: event.class?.name || "All Classes",
		Grade: event.class?.grade.level || "All Grades",
		"Start Time": formatDateTime(event.startTime),
		"End Time": formatDateTime(event.endTime),
	}));
};

/**
 * Export Announcements Data
 */
export const exportAnnouncements = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.date = {
			gte: startDate,
			lte: endDate,
		};
	}

	const announcements = await prisma.announcement.findMany({
		where,
		include: {
			class: {
				include: {
					grade: true,
				},
			},
		},
		orderBy: { date: "desc" },
	});

	return announcements.map((announcement) => ({
		"Announcement ID": announcement.id,
		Title: announcement.title,
		Description: announcement.description || "",
		Class: announcement.class?.name || "All Classes",
		Grade: announcement.class?.grade.level || "All Grades",
		Date: formatDateTime(announcement.date),
	}));
};

/**
 * Export Student Leaderboard Data
 */
export const exportStudentLeaderboard = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const students = await prisma.student.findMany({
		include: {
			class: {
				include: {
					grade: true,
				},
			},
			mcqAttempts: {
				include: {
					test: true,
				},
			},
		},
	});

	const leaderboardData = students
		.map((student) => {
			const totalAttempts = student.mcqAttempts.length;
			const totalScore = student.mcqAttempts.reduce(
				(sum: number, attempt: any) => sum + (attempt.score || 0),
				0
			);
			const averageScore =
				totalAttempts > 0 ? (totalScore / totalAttempts).toFixed(2) : "0.00";

			return {
				"Student Name": `${student.name} ${student.surname}`,
				"Student ID": student.id,
				Class: student.class?.name || "",
				Grade: student.class?.grade.level || "",
				"Total Tests Taken": totalAttempts,
				"Total Score": totalScore,
				"Average Score": averageScore,
			};
		})
		.sort(
			(a, b) => parseFloat(b["Average Score"]) - parseFloat(a["Average Score"])
		)
		.map((item, index) => ({
			Rank: index + 1,
			...item,
		}));

	return leaderboardData;
};

/**
 * Export Teacher Leaderboard Data
 */
export const exportTeacherLeaderboard = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const ratings = await prisma.teacherRating.findMany({
		include: {
			teacher: {
				include: {
					subjects: true,
				},
			},
		},
	});

	const teacherStats = ratings.reduce((acc: any, rating) => {
		const teacherId = rating.teacherId;
		if (!acc[teacherId]) {
			acc[teacherId] = {
				teacher: rating.teacher,
				totalRatings: 0,
				totalScore: 0,
				fiveStar: 0,
				fourStar: 0,
				threeStar: 0,
				twoStar: 0,
				oneStar: 0,
			};
		}

		acc[teacherId].totalRatings++;
		acc[teacherId].totalScore += rating.rating;

		switch (rating.rating) {
			case 5:
				acc[teacherId].fiveStar++;
				break;
			case 4:
				acc[teacherId].fourStar++;
				break;
			case 3:
				acc[teacherId].threeStar++;
				break;
			case 2:
				acc[teacherId].twoStar++;
				break;
			case 1:
				acc[teacherId].oneStar++;
				break;
		}

		return acc;
	}, {});

	const leaderboardData = Object.values(teacherStats)
		.map((stats: any) => ({
			"Teacher Name": `${stats.teacher.name} ${stats.teacher.surname}`,
			"Teacher ID": stats.teacher.id,
			Subjects: stats.teacher.subjects.map((s: any) => s.name).join(", "),
			"Average Rating": (stats.totalScore / stats.totalRatings).toFixed(2),
			"Total Ratings": stats.totalRatings,
			"5 Stars": stats.fiveStar,
			"4 Stars": stats.fourStar,
			"3 Stars": stats.threeStar,
			"2 Stars": stats.twoStar,
			"1 Star": stats.oneStar,
		}))
		.sort(
			(a: any, b: any) =>
				parseFloat(b["Average Rating"]) - parseFloat(a["Average Rating"])
		)
		.map((item: any, index: number) => ({
			Rank: index + 1,
			...item,
		}));

	return leaderboardData;
};

/**
 * Export MCQ Test Records
 */
export const exportMCQTests = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.createdAt = {
			gte: startDate,
			lte: endDate,
		};
	}

	const tests = await prisma.mCQTest.findMany({
		where,
		include: {
			subject: true,
			class: {
				include: {
					grade: true,
				},
			},
			teacher: true,
			_count: {
				select: {
					attempts: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return tests.map((test) => ({
		"Test ID": test.id,
		Title: test.title,
		Subject: test.subject?.name || "",
		Class: test.class?.name || "",
		Grade: test.class?.grade.level || "",
		Teacher: `${test.teacher.name} ${test.teacher.surname}`,
		"Total Attempts": test._count.attempts,
		"Created At": formatDateTime(test.createdAt),
	}));
};

/**
 * Export MCQ Test Attempts/Student Results
 */
export const exportMCQTestAttempts = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.startedAt = {
			gte: startDate,
			lte: endDate,
		};
	}

	const attempts = await prisma.mCQAttempt.findMany({
		where,
		include: {
			test: {
				include: {
					subject: true,
					class: true,
				},
			},
			student: {
				include: {
					class: true,
				},
			},
		},
		orderBy: { startedAt: "desc" },
	});

	return attempts.map((attempt: any) => ({
		"Attempt ID": attempt.id,
		Student: `${attempt.student.name} ${attempt.student.surname}`,
		"Student ID": attempt.student.id,
		"Student Class": attempt.student.class?.name || "",
		"Test Title": attempt.test.title,
		Subject: attempt.test.subject?.name || "",
		Score: attempt.score || 0,
		"Attempt Number": attempt.attemptNumber,
		"Started At": formatDateTime(attempt.startedAt),
		"Submitted At": attempt.submittedAt
			? formatDateTime(attempt.submittedAt)
			: "In Progress",
	}));
};

/**
 * Export Fee Structures
 */
export const exportFeeStructures = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const feeStructures = await prisma.feeStructure.findMany({
		include: {
			grade: true,
		},
		orderBy: { createdAt: "desc" },
	});

	return feeStructures.map((fee) => ({
		"Fee ID": fee.id,
		Name: fee.name,
		Grade: fee.grade?.level || "",
		Amount: fee.amount,
		Currency: "INR",
		"Created At": formatDateTime(fee.createdAt),
	}));
};

/**
 * Export Student Fees
 */
export const exportStudentFees = async (
	startDate?: Date,
	endDate?: Date,
	filters?: { classId?: number; studentId?: string; parentId?: string }
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};

	// Date filter
	if (startDate && endDate) {
		where.createdAt = {
			gte: startDate,
			lte: endDate,
		};
	}

	// Apply filters
	if (filters?.studentId) {
		where.studentId = filters.studentId;
	} else if (filters?.classId) {
		where.student = {
			classId: filters.classId,
		};
	} else if (filters?.parentId) {
		where.student = {
			parentId: filters.parentId,
		};
	}

	const studentFees = await prisma.studentFee.findMany({
		where,
		include: {
			student: {
				include: {
					class: {
						include: {
							grade: true,
						},
					},
					parent: true,
				},
			},
			feeStructure: true,
		},
		orderBy: { createdAt: "desc" },
	});

	return studentFees.map((fee: any) => ({
		"Fee Record ID": fee.id,
		Student: `${fee.student.name} ${fee.student.surname}`,
		"Student ID": fee.student.id,
		Class: fee.student.class?.name || "",
		Grade: fee.student.class?.grade.level || "",
		Parent: fee.student.parent
			? `${fee.student.parent.name} ${fee.student.parent.surname}`
			: "",
		"Fee Name": fee.feeStructure.name,
		Amount: fee.amount,
		"Amount Paid": fee.amountPaid,
		Balance: fee.amount - fee.amountPaid,
		Status: fee.status,
		"Due Date": formatDate(fee.dueDate),
		"Created At": formatDateTime(fee.createdAt),
	}));
};

/**
 * Export Payment Transactions
 */
export const exportTransactions = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.paymentDate = {
			gte: startDate,
			lte: endDate,
		};
	}

	const payments = await prisma.payment.findMany({
		where,
		include: {
			studentFee: {
				include: {
					student: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return payments.map((payment: any) => ({
		"Payment ID": payment.id,
		"Receipt Number": payment.receiptNumber || "",
		"Transaction ID": payment.transactionId || "",
		Student: payment.studentFee?.student
			? `${payment.studentFee.student.name} ${payment.studentFee.student.surname}`
			: "",
		Amount: payment.amount,
		"Payment Method": payment.paymentMethod,
		Status: payment.approvalStatus,
		"Payment Date": formatDateTime(payment.paymentDate),
		"Created At": formatDateTime(payment.createdAt),
	}));
};

/**
 * Export Salaries
 */
export const exportSalaries = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.createdAt = {
			gte: startDate,
			lte: endDate,
		};
	}

	const salaries = await prisma.salary.findMany({
		where,
		include: {
			teacher: true,
		},
		orderBy: { createdAt: "desc" },
	});

	return salaries.map((salary) => ({
		"Salary ID": salary.id,
		Teacher: salary.teacher
			? `${salary.teacher.name} ${salary.teacher.surname}`
			: salary.staffName || "",
		"Teacher ID": salary.teacher?.id || "",
		Amount: salary.amount,
		Month: salary.month,
		Year: salary.year,
		Status: salary.status,
		"Paid Date": salary.paidDate ? formatDate(salary.paidDate) : "",
		"Payment Method": salary.paymentMethod || "",
		Notes: salary.notes || "",
		"Created At": formatDateTime(salary.createdAt),
	}));
};

/**
 * Export Income Records
 */
export const exportIncome = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.date = {
			gte: startDate,
			lte: endDate,
		};
	}

	const income = await prisma.income.findMany({
		where,
		orderBy: { date: "desc" },
	});

	return income.map((item) => ({
		"Income ID": item.id,
		Title: item.title,
		Description: item.description || "",
		Amount: item.amount,
		Date: formatDate(item.date),
		"Created At": formatDateTime(item.createdAt),
	}));
};

/**
 * Export Expense Records
 */
export const exportExpenses = async (
	startDate?: Date,
	endDate?: Date,
	filters?: any
): Promise<any[]> => {
	await checkAdminAccess();

	const where: any = {};
	if (startDate && endDate) {
		where.date = {
			gte: startDate,
			lte: endDate,
		};
	}

	const expenses = await prisma.expense.findMany({
		where,
		orderBy: { date: "desc" },
	});

	return expenses.map((item) => ({
		"Expense ID": item.id,
		Title: item.title,
		Description: item.description || "",
		Amount: item.amount,
		Date: formatDate(item.date),
		"Created At": formatDateTime(item.createdAt),
	}));
};
