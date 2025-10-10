import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		// Only admin can update settings
		if (role !== "admin") {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 403 }
			);
		}

		const body = await req.json();
		const { startTime, endTime, isActive } = body;

		// Validate time format (HH:MM)
		const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
		if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
			return NextResponse.json(
				{ success: false, message: "Invalid time format. Use HH:MM format" },
				{ status: 400 }
			);
		}

		// Validate that end time is after start time
		const [startHour, startMin] = startTime.split(":").map(Number);
		const [endHour, endMin] = endTime.split(":").map(Number);
		const startMinutes = startHour * 60 + startMin;
		const endMinutes = endHour * 60 + endMin;

		if (endMinutes <= startMinutes) {
			return NextResponse.json(
				{
					success: false,
					message: "End time must be after start time",
				},
				{ status: 400 }
			);
		}

		// Deactivate all existing settings
		await prisma.attendanceSettings.updateMany({
			where: { isActive: true },
			data: { isActive: false },
		});

		// Create new settings
		await prisma.attendanceSettings.create({
			data: {
				startTime,
				endTime,
				isActive,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Settings updated successfully",
		});
	} catch (error) {
		console.error("Error updating attendance settings:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const settings = await prisma.attendanceSettings.findFirst({
			where: { isActive: true },
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json({
			success: true,
			data: settings,
		});
	} catch (error) {
		console.error("Error fetching attendance settings:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
