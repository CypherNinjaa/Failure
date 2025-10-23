import prisma from "@/lib/prisma";
import { StaffDirectoryClient } from "./staff-directory";

export async function StaffDirectoryServer() {
	// Fetch teachers from database
	const teachers = await prisma.teacher.findMany({
		select: {
			id: true,
			name: true,
			surname: true,
			email: true,
			phone: true,
			img: true,
			subjects: {
				select: {
					name: true,
				},
			},
			// We'll need to add these fields to the teacher data
			// For now, we'll use placeholder data for missing fields
		},
		orderBy: {
			name: "asc",
		},
	});

	// Transform database teachers to match the component interface
	const transformedTeachers = teachers.map((teacher) => ({
		id: teacher.id,
		name: `${teacher.name} ${teacher.surname}`,
		subject: teacher.subjects.map((s) => s.name).join(", ") || "General",
		education: "B.Ed, M.A.", // Placeholder - add to schema later
		experience: "5+ Years", // Placeholder - add to schema later
		specialization:
			teacher.subjects.map((s) => s.name).join(", ") || "Multiple Subjects",
		achievements: [], // Placeholder - add to schema later
		image: teacher.img || `${teacher.name[0]}${teacher.surname[0]}`,
		rating: 4.5, // Placeholder - calculate from student feedback later
		email: teacher.email || "",
		phone: teacher.phone || "",
	}));

	// Fetch support staff from database
	const supportStaffData = await prisma.supportStaff.findMany({
		where: {
			isActive: true,
		},
		orderBy: {
			displayOrder: "asc",
		},
	});

	// Transform database support staff to match the component interface
	const nonTeachingStaff = supportStaffData.map((staff) => ({
		name: staff.name,
		role: staff.role,
		department: staff.department,
		education: staff.education || "N/A",
		experience: staff.experience || "N/A",
		specialization: staff.specialization || "N/A",
		image: staff.photo,
	}));

	return (
		<StaffDirectoryClient
			teachers={transformedTeachers}
			nonTeachingStaff={nonTeachingStaff}
		/>
	);
}
