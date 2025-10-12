"use server";

import { revalidatePath } from "next/cache";
import {
	ClassSchema,
	ExamSchema,
	StudentSchema,
	SubjectSchema,
	TeacherSchema,
	ParentSchema,
	LessonSchema,
	AssignmentSchema,
	ResultSchema,
	AttendanceSchema,
	BulkAttendanceSchema,
	EventSchema,
	AnnouncementSchema,
	LocationSchema,
	MCQTestSchema,
	MCQQuestionSchema,
	MCQAttemptSchema,
	StudentAnswerSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient, auth } from "@clerk/nextjs/server";
import {
	triggerAnnouncementNotification,
	triggerExamScheduledNotification,
	triggerResultPublishedNotification,
	triggerAssignmentCreatedNotification,
	triggerAttendanceAbsentNotification,
	triggerMCQTestAvailableNotification,
	triggerMCQResultReadyNotification,
	triggerBadgeEarnedNotification,
	triggerEventCreatedNotification,
	triggerFeeAssignedNotification,
	triggerTeacherRatingNotification,
} from "./notificationActions";

type CurrentState = { success: boolean; error: boolean; message?: string };

export const createSubject = async (
	currentState: CurrentState,
	data: SubjectSchema
) => {
	try {
		await prisma.subject.create({
			data: {
				name: data.name,
				teachers: {
					connect: data.teachers.map((teacherId) => ({ id: teacherId })),
				},
			},
		});

		// revalidatePath("/list/subjects");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateSubject = async (
	currentState: CurrentState,
	data: SubjectSchema
) => {
	try {
		await prisma.subject.update({
			where: {
				id: data.id,
			},
			data: {
				name: data.name,
				teachers: {
					set: data.teachers.map((teacherId) => ({ id: teacherId })),
				},
			},
		});

		// revalidatePath("/list/subjects");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteSubject = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.subject.delete({
			where: {
				id: parseInt(id),
			},
		});

		// revalidatePath("/list/subjects");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const createClass = async (
	currentState: CurrentState,
	data: ClassSchema
) => {
	try {
		await prisma.class.create({
			data,
		});

		// revalidatePath("/list/class");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateClass = async (
	currentState: CurrentState,
	data: ClassSchema
) => {
	try {
		await prisma.class.update({
			where: {
				id: data.id,
			},
			data,
		});

		// revalidatePath("/list/class");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteClass = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.class.delete({
			where: {
				id: parseInt(id),
			},
		});

		// revalidatePath("/list/class");
		return { success: true, error: false };
	} catch (err: any) {
		console.log(err);

		// Check if it's a foreign key constraint error
		if (
			err.code === "P2003" ||
			err.message?.includes("foreign key constraint")
		) {
			return {
				success: false,
				error: true,
				message:
					"Cannot delete this class because it has related students, lessons, events, or announcements. Please delete or reassign those first.",
			};
		}

		return {
			success: false,
			error: true,
			message: "Failed to delete class. Please try again.",
		};
	}
};

export const createTeacher = async (
	currentState: CurrentState,
	data: TeacherSchema
) => {
	try {
		const user = await clerkClient().users.createUser({
			username: data.username,
			password: data.password,
			firstName: data.name,
			lastName: data.surname,
			publicMetadata: { role: "teacher" },
		});

		await prisma.teacher.create({
			data: {
				id: user.id,
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email || null,
				phone: data.phone || null,
				address: data.address,
				img: data.img || null,
				bloodType: data.bloodType,
				sex: data.sex,
				birthday: data.birthday,
				subjects: {
					connect: data.subjects?.map((subjectId: string) => ({
						id: parseInt(subjectId),
					})),
				},
			},
		});

		// revalidatePath("/list/teachers");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateTeacher = async (
	currentState: CurrentState,
	data: TeacherSchema
) => {
	if (!data.id) {
		return { success: false, error: true };
	}
	try {
		const user = await clerkClient().users.updateUser(data.id, {
			username: data.username,
			...(data.password !== "" && { password: data.password }),
			firstName: data.name,
			lastName: data.surname,
		});

		await prisma.teacher.update({
			where: {
				id: data.id,
			},
			data: {
				...(data.password !== "" && { password: data.password }),
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email || null,
				phone: data.phone || null,
				address: data.address,
				img: data.img || null,
				bloodType: data.bloodType,
				sex: data.sex,
				birthday: data.birthday,
				subjects: {
					set: data.subjects?.map((subjectId: string) => ({
						id: parseInt(subjectId),
					})),
				},
			},
		});
		// revalidatePath("/list/teachers");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteTeacher = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await clerkClient().users.deleteUser(id);

		await prisma.teacher.delete({
			where: {
				id: id,
			},
		});

		// revalidatePath("/list/teachers");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const createStudent = async (
	currentState: CurrentState,
	data: StudentSchema
) => {
	console.log(data);
	try {
		const classItem = await prisma.class.findUnique({
			where: { id: data.classId },
			include: { _count: { select: { students: true } } },
		});

		if (classItem && classItem.capacity === classItem._count.students) {
			return {
				success: false,
				error: true,
				message: `Class is full. Maximum capacity of ${classItem.capacity} students reached.`,
			};
		}

		const user = await clerkClient().users.createUser({
			username: data.username,
			password: data.password,
			firstName: data.name,
			lastName: data.surname,
			publicMetadata: { role: "student" },
		});

		await prisma.student.create({
			data: {
				id: user.id,
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email || null,
				phone: data.phone || null,
				address: data.address,
				img: data.img || null,
				bloodType: data.bloodType,
				sex: data.sex,
				birthday: data.birthday,
				gradeId: data.gradeId,
				classId: data.classId,
				parentId: data.parentId,
			},
		});

		// revalidatePath("/list/students");
		return { success: true, error: false };
	} catch (err: any) {
		console.log(err);
		// Check if it's a Clerk error with specific error codes
		if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
			const clerkError = err.errors[0];
			return {
				success: false,
				error: true,
				message:
					clerkError.longMessage || clerkError.message || "An error occurred",
			};
		}
		return {
			success: false,
			error: true,
			message: "An error occurred while creating the student",
		};
	}
};

export const updateStudent = async (
	currentState: CurrentState,
	data: StudentSchema
) => {
	if (!data.id) {
		return { success: false, error: true };
	}
	try {
		const user = await clerkClient().users.updateUser(data.id, {
			username: data.username,
			...(data.password !== "" && { password: data.password }),
			firstName: data.name,
			lastName: data.surname,
		});

		await prisma.student.update({
			where: {
				id: data.id,
			},
			data: {
				...(data.password !== "" && { password: data.password }),
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email || null,
				phone: data.phone || null,
				address: data.address,
				img: data.img || null,
				bloodType: data.bloodType,
				sex: data.sex,
				birthday: data.birthday,
				gradeId: data.gradeId,
				classId: data.classId,
				parentId: data.parentId,
			},
		});
		// revalidatePath("/list/students");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteStudent = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await clerkClient().users.deleteUser(id);

		await prisma.student.delete({
			where: {
				id: id,
			},
		});

		// revalidatePath("/list/students");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const createExam = async (
	currentState: CurrentState,
	data: ExamSchema
) => {
	// const { userId, sessionClaims } = auth();
	// const role = (sessionClaims?.metadata as { role?: string })?.role;

	try {
		// if (role === "teacher") {
		//   const teacherLesson = await prisma.lesson.findFirst({
		//     where: {
		//       teacherId: userId!,
		//       id: data.lessonId,
		//     },
		//   });

		//   if (!teacherLesson) {
		//     return { success: false, error: true };
		//   }
		// }

		const exam = await prisma.exam.create({
			data: {
				title: data.title,
				startTime: data.startTime,
				endTime: data.endTime,
				lessonId: data.lessonId,
			},
		});

		// 🔔 Trigger automatic notification
		await triggerExamScheduledNotification(exam.id);

		// revalidatePath("/list/subjects");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateExam = async (
	currentState: CurrentState,
	data: ExamSchema
) => {
	// const { userId, sessionClaims } = auth();
	// const role = (sessionClaims?.metadata as { role?: string })?.role;

	try {
		// if (role === "teacher") {
		//   const teacherLesson = await prisma.lesson.findFirst({
		//     where: {
		//       teacherId: userId!,
		//       id: data.lessonId,
		//     },
		//   });

		//   if (!teacherLesson) {
		//     return { success: false, error: true };
		//   }
		// }

		await prisma.exam.update({
			where: {
				id: data.id,
			},
			data: {
				title: data.title,
				startTime: data.startTime,
				endTime: data.endTime,
				lessonId: data.lessonId,
			},
		});

		// revalidatePath("/list/subjects");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteExam = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;

	// const { userId, sessionClaims } = auth();
	// const role = (sessionClaims?.metadata as { role?: string })?.role;

	try {
		await prisma.exam.delete({
			where: {
				id: parseInt(id),
				// ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
			},
		});

		// revalidatePath("/list/subjects");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// PARENT ACTIONS

export const createParent = async (
	currentState: CurrentState,
	data: ParentSchema
) => {
	try {
		const user = await clerkClient().users.createUser({
			username: data.username,
			password: data.password,
			firstName: data.name,
			lastName: data.surname,
			publicMetadata: { role: "parent" },
		});

		await prisma.parent.create({
			data: {
				id: user.id,
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email || null,
				phone: data.phone,
				address: data.address,
			},
		});

		// revalidatePath("/list/parents");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateParent = async (
	currentState: CurrentState,
	data: ParentSchema
) => {
	if (!data.id) {
		return { success: false, error: true };
	}
	try {
		const user = await clerkClient().users.updateUser(data.id, {
			username: data.username,
			...(data.password !== "" && { password: data.password }),
			firstName: data.name,
			lastName: data.surname,
		});

		await prisma.parent.update({
			where: {
				id: data.id,
			},
			data: {
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email || null,
				phone: data.phone,
				address: data.address,
			},
		});
		// revalidatePath("/list/parents");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteParent = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await clerkClient().users.deleteUser(id);

		await prisma.parent.delete({
			where: {
				id: id,
			},
		});

		// revalidatePath("/list/parents");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// LESSON ACTIONS

export const createLesson = async (
	currentState: CurrentState,
	data: LessonSchema
) => {
	try {
		await prisma.lesson.create({
			data: {
				name: data.name,
				day: data.day,
				startTime: data.startTime,
				endTime: data.endTime,
				subjectId: data.subjectId,
				classId: data.classId,
				teacherId: data.teacherId,
			},
		});

		// revalidatePath("/list/lessons");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateLesson = async (
	currentState: CurrentState,
	data: LessonSchema
) => {
	try {
		await prisma.lesson.update({
			where: {
				id: data.id,
			},
			data: {
				name: data.name,
				day: data.day,
				startTime: data.startTime,
				endTime: data.endTime,
				subjectId: data.subjectId,
				classId: data.classId,
				teacherId: data.teacherId,
			},
		});

		// revalidatePath("/list/lessons");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteLesson = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.lesson.delete({
			where: {
				id: parseInt(id),
			},
		});

		// revalidatePath("/list/lessons");
		return { success: true, error: false };
	} catch (err: any) {
		console.log(err);

		// Check if it's a foreign key constraint error
		if (
			err.code === "P2003" ||
			err.message?.includes("foreign key constraint")
		) {
			return {
				success: false,
				error: true,
				message:
					"Cannot delete this lesson because it has related exams, assignments, or attendance records. Please delete those first.",
			};
		}

		return {
			success: false,
			error: true,
			message: "Failed to delete lesson. Please try again.",
		};
	}
};

// LESSON RECURRENCE ACTIONS

// Helper function to get day name from date
const getDayFromDate = (date: Date): string => {
	const dayMap = [
		"SUNDAY",
		"MONDAY",
		"TUESDAY",
		"WEDNESDAY",
		"THURSDAY",
		"FRIDAY",
		"SATURDAY",
	];
	return dayMap[date.getDay()];
};

// Helper function to check if day is valid (weekday)
const isValidSchoolDay = (day: string): boolean => {
	return ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].includes(day);
};

export const duplicateLessonForDate = async (
	currentState: CurrentState,
	data: FormData
) => {
	const lessonId = data.get("lessonId") as string;
	const newDate = data.get("newDate") as string;

	try {
		// Fetch the original lesson
		const originalLesson = await prisma.lesson.findUnique({
			where: { id: parseInt(lessonId) },
		});

		if (!originalLesson) {
			return {
				success: false,
				error: true,
				message: "Original lesson not found",
			};
		}

		// Create new lesson with the same data but different date
		const newStartTime = new Date(
			newDate + "T" + originalLesson.startTime.toISOString().split("T")[1]
		);
		const newEndTime = new Date(
			newDate + "T" + originalLesson.endTime.toISOString().split("T")[1]
		);

		// Get the day of the week from the new date
		const newDay = getDayFromDate(newStartTime);

		// Check if it's a valid school day (Monday-Friday)
		if (!isValidSchoolDay(newDay)) {
			return {
				success: false,
				error: true,
				message:
					"Cannot create lesson on weekends. Please select a weekday (Monday-Friday).",
			};
		}

		await prisma.lesson.create({
			data: {
				name: originalLesson.name,
				day: newDay as any,
				startTime: newStartTime,
				endTime: newEndTime,
				subjectId: originalLesson.subjectId,
				classId: originalLesson.classId,
				teacherId: originalLesson.teacherId,
				parentLessonId: parseInt(lessonId),
			},
		});

		// revalidatePath("/list/lessons");
		return {
			success: true,
			error: false,
			message: "Lesson duplicated successfully for the new date!",
		};
	} catch (err) {
		console.log(err);
		return {
			success: false,
			error: true,
			message: "Failed to duplicate lesson. Please try again.",
		};
	}
};

export const toggleLessonRecurrence = async (
	currentState: CurrentState,
	data: FormData
) => {
	const lessonId = data.get("lessonId") as string;
	const isRecurring = data.get("isRecurring") === "true";
	const recurrenceEndDate = data.get("recurrenceEndDate") as string;

	try {
		await prisma.lesson.update({
			where: { id: parseInt(lessonId) },
			data: {
				isRecurring,
				recurrenceEndDate: recurrenceEndDate
					? new Date(recurrenceEndDate)
					: null,
			},
		});

		// revalidatePath("/list/lessons");
		return {
			success: true,
			error: false,
			message: `Auto-repeat ${
				isRecurring ? "enabled" : "disabled"
			} successfully!`,
		};
	} catch (err) {
		console.log(err);
		return {
			success: false,
			error: true,
			message: "Failed to update recurrence settings. Please try again.",
		};
	}
};

export const generateRecurringLessons = async (
	currentState: CurrentState,
	data: FormData
) => {
	const lessonId = data.get("lessonId") as string;

	try {
		const lesson = await prisma.lesson.findUnique({
			where: { id: parseInt(lessonId) },
		});

		if (!lesson || !lesson.isRecurring) {
			return {
				success: false,
				error: true,
				message: "Lesson not found or recurrence not enabled",
			};
		}

		const today = new Date();
		const endDate =
			lesson.recurrenceEndDate ||
			new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default

		const lessonsToCreate = [];
		let currentDate = new Date(lesson.startTime);
		currentDate.setDate(currentDate.getDate() + 7); // Start from next week

		while (currentDate <= endDate) {
			// Check if lesson already exists for this date
			const existingLesson = await prisma.lesson.findFirst({
				where: {
					parentLessonId: parseInt(lessonId),
					startTime: {
						gte: new Date(currentDate.setHours(0, 0, 0, 0)),
						lt: new Date(currentDate.setHours(23, 59, 59, 999)),
					},
				},
			});

			if (!existingLesson) {
				const newStartTime = new Date(currentDate);
				newStartTime.setHours(lesson.startTime.getHours());
				newStartTime.setMinutes(lesson.startTime.getMinutes());

				const newEndTime = new Date(currentDate);
				newEndTime.setHours(lesson.endTime.getHours());
				newEndTime.setMinutes(lesson.endTime.getMinutes());

				// Get the day of the week from the new date
				const newDay = getDayFromDate(newStartTime);

				// Only create lesson if it's a weekday
				if (isValidSchoolDay(newDay)) {
					lessonsToCreate.push({
						name: lesson.name,
						day: newDay as any,
						startTime: newStartTime,
						endTime: newEndTime,
						subjectId: lesson.subjectId,
						classId: lesson.classId,
						teacherId: lesson.teacherId,
						parentLessonId: parseInt(lessonId),
					});
				}
			}

			currentDate.setDate(currentDate.getDate() + 7); // Move to next week
		}

		if (lessonsToCreate.length > 0) {
			await prisma.lesson.createMany({
				data: lessonsToCreate,
			});
		}

		// revalidatePath("/list/lessons");
		return {
			success: true,
			error: false,
			message: `${lessonsToCreate.length} recurring lessons generated successfully!`,
		};
	} catch (err) {
		console.log(err);
		return {
			success: false,
			error: true,
			message: "Failed to generate recurring lessons. Please try again.",
		};
	}
};

// ASSIGNMENT ACTIONS

export const createAssignment = async (
	currentState: CurrentState,
	data: AssignmentSchema
) => {
	try {
		const assignment = await prisma.assignment.create({
			data: {
				title: data.title,
				startDate: data.startDate,
				dueDate: data.dueDate,
				lessonId: data.lessonId,
			},
		});

		// 🔔 Trigger automatic notification
		await triggerAssignmentCreatedNotification(assignment.id);

		// revalidatePath("/list/assignments");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateAssignment = async (
	currentState: CurrentState,
	data: AssignmentSchema
) => {
	try {
		await prisma.assignment.update({
			where: {
				id: data.id,
			},
			data: {
				title: data.title,
				startDate: data.startDate,
				dueDate: data.dueDate,
				lesson: {
					connect: { id: data.lessonId },
				},
			} as any, // Temporarily bypassing TypeScript cache issue
		});

		// revalidatePath("/list/assignments");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteAssignment = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.assignment.delete({
			where: {
				id: parseInt(id),
			},
		});

		// revalidatePath("/list/assignments");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// RESULT ACTIONS

export const createResult = async (
	currentState: CurrentState,
	data: ResultSchema
) => {
	try {
		const result = await prisma.result.create({
			data: {
				score: data.score,
				...(data.examId && { examId: data.examId }),
				...(data.assignmentId && { assignmentId: data.assignmentId }),
				studentId: data.studentId,
			},
		});

		// 🔔 Trigger automatic notification
		await triggerResultPublishedNotification(result.id);

		// revalidatePath("/list/results");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateResult = async (
	currentState: CurrentState,
	data: ResultSchema
) => {
	try {
		await prisma.result.update({
			where: {
				id: data.id,
			},
			data: {
				score: data.score,
				...(data.examId && { examId: data.examId }),
				...(data.assignmentId && { assignmentId: data.assignmentId }),
				studentId: data.studentId,
			},
		});

		// revalidatePath("/list/results");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteResult = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.result.delete({
			where: {
				id: parseInt(id),
			},
		});

		// revalidatePath("/list/results");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// ATTENDANCE ACTIONS

export const createAttendance = async (
	currentState: CurrentState,
	data: AttendanceSchema
) => {
	try {
		const attendance = await prisma.attendance.create({
			data: {
				date: data.date,
				present: data.present,
				studentId: data.studentId,
				...(data.lessonId && { lessonId: data.lessonId }),
			} as any,
		});

		// 🔔 Trigger notification if student is absent
		if (!data.present) {
			await triggerAttendanceAbsentNotification(attendance.id);
		}

		// revalidatePath("/list/attendance");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateAttendance = async (
	currentState: CurrentState,
	data: AttendanceSchema
) => {
	try {
		await prisma.attendance.update({
			where: {
				id: data.id,
			},
			data: {
				date: data.date,
				present: data.present,
				studentId: data.studentId,
				...(data.lessonId && { lessonId: data.lessonId }),
			} as any,
		});

		// revalidatePath("/list/attendance");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteAttendance = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.attendance.delete({
			where: {
				id: parseInt(id),
			},
		});

		// revalidatePath("/list/attendance");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// EVENT ACTIONS

export const createEvent = async (
	currentState: CurrentState,
	data: EventSchema
) => {
	try {
		const event = await prisma.event.create({
			data: {
				title: data.title,
				description: data.description,
				startTime: data.startTime,
				endTime: data.endTime,
				...(data.classId && { classId: data.classId }),
			},
		});

		// 🔔 Trigger automatic notification
		await triggerEventCreatedNotification(event.id);

		// revalidatePath("/list/events");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateEvent = async (
	currentState: CurrentState,
	data: EventSchema
) => {
	try {
		await prisma.event.update({
			where: {
				id: data.id,
			},
			data: {
				title: data.title,
				description: data.description,
				startTime: data.startTime,
				endTime: data.endTime,
				...(data.classId && { classId: data.classId }),
			},
		});

		// revalidatePath("/list/events");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteEvent = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.event.delete({
			where: {
				id: parseInt(id),
			},
		});

		// revalidatePath("/list/events");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// ANNOUNCEMENT ACTIONS

export const createAnnouncement = async (
	currentState: CurrentState,
	data: AnnouncementSchema
) => {
	try {
		const announcement = await prisma.announcement.create({
			data: {
				title: data.title,
				description: data.description,
				date: data.date,
				...(data.classId && { classId: data.classId }),
			},
		});

		// 🔔 AUTOMATICALLY SEND NOTIFICATION (both email + web-push)
		const { triggerAnnouncementNotification } = await import(
			"@/lib/notificationActions"
		);
		await triggerAnnouncementNotification(announcement.id);

		// revalidatePath("/list/announcements");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateAnnouncement = async (
	currentState: CurrentState,
	data: AnnouncementSchema
) => {
	try {
		const announcement = await prisma.announcement.update({
			where: {
				id: data.id,
			},
			data: {
				title: data.title,
				description: data.description,
				date: data.date,
				...(data.classId && { classId: data.classId }),
			},
		});

		// 🔔 SEND NOTIFICATION FOR UPDATED ANNOUNCEMENT
		const { triggerAnnouncementNotification } = await import(
			"@/lib/notificationActions"
		);
		await triggerAnnouncementNotification(announcement.id);

		// revalidatePath("/list/announcements");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteAnnouncement = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.announcement.delete({
			where: {
				id: parseInt(id),
			},
		});

		// revalidatePath("/list/announcements");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const createBulkAttendance = async (
	currentState: CurrentState,
	formData: FormData
) => {
	try {
		const date = new Date(formData.get("date") as string);
		// Normalize to start of day to avoid time comparison issues
		date.setHours(0, 0, 0, 0);

		const classId = parseInt(formData.get("classId") as string);
		const attendances = JSON.parse(formData.get("attendances") as string) as {
			studentId: string;
			present: boolean;
		}[];

		// Check if attendance already exists for this date and class
		const studentIds = attendances.map((a) => a.studentId);

		const existingRecords = await prisma.attendance.findMany({
			where: {
				studentId: { in: studentIds },
				date: {
					gte: date,
					lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Same day
				},
			},
		});

		if (existingRecords.length > 0) {
			// Update existing records instead of creating duplicates
			await prisma.$transaction(
				attendances.map((attendance) => {
					const existing = existingRecords.find(
						(r) => r.studentId === attendance.studentId
					);

					if (existing) {
						// Update existing record
						return prisma.attendance.update({
							where: { id: existing.id },
							data: { present: attendance.present },
						});
					} else {
						// Create new record
						return prisma.attendance.create({
							data: {
								date: date,
								present: attendance.present,
								studentId: attendance.studentId,
							} as any,
						});
					}
				})
			);
		} else {
			// Create all new records
			await prisma.attendance.createMany({
				data: attendances.map((attendance) => ({
					date: date,
					present: attendance.present,
					studentId: attendance.studentId,
				})) as any,
			});
		}

		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return {
			success: false,
			error: true,
			message: "Failed to record attendance",
		};
	}
};

export const createFaceRecognitionAttendance = async (
	studentIds: string[],
	classId: number,
	date?: Date
) => {
	try {
		const attendanceDate = date || new Date();
		// Normalize to start of day
		attendanceDate.setHours(0, 0, 0, 0);

		// Get all students in the class
		const allStudents = await prisma.student.findMany({
			where: { classId },
			select: { id: true },
		});

		const attendances = allStudents.map((student) => ({
			studentId: student.id,
			present: studentIds.includes(student.id),
		}));

		// Check existing records
		const existingRecords = await prisma.attendance.findMany({
			where: {
				studentId: { in: allStudents.map((s) => s.id) },
				date: {
					gte: attendanceDate,
					lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
				},
			},
		});

		if (existingRecords.length > 0) {
			// Update existing
			await prisma.$transaction(
				attendances.map((attendance) => {
					const existing = existingRecords.find(
						(r) => r.studentId === attendance.studentId
					);

					if (existing) {
						return prisma.attendance.update({
							where: { id: existing.id },
							data: { present: attendance.present },
						});
					} else {
						return prisma.attendance.create({
							data: {
								date: attendanceDate,
								present: attendance.present,
								studentId: attendance.studentId,
							} as any,
						});
					}
				})
			);
		} else {
			// Create all new
			await prisma.attendance.createMany({
				data: attendances.map((attendance) => ({
					date: attendanceDate,
					present: attendance.present,
					studentId: attendance.studentId,
				})) as any,
			});
		}

		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return {
			success: false,
			error: true,
			message: "Failed to record face recognition attendance",
		};
	}
};

// Teacher Attendance
export const createTeacherAttendance = async (
	teacherId: string,
	date: Date,
	locationId: number,
	latitude: number,
	longitude: number,
	livenessVerified: boolean
) => {
	try {
		// Normalize date to start of day
		const attendanceDate = new Date(date);
		attendanceDate.setHours(0, 0, 0, 0);

		// Check if attendance already exists for this date
		const existingAttendance = await prisma.teacherAttendance.findUnique({
			where: {
				teacherId_date: {
					teacherId,
					date: attendanceDate,
				},
			},
		});

		if (existingAttendance) {
			// Prevent duplicate attendance marking
			throw new Error("Attendance already marked for today");
		}

		// Create new attendance
		await prisma.teacherAttendance.create({
			data: {
				teacherId,
				date: attendanceDate,
				present: true,
				checkInTime: new Date(),
				locationId,
				latitude,
				longitude,
				livenessVerified,
			},
		});

		return {
			success: true,
			error: false,
			message: "Attendance marked successfully",
		};
	} catch (err) {
		console.log(err);
		return {
			success: false,
			error: true,
			message: "Failed to mark teacher attendance",
		};
	}
};

// Location CRUD
type LocationState = {
	success: boolean;
	error: boolean;
	message?: string;
};

export const createLocation = async (
	currentState: LocationState,
	data: LocationSchema
) => {
	try {
		await prisma.location.create({
			data: {
				name: data.name,
				address: data.address || null,
				latitude: data.latitude,
				longitude: data.longitude,
				radius: data.radius,
				isActive: data.isActive,
			},
		});

		// revalidatePath("/list/locations");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateLocation = async (
	currentState: LocationState,
	data: LocationSchema
) => {
	try {
		await prisma.location.update({
			where: {
				id: data.id,
			},
			data: {
				name: data.name,
				address: data.address || null,
				latitude: data.latitude,
				longitude: data.longitude,
				radius: data.radius,
				isActive: data.isActive,
			},
		});

		// revalidatePath("/list/locations");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteLocation = async (
	currentState: LocationState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.location.delete({
			where: {
				id: parseInt(id),
			},
		});

		// revalidatePath("/list/locations");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// ============================================
// MCQ SYSTEM ACTIONS
// ============================================

type MCQState = {
	success: boolean;
	error: boolean;
	message?: string;
};

// MCQ Test CRUD
export const createMCQTest = async (
	currentState: MCQState,
	data: MCQTestSchema
) => {
	try {
		const test = await prisma.mCQTest.create({
			data: {
				title: data.title,
				description: data.description || null,
				subjectId: data.subjectId || null,
				classId: data.classId || null,
				teacherId: data.teacherId,
			},
		});

		// 🔔 Trigger automatic notification
		await triggerMCQTestAvailableNotification(test.id);

		// revalidatePath("/list/mcq-tests");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateMCQTest = async (
	currentState: MCQState,
	data: MCQTestSchema
) => {
	if (!data.id) {
		return { success: false, error: true, message: "Test ID is required!" };
	}

	try {
		await prisma.mCQTest.update({
			where: {
				id: data.id,
			},
			data: {
				title: data.title,
				description: data.description || null,
				subjectId: data.subjectId || null,
				classId: data.classId || null,
				teacherId: data.teacherId,
			},
		});

		// revalidatePath("/list/mcq-tests");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteMCQTest = async (currentState: MCQState, data: FormData) => {
	const id = data.get("id") as string;
	try {
		await prisma.mCQTest.delete({
			where: {
				id: id,
			},
		});

		// revalidatePath("/list/mcq-tests");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// MCQ Question CRUD
export const createMCQQuestion = async (
	currentState: MCQState,
	data: MCQQuestionSchema
) => {
	try {
		await prisma.mCQQuestion.create({
			data: {
				testId: data.testId,
				question: data.question,
				answer: data.answer || "",
				options: data.options || [],
				questionType: data.questionType,
				explanation: data.explanation || null,
				orderIndex: data.orderIndex,
			},
		});

		// revalidatePath(`/teacher/mcq-tests/${data.testId}`);
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateMCQQuestion = async (
	currentState: MCQState,
	data: MCQQuestionSchema
) => {
	if (!data.id) {
		return { success: false, error: true, message: "Question ID is required!" };
	}

	try {
		await prisma.mCQQuestion.update({
			where: {
				id: data.id,
			},
			data: {
				question: data.question,
				answer: data.answer || "",
				options: data.options || [],
				questionType: data.questionType,
				explanation: data.explanation || null,
				orderIndex: data.orderIndex,
			},
		});

		// revalidatePath(`/teacher/mcq-tests/${data.testId}`);
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const deleteMCQQuestion = async (
	currentState: MCQState,
	data: FormData
) => {
	const id = data.get("id") as string;
	try {
		await prisma.mCQQuestion.delete({
			where: {
				id: id,
			},
		});

		// revalidatePath route after deletion
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// MCQ Attempt Actions
export const startMCQAttempt = async (
	currentState: MCQState,
	data: MCQAttemptSchema
) => {
	try {
		const attempt = await prisma.mCQAttempt.create({
			data: {
				testId: data.testId,
				studentId: data.studentId,
				totalQuestions: data.totalQuestions,
			},
		});

		return {
			success: true,
			error: false,
			message: attempt.id, // Return attempt ID for tracking
		};
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const submitMCQAnswer = async (
	currentState: MCQState,
	data: StudentAnswerSchema
) => {
	try {
		// Get the question to check the correct answer
		const question = await prisma.mCQQuestion.findUnique({
			where: { id: data.questionId },
		});

		if (!question) {
			return {
				success: false,
				error: true,
				message: "Question not found!",
			};
		}

		// For OPEN_ENDED questions, save answer without grading (requires manual grading)
		if (question.questionType === "OPEN_ENDED") {
			await prisma.studentAnswer.create({
				data: {
					attemptId: data.attemptId,
					questionId: data.questionId,
					userAnswer: data.userAnswer,
					isCorrect: null, // Will be graded manually by teacher
				},
			});

			return {
				success: true,
				error: false,
				message: "Answer submitted! Waiting for teacher review.",
			};
		}

		// For MULTIPLE_CHOICE and TRUE_FALSE, auto-grade
		const isCorrect =
			data.userAnswer.trim().toLowerCase() ===
			question.answer.trim().toLowerCase();

		// Save the student's answer
		await prisma.studentAnswer.create({
			data: {
				attemptId: data.attemptId,
				questionId: data.questionId,
				userAnswer: data.userAnswer,
				isCorrect: isCorrect,
			},
		});

		// Update attempt's correct answer count if correct
		if (isCorrect) {
			await prisma.mCQAttempt.update({
				where: { id: data.attemptId },
				data: {
					correctAnswers: {
						increment: 1,
					},
				},
			});
		}

		return {
			success: true,
			error: false,
			message: isCorrect ? "Correct!" : "Incorrect!",
		};
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const completeMCQAttempt = async (attemptId: string) => {
	try {
		const attempt = await prisma.mCQAttempt.findUnique({
			where: { id: attemptId },
		});

		if (!attempt) {
			return {
				success: false,
				error: true,
				message: "Attempt not found!",
			};
		}

		// Calculate base score percentage
		let score = (attempt.correctAnswers / attempt.totalQuestions) * 100;

		// Apply cheating penalty if any violations occurred
		if (attempt.finalPenaltyPercentage > 0) {
			const penaltyAmount = (score * attempt.finalPenaltyPercentage) / 100;
			score = Math.max(0, score - penaltyAmount); // Ensure score doesn't go negative
		}

		// If terminated for cheating, cap maximum score at 50%
		if (attempt.isTerminatedForCheating) {
			score = Math.min(score, 50);
		}

		await prisma.mCQAttempt.update({
			where: { id: attemptId },
			data: {
				completedAt: new Date(),
				score: score,
			},
		});

		// 🔔 Trigger automatic notification
		await triggerMCQResultReadyNotification(attemptId);

		// 🎖️ Auto-award/remove badges based on new performance
		try {
			await autoAwardBadges();
		} catch (badgeError) {
			console.error("Error auto-awarding badges:", badgeError);
			// Don't fail test completion if badge award fails
		}

		// revalidatePath(`/student/mcq-tests/${attempt.testId}`);
		return {
			success: true,
			error: false,
			message: `Test completed! Score: ${score.toFixed(2)}%`,
		};
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// ===== ANTI-CHEATING SYSTEM =====

type ViolationType =
	| "TAB_SWITCH"
	| "WINDOW_BLUR"
	| "RIGHT_CLICK"
	| "COPY_PASTE"
	| "DEVTOOLS"
	| "EXIT_FULLSCREEN";

export const recordCheatingViolation = async (
	currentState: MCQState,
	data: {
		attemptId: string;
		violationType: ViolationType;
		timestamp: string;
	}
) => {
	try {
		const attempt = await prisma.mCQAttempt.findUnique({
			where: { id: data.attemptId },
			include: {
				student: {
					select: {
						id: true,
						cheatingSuspensions: {
							where: { isActive: true },
							select: { id: true },
						},
					},
				},
			},
		});

		if (!attempt) {
			return { success: false, error: true, message: "Attempt not found!" };
		}

		// Get current violations from JSON
		const currentViolations = (attempt.violationDetails as any[]) || [];
		const newViolationCount = attempt.cheatingViolations + 1;

		// Add new violation
		currentViolations.push({
			type: data.violationType,
			timestamp: data.timestamp,
			violationNumber: newViolationCount,
		});

		// Calculate penalty based on violation count
		let penalty = 0;
		if (newViolationCount === 1) penalty = 10;
		else if (newViolationCount === 2) penalty = 25;
		else if (newViolationCount >= 3) penalty = 50;

		// Update attempt with violation data
		await prisma.mCQAttempt.update({
			where: { id: data.attemptId },
			data: {
				cheatingViolations: newViolationCount,
				violationDetails: currentViolations,
				finalPenaltyPercentage: penalty,
				isTerminatedForCheating: newViolationCount >= 3,
			},
		});

		// Apply suspension for 4+ total violations across all tests
		if (newViolationCount >= 3) {
			// Check student's total violation history
			const allAttempts = await prisma.mCQAttempt.findMany({
				where: { studentId: attempt.studentId },
				select: { cheatingViolations: true },
			});

			const totalLifetimeViolations = allAttempts.reduce(
				(sum, a) => sum + a.cheatingViolations,
				0
			);

			// Issue 7-day suspension for 4+ total violations
			if (totalLifetimeViolations >= 4) {
				const suspendedUntil = new Date();
				suspendedUntil.setDate(suspendedUntil.getDate() + 7);

				await prisma.cheatingSuspension.create({
					data: {
						studentId: attempt.studentId,
						reason: `Repeated cheating violations detected across multiple tests (${totalLifetimeViolations} total violations)`,
						violationCount: totalLifetimeViolations,
						suspendedUntil,
					},
				});

				// Remove from leaderboard
				await prisma.leaderboardSnapshot.deleteMany({
					where: { studentId: attempt.studentId },
				});
			}
		}

		return {
			success: true,
			error: false,
			message: `Violation recorded. Count: ${newViolationCount}`,
		};
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// Check if student is suspended
export const checkStudentSuspension = async (studentId: string) => {
	try {
		const activeSuspension = await prisma.cheatingSuspension.findFirst({
			where: {
				studentId,
				isActive: true,
				suspendedUntil: { gte: new Date() },
			},
		});

		return {
			isSuspended: !!activeSuspension,
			suspension: activeSuspension,
		};
	} catch (err) {
		console.log(err);
		return { isSuspended: false, suspension: null };
	}
};

// ============= PENALTY REMOVAL SYSTEM =============

// Automatically check if student qualifies for penalty reduction
export const checkPenaltyReductionEligibility = async (studentId: string) => {
	try {
		// Get student's violation history
		const allAttempts = await prisma.mCQAttempt.findMany({
			where: { studentId },
			orderBy: { completedAt: "desc" },
			select: {
				cheatingViolations: true,
				completedAt: true,
			},
		});

		const totalViolations = allAttempts.reduce(
			(sum, a) => sum + a.cheatingViolations,
			0
		);

		// Find last violation date
		const attemptsWithViolations = allAttempts.filter(
			(a) => a.cheatingViolations > 0
		);
		const lastViolationDate = attemptsWithViolations[0]?.completedAt;

		// Count clean tests (after last violation)
		const cleanTests = allAttempts.filter(
			(a) =>
				a.cheatingViolations === 0 &&
				(!lastViolationDate ||
					(a.completedAt && a.completedAt > lastViolationDate))
		);

		// Calculate days without violation
		const daysWithoutViolation = lastViolationDate
			? Math.floor(
					(new Date().getTime() - new Date(lastViolationDate).getTime()) /
						(1000 * 60 * 60 * 24)
			  )
			: 999; // Very high if no violations

		// Calculate good behavior score (0-100)
		const goodBehaviorScore =
			Math.min(cleanTests.length * 10, 50) + // Up to 50 points for clean tests
			Math.min(daysWithoutViolation * 2, 50); // Up to 50 points for days

		// Eligibility criteria:
		// Option 1: 5+ clean tests AND 30+ days without violation
		// Option 2: 10+ clean tests
		// Option 3: 60+ days without violation
		const isEligible =
			(cleanTests.length >= 5 && daysWithoutViolation >= 30) ||
			cleanTests.length >= 10 ||
			daysWithoutViolation >= 60;

		return {
			isEligible,
			totalViolations,
			cleanTestsCompleted: cleanTests.length,
			daysWithoutViolation,
			goodBehaviorScore,
			lastViolationDate,
			canReduceBy: isEligible
				? Math.min(Math.floor(totalViolations / 2), 2)
				: 0, // Reduce by half, max 2
		};
	} catch (err) {
		console.log(err);
		return {
			isEligible: false,
			totalViolations: 0,
			cleanTestsCompleted: 0,
			daysWithoutViolation: 0,
			goodBehaviorScore: 0,
			canReduceBy: 0,
		};
	}
};

// Apply automatic penalty reduction for good behavior
export const applyPenaltyReduction = async (
	currentState: { success: boolean; error: boolean },
	data: {
		studentId: string;
		adminId: string;
		reason: string;
		violationsToRemove: number;
	}
) => {
	try {
		// Verify eligibility
		const eligibility = await checkPenaltyReductionEligibility(data.studentId);

		if (!eligibility.isEligible) {
			return {
				success: false,
				error: true,
				message: "Student does not qualify for penalty reduction yet!",
			};
		}

		// Get active suspension if any
		const activeSuspension = await prisma.cheatingSuspension.findFirst({
			where: {
				studentId: data.studentId,
				isActive: true,
			},
			orderBy: { createdAt: "desc" },
		});

		// Record the penalty reduction
		await prisma.penaltyReduction.create({
			data: {
				studentId: data.studentId,
				originalSuspensionId: activeSuspension?.id,
				violationsRemoved: data.violationsToRemove,
				reason: data.reason,
				reducedBy: data.adminId,
				cleanTestsCompleted: eligibility.cleanTestsCompleted,
				daysWithoutViolation: eligibility.daysWithoutViolation,
				goodBehaviorScore: eligibility.goodBehaviorScore,
			},
		});

		// Lift active suspension if exists
		if (activeSuspension) {
			await prisma.cheatingSuspension.update({
				where: { id: activeSuspension.id },
				data: {
					isActive: false,
					wasReduced: true,
					reducedAt: new Date(),
					reducedBy: data.adminId,
					reductionReason: data.reason,
				},
			});
		}

		// Create notification for student
		await prisma.notification.create({
			data: {
				recipientType: "STUDENT",
				recipientId: data.studentId,
				title: "🎉 Penalty Reduced - Good Behavior!",
				message: `Your penalty has been reduced due to your good behavior! ${eligibility.cleanTestsCompleted} clean tests completed. Keep up the great work!`,
				type: "GENERAL",
			},
		});

		console.log(
			`✅ Penalty reduced for student ${data.studentId}: ${data.violationsToRemove} violations removed`
		);

		return {
			success: true,
			error: false,
			message: `Penalty reduced! ${data.violationsToRemove} violations removed.`,
		};
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// Manual penalty forgiveness (admin action)
export const forgivePenalty = async (
	currentState: { success: boolean; error: boolean },
	data: {
		studentId: string;
		adminId: string;
		reason: string;
		fullForgiveness: boolean; // true = clear all, false = reduce by half
	}
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return {
				success: false,
				error: true,
				message: "Only admins can forgive penalties!",
			};
		}

		// Get student's violation count
		const allAttempts = await prisma.mCQAttempt.findMany({
			where: { studentId: data.studentId },
			select: { cheatingViolations: true },
		});

		const totalViolations = allAttempts.reduce(
			(sum, a) => sum + a.cheatingViolations,
			0
		);

		const violationsToRemove = data.fullForgiveness
			? totalViolations
			: Math.floor(totalViolations / 2);

		// Deactivate all active suspensions
		await prisma.cheatingSuspension.updateMany({
			where: {
				studentId: data.studentId,
				isActive: true,
			},
			data: {
				isActive: false,
				wasReduced: true,
				reducedAt: new Date(),
				reducedBy: data.adminId,
				reductionReason: data.reason,
			},
		});

		// Record the forgiveness
		await prisma.penaltyReduction.create({
			data: {
				studentId: data.studentId,
				violationsRemoved: violationsToRemove,
				reason: `ADMIN FORGIVENESS: ${data.reason}`,
				reducedBy: data.adminId,
				cleanTestsCompleted: 0,
				daysWithoutViolation: 0,
				goodBehaviorScore: 0,
			},
		});

		// Send notification to student
		await prisma.notification.create({
			data: {
				recipientType: "STUDENT",
				recipientId: data.studentId,
				title: data.fullForgiveness
					? "🎊 All Penalties Forgiven!"
					: "✨ Penalty Reduced",
				message: data.fullForgiveness
					? `All your penalties have been forgiven! You have a fresh start. Reason: ${data.reason}`
					: `Your penalty has been reduced by 50%. Reason: ${data.reason}`,
				type: "GENERAL",
			},
		});

		console.log(
			`✅ Admin ${data.adminId} ${
				data.fullForgiveness ? "fully forgave" : "reduced"
			} penalties for student ${data.studentId}`
		);

		return {
			success: true,
			error: false,
			message: data.fullForgiveness
				? "All penalties forgiven!"
				: "Penalty reduced by 50%!",
		};
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// Auto-expire suspensions (runs on cron)
export const expireOldSuspensions = async () => {
	try {
		const now = new Date();

		// Find all active suspensions that have expired
		const expiredSuspensions = await prisma.cheatingSuspension.findMany({
			where: {
				isActive: true,
				suspendedUntil: { lt: now },
			},
		});

		// Deactivate them
		await prisma.cheatingSuspension.updateMany({
			where: {
				isActive: true,
				suspendedUntil: { lt: now },
			},
			data: {
				isActive: false,
			},
		});

		// Notify students their suspension has ended
		for (const suspension of expiredSuspensions) {
			await prisma.notification.create({
				data: {
					recipientType: "STUDENT",
					recipientId: suspension.studentId,
					title: "✅ Suspension Ended",
					message:
						"Your suspension period has ended. You can now take tests again. Please maintain good behavior!",
					type: "GENERAL",
				},
			});
		}

		console.log(`✅ Expired ${expiredSuspensions.length} old suspensions`);

		return {
			success: true,
			expiredCount: expiredSuspensions.length,
		};
	} catch (err) {
		console.log(err);
		return { success: false, expiredCount: 0 };
	}
};

// Get penalty reduction history for a student
export const getPenaltyReductionHistory = async (studentId: string) => {
	try {
		const reductions = await prisma.penaltyReduction.findMany({
			where: { studentId },
			orderBy: { reducedAt: "desc" },
		});

		return {
			success: true,
			reductions,
		};
	} catch (err) {
		console.log(err);
		return { success: false, reductions: [] };
	}
};

// ============= END PENALTY REMOVAL SYSTEM =============

// Grade an open-ended answer
export const gradeOpenEndedAnswer = async (
	currentState: MCQState,
	data: {
		answerId: string;
		isCorrect: boolean;
		pointsAwarded?: number;
		teacherFeedback?: string;
	}
) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return {
				success: false,
				error: true,
				message: "Unauthorized!",
			};
		}

		// Get the answer with question and attempt info
		const answer = await prisma.studentAnswer.findUnique({
			where: { id: data.answerId },
			include: {
				question: true,
				attempt: true,
			},
		});

		if (!answer) {
			return {
				success: false,
				error: true,
				message: "Answer not found!",
			};
		}

		// Verify this is an open-ended question
		if (answer.question.questionType !== "OPEN_ENDED") {
			return {
				success: false,
				error: true,
				message: "This question is not open-ended!",
			};
		}

		// Check if the user is a teacher (for foreign key constraint)
		const teacher = await prisma.teacher.findUnique({
			where: { id: userId! },
		});

		// Update the answer with grading info
		await prisma.studentAnswer.update({
			where: { id: data.answerId },
			data: {
				isCorrect: data.isCorrect,
				pointsAwarded: data.pointsAwarded ?? (data.isCorrect ? 1 : 0),
				teacherFeedback: data.teacherFeedback,
				gradedAt: new Date(),
				// Only set gradedBy if user is actually a teacher in the database
				...(teacher && { gradedBy: userId }),
			},
		});

		// If marked correct, increment the attempt's correct answers
		if (data.isCorrect && answer.isCorrect === null) {
			await prisma.mCQAttempt.update({
				where: { id: answer.attemptId },
				data: {
					correctAnswers: {
						increment: 1,
					},
				},
			});

			// Recalculate score
			const attempt = await prisma.mCQAttempt.findUnique({
				where: { id: answer.attemptId },
			});

			if (attempt && attempt.completedAt) {
				const score = (attempt.correctAnswers / attempt.totalQuestions) * 100;
				await prisma.mCQAttempt.update({
					where: { id: answer.attemptId },
					data: { score },
				});
			}
		}

		return {
			success: true,
			error: false,
			message: "Answer graded successfully!",
		};
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

// ===== LEADERBOARD ACTIONS =====

export type LeaderboardEntry = {
	rank: number;
	studentId: string;
	studentName: string;
	studentSurname: string;
	studentImg: string | null;
	className: string | null;
	averageScore: number;
	totalTests: number;
	bestScore: number;
	badges: {
		id: string;
		name: string;
		icon: string | null;
		color: string;
	}[];
};

export const calculateLeaderboard = async (filters?: {
	classId?: string;
	subjectId?: string;
	startDate?: Date;
	endDate?: Date;
}): Promise<LeaderboardEntry[]> => {
	try {
		// Get leaderboard configuration
		const config = await prisma.leaderboardConfig.findFirst();

		if (!config) {
			throw new Error("Leaderboard configuration not found");
		}

		// Build query filters
		const whereClause: any = {};

		if (filters?.classId) {
			whereClause.student = {
				classId: filters.classId,
			};
		}

		if (filters?.subjectId) {
			whereClause.test = {
				subjectId: filters.subjectId,
			};
		}

		if (filters?.startDate || filters?.endDate) {
			whereClause.completedAt = {};
			if (filters.startDate) {
				whereClause.completedAt.gte = filters.startDate;
			}
			if (filters.endDate) {
				whereClause.completedAt.lte = filters.endDate;
			}
		}

		// Only include completed attempts
		whereClause.completedAt = {
			...whereClause.completedAt,
			not: null,
		};

		// Fetch all completed attempts with student and test info
		const attempts = await prisma.mCQAttempt.findMany({
			where: whereClause,
			include: {
				student: {
					include: {
						class: true,
					},
				},
				test: {
					include: {
						subject: true,
					},
				},
			},
			orderBy: {
				startedAt: "asc", // Order by start time to identify first attempts
			},
		});

		// Group attempts by student and test, taking only first attempt if configured
		const studentStats = new Map<
			string,
			{
				student: {
					id: string;
					name: string;
					surname: string;
					img: string | null;
					className: string | null;
				};
				scores: number[];
				bestScore: number;
			}
		>();

		// Group by student-test combination
		const studentTestAttempts = new Map<string, typeof attempts>();

		attempts.forEach((attempt) => {
			const key = `${attempt.studentId}-${attempt.testId}`;
			if (!studentTestAttempts.has(key)) {
				studentTestAttempts.set(key, []);
			}
			studentTestAttempts.get(key)!.push(attempt);
		});

		// Process each student-test combination
		studentTestAttempts.forEach((testAttempts, key) => {
			const studentId = key.split("-")[0];

			// Get the attempt to use based on configuration
			const attemptToUse = config.useFirstAttemptOnly
				? testAttempts[0] // First attempt (already sorted by startedAt ASC)
				: testAttempts.reduce((best, current) =>
						(current.score || 0) > (best.score || 0) ? current : best
				  ); // Best attempt

			// Initialize student stats if not exists
			if (!studentStats.has(studentId)) {
				studentStats.set(studentId, {
					student: {
						id: attemptToUse.student.id,
						name: attemptToUse.student.name,
						surname: attemptToUse.student.surname,
						img: attemptToUse.student.img,
						className: attemptToUse.student.class?.name || null,
					},
					scores: [],
					bestScore: 0,
				});
			}

			const stats = studentStats.get(studentId)!;
			if (attemptToUse.score !== null) {
				stats.scores.push(attemptToUse.score);
				stats.bestScore = Math.max(stats.bestScore, attemptToUse.score);
			}
		});

		// Calculate averages and filter by minimum tests
		const leaderboardData: Array<{
			student: {
				id: string;
				name: string;
				surname: string;
				img: string | null;
				className: string | null;
			};
			averageScore: number;
			totalTests: number;
			bestScore: number;
		}> = [];

		studentStats.forEach((stats, studentId) => {
			if (stats.scores.length >= config.minimumTestsRequired) {
				const averageScore =
					stats.scores.reduce((sum, score) => sum + score, 0) /
					stats.scores.length;

				leaderboardData.push({
					student: stats.student,
					averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
					totalTests: stats.scores.length,
					bestScore: stats.bestScore,
				});
			}
		});

		// Sort by average score (DESC), then by total tests (DESC) as tie-breaker
		leaderboardData.sort((a, b) => {
			if (b.averageScore !== a.averageScore) {
				return b.averageScore - a.averageScore;
			}
			return b.totalTests - a.totalTests;
		});

		// Assign ranks and fetch badges
		const leaderboard: LeaderboardEntry[] = await Promise.all(
			leaderboardData.map(async (data, index) => {
				const rank = index + 1;

				// Fetch student badges
				const studentBadges = await prisma.studentBadge.findMany({
					where: {
						studentId: data.student.id,
					},
					include: {
						badge: {
							select: {
								id: true,
								name: true,
								icon: true,
								color: true,
							},
						},
					},
					orderBy: {
						badge: {
							priority: "asc",
						},
					},
					take: 3, // Show top 3 badges
				});

				return {
					rank,
					studentId: data.student.id,
					studentName: data.student.name,
					studentSurname: data.student.surname,
					studentImg: data.student.img,
					className: data.student.className,
					averageScore: data.averageScore,
					totalTests: data.totalTests,
					bestScore: data.bestScore,
					badges: studentBadges.map((sb) => sb.badge),
				};
			})
		);

		// Limit to showTop if configured
		return config.showTop ? leaderboard.slice(0, config.showTop) : leaderboard;
	} catch (err) {
		console.error("Error calculating leaderboard:", err);
		return [];
	}
};

// Auto-award badges based on leaderboard
export const autoAwardBadges = async (): Promise<{
	success: boolean;
	awardedCount: number;
	removedCount: number;
}> => {
	try {
		const config = await prisma.leaderboardConfig.findFirst();

		if (!config || !config.autoAwardBadges) {
			return { success: false, awardedCount: 0, removedCount: 0 };
		}

		// Get full leaderboard (no limit)
		const fullLeaderboard = await calculateLeaderboard();

		// Get all active badges
		const badges = await prisma.badge.findMany({
			where: { isActive: true },
		});

		let awardedCount = 0;
		let removedCount = 0;

		// Track which students should have which badges
		const shouldHaveBadges = new Map<string, Set<string>>(); // studentId -> Set of badgeIds

		// First pass: Determine which students SHOULD have which badges
		for (const entry of fullLeaderboard) {
			if (!shouldHaveBadges.has(entry.studentId)) {
				shouldHaveBadges.set(entry.studentId, new Set());
			}

			for (const badge of badges) {
				const criteria = badge.criteria as any;
				let shouldAward = false;

				switch (badge.badgeType) {
					case "RANK_BASED":
						if (criteria.type === "rank") {
							if (criteria.value) {
								// Exact rank match (e.g., rank === 1)
								shouldAward = entry.rank === criteria.value;
							} else if (criteria.maxValue) {
								// Range match (e.g., rank <= 5 for "Top 5")
								shouldAward = entry.rank <= criteria.maxValue;
							}
						}
						break;

					case "SCORE_BASED":
						if (criteria.type === "averageScore" && criteria.min) {
							shouldAward = entry.averageScore >= criteria.min;
						} else if (criteria.type === "perfectScore") {
							shouldAward = entry.bestScore === 100;
						}
						break;

					case "ACTIVITY_BASED":
						if (criteria.type === "testsCompleted" && criteria.min) {
							shouldAward = entry.totalTests >= criteria.min;
						}
						break;

					case "IMPROVEMENT":
						// TODO: Implement improvement logic (requires historical snapshots)
						break;
				}

				if (shouldAward) {
					shouldHaveBadges.get(entry.studentId)!.add(badge.id);
				}
			}
		}

		// Second pass: Award new badges and remove old ones
		for (const studentId of Array.from(shouldHaveBadges.keys())) {
			const badgeIds = shouldHaveBadges.get(studentId)!;

			// Get student's current badges
			const currentBadges = await prisma.studentBadge.findMany({
				where: { studentId },
				select: { badgeId: true, id: true },
			});

			const currentBadgeIds = new Set(currentBadges.map((sb) => sb.badgeId));

			// Award new badges
			for (const badgeId of Array.from(badgeIds)) {
				if (!currentBadgeIds.has(badgeId)) {
					const entry = fullLeaderboard.find((e) => e.studentId === studentId)!;

					const studentBadge = await prisma.studentBadge.create({
						data: {
							studentId,
							badgeId,
							metadata: {
								rank: entry.rank,
								averageScore: entry.averageScore,
								totalTests: entry.totalTests,
								awardedAt: new Date().toISOString(),
							},
						},
					});

					// 🔔 Trigger automatic notification for new badge
					await triggerBadgeEarnedNotification(studentBadge.id);

					awardedCount++;
					console.log(
						`✅ Awarded badge ${badgeId} to student ${studentId} (Rank: ${entry.rank})`
					);
				}
			}

			// Remove badges that are no longer deserved
			for (const currentBadge of currentBadges) {
				if (!badgeIds.has(currentBadge.badgeId)) {
					// Student lost this badge (e.g., no longer rank 1)
					await prisma.studentBadge.delete({
						where: { id: currentBadge.id },
					});

					removedCount++;
					console.log(
						`🔴 Removed badge ${currentBadge.badgeId} from student ${studentId} (no longer meets criteria)`
					);
				}
			}
		}

		// Third pass: Remove badges from students NOT in leaderboard
		const leaderboardStudentIds = new Set(
			fullLeaderboard.map((e) => e.studentId)
		);

		const allStudentBadges = await prisma.studentBadge.findMany({
			select: { id: true, studentId: true, badgeId: true },
		});

		for (const studentBadge of allStudentBadges) {
			if (!leaderboardStudentIds.has(studentBadge.studentId)) {
				// Student not in leaderboard anymore, remove their badges
				await prisma.studentBadge.delete({
					where: { id: studentBadge.id },
				});

				removedCount++;
				console.log(
					`🔴 Removed badge ${studentBadge.badgeId} from student ${studentBadge.studentId} (not in leaderboard)`
				);
			}
		}

		console.log(
			`\n🎖️  Badge System: Awarded ${awardedCount}, Removed ${removedCount}`
		);

		return { success: true, awardedCount, removedCount };
	} catch (err) {
		console.error("Error auto-awarding badges:", err);
		return { success: false, awardedCount: 0, removedCount: 0 };
	}
};

// ============ BADGE CRUD ACTIONS ============

type BadgeState = {
	success: boolean;
	error: boolean;
};

export const createBadge = async (
	currentState: BadgeState,
	data: FormData
): Promise<BadgeState> => {
	try {
		const name = data.get("name") as string;
		const description =
			(data.get("description") as string) || "No description provided";
		const icon = data.get("icon") as string | null;
		const color = data.get("color") as string;
		const criteriaStr = data.get("criteria") as string | null;
		const isActive = data.get("isActive") === "on";
		const priority = parseInt(data.get("displayOrder") as string) || 0;

		let criteria = {};
		if (criteriaStr) {
			try {
				criteria = JSON.parse(criteriaStr);
			} catch (e) {
				return { success: false, error: true };
			}
		}

		await prisma.badge.create({
			data: {
				name,
				description,
				icon: icon || null,
				color,
				criteria,
				isActive,
				priority,
			},
		});

		return { success: true, error: false };
	} catch (err) {
		console.error("Error creating badge:", err);
		return { success: false, error: true };
	}
};

export const updateBadge = async (
	currentState: BadgeState,
	data: FormData
): Promise<BadgeState> => {
	try {
		const id = data.get("id") as string;
		const name = data.get("name") as string;
		const description =
			(data.get("description") as string) || "No description provided";
		const icon = data.get("icon") as string | null;
		const color = data.get("color") as string;
		const criteriaStr = data.get("criteria") as string | null;
		const isActive = data.get("isActive") === "on";
		const priority = parseInt(data.get("displayOrder") as string) || 0;

		let criteria = {};
		if (criteriaStr) {
			try {
				criteria = JSON.parse(criteriaStr);
			} catch (e) {
				return { success: false, error: true };
			}
		}

		await prisma.badge.update({
			where: { id },
			data: {
				name,
				description,
				icon: icon || null,
				color,
				criteria,
				isActive,
				priority,
			},
		});

		return { success: true, error: false };
	} catch (err) {
		console.error("Error updating badge:", err);
		return { success: false, error: true };
	}
};

export const deleteBadge = async (
	currentState: BadgeState,
	data: FormData
): Promise<BadgeState> => {
	try {
		const id = data.get("id") as string;

		// Delete all student badge associations first
		await prisma.studentBadge.deleteMany({
			where: { badgeId: id },
		});

		// Delete the badge
		await prisma.badge.delete({
			where: { id },
		});

		return { success: true, error: false };
	} catch (err) {
		console.error("Error deleting badge:", err);
		return { success: false, error: true };
	}
};

// ============ TEACHER RATING SYSTEM ============

type TeacherRatingState = {
	success: boolean;
	error: boolean;
};

export const submitTeacherRating = async (
	currentState: TeacherRatingState,
	data: FormData
): Promise<TeacherRatingState> => {
	try {
		const { userId } = auth();
		if (!userId) {
			return { success: false, error: true };
		}

		const teacherId = data.get("teacherId") as string;
		const testId = data.get("testId") as string | null;
		const subjectId = data.get("subjectId") as string | null;
		const rating = parseInt(data.get("rating") as string);
		const comment = data.get("comment") as string | null;

		// Validate rating
		if (rating < 1 || rating > 5) {
			return { success: false, error: true };
		}

		// Check if already rated (only if testId is provided)
		let existingRating = null;
		if (testId) {
			existingRating = await prisma.teacherRating.findUnique({
				where: {
					studentId_teacherId_testId: {
						studentId: userId,
						teacherId,
						testId,
					},
				},
			});
		}

		if (existingRating) {
			// Update existing rating
			await prisma.teacherRating.update({
				where: { id: existingRating.id },
				data: {
					rating,
					comment: comment || null,
				},
			});
		} else {
			// Create new rating
			const newRating = await prisma.teacherRating.create({
				data: {
					studentId: userId,
					teacherId,
					testId: testId || null,
					subjectId: subjectId ? parseInt(subjectId) : null,
					rating,
					comment: comment || null,
					isAnonymous: true,
				},
			});

			// 🔔 Trigger automatic notification
			await triggerTeacherRatingNotification(newRating.id);
		}

		// Recalculate teacher leaderboard
		await calculateTeacherLeaderboard();

		return { success: true, error: false };
	} catch (err) {
		console.error("Error submitting teacher rating:", err);
		return { success: false, error: true };
	}
};

// Calculate teacher leaderboard
export type TeacherLeaderboardEntry = {
	rank: number;
	teacherId: string;
	teacherName: string;
	teacherSurname: string;
	teacherImg: string | null;
	averageRating: number;
	totalRatings: number;
	fiveStarCount: number;
	fourStarCount: number;
	threeStarCount: number;
	twoStarCount: number;
	oneStarCount: number;
	badges: {
		id: string;
		name: string;
		icon: string | null;
		color: string;
	}[];
	subjects: string[];
};

export const calculateTeacherLeaderboard = async (filters?: {
	subjectId?: number;
}): Promise<TeacherLeaderboardEntry[]> => {
	try {
		// Get all teachers with their ratings
		const teachers = await prisma.teacher.findMany({
			include: {
				ratings: {
					where: filters?.subjectId
						? { subjectId: filters.subjectId }
						: undefined,
				},
				subjects: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		// Calculate statistics for each teacher
		const leaderboardData: Array<{
			teacher: {
				id: string;
				name: string;
				surname: string;
				img: string | null;
			};
			subjects: string[];
			averageRating: number;
			totalRatings: number;
			fiveStarCount: number;
			fourStarCount: number;
			threeStarCount: number;
			twoStarCount: number;
			oneStarCount: number;
		}> = [];

		for (const teacher of teachers) {
			if (teacher.ratings.length === 0) continue;

			const ratings = teacher.ratings;
			const totalRatings = ratings.length;
			const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
			const averageRating = sumRatings / totalRatings;

			const fiveStarCount = ratings.filter((r) => r.rating === 5).length;
			const fourStarCount = ratings.filter((r) => r.rating === 4).length;
			const threeStarCount = ratings.filter((r) => r.rating === 3).length;
			const twoStarCount = ratings.filter((r) => r.rating === 2).length;
			const oneStarCount = ratings.filter((r) => r.rating === 1).length;

			leaderboardData.push({
				teacher: {
					id: teacher.id,
					name: teacher.name,
					surname: teacher.surname,
					img: teacher.img,
				},
				subjects: teacher.subjects.map((s) => s.name),
				averageRating: Math.round(averageRating * 100) / 100,
				totalRatings,
				fiveStarCount,
				fourStarCount,
				threeStarCount,
				twoStarCount,
				oneStarCount,
			});

			// Update or create leaderboard entry in database
			await prisma.teacherLeaderboard.upsert({
				where: { teacherId: teacher.id },
				update: {
					averageRating,
					totalRatings,
					fiveStarCount,
					fourStarCount,
					threeStarCount,
					twoStarCount,
					oneStarCount,
					overallScore: averageRating,
					lastCalculated: new Date(),
				},
				create: {
					teacherId: teacher.id,
					averageRating,
					totalRatings,
					fiveStarCount,
					fourStarCount,
					threeStarCount,
					twoStarCount,
					oneStarCount,
					overallScore: averageRating,
				},
			});
		}

		// Sort by average rating (DESC), then by total ratings (DESC) as tie-breaker
		leaderboardData.sort((a, b) => {
			if (b.averageRating !== a.averageRating) {
				return b.averageRating - a.averageRating;
			}
			return b.totalRatings - a.totalRatings;
		});

		// Assign ranks and fetch badges
		const leaderboard: TeacherLeaderboardEntry[] = await Promise.all(
			leaderboardData.map(async (data, index) => {
				const rank = index + 1;

				// Update rank in database
				await prisma.teacherLeaderboard.update({
					where: { teacherId: data.teacher.id },
					data: { rank },
				});

				// Fetch teacher badges
				const teacherBadges = await prisma.teacherBadge.findMany({
					where: {
						teacherId: data.teacher.id,
					},
					include: {
						badge: {
							select: {
								id: true,
								name: true,
								icon: true,
								color: true,
							},
						},
					},
					orderBy: {
						badge: {
							priority: "asc",
						},
					},
					take: 3, // Show top 3 badges
				});

				return {
					rank,
					teacherId: data.teacher.id,
					teacherName: data.teacher.name,
					teacherSurname: data.teacher.surname,
					teacherImg: data.teacher.img,
					averageRating: data.averageRating,
					totalRatings: data.totalRatings,
					fiveStarCount: data.fiveStarCount,
					fourStarCount: data.fourStarCount,
					threeStarCount: data.threeStarCount,
					twoStarCount: data.twoStarCount,
					oneStarCount: data.oneStarCount,
					badges: teacherBadges.map((tb) => tb.badge),
					subjects: data.subjects,
				};
			})
		);

		// Auto-award badges based on criteria
		await autoAwardTeacherBadges(leaderboard);

		return leaderboard;
	} catch (err) {
		console.error("Error calculating teacher leaderboard:", err);
		return [];
	}
};

// Auto-award teacher badges
const autoAwardTeacherBadges = async (
	leaderboard: TeacherLeaderboardEntry[]
): Promise<void> => {
	try {
		// Get all active badges
		const badges = await prisma.badge.findMany({
			where: { isActive: true },
		});

		for (const entry of leaderboard) {
			for (const badge of badges) {
				const criteria = badge.criteria as any;
				let shouldAward = false;

				// Check badge criteria
				if (criteria.type === "teacherRank") {
					if (criteria.value) {
						shouldAward = entry.rank === criteria.value;
					} else if (criteria.maxValue) {
						shouldAward = entry.rank <= criteria.maxValue;
					}
				} else if (criteria.type === "teacherRating") {
					if (criteria.min) {
						shouldAward = entry.averageRating >= criteria.min;
					}
				} else if (criteria.type === "teacherRatings") {
					if (criteria.min) {
						shouldAward = entry.totalRatings >= criteria.min;
					}
				} else if (criteria.type === "fiveStars") {
					if (criteria.min) {
						shouldAward = entry.fiveStarCount >= criteria.min;
					}
				}

				if (shouldAward) {
					// Check if teacher already has this badge
					const existing = await prisma.teacherBadge.findUnique({
						where: {
							teacherId_badgeId: {
								teacherId: entry.teacherId,
								badgeId: badge.id,
							},
						},
					});

					if (!existing) {
						await prisma.teacherBadge.create({
							data: {
								teacherId: entry.teacherId,
								badgeId: badge.id,
								metadata: {
									rank: entry.rank,
									averageRating: entry.averageRating,
									totalRatings: entry.totalRatings,
								},
							},
						});
					}
				}
			}
		}
	} catch (err) {
		console.error("Error auto-awarding teacher badges:", err);
	}
};

// Get teacher's own rating statistics
export const getTeacherRatingStats = async (teacherId: string) => {
	try {
		const leaderboard = await prisma.teacherLeaderboard.findUnique({
			where: { teacherId },
			include: {
				badges: {
					include: {
						badge: true,
					},
					orderBy: {
						badge: {
							priority: "asc",
						},
					},
				},
			},
		});

		const ratings = await prisma.teacherRating.findMany({
			where: { teacherId },
			include: {
				test: {
					select: {
						title: true,
					},
				},
				subject: {
					select: {
						name: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 10, // Last 10 ratings
		});

		return {
			leaderboard,
			recentRatings: ratings,
		};
	} catch (err) {
		console.error("Error fetching teacher rating stats:", err);
		return null;
	}
};

// ============================================
// FINANCE SYSTEM ACTIONS
// ============================================

// -------------------- FEE STRUCTURE MANAGEMENT --------------------

export const createFeeStructure = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const data = {
			name: formData.get("name") as string,
			description: formData.get("description") as string,
			amount: parseFloat(formData.get("amount") as string),
			frequency: formData.get("frequency") as any,
			feeType: formData.get("feeType") as any,
			classId:
				formData.get("classId") && formData.get("classId") !== ""
					? parseInt(formData.get("classId") as string)
					: null,
			gradeId:
				formData.get("gradeId") && formData.get("gradeId") !== ""
					? parseInt(formData.get("gradeId") as string)
					: null,
		};

		await prisma.feeStructure.create({
			data: {
				...data,
			},
		});

		// revalidatePath("/list/fee-structures");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error creating fee structure:", err);
		return { success: false, error: true };
	}
};

export const updateFeeStructure = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const id = formData.get("id") as string;
		const data = {
			name: formData.get("name") as string,
			description: formData.get("description") as string,
			amount: parseFloat(formData.get("amount") as string),
			frequency: formData.get("frequency") as any,
			feeType: formData.get("feeType") as any,
			classId:
				formData.get("classId") && formData.get("classId") !== ""
					? parseInt(formData.get("classId") as string)
					: null,
			gradeId:
				formData.get("gradeId") && formData.get("gradeId") !== ""
					? parseInt(formData.get("gradeId") as string)
					: null,
		};

		await prisma.feeStructure.update({
			where: { id },
			data,
		});

		// revalidatePath("/list/fee-structures");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error updating fee structure:", err);
		return { success: false, error: true };
	}
};

export const deleteFeeStructure = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const id = formData.get("id") as string;

		await prisma.feeStructure.delete({
			where: { id },
		});

		// revalidatePath("/list/fee-structures");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error deleting fee structure:", err);
		return { success: false, error: true };
	}
};

// -------------------- STUDENT FEE ASSIGNMENT --------------------

export const assignFeesToStudents = async (
	feeStructureId: string,
	studentIds: string[],
	dueDate: Date,
	month: number,
	year: number
) => {
	try {
		const feeStructure = await prisma.feeStructure.findUnique({
			where: { id: feeStructureId },
		});

		if (!feeStructure) {
			throw new Error("Fee structure not found");
		}

		// Create fees individually to trigger notifications
		const createdFees = [];
		for (const studentId of studentIds) {
			// Check if fee already exists for this student/month/year
			const existing = await prisma.studentFee.findFirst({
				where: {
					studentId,
					feeStructureId,
					month,
					year,
				},
			});

			if (!existing) {
				const studentFee = await prisma.studentFee.create({
					data: {
						studentId,
						feeStructureId,
						totalAmount: feeStructure.amount,
						pendingAmount: feeStructure.amount,
						dueDate,
						month,
						year,
						status: "PENDING",
					},
				});

				createdFees.push(studentFee);

				// 🔔 Trigger automatic notification
				await triggerFeeAssignedNotification(studentFee.id);
			}
		}

		return { success: true, count: createdFees.length };
	} catch (err) {
		console.error("Error assigning fees:", err);
		return { success: false, error: err };
	}
};

// Bulk assign fees to all students in a class
export const assignFeesToClass = async (
	feeStructureId: string,
	classId: number,
	dueDate: Date,
	month: number,
	year: number
) => {
	try {
		const students = await prisma.student.findMany({
			where: { classId },
			select: { id: true },
		});

		const studentIds = students.map((s) => s.id);
		return await assignFeesToStudents(
			feeStructureId,
			studentIds,
			dueDate,
			month,
			year
		);
	} catch (err) {
		console.error("Error assigning fees to class:", err);
		return { success: false, error: err };
	}
};

// -------------------- PAYMENT RECORDING (OFFLINE) --------------------

export const recordOfflinePayment = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const studentFeeId = formData.get("studentFeeId") as string;
		const amount = parseFloat(formData.get("amount") as string);
		const paymentMethod = formData.get("paymentMethod") as string;
		const notes = formData.get("notes") as string;

		// Get student fee details
		const studentFee = await prisma.studentFee.findUnique({
			where: { id: studentFeeId },
		});

		if (!studentFee) {
			return { success: false, error: true };
		}

		// Generate receipt number
		const receiptNumber = `REC-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;

		// Create payment record
		await prisma.payment.create({
			data: {
				studentFeeId,
				amount,
				paymentMethod: paymentMethod as any,
				notes,
				receiptNumber,
				approvalStatus: "APPROVED", // Auto-approved for offline payments
				approvedBy: userId,
				approvedAt: new Date(),
				processedBy: userId,
			},
		});

		// Update student fee
		const newPaidAmount = studentFee.paidAmount + amount;
		const newPendingAmount = studentFee.totalAmount - newPaidAmount;

		let newStatus: "PAID" | "PARTIAL" | "PENDING" = "PENDING";
		if (newPendingAmount <= 0) {
			newStatus = "PAID"; // GREEN
		} else if (newPaidAmount > 0) {
			newStatus = "PARTIAL"; // YELLOW
		}

		await prisma.studentFee.update({
			where: { id: studentFeeId },
			data: {
				paidAmount: newPaidAmount,
				pendingAmount: Math.max(0, newPendingAmount),
				status: newStatus,
			},
		});

		// Send notification to parent
		await prisma.notification.create({
			data: {
				recipientType: "PARENT",
				recipientId: (
					await prisma.student.findUnique({
						where: { id: studentFee.studentId },
						select: { parentId: true },
					})
				)?.parentId,
				title: "Payment Received",
				message: `Payment of ₹${amount} received successfully. Receipt: ${receiptNumber}`,
				type: "PAYMENT_APPROVED",
				metadata: { studentFeeId },
				createdBy: userId,
			},
		});

		// revalidatePath("/list/student-fees");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error recording payment:", err);
		return { success: false, error: true };
	}
};

// -------------------- ONLINE PAYMENT (UPI SCREENSHOT) --------------------

export const submitOnlinePayment = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId } = auth();

		if (!userId) {
			return { success: false, error: true };
		}

		const studentFeeId = formData.get("studentFeeId") as string;
		const amount = parseFloat(formData.get("amount") as string);
		const transactionId = formData.get("transactionId") as string;
		const screenshot = formData.get("screenshot") as string; // Cloudinary URL

		// Get student fee details
		const studentFee = await prisma.studentFee.findUnique({
			where: { id: studentFeeId },
			include: { student: true },
		});

		if (!studentFee) {
			return { success: false, error: true };
		}

		// Generate receipt number
		const receiptNumber = `REC-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;

		// Create payment record (PENDING approval)
		await prisma.payment.create({
			data: {
				studentFeeId,
				amount,
				paymentMethod: "ONLINE_UPI",
				transactionId,
				screenshot,
				receiptNumber,
				approvalStatus: "PENDING", // Needs admin approval
			},
		});

		// Send notification to admin
		await prisma.notification.create({
			data: {
				recipientType: "ALL",
				title: "New Payment Awaiting Approval",
				message: `Online payment of ₹${amount} from ${studentFee.student.name} needs verification. Transaction ID: ${transactionId}`,
				type: "GENERAL",
				metadata: { studentFeeId },
			},
		});

		// revalidatePath("/parent/fees");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error submitting online payment:", err);
		return { success: false, error: true };
	}
};

// -------------------- PAYMENT APPROVAL/REJECTION --------------------

export const approvePayment = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const paymentId = formData.get("paymentId") as string;

		const payment = await prisma.payment.findUnique({
			where: { id: paymentId },
			include: {
				studentFee: {
					include: {
						student: true,
					},
				},
			},
		});

		if (!payment) {
			return { success: false, error: true };
		}

		// Update payment status
		await prisma.payment.update({
			where: { id: paymentId },
			data: {
				approvalStatus: "APPROVED",
				approvedBy: userId,
				approvedAt: new Date(),
			},
		});

		// Update student fee
		const newPaidAmount = payment.studentFee.paidAmount + payment.amount;
		const newPendingAmount = payment.studentFee.totalAmount - newPaidAmount;

		let newStatus: "PAID" | "PARTIAL" | "PENDING" = "PENDING";
		if (newPendingAmount <= 0) {
			newStatus = "PAID"; // GREEN
		} else if (newPaidAmount > 0) {
			newStatus = "PARTIAL"; // YELLOW
		}

		await prisma.studentFee.update({
			where: { id: payment.studentFeeId },
			data: {
				paidAmount: newPaidAmount,
				pendingAmount: Math.max(0, newPendingAmount),
				status: newStatus,
			},
		});

		// Send notification to parent
		await prisma.notification.create({
			data: {
				recipientType: "PARENT",
				recipientId: payment.studentFee.student.parentId,
				title: "Payment Approved ✅",
				message: `Your payment of ₹${payment.amount} has been verified and approved. Receipt: ${payment.receiptNumber}`,
				type: "PAYMENT_APPROVED",
				metadata: { paymentId },
				createdBy: userId,
			},
		});

		// revalidatePath("/list/payments");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error approving payment:", err);
		return { success: false, error: true };
	}
};

export const rejectPayment = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const paymentId = formData.get("paymentId") as string;
		const rejectionReason = formData.get("rejectionReason") as string;

		const payment = await prisma.payment.findUnique({
			where: { id: paymentId },
			include: {
				studentFee: {
					include: {
						student: true,
					},
				},
			},
		});

		if (!payment) {
			return { success: false, error: true };
		}

		// Update payment status
		await prisma.payment.update({
			where: { id: paymentId },
			data: {
				approvalStatus: "REJECTED",
				rejectionReason,
				approvedBy: userId,
				approvedAt: new Date(),
			},
		});

		// Send notification to parent
		await prisma.notification.create({
			data: {
				recipientType: "PARENT",
				recipientId: payment.studentFee.student.parentId,
				title: "Payment Rejected ❌",
				message: `Your payment of ₹${payment.amount} was rejected. Reason: ${rejectionReason}. Please contact admin.`,
				type: "PAYMENT_REJECTED",
				metadata: { paymentId },
				createdBy: userId,
			},
		});

		// revalidatePath("/list/payments");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error rejecting payment:", err);
		return { success: false, error: true };
	}
};

// -------------------- SALARY MANAGEMENT --------------------

export const recordSalary = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const teacherId = formData.get("teacherId") as string;
		const staffName = formData.get("staffName") as string;
		const amount = parseFloat(formData.get("amount") as string);
		const month = parseInt(formData.get("month") as string);
		const year = parseInt(formData.get("year") as string);
		const status = formData.get("status") as string;
		const notes = formData.get("notes") as string;

		await prisma.salary.create({
			data: {
				teacherId: teacherId || null,
				staffName: staffName || null,
				amount,
				month,
				year,
				status: status as any,
				paidDate: status === "PAID" ? new Date() : null,
				notes,
				processedBy: userId,
			},
		});

		// revalidatePath("/list/salaries");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error recording salary:", err);
		return { success: false, error: true };
	}
};

// -------------------- INCOME/EXPENSE TRACKING --------------------

export const recordIncome = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const data = {
			title: formData.get("title") as string,
			source: formData.get("source") as string,
			amount: parseFloat(formData.get("amount") as string),
			category: formData.get("category") as any,
			date: new Date(formData.get("date") as string),
			description: formData.get("description") as string,
			recordedBy: userId,
		};

		await prisma.income.create({ data });

		// revalidatePath("/list/income");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error recording income:", err);
		return { success: false, error: true };
	}
};

export const recordExpense = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const data = {
			title: formData.get("title") as string,
			amount: parseFloat(formData.get("amount") as string),
			category: formData.get("category") as any,
			date: new Date(formData.get("date") as string),
			description: formData.get("description") as string,
			receipt: formData.get("receipt") as string, // Cloudinary URL
			recordedBy: userId,
		};

		await prisma.expense.create({ data });

		// revalidatePath("/list/expenses");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error recording expense:", err);
		return { success: false, error: true };
	}
};

// -------------------- PAYMENT CONFIG --------------------

export const updatePaymentConfig = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const data = {
			upiId: formData.get("upiId") as string,
			upiQRCode: formData.get("upiQRCode") as string, // Cloudinary URL
			bankName: formData.get("bankName") as string,
			accountNumber: formData.get("accountNumber") as string,
			ifscCode: formData.get("ifscCode") as string,
			instructions: formData.get("instructions") as string,
		};

		await prisma.paymentConfig.upsert({
			where: { id: 1 },
			update: data,
			create: { id: 1, ...data },
		});

		// revalidatePath("/admin/payment-config");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error updating payment config:", err);
		return { success: false, error: true };
	}
};

// -------------------- NOTIFICATION SYSTEM --------------------

export const sendNotification = async (
	state: { success: boolean; error: boolean },
	formData: FormData
) => {
	try {
		const { userId, sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return { success: false, error: true };
		}

		const data = {
			recipientType: formData.get("recipientType") as any,
			recipientId: formData.get("recipientId") as string,
			title: formData.get("title") as string,
			message: formData.get("message") as string,
			type: formData.get("type") as any,
			sendEmail: formData.get("sendEmail") === "true",
			sendWebPush: formData.get("sendWebPush") === "true",
			createdBy: userId,
		};

		await prisma.notification.create({
			data: {
				...data,
				recipientId: data.recipientId || null,
			},
		});

		// TODO: Implement actual email and web push sending
		// For now, just mark as sent
		// Use nodemailer for email and web-push for push notifications

		// revalidatePath("/list/notifications");
		return { success: true, error: false };
	} catch (err) {
		console.error("Error sending notification:", err);
		return { success: false, error: true };
	}
};

// -------------------- FINANCIAL REPORTS --------------------

export const getFinancialSummary = async (month: number, year: number) => {
	try {
		// Total fee collection
		const feeCollection = await prisma.payment.aggregate({
			where: {
				approvalStatus: "APPROVED",
				paymentDate: {
					gte: new Date(year, month - 1, 1),
					lt: new Date(year, month, 1),
				},
			},
			_sum: {
				amount: true,
			},
		});

		// Total income (non-fee)
		const otherIncome = await prisma.income.aggregate({
			where: {
				date: {
					gte: new Date(year, month - 1, 1),
					lt: new Date(year, month, 1),
				},
			},
			_sum: {
				amount: true,
			},
		});

		// Total expenses
		const expenses = await prisma.expense.aggregate({
			where: {
				date: {
					gte: new Date(year, month - 1, 1),
					lt: new Date(year, month, 1),
				},
				status: "APPROVED",
			},
			_sum: {
				amount: true,
			},
		});

		// Total salaries
		const salaries = await prisma.salary.aggregate({
			where: {
				month,
				year,
				status: "PAID",
			},
			_sum: {
				amount: true,
			},
		});

		const totalIncome =
			(feeCollection._sum.amount || 0) + (otherIncome._sum.amount || 0);
		const totalExpenses =
			(expenses._sum.amount || 0) + (salaries._sum.amount || 0);
		const netProfit = totalIncome - totalExpenses;

		return {
			totalIncome,
			feeCollection: feeCollection._sum.amount || 0,
			otherIncome: otherIncome._sum.amount || 0,
			totalExpenses,
			expenses: expenses._sum.amount || 0,
			salaries: salaries._sum.amount || 0,
			netProfit,
		};
	} catch (err) {
		console.error("Error getting financial summary:", err);
		return null;
	}
};

// Get pending fee collections
export const getPendingFees = async () => {
	try {
		const pendingFees = await prisma.studentFee.findMany({
			where: {
				status: {
					in: ["PENDING", "PARTIAL", "OVERDUE"],
				},
			},
			include: {
				student: {
					select: {
						id: true,
						name: true,
						surname: true,
						class: {
							select: {
								name: true,
							},
						},
					},
				},
				feeStructure: {
					select: {
						name: true,
						feeType: true,
					},
				},
			},
			orderBy: {
				dueDate: "asc",
			},
		});

		const totalPending = pendingFees.reduce(
			(sum, fee) => sum + fee.pendingAmount,
			0
		);

		return {
			fees: pendingFees,
			totalPending,
			count: pendingFees.length,
		};
	} catch (err) {
		console.error("Error getting pending fees:", err);
		return null;
	}
};
