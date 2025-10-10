import { z } from "zod";

export const subjectSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, { message: "Subject name is required!" }),
	teachers: z.array(z.string()), //teacher ids
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, { message: "Subject name is required!" }),
	capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
	gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
	supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
	id: z.string().optional(),
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters long!" })
		.max(20, { message: "Username must be at most 20 characters long!" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long!" })
		.optional()
		.or(z.literal("")),
	name: z.string().min(1, { message: "First name is required!" }),
	surname: z.string().min(1, { message: "Last name is required!" }),
	email: z
		.string()
		.email({ message: "Invalid email address!" })
		.optional()
		.or(z.literal("")),
	phone: z.string().optional(),
	address: z.string(),
	img: z.string().optional(),
	bloodType: z.string().min(1, { message: "Blood Type is required!" }),
	birthday: z.coerce.date({ message: "Birthday is required!" }),
	sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
	subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
	id: z.string().optional(),
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters long!" })
		.max(20, { message: "Username must be at most 20 characters long!" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long!" })
		.optional()
		.or(z.literal("")),
	name: z.string().min(1, { message: "First name is required!" }),
	surname: z.string().min(1, { message: "Last name is required!" }),
	email: z
		.string()
		.email({ message: "Invalid email address!" })
		.optional()
		.or(z.literal("")),
	phone: z.string().optional(),
	address: z.string(),
	img: z.string().optional(),
	bloodType: z.string().min(1, { message: "Blood Type is required!" }),
	birthday: z.coerce.date({ message: "Birthday is required!" }),
	sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
	gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
	classId: z.coerce.number().min(1, { message: "Class is required!" }),
	parentId: z.string().min(1, { message: "Parent Id is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
	id: z.coerce.number().optional(),
	title: z.string().min(1, { message: "Title name is required!" }),
	startTime: z.coerce.date({ message: "Start time is required!" }),
	endTime: z.coerce.date({ message: "End time is required!" }),
	lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const parentSchema = z.object({
	id: z.string().optional(),
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters long!" })
		.max(20, { message: "Username must be at most 20 characters long!" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long!" })
		.optional()
		.or(z.literal("")),
	name: z.string().min(1, { message: "First name is required!" }),
	surname: z.string().min(1, { message: "Last name is required!" }),
	email: z
		.string()
		.email({ message: "Invalid email address!" })
		.optional()
		.or(z.literal("")),
	phone: z.string().min(1, { message: "Phone is required!" }),
	address: z.string().min(1, { message: "Address is required!" }),
});

export type ParentSchema = z.infer<typeof parentSchema>;

export const lessonSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, { message: "Lesson name is required!" }),
	day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
		message: "Day is required!",
	}),
	startTime: z.coerce.date({ message: "Start time is required!" }),
	endTime: z.coerce.date({ message: "End time is required!" }),
	subjectId: z.coerce.number({ message: "Subject is required!" }),
	classId: z.coerce.number({ message: "Class is required!" }),
	teacherId: z.string().min(1, { message: "Teacher is required!" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export const assignmentSchema = z.object({
	id: z.coerce.number().optional(),
	title: z.string().min(1, { message: "Title is required!" }),
	startDate: z.coerce.date({ message: "Start date is required!" }),
	dueDate: z.coerce.date({ message: "Due date is required!" }),
	lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const resultSchema = z.object({
	id: z.coerce.number().optional(),
	score: z.coerce.number().min(0, { message: "Score must be at least 0!" }),
	examId: z.coerce.number().optional(),
	assignmentId: z.coerce.number().optional(),
	studentId: z.string().min(1, { message: "Student is required!" }),
});

export type ResultSchema = z.infer<typeof resultSchema>;

export const attendanceSchema = z.object({
	id: z.coerce.number().optional(),
	date: z.coerce.date({ message: "Date is required!" }),
	present: z.boolean(),
	studentId: z.string().min(1, { message: "Student is required!" }),
	lessonId: z.coerce.number().optional(),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

export const bulkAttendanceSchema = z.object({
	date: z.coerce.date({ message: "Date is required!" }),
	classId: z.coerce.number({ message: "Class is required!" }),
	attendances: z.array(
		z.object({
			studentId: z.string(),
			present: z.boolean(),
		})
	),
});

export type BulkAttendanceSchema = z.infer<typeof bulkAttendanceSchema>;

export const eventSchema = z.object({
	id: z.coerce.number().optional(),
	title: z.string().min(1, { message: "Title is required!" }),
	description: z.string().min(1, { message: "Description is required!" }),
	startTime: z.coerce.date({ message: "Start time is required!" }),
	endTime: z.coerce.date({ message: "End time is required!" }),
	classId: z.coerce.number().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
	id: z.coerce.number().optional(),
	title: z.string().min(1, { message: "Title is required!" }),
	description: z.string().min(1, { message: "Description is required!" }),
	date: z.coerce.date({ message: "Date is required!" }),
	classId: z.coerce.number().optional(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const locationSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, { message: "Location name is required!" }),
	address: z.string().optional(),
	latitude: z.coerce.number({ message: "Latitude is required!" }),
	longitude: z.coerce.number({ message: "Longitude is required!" }),
	radius: z.coerce
		.number()
		.min(10, { message: "Radius must be at least 10 meters!" })
		.default(100),
	isActive: z.coerce.boolean().default(true),
});

export type LocationSchema = z.infer<typeof locationSchema>;

// MCQ System Validation Schemas

export const mcqTestSchema = z.object({
	id: z.coerce.number().optional(),
	title: z.string().min(1, { message: "Test title is required!" }),
	description: z.string().optional(),
	subjectId: z.coerce.number({ message: "Subject is required!" }),
	classId: z.coerce.number({ message: "Class is required!" }),
	teacherId: z.string().optional(), // Will be set from session
	duration: z.coerce
		.number()
		.min(1, { message: "Duration must be at least 1 minute!" }),
	deadline: z.coerce.date({ message: "Deadline is required!" }),
	startTime: z.coerce.date({ message: "Start time is required!" }),
	shuffleQuestions: z.coerce.boolean().default(true),
	shuffleOptions: z.coerce.boolean().default(true),
	passingScore: z.coerce.number().optional(),
	allowReview: z.coerce.boolean().default(true),
	showResults: z.coerce.boolean().default(true),
	isPublished: z.coerce.boolean().default(false),
});

export type MCQTestSchema = z.infer<typeof mcqTestSchema>;

export const mcqQuestionSchema = z.object({
	id: z.coerce.number().optional(),
	testId: z.coerce.number({ message: "Test ID is required!" }),
	questionType: z.enum(
		[
			"MULTIPLE_CHOICE",
			"MULTI_SELECT",
			"TRUE_FALSE",
			"FILL_BLANK",
			"MATCH_FOLLOWING",
		],
		{ message: "Question type is required!" }
	),
	questionText: z.string().min(1, { message: "Question text is required!" }),
	options: z.string().optional(), // Will be parsed as JSON
	correctAnswer: z.string().min(1, { message: "Correct answer is required!" }), // Will be parsed as JSON
	explanation: z.string().optional(),
	points: z.coerce
		.number()
		.min(1, { message: "Points must be at least 1!" })
		.default(1),
	negativeMarking: z.coerce
		.number()
		.min(0, { message: "Negative marking cannot be negative!" })
		.max(4, { message: "Negative marking cannot exceed 4 points!" })
		.default(0),
	order: z.coerce.number().default(1),
	imageUrl: z.string().optional(),
});

export type MCQQuestionSchema = z.infer<typeof mcqQuestionSchema>;

export const mcqAttemptSchema = z.object({
	testId: z.coerce.number({ message: "Test ID is required!" }),
	studentId: z.string().optional(), // Will be set from session
	answers: z.string(), // JSON string of answers
	timeSpent: z.coerce.number().default(0),
	tabSwitches: z.coerce.number().default(0),
	copyPasteAttempts: z.coerce.number().default(0),
});

export type MCQAttemptSchema = z.infer<typeof mcqAttemptSchema>;
