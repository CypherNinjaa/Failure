import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	// Clear existing data first
	console.log("Clearing existing data...");
	await prisma.result.deleteMany();
	await prisma.attendance.deleteMany();
	await prisma.assignment.deleteMany();
	await prisma.exam.deleteMany();
	await prisma.announcement.deleteMany();
	await prisma.event.deleteMany();
	await prisma.student.deleteMany();
	await prisma.parent.deleteMany();
	await prisma.lesson.deleteMany();
	await prisma.teacher.deleteMany();
	await prisma.class.deleteMany();
	await prisma.subject.deleteMany();
	await prisma.grade.deleteMany();
	await prisma.admin.deleteMany();
	console.log("Existing data cleared.");

	// ADMIN
	await prisma.admin.create({
		data: {
			id: "admin1",
			username: "admin1",
		},
	});
	await prisma.admin.create({
		data: {
			id: "admin2",
			username: "admin2",
		},
	});

	// GRADE
	const grades = [];
	for (let i = 1; i <= 6; i++) {
		const grade = await prisma.grade.create({
			data: {
				level: i,
			},
		});
		grades.push(grade);
	}

	// CLASS
	for (let i = 0; i < 6; i++) {
		await prisma.class.create({
			data: {
				name: `${i + 1}A`,
				gradeId: grades[i].id,
				capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
			},
		});
	}

	// SUBJECT
	const subjectData = [
		{ name: "Mathematics" },
		{ name: "Science" },
		{ name: "English" },
		{ name: "History" },
		{ name: "Geography" },
		{ name: "Physics" },
		{ name: "Chemistry" },
		{ name: "Biology" },
		{ name: "Computer Science" },
		{ name: "Art" },
	];

	const subjects = [];
	for (const subject of subjectData) {
		const createdSubject = await prisma.subject.create({ data: subject });
		subjects.push(createdSubject);
	}

	// Get classes for reference
	const classes = await prisma.class.findMany();

	// TEACHER
	for (let i = 1; i <= 15; i++) {
		await prisma.teacher.create({
			data: {
				id: `teacher${i}`, // Unique ID for the teacher
				username: `teacher${i}`,
				name: `TName${i}`,
				surname: `TSurname${i}`,
				email: `teacher${i}@example.com`,
				phone: `123-456-789${i}`,
				address: `Address${i}`,
				bloodType: "A+",
				sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
				subjects: { connect: [{ id: subjects[i % 10].id }] },
				classes: { connect: [{ id: classes[i % 6].id }] },
				birthday: new Date(
					new Date().setFullYear(new Date().getFullYear() - 30)
				),
			},
		});
	}

	// LESSON
	for (let i = 1; i <= 30; i++) {
		await prisma.lesson.create({
			data: {
				name: `Lesson${i}`,
				day: Day[
					Object.keys(Day)[
						Math.floor(Math.random() * Object.keys(Day).length)
					] as keyof typeof Day
				],
				startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
				endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
				subjectId: subjects[(i - 1) % 10].id,
				classId: classes[(i - 1) % 6].id,
				teacherId: `teacher${((i - 1) % 15) + 1}`,
			},
		});
	}

	// Get lessons for reference
	const lessons = await prisma.lesson.findMany();

	// PARENT
	for (let i = 1; i <= 25; i++) {
		await prisma.parent.create({
			data: {
				id: `parentId${i}`,
				username: `parentId${i}`,
				name: `PName ${i}`,
				surname: `PSurname ${i}`,
				email: `parent${i}@example.com`,
				phone: `123-456-789${i}`,
				address: `Address${i}`,
			},
		});
	}

	// STUDENT
	for (let i = 1; i <= 50; i++) {
		await prisma.student.create({
			data: {
				id: `student${i}`,
				username: `student${i}`,
				name: `SName${i}`,
				surname: `SSurname ${i}`,
				email: `student${i}@example.com`,
				phone: `987-654-321${i}`,
				address: `Address${i}`,
				bloodType: "O-",
				sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
				parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
				gradeId: grades[(i - 1) % 6].id,
				classId: classes[(i - 1) % 6].id,
				birthday: new Date(
					new Date().setFullYear(new Date().getFullYear() - 10)
				),
			},
		});
	}

	// EXAM
	for (let i = 1; i <= 10; i++) {
		await prisma.exam.create({
			data: {
				title: `Exam ${i}`,
				startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
				endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
				lessonId: lessons[(i - 1) % lessons.length].id,
			},
		});
	}

	// Get exams for reference
	const exams = await prisma.exam.findMany();

	// ASSIGNMENT
	for (let i = 1; i <= 10; i++) {
		await prisma.assignment.create({
			data: {
				title: `Assignment ${i}`,
				startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
				dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
				lesson: {
					connect: { id: lessons[(i - 1) % lessons.length].id },
				},
			},
		});
	}

	// Get assignments for reference
	const assignments = await prisma.assignment.findMany();

	// RESULT
	for (let i = 1; i <= 10; i++) {
		await prisma.result.create({
			data: {
				score: 90,
				studentId: `student${i}`,
				...(i <= 5
					? { examId: exams[i - 1].id }
					: { assignmentId: assignments[i - 6].id }),
			},
		});
	}

	// ATTENDANCE
	for (let i = 1; i <= 10; i++) {
		await prisma.attendance.create({
			data: {
				date: new Date(),
				present: true,
				studentId: `student${i}`,
				lessonId: lessons[(i - 1) % lessons.length].id,
			},
		});
	}

	// EVENT
	for (let i = 1; i <= 5; i++) {
		await prisma.event.create({
			data: {
				title: `Event ${i}`,
				description: `Description for Event ${i}`,
				startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
				endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
				classId: classes[(i - 1) % 5].id,
			},
		});
	}

	// ANNOUNCEMENT
	for (let i = 1; i <= 5; i++) {
		await prisma.announcement.create({
			data: {
				title: `Announcement ${i}`,
				description: `Description for Announcement ${i}`,
				date: new Date(),
				classId: classes[(i - 1) % 5].id,
			},
		});
	}

	console.log("Seeding completed successfully.");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
