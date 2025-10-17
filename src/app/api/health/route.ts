import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Health Check Endpoint for Railway
 * Tests database connectivity and returns service status
 */
export async function GET() {
	try {
		// Check database connection
		await prisma.$queryRaw`SELECT 1`;

		return NextResponse.json(
			{
				status: "healthy",
				timestamp: new Date().toISOString(),
				database: "connected",
				service: "school-management-system",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Health check failed:", error);

		return NextResponse.json(
			{
				status: "unhealthy",
				timestamp: new Date().toISOString(),
				database: "disconnected",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 503 }
		);
	}
}
