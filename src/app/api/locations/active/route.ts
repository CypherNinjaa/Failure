import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Force dynamic rendering - required for database access
export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const locations = await prisma.location.findMany({
			where: {
				isActive: true,
			},
			select: {
				id: true,
				name: true,
				latitude: true,
				longitude: true,
				radius: true,
				isActive: true,
			},
		});

		return NextResponse.json(locations);
	} catch (error) {
		console.error("Error fetching locations:", error);
		return NextResponse.json(
			{ error: "Failed to fetch locations" },
			{ status: 500 }
		);
	}
}
