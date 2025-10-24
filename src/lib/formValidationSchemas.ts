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
	description: z.string().optional(),
	pdfLink: z
		.string()
		.url({ message: "Must be a valid URL" })
		.optional()
		.or(z.literal("")),
	imageUrl: z.string().optional(),
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

// MCQ Validation Schemas
export const mcqTestSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, { message: "Test title is required!" }),
	description: z.string().optional(),
	subjectId: z.coerce.number().optional(),
	classId: z.coerce.number().optional(),
	teacherId: z.string().min(1, { message: "Teacher is required!" }),
});

export type MCQTestSchema = z.infer<typeof mcqTestSchema>;

export const mcqQuestionSchema = z
	.object({
		id: z.string().optional(),
		testId: z.string().min(1, { message: "Test is required!" }),
		question: z.string().min(1, { message: "Question is required!" }),
		answer: z.string().optional(), // Optional for OPEN_ENDED, used as reference answer
		options: z.array(z.string()).optional(), // Optional for OPEN_ENDED
		questionType: z
			.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "OPEN_ENDED"])
			.default("MULTIPLE_CHOICE"),
		explanation: z.string().optional(),
		orderIndex: z.coerce.number().default(0),
	})
	.refine(
		(data) => {
			// For MULTIPLE_CHOICE and TRUE_FALSE, require options and answer
			if (data.questionType === "OPEN_ENDED") {
				return true; // OPEN_ENDED doesn't require options or answer
			}
			return (
				data.options &&
				data.options.length >= 2 &&
				data.answer &&
				data.answer.trim().length > 0
			);
		},
		{
			message:
				"Multiple Choice and True/False questions require at least 2 options and a correct answer",
			path: ["options"],
		}
	);

export type MCQQuestionSchema = z.infer<typeof mcqQuestionSchema>;

export const mcqAttemptSchema = z.object({
	id: z.string().optional(),
	testId: z.string().min(1, { message: "Test is required!" }),
	studentId: z.string().min(1, { message: "Student is required!" }),
	totalQuestions: z.coerce.number().min(1),
});

export type MCQAttemptSchema = z.infer<typeof mcqAttemptSchema>;

export const studentAnswerSchema = z.object({
	attemptId: z.string().min(1, { message: "Attempt is required!" }),
	questionId: z.string().min(1, { message: "Question is required!" }),
	userAnswer: z.string().min(1, { message: "Answer is required!" }),
});

export type StudentAnswerSchema = z.infer<typeof studentAnswerSchema>;

// ============================================
// FINANCE SYSTEM SCHEMAS
// ============================================

export const feeStructureSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, { message: "Fee name is required!" }),
	description: z.string().optional(),
	amount: z.coerce.number().min(0, { message: "Amount must be positive!" }),
	frequency: z.enum(
		["MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL", "ONE_TIME"],
		{
			message: "Frequency is required!",
		}
	),
	feeType: z.enum(
		[
			"TUITION",
			"TRANSPORT",
			"LIBRARY",
			"EXAM",
			"SPORTS",
			"LAB",
			"ADMISSION",
			"HOSTEL",
			"OTHER",
		],
		{
			message: "Fee type is required!",
		}
	),
	classId: z.coerce.number().optional(),
	gradeId: z.coerce.number().optional(),
});

export type FeeStructureSchema = z.infer<typeof feeStructureSchema>;

export const offlinePaymentSchema = z.object({
	studentFeeId: z.string().min(1, { message: "Student fee is required!" }),
	amount: z.coerce
		.number()
		.min(1, { message: "Amount must be greater than 0!" }),
	paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER", "CHEQUE", "OTHER"], {
		message: "Payment method is required!",
	}),
	notes: z.string().optional(),
});

export type OfflinePaymentSchema = z.infer<typeof offlinePaymentSchema>;

export const onlinePaymentSchema = z.object({
	studentFeeId: z.string().min(1, { message: "Student fee is required!" }),
	amount: z.coerce
		.number()
		.min(1, { message: "Amount must be greater than 0!" }),
	transactionId: z.string().min(1, { message: "Transaction ID is required!" }),
	screenshot: z.string().min(1, { message: "Payment screenshot is required!" }),
});

export type OnlinePaymentSchema = z.infer<typeof onlinePaymentSchema>;

export const salarySchema = z.object({
	id: z.string().optional(),
	teacherId: z.string().optional(),
	staffName: z.string().optional(),
	amount: z.coerce.number().min(0, { message: "Amount must be positive!" }),
	month: z.coerce.number().min(1).max(12, { message: "Invalid month!" }),
	year: z.coerce.number().min(2020, { message: "Invalid year!" }),
	status: z.enum(["PENDING", "PAID"], { message: "Status is required!" }),
	notes: z.string().optional(),
});

export type SalarySchema = z.infer<typeof salarySchema>;

export const incomeSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, { message: "Title is required!" }),
	source: z.string().min(1, { message: "Source is required!" }),
	amount: z.coerce.number().min(0, { message: "Amount must be positive!" }),
	category: z.enum(
		["DONATION", "EVENT", "SPONSORSHIP", "ADMISSION_FEE", "OTHER"],
		{
			message: "Category is required!",
		}
	),
	date: z.coerce.date({ message: "Date is required!" }),
	description: z.string().optional(),
});

export type IncomeSchema = z.infer<typeof incomeSchema>;

export const expenseSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, { message: "Title is required!" }),
	amount: z.coerce.number().min(0, { message: "Amount must be positive!" }),
	category: z.enum(
		[
			"SALARY",
			"UTILITIES",
			"SUPPLIES",
			"MAINTENANCE",
			"TRANSPORT",
			"FOOD",
			"INFRASTRUCTURE",
			"OTHER",
		],
		{
			message: "Category is required!",
		}
	),
	date: z.coerce.date({ message: "Date is required!" }),
	description: z.string().optional(),
	receipt: z.string().optional(),
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;

export const paymentConfigSchema = z.object({
	upiId: z.string().optional(),
	upiQRCode: z.string().optional(),
	bankName: z.string().optional(),
	accountNumber: z.string().optional(),
	ifscCode: z.string().optional(),
	instructions: z.string().optional(),
});

export type PaymentConfigSchema = z.infer<typeof paymentConfigSchema>;

export const notificationSchema = z.object({
	recipientType: z.enum(["STUDENT", "PARENT", "TEACHER", "ALL"], {
		message: "Recipient type is required!",
	}),
	recipientId: z.string().optional(),
	title: z.string().min(1, { message: "Title is required!" }),
	message: z.string().min(1, { message: "Message is required!" }),
	type: z.enum(
		[
			"FEE_REMINDER",
			"PAYMENT_APPROVED",
			"PAYMENT_REJECTED",
			"FEE_DUE",
			"GENERAL",
		],
		{
			message: "Notification type is required!",
		}
	),
	sendEmail: z.boolean().default(false),
	sendWebPush: z.boolean().default(true),
});

export type NotificationSchema = z.infer<typeof notificationSchema>;

export const gallerySchema = z.object({
	id: z.coerce.number().optional(),
	type: z.enum(["IMAGE", "VIDEO"], {
		message: "Type is required!",
	}),
	src: z.string().min(1, { message: "Image/Video URL is required!" }),
	title: z.string().min(1, { message: "Title is required!" }),
	description: z.string().min(1, { message: "Description is required!" }),
	location: z.string().optional().or(z.literal("")),
	category: z.enum(["FACILITY", "EVENT", "ACTIVITY", "ACHIEVEMENT"], {
		message: "Category is required!",
	}),
	isActive: z.boolean().default(true),
	displayOrder: z.coerce.number().default(0),
});

export type GallerySchema = z.infer<typeof gallerySchema>;

export const newsTickerSchema = z.object({
	id: z.coerce.number().optional(),
	icon: z.string().min(1, { message: "Icon is required!" }),
	text: z.string().min(1, { message: "Text is required!" }),
	type: z.enum(["EVENT", "FACILITY", "ACHIEVEMENT", "ANNOUNCEMENT"], {
		message: "Type is required!",
	}),
	isActive: z.boolean().default(true),
	displayOrder: z.coerce.number().default(0),
});

export type NewsTickerSchema = z.infer<typeof newsTickerSchema>;

export const statSchema = z.object({
	id: z.coerce.number().optional(),
	value: z.coerce.number().min(1, { message: "Value is required!" }),
	suffix: z.string().default(""),
	label: z.string().min(1, { message: "Label is required!" }),
	emoji: z.string().min(1, { message: "Emoji is required!" }),
	iconName: z.string().min(1, { message: "Icon name is required!" }),
	gradient: z.string().min(1, { message: "Gradient is required!" }),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type StatSchema = z.infer<typeof statSchema>;

export const testimonialSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, { message: "Name is required!" }),
	role: z.string().min(1, { message: "Role is required!" }),
	avatar: z.string().min(1, { message: "Avatar is required!" }),
	content: z
		.string()
		.min(10, { message: "Content must be at least 10 characters!" })
		.max(500, { message: "Content must not exceed 500 characters!" }),
	rating: z.coerce.number().min(1).max(5).default(5),
	gradient: z.string().min(1, { message: "Gradient is required!" }),
	email: z
		.string()
		.email({ message: "Invalid email address!" })
		.optional()
		.or(z.literal("")),
	phone: z.string().optional().or(z.literal("")),
	displayOrder: z.coerce.number().default(0),
});

export type TestimonialSchema = z.infer<typeof testimonialSchema>;

// ===== ABOUT PAGE SCHEMAS =====

export const timelineEventSchema = z.object({
	id: z.coerce.number().optional(),
	year: z.string().min(1, { message: "Year is required!" }),
	title: z.string().min(1, { message: "Title is required!" }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters!" }),
	icon: z.string().min(1, { message: "Icon/Emoji is required!" }),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type TimelineEventSchema = z.infer<typeof timelineEventSchema>;

export const principalInfoSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, { message: "Name is required!" }),
	title: z.string().min(1, { message: "Title is required!" }),
	qualifications: z
		.string()
		.min(1, { message: "Qualifications are required!" }),
	photo: z.string().min(1, { message: "Photo/Initials are required!" }),
	message: z
		.string()
		.min(20, { message: "Message must be at least 20 characters!" }),
	messageAudio: z.string().optional().or(z.literal("")),
	email: z
		.string()
		.email({ message: "Invalid email address!" })
		.optional()
		.or(z.literal("")),
	phone: z.string().optional().or(z.literal("")),
	experience: z.string().optional().or(z.literal("")),
	specialization: z.string().optional().or(z.literal("")),
	isActive: z.boolean().default(true),
});

export type PrincipalInfoSchema = z.infer<typeof principalInfoSchema>;

export const leadershipMemberSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, { message: "Name is required!" }),
	position: z.string().min(1, { message: "Position is required!" }),
	category: z
		.enum(["leadership", "academic", "administrative"])
		.default("leadership"),
	experience: z.string().optional().or(z.literal("")),
	education: z.string().optional().or(z.literal("")),
	photo: z.string().min(1, { message: "Photo/Initials are required!" }),
	email: z
		.string()
		.email({ message: "Invalid email address!" })
		.optional()
		.or(z.literal("")),
	phone: z.string().optional().or(z.literal("")),
	specialization: z.string().optional().or(z.literal("")),
	bio: z.string().optional().or(z.literal("")),
	quote: z.string().optional().or(z.literal("")),
	linkedIn: z.string().optional().or(z.literal("")),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type LeadershipMemberSchema = z.infer<typeof leadershipMemberSchema>;

// Support Staff Schema
export const supportStaffSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, { message: "Name is required!" }),
	role: z.string().min(1, { message: "Role is required!" }),
	department: z.string().min(1, { message: "Department is required!" }),
	education: z.string().optional().or(z.literal("")),
	experience: z.string().optional().or(z.literal("")),
	specialization: z.string().optional().or(z.literal("")),
	photo: z.string().min(1, { message: "Photo/Initials are required!" }),
	email: z
		.string()
		.email({ message: "Invalid email address!" })
		.optional()
		.or(z.literal("")),
	phone: z.string().optional().or(z.literal("")),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type SupportStaffSchema = z.infer<typeof supportStaffSchema>;

// Infrastructure Highlights Schemas
export const facilitySchema = z.object({
	id: z.coerce.number().optional(),
	title: z.string().min(1, { message: "Title is required!" }),
	description: z.string().min(1, { message: "Description is required!" }),
	icon: z.string().min(1, { message: "Icon name is required!" }),
	features: z.string().min(1, { message: "At least one feature is required!" }), // Comma-separated string
	image: z.string().min(1, { message: "Image/Emoji is required!" }),
	color: z.string().min(1, { message: "Color gradient is required!" }),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type FacilitySchema = z.infer<typeof facilitySchema>;

export const additionalFeatureSchema = z.object({
	id: z.coerce.number().optional(),
	title: z.string().min(1, { message: "Title is required!" }),
	description: z.string().min(1, { message: "Description is required!" }),
	icon: z.string().min(1, { message: "Icon name is required!" }),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type AdditionalFeatureSchema = z.infer<typeof additionalFeatureSchema>;

export const campusStatSchema = z.object({
	id: z.coerce.number().optional(),
	number: z.string().min(1, { message: "Number/Value is required!" }),
	label: z.string().min(1, { message: "Label is required!" }),
	icon: z.string().min(1, { message: "Icon/Emoji is required!" }),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type CampusStatSchema = z.infer<typeof campusStatSchema>;

// Awards & Achievements Schemas
export const awardSchema = z.object({
	id: z.coerce.number().optional(),
	year: z.string().min(1, { message: "Year is required!" }),
	title: z.string().min(1, { message: "Title is required!" }),
	organization: z.string().min(1, { message: "Organization is required!" }),
	description: z.string().min(1, { message: "Description is required!" }),
	category: z.string().min(1, { message: "Category is required!" }),
	icon: z.string().min(1, { message: "Icon name is required!" }),
	color: z.string().min(1, { message: "Color gradient is required!" }),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type AwardSchema = z.infer<typeof awardSchema>;

export const achievementMetricSchema = z.object({
	id: z.coerce.number().optional(),
	metric: z.string().min(1, { message: "Metric value is required!" }),
	description: z.string().min(1, { message: "Description is required!" }),
	detail: z.string().min(1, { message: "Detail is required!" }),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type AchievementMetricSchema = z.infer<typeof achievementMetricSchema>;

export const studentAchievementSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, { message: "Achievement name is required!" }),
	year: z.string().min(1, { message: "Year is required!" }),
	winners: z.string().min(1, { message: "Winners info is required!" }),
	icon: z.string().min(1, { message: "Icon/Emoji is required!" }),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type StudentAchievementSchema = z.infer<typeof studentAchievementSchema>;

// Gallery Album Schema
export const galleryAlbumSchema = z.object({
	id: z.coerce.number().optional(),
	type: z.enum(["IMAGE", "VIDEO"], {
		message: "Type must be either IMAGE or VIDEO!",
	}),
	src: z.string().min(1, { message: "Image/Video URL is required!" }),
	title: z.string().min(1, { message: "Title is required!" }).max(200),
	description: z
		.string()
		.min(1, { message: "Description is required!" })
		.max(500),
	category: z.enum(
		[
			"EVENTS",
			"SPORTS",
			"ACADEMICS",
			"CULTURAL",
			"ACHIEVEMENTS",
			"TESTIMONIALS",
		],
		{
			message: "Please select a valid category!",
		}
	),
	eventDate: z.coerce.date().optional().or(z.literal("")),
	photographer: z.string().max(100).optional().or(z.literal("")),
	duration: z.string().max(10).optional().or(z.literal("")), // For videos (e.g., "15:30")
	thumbnail: z.string().max(100).optional().or(z.literal("")), // Tailwind gradient classes
	likes: z.coerce.number().default(0),
	views: z.coerce.number().default(0),
	featured: z.boolean().default(false),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export type GalleryAlbumSchema = z.infer<typeof galleryAlbumSchema>;
