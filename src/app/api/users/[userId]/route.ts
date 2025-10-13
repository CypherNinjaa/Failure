import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
	request: NextRequest,
	{ params }: { params: { userId: string } }
) {
	try {
		const { userId: currentUserId } = auth();
		if (!currentUserId) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const targetUserId = params.userId;

		// Try to find as student first
		let user = await prisma.student.findUnique({
			where: { id: targetUserId },
			select: {
				name: true,
				surname: true,
				email: true,
				phone: true,
				img: true,
				birthday: true,
				sex: true,
			},
		});

		// If not student, try teacher
		if (!user) {
			user = await prisma.teacher.findUnique({
				where: { id: targetUserId },
				select: {
					name: true,
					surname: true,
					email: true,
					phone: true,
					img: true,
					birthday: true,
					sex: true,
				},
			});
		}

		// If not teacher, try parent
		if (!user) {
			const parent = await prisma.parent.findUnique({
				where: { id: targetUserId },
				select: {
					name: true,
					surname: true,
					email: true,
					phone: true,
				},
			});

			// Add missing fields for parent to match the type
			if (parent) {
				user = {
					...parent,
					img: null,
					birthday: null as any,
					sex: null as any,
				};
			}
		}

		if (!user) {
			return NextResponse.json(
				{ success: false, error: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			user,
		});
	} catch (error) {
		console.error("Error fetching user details:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch user details" },
			{ status: 500 }
		);
	}
}
