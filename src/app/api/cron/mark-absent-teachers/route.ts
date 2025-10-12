import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Cron job endpoint to automatically mark absent teachers
 * This should be called after the attendance window closes each day
 *
 * Setup options:
 * 1. Vercel Cron: Add to vercel.json
 * 2. External cron service: Call this endpoint daily
 * 3. GitHub Actions: Schedule workflow
 *
 * Security: Add CRON_SECRET to environment variables
 */
export async function GET(req: Request) {
	try {
		// Verify cron secret for security
		const authHeader = req.headers.get("authorization");
		const cronSecret = process.env.CRON_SECRET;

		if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const now = new Date();
		const today = new Date(now);
		today.setHours(0, 0, 0, 0);

		// Get attendance settings
		const settings = await prisma.attendanceSettings.findFirst({
			where: { isActive: true },
		});

		if (!settings) {
			return NextResponse.json({
				success: false,
				message: "No active attendance settings found",
			});
		}

		// Parse end time
		const [endHour, endMinute] = settings.endTime.split(":").map(Number);
		const endTime = new Date(now);
		endTime.setHours(endHour, endMinute, 0, 0);

		// Only mark absent if past end time
		if (now < endTime) {
			return NextResponse.json({
				success: false,
				message: "Attendance window still open",
				windowCloses: endTime.toISOString(),
			});
		}

		// Get all teachers
		const allTeachers = await prisma.teacher.findMany({
			select: { id: true, name: true, surname: true },
		});

		// Get today's attendance records
		const todayAttendance = await prisma.teacherAttendance.findMany({
			where: {
				date: {
					gte: today,
					lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
				},
			},
			select: { teacherId: true },
		});

		const markedTeacherIds = new Set(todayAttendance.map((a) => a.teacherId));

		// Find unmarked teachers
		const unmarkedTeachers = allTeachers.filter(
			(t) => !markedTeacherIds.has(t.id)
		);

		// Mark them as absent
		const absentRecords = await prisma.teacherAttendance.createMany({
			data: unmarkedTeachers.map((teacher) => ({
				teacherId: teacher.id,
				date: today,
				present: false,
				checkInTime: endTime,
				livenessVerified: false,
			})),
			skipDuplicates: true,
		});

		console.log(
			`[CRON] Marked ${
				absentRecords.count
			} teachers as absent for ${today.toDateString()}`
		);

		return NextResponse.json({
			success: true,
			message: "Absent teachers marked successfully",
			data: {
				date: today.toISOString(),
				totalTeachers: allTeachers.length,
				markedPresent: todayAttendance.length,
				markedAbsent: absentRecords.count,
				absentTeachers: unmarkedTeachers.map((t) => ({
					id: t.id,
					name: `${t.name} ${t.surname}`,
				})),
			},
		});
	} catch (error) {
		console.error("[CRON] Error marking absent teachers:", error);
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
