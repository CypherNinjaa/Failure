import prisma from "@/lib/prisma";
import BulkAttendanceForm from "@/components/forms/BulkAttendanceForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ClassAttendancePage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only admin and teachers can take attendance
	if (role !== "admin" && role !== "teacher") {
		redirect("/");
	}

	const { id } = await params;
	const classId = parseInt(id);

	// Fetch class with students
	const classData = await prisma.class.findUnique({
		where: { id: classId },
		include: {
			students: {
				select: {
					id: true,
					name: true,
					surname: true,
				},
				orderBy: {
					name: "asc",
				},
			},
			grade: {
				select: {
					level: true,
				},
			},
		},
	});

	if (!classData) {
		return <div>Class not found</div>;
	}

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			<h1 className="text-xl font-semibold mb-4">
				Take Attendance - Class {classData.name} (Grade {classData.grade.level})
			</h1>
			<p className="text-gray-500 mb-6">
				{classData.students.length} students enrolled
			</p>
			<BulkAttendanceForm classId={classId} students={classData.students} />
		</div>
	);
};

export default ClassAttendancePage;
