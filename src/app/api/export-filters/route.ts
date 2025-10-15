/**
 * Export Filters API
 * Provides dropdown options for filtering exports
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
	try {
		const { sessionClaims } = await auth();
		const role = (sessionClaims?.metadata as { role?: string })?.role;

		if (role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized: Admin access required" },
				{ status: 403 }
			);
		}

		// Fetch all filter options in parallel
		const [classes, students, teachers, parents] = await Promise.all([
			// Classes with grade info
			prisma.class.findMany({
				include: {
					grade: true,
				},
				orderBy: { name: "asc" },
			}),

			// Students with class info
			prisma.student.findMany({
				select: {
					id: true,
					name: true,
					surname: true,
					class: {
						select: {
							name: true,
						},
					},
				},
				orderBy: [{ name: "asc" }, { surname: "asc" }],
			}),

			// Teachers
			prisma.teacher.findMany({
				select: {
					id: true,
					name: true,
					surname: true,
				},
				orderBy: [{ name: "asc" }, { surname: "asc" }],
			}),

			// Parents
			prisma.parent.findMany({
				select: {
					id: true,
					name: true,
					surname: true,
				},
				orderBy: [{ name: "asc" }, { surname: "asc" }],
			}),
		]);

		return NextResponse.json({
			classes,
			students,
			teachers,
			parents,
		});
	} catch (error) {
		console.error("Export filters error:", error);
		return NextResponse.json(
			{ error: "Failed to load filter options" },
			{ status: 500 }
		);
	}
}
