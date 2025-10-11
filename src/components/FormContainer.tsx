import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
	table:
		| "teacher"
		| "student"
		| "parent"
		| "subject"
		| "class"
		| "lesson"
		| "exam"
		| "assignment"
		| "result"
		| "attendance"
		| "event"
		| "announcement"
		| "location"
		| "mcqTest"
		| "mcqQuestion"
		| "badge"
		| "feeStructure"
		| "offlinePayment"
		| "salary"
		| "income"
		| "expense"
		| "assignFees";
	type: "create" | "update" | "delete";
	data?: any;
	id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
	let relatedData = {};

	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;
	const currentUserId = userId;

	if (type !== "delete") {
		switch (table) {
			case "subject":
				const subjectTeachers = await prisma.teacher.findMany({
					select: { id: true, name: true, surname: true },
				});
				relatedData = { teachers: subjectTeachers };
				break;
			case "class":
				const classGrades = await prisma.grade.findMany({
					select: { id: true, level: true },
				});
				const classTeachers = await prisma.teacher.findMany({
					select: { id: true, name: true, surname: true },
				});
				relatedData = { teachers: classTeachers, grades: classGrades };
				break;
			case "teacher":
				const teacherSubjects = await prisma.subject.findMany({
					select: { id: true, name: true },
				});
				relatedData = { subjects: teacherSubjects };
				break;
			case "student":
				const studentGrades = await prisma.grade.findMany({
					select: { id: true, level: true },
				});
				const studentClasses = await prisma.class.findMany({
					include: { _count: { select: { students: true } } },
				});
				const studentParents = await prisma.parent.findMany({
					select: { id: true, name: true, surname: true, createdAt: true },
					orderBy: { createdAt: "desc" }, // Newest parents first
				});
				relatedData = {
					classes: studentClasses,
					grades: studentGrades,
					parents: studentParents,
				};
				break;
			case "exam":
				const examLessons = await prisma.lesson.findMany({
					where: {
						...(role === "teacher" ? { teacherId: currentUserId! } : {}),
					},
					select: { id: true, name: true },
				});
				relatedData = { lessons: examLessons };
				break;
			case "parent":
				// Parents don't need related data
				relatedData = {};
				break;
			case "lesson":
				const lessonSubjects = await prisma.subject.findMany({
					select: { id: true, name: true },
				});
				const lessonClasses = await prisma.class.findMany({
					select: { id: true, name: true },
				});
				const lessonTeachers = await prisma.teacher.findMany({
					select: { id: true, name: true, surname: true },
				});
				relatedData = {
					subjects: lessonSubjects,
					classes: lessonClasses,
					teachers: lessonTeachers,
				};
				break;
			case "assignment":
				const assignmentLessons = await prisma.lesson.findMany({
					where: {
						...(role === "teacher" ? { teacherId: currentUserId! } : {}),
					},
					select: { id: true, name: true },
				});
				relatedData = { lessons: assignmentLessons };
				break;
			case "result":
				const resultStudents = await prisma.student.findMany({
					select: { id: true, name: true, surname: true },
				});
				const resultExams = await prisma.exam.findMany({
					select: { id: true, title: true },
				});
				const resultAssignments = await prisma.assignment.findMany({
					select: { id: true, title: true },
				});
				relatedData = {
					students: resultStudents,
					exams: resultExams,
					assignments: resultAssignments,
				};
				break;
			case "attendance":
				const attendanceStudents = await prisma.student.findMany({
					select: { id: true, name: true, surname: true },
				});
				const attendanceLessons = await prisma.lesson.findMany({
					where: {
						...(role === "teacher" ? { teacherId: currentUserId! } : {}),
					},
					select: { id: true, name: true },
				});
				relatedData = {
					students: attendanceStudents,
					lessons: attendanceLessons,
				};
				break;
			case "event":
				const eventClasses = await prisma.class.findMany({
					select: { id: true, name: true },
				});
				relatedData = { classes: eventClasses };
				break;
			case "announcement":
				const announcementClasses = await prisma.class.findMany({
					select: { id: true, name: true },
				});
				relatedData = { classes: announcementClasses };
				break;
			case "location":
				// Locations don't need related data
				relatedData = {};
				break;
			case "mcqTest":
				const mcqTestSubjects = await prisma.subject.findMany({
					select: { id: true, name: true },
				});
				const mcqTestClasses = await prisma.class.findMany({
					select: { id: true, name: true },
				});
				const mcqTestTeachers = await prisma.teacher.findMany({
					select: { id: true, name: true, surname: true },
				});
				relatedData = {
					subjects: mcqTestSubjects,
					classes: mcqTestClasses,
					teachers: mcqTestTeachers,
				};
				break;
			case "mcqQuestion":
				// Questions get testId from data prop
				relatedData = {};
				break;
			case "feeStructure":
				const feeClasses = await prisma.class.findMany({
					select: { id: true, name: true },
				});
				const feeGrades = await prisma.grade.findMany({
					select: { id: true, level: true },
				});
				relatedData = { classes: feeClasses, grades: feeGrades };
				break;
			case "offlinePayment":
				const studentFees = await prisma.studentFee.findMany({
					where: {
						status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
					},
					include: {
						student: {
							select: {
								id: true,
								name: true,
								surname: true,
								class: {
									select: {
										id: true,
										name: true,
										grade: {
											select: {
												id: true,
												level: true,
											},
										},
									},
								},
							},
						},
						feeStructure: { select: { id: true, name: true } },
					},
					orderBy: { dueDate: "asc" },
				});
				relatedData = { studentFees };
				break;
			case "salary":
				const salaryTeachers = await prisma.teacher.findMany({
					select: { id: true, name: true, surname: true },
				});
				relatedData = { teachers: salaryTeachers };
				break;
			case "income":
			case "expense":
				// No related data needed
				relatedData = {};
				break;
			case "assignFees":
				const assignFeeStructures = await prisma.feeStructure.findMany({
					where: { isActive: true },
					select: { id: true, name: true, amount: true },
					orderBy: { name: "asc" },
				});
				const assignClasses = await prisma.class.findMany({
					select: { id: true, name: true },
					orderBy: { name: "asc" },
				});
				const assignStudents = await prisma.student.findMany({
					select: { id: true, name: true, surname: true, classId: true },
					orderBy: [{ name: "asc" }, { surname: "asc" }],
				});
				relatedData = {
					feeStructures: assignFeeStructures,
					classes: assignClasses,
					students: assignStudents,
				};
				break;

			default:
				break;
		}
	}

	return (
		<div className="">
			<FormModal
				table={table}
				type={type}
				data={data}
				id={id}
				relatedData={relatedData}
			/>
		</div>
	);
};

export default FormContainer;
