import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { triggerPusherEvent } from "@/lib/pusher";

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { status } = await req.json();

		if (status === "online") {
			await triggerPusherEvent("online-status", "user-online", { userId });
		} else if (status === "offline") {
			await triggerPusherEvent("online-status", "user-offline", { userId });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Online status error:", error);
		return NextResponse.json(
			{ error: "Failed to update status" },
			{ status: 500 }
		);
	}
}
