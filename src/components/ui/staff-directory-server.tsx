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

	// Hardcoded non-teaching staff for now (can be moved to database later)
	const nonTeachingStaff = [
		{
			name: "Mr. James Parker",
			role: "IT Administrator",
			department: "Technology",
			education: "B.Tech Computer Engineering",
			experience: "7 Years",
			specialization: "Network Management, System Security",
			image: "JP",
		},
		{
			name: "Ms. Maria Gonzalez",
			role: "School Nurse",
			department: "Health Services",
			education: "B.Sc. Nursing, RN License",
			experience: "11 Years",
			specialization: "Child Health, Emergency Care",
			image: "MG",
		},
		{
			name: "Mr. Ahmed Hassan",
			role: "Sports Coordinator",
			department: "Physical Education",
			education: "M.P.Ed Physical Education",
			experience: "6 Years",
			specialization: "Athletic Training, Sports Psychology",
			image: "AH",
		},
		{
			name: "Ms. Rachel Green",
			role: "Librarian",
			department: "Library Services",
			education: "M.L.I.S Library Science",
			experience: "9 Years",
			specialization: "Digital Archives, Research Support",
			image: "RG",
		},
		{
			name: "Mr. Thomas Brown",
			role: "Lab Technician",
			department: "Science Department",
			education: "B.Sc. Chemistry",
			experience: "5 Years",
			specialization: "Lab Safety, Equipment Maintenance",
			image: "TB",
		},
		{
			name: "Ms. Anna Kim",
			role: "Administrative Assistant",
			department: "Administration",
			education: "B.A. Business Administration",
			experience: "8 Years",
			specialization: "Student Records, Office Management",
			image: "AK",
		},
	];

	return (
		<StaffDirectoryClient
			teachers={transformedTeachers}
			nonTeachingStaff={nonTeachingStaff}
		/>
	);
}
