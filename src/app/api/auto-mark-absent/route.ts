import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
	try {
		// Get the current date and time
		const now = new Date();
		const today = new Date(now);
		today.setHours(0, 0, 0, 0);

		// Get attendance settings
		const settings = await prisma.attendanceSettings.findFirst({
			where: { isActive: true },
		});

		if (!settings) {
			return NextResponse.json(
				{ success: false, message: "No active attendance settings found" },
				{ status: 404 }
			);
		}

		// Parse end time from settings
		const [endHour, endMinute] = settings.endTime.split(":").map(Number);
		const endTime = new Date(now);
		endTime.setHours(endHour, endMinute, 0, 0);

		// Check if current time is past the end time
		if (now < endTime) {
			return NextResponse.json({
				success: false,
				message: "Attendance window is still open",
				currentTime: now.toISOString(),
				endTime: endTime.toISOString(),
			});
		}

		// Get all active teachers
		const allTeachers = await prisma.teacher.findMany({
			select: {
				id: true,
				name: true,
				surname: true,
			},
		});

		// Get teachers who already marked attendance today
		const presentTeachers = await prisma.teacherAttendance.findMany({
			where: {
				date: {
					gte: today,
					lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
				},
			},
			select: {
				teacherId: true,
			},
		});

		const presentTeacherIds = new Set(presentTeachers.map((t) => t.teacherId));

		// Find teachers who didn't mark attendance
		const absentTeachers = allTeachers.filter(
			(teacher) => !presentTeacherIds.has(teacher.id)
		);

		// Mark absent teachers
		const absentRecords = await Promise.all(
			absentTeachers.map((teacher) =>
				prisma.teacherAttendance.create({
					data: {
						teacherId: teacher.id,
						date: today,
						present: false,
						checkInTime: endTime, // Use end time as check-in time for absent
						livenessVerified: false,
					},
				})
			)
		);

		return NextResponse.json({
			success: true,
			message: "Absent teachers marked successfully",
			data: {
				totalTeachers: allTeachers.length,
				presentCount: presentTeachers.length,
				absentCount: absentRecords.length,
				absentTeachers: absentTeachers.map((t) => ({
					id: t.id,
					name: `${t.name} ${t.surname}`,
				})),
				markedAt: now.toISOString(),
			},
		});
	} catch (error) {
		console.error("Error marking absent teachers:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to mark absent teachers",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// GET endpoint to check status without marking
export async function GET() {
	try {
		const now = new Date();
		const today = new Date(now);
		today.setHours(0, 0, 0, 0);

		const settings = await prisma.attendanceSettings.findFirst({
			where: { isActive: true },
		});

		if (!settings) {
			return NextResponse.json(
				{ success: false, message: "No active attendance settings found" },
				{ status: 404 }
			);
		}

		const [endHour, endMinute] = settings.endTime.split(":").map(Number);
		const endTime = new Date(now);
		endTime.setHours(endHour, endMinute, 0, 0);

		const allTeachers = await prisma.teacher.findMany({
			select: {
				id: true,
				name: true,
				surname: true,
			},
		});

		const presentTeachers = await prisma.teacherAttendance.findMany({
			where: {
				date: {
					gte: today,
					lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
				},
			},
			select: {
				teacherId: true,
				present: true,
			},
		});

		const presentTeacherIds = new Set(
			presentTeachers.filter((t) => t.present).map((t) => t.teacherId)
		);
		const absentTeacherIds = new Set(
			presentTeachers.filter((t) => !t.present).map((t) => t.teacherId)
		);

		const notMarkedYet = allTeachers.filter(
			(teacher) =>
				!presentTeacherIds.has(teacher.id) && !absentTeacherIds.has(teacher.id)
		);

		return NextResponse.json({
			success: true,
			data: {
				currentTime: now.toISOString(),
				attendanceWindow: {
					startTime: settings.startTime,
					endTime: settings.endTime,
					isOpen: now < endTime,
				},
				totalTeachers: allTeachers.length,
				presentCount: presentTeacherIds.size,
				absentCount: absentTeacherIds.size,
				notMarkedYet: notMarkedYet.length,
				teachersNotMarked: notMarkedYet.map((t) => ({
					id: t.id,
					name: `${t.name} ${t.surname}`,
				})),
			},
		});
	} catch (error) {
		console.error("Error checking attendance status:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to check attendance status",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
