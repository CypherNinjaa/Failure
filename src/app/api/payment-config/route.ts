import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const config = await prisma.paymentConfig.findFirst({
			where: { id: 1 },
		});

		return NextResponse.json(config);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to fetch payment config" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const { sessionClaims } = auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const body = await req.json();
		const { upiId, upiQRCode } = body;

		// Upsert payment config
		const config = await prisma.paymentConfig.upsert({
			where: { id: 1 },
			update: {
				upiId,
				upiQRCode,
			},
			create: {
				id: 1,
				upiId,
				upiQRCode,
			},
		});

		return NextResponse.json(config);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to save payment config" },
			{ status: 500 }
		);
	}
}
