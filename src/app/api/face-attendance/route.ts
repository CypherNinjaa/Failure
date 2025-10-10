import { NextRequest, NextResponse } from "next/server";
import { createFaceRecognitionAttendance } from "@/lib/actions";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
	try {
		const { sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		// Only teachers and admins can record attendance
		if (role !== "teacher" && role !== "admin") {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const { studentIds, classId, date } = body;

		const result = await createFaceRecognitionAttendance(
			studentIds,
			classId,
			date ? new Date(date) : undefined
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Face attendance API error:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
