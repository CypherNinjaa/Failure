import { z } from "zod";

// Authentication schemas
export const loginSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
	.object({
		email: z.string().email("Invalid email format"),
		username: z.string().min(3, "Username must be at least 3 characters"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
		role: z.enum([
			"STUDENT",
			"TEACHER",
			"PARENT",
			"ADMIN",
			"STUDENT_COORDINATOR",
			"LIBRARIAN",
			"MEDIA_COORDINATOR",
		]),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

// Profile schemas
export const userProfileSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	phone: z.string().optional(),
	address: z.string().optional(),
	dateOfBirth: z.string().optional(),
	emergencyContact: z.string().optional(),
});

// Student schemas
export const studentSchema = z.object({
	studentId: z.string().min(1, "Student ID is required"),
	classId: z.string().min(1, "Class is required"),
	rollNumber: z.string().min(1, "Roll number is required"),
	admissionDate: z.string(),
	parentId: z.string().optional(),
});

// Teacher schemas
export const teacherSchema = z.object({
	teacherId: z.string().min(1, "Teacher ID is required"),
	subject: z.string().min(1, "Subject is required"),
	qualification: z.string().min(1, "Qualification is required"),
	experience: z.number().min(0, "Experience cannot be negative"),
	joiningDate: z.string(),
	salary: z.number().min(0, "Salary cannot be negative"),
});

// Assignment schemas
export const assignmentSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	dueDate: z.string(),
	maxMarks: z.number().min(1, "Max marks must be at least 1"),
	studentId: z.string().min(1, "Student is required"),
});

// MCQ Test schemas
export const mcqTestSchema = z.object({
	title: z.string().min(1, "Title is required"),
	subjectId: z.string().min(1, "Subject is required"),
	timeLimit: z.number().min(1, "Time limit must be at least 1 minute"),
	totalMarks: z.number().min(1, "Total marks must be at least 1"),
	scheduledAt: z.string(),
});

export const mcqQuestionSchema = z.object({
	question: z.string().min(1, "Question is required"),
	optionA: z.string().min(1, "Option A is required"),
	optionB: z.string().min(1, "Option B is required"),
	optionC: z.string().min(1, "Option C is required"),
	optionD: z.string().min(1, "Option D is required"),
	correct: z.enum(["A", "B", "C", "D"]),
	marks: z.number().min(1, "Marks must be at least 1"),
});

// Attendance schemas
export const attendanceSchema = z.object({
	studentId: z.string().min(1, "Student is required"),
	date: z.string(),
	status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY"]),
	remarks: z.string().optional(),
});

// Fee payment schemas
export const feePaymentSchema = z.object({
	studentId: z.string().min(1, "Student is required"),
	amount: z.number().min(0, "Amount cannot be negative"),
	feeType: z.enum([
		"TUITION",
		"TRANSPORT",
		"LIBRARY",
		"SPORTS",
		"EXAM",
		"MISC",
	]),
	paymentMethod: z.enum(["CASH", "ONLINE", "CHEQUE", "CARD"]),
	dueDate: z.string(),
	remarks: z.string().optional(),
});

// Class schemas
export const classSchema = z.object({
	name: z.string().min(1, "Class name is required"),
	grade: z.number().min(1, "Grade must be at least 1"),
	section: z.string().min(1, "Section is required"),
	capacity: z.number().min(1, "Capacity must be at least 1"),
	teacherId: z.string().min(1, "Teacher is required"),
});

// Subject schemas
export const subjectSchema = z.object({
	name: z.string().min(1, "Subject name is required"),
	code: z.string().min(1, "Subject code is required"),
	classId: z.string().min(1, "Class is required"),
	credits: z.number().min(1, "Credits must be at least 1"),
});

// Exam schemas
export const examSchema = z.object({
	title: z.string().min(1, "Exam title is required"),
	subjectId: z.string().min(1, "Subject is required"),
	date: z.string(),
	duration: z.number().min(1, "Duration must be at least 1 minute"),
	maxMarks: z.number().min(1, "Max marks must be at least 1"),
});

// News article schemas
export const newsArticleSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	excerpt: z.string().optional(),
	imageUrl: z.string().url().optional(),
	status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

// Book schemas
export const bookSchema = z.object({
	title: z.string().min(1, "Book title is required"),
	author: z.string().min(1, "Author is required"),
	isbn: z.string().min(1, "ISBN is required"),
	category: z.string().min(1, "Category is required"),
	totalCopies: z.number().min(1, "Total copies must be at least 1"),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type TeacherInput = z.infer<typeof teacherSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type MCQTestInput = z.infer<typeof mcqTestSchema>;
export type MCQQuestionInput = z.infer<typeof mcqQuestionSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type FeePaymentInput = z.infer<typeof feePaymentSchema>;
export type ClassInput = z.infer<typeof classSchema>;
export type SubjectInput = z.infer<typeof subjectSchema>;
export type ExamInput = z.infer<typeof examSchema>;
export type NewsArticleInput = z.infer<typeof newsArticleSchema>;
export type BookInput = z.infer<typeof bookSchema>;
