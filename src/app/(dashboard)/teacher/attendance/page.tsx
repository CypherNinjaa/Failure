import { auth } from "@clerk/nextjs/server";
import TeacherFaceAttendanceClient from "@/components/TeacherFaceAttendanceClient";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const TeacherSelfAttendancePage = async () => {
	const { sessionClaims, userId } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only teachers can access this page
	if (role !== "teacher") {
		redirect("/");
	}

	if (!userId) {
		redirect("/sign-in");
	}

	// Fetch teacher data
	const teacher = await prisma.teacher.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			surname: true,
			img: true,
		},
	});

	if (!teacher) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
					<p className="text-red-800">Teacher profile not found.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
			{/* LEFT */}
			<div className="w-full xl:w-2/3">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-lg font-semibold hidden md:block">
						Mark Your Attendance
					</h1>
					<Link
						href="/list/teacher-attendance"
						className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Back to Attendance List
					</Link>
				</div>
				<TeacherFaceAttendanceClient teacher={teacher} />
			</div>

			{/* RIGHT */}
			<div className="w-full xl:w-1/3">
				<div className="bg-white p-4 rounded-md">
					<h1 className="text-xl font-semibold mb-4">Your Profile</h1>
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-4">
							{teacher.img ? (
								<Image
									src={teacher.img}
									alt={`${teacher.name} ${teacher.surname}`}
									width={96}
									height={96}
									className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
								/>
							) : (
								<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
									<svg
										className="w-12 h-12 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
							)}
							<div>
								<h3 className="font-semibold text-lg">
									{teacher.name} {teacher.surname}
								</h3>
								<p className="text-sm text-gray-500">Teacher</p>
							</div>
						</div>

						{!teacher.img && (
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
								<p className="text-sm text-yellow-800">
									⚠️ No profile photo found. Please upload a clear photo to use
									face recognition attendance.
								</p>
							</div>
						)}

						<div className="border-t pt-4">
							<h3 className="font-semibold mb-3 text-gray-700">
								Security Features:
							</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-start gap-2">
									<svg
										className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span>Location verification</span>
								</li>
								<li className="flex items-start gap-2">
									<svg
										className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span>Liveness detection (anti-spoofing)</span>
								</li>
								<li className="flex items-start gap-2">
									<svg
										className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span>AI-powered face recognition</span>
								</li>
							</ul>
						</div>

						<div className="border-t pt-4">
							<h3 className="font-semibold mb-2 text-gray-700">Quick Tips:</h3>
							<ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
								<li>Ensure good lighting for face detection</li>
								<li>Remove glasses or hats if possible</li>
								<li>Complete all verification steps</li>
								<li>Location services must be enabled</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeacherSelfAttendancePage;
