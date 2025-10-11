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
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

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

		await prisma.exam.create({
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
		await prisma.assignment.create({
			data: {
				title: data.title,
				startDate: data.startDate,
				dueDate: data.dueDate,
				lessonId: data.lessonId,
			},
		});

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
		await prisma.result.create({
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
		await prisma.attendance.create({
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
		await prisma.event.create({
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
		await prisma.announcement.create({
			data: {
				title: data.title,
				description: data.description,
				date: data.date,
				...(data.classId && { classId: data.classId }),
			},
		});

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
		await prisma.announcement.update({
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
			// Update existing attendance
			await prisma.teacherAttendance.update({
				where: { id: existingAttendance.id },
				data: {
					present: true,
					checkInTime: new Date(),
					locationId,
					latitude,
					longitude,
					livenessVerified,
				},
			});
		} else {
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
		}

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
