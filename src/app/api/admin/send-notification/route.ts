import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { adminSendNotification } from "@/lib/notificationActions";

export async function POST(req: Request) {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		return NextResponse.json(
			{ success: false, error: "Unauthorized" },
			{ status: 403 }
		);
	}

	try {
		const { recipientType, categoryKey, title, message, channels } =
			await req.json();

		const result = await adminSendNotification(
			recipientType,
			categoryKey,
			title,
			message,
			undefined,
			{ channels }
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Send notification API error:", error);
		return NextResponse.json({ success: false, error: true }, { status: 500 });
	}
}
