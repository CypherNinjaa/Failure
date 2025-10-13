import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const { userId } = auth();
		return NextResponse.json({ userId });
	} catch (error) {
		console.error("Get current user error:", error);
		return NextResponse.json({ userId: null }, { status: 500 });
	}
}
