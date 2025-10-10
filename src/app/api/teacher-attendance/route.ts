import { NextRequest, NextResponse } from "next/server";
import { createTeacherAttendance } from "@/lib/actions";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
	try {
		const { sessionClaims, userId } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		// Only teachers can mark their own attendance, admins can mark any
		if (role !== "teacher" && role !== "admin") {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const {
			teacherId,
			date,
			locationId,
			latitude,
			longitude,
			livenessVerified,
		} = body;

		// If teacher, ensure they're marking their own attendance
		if (role === "teacher" && teacherId !== userId) {
			return NextResponse.json(
				{ success: false, message: "You can only mark your own attendance" },
				{ status: 403 }
			);
		}

		const result = await createTeacherAttendance(
			teacherId,
			date ? new Date(date) : new Date(),
			locationId,
			latitude,
			longitude,
			livenessVerified
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Teacher attendance API error:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
