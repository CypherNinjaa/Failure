import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import FaceRecognitionAttendanceClient from "@/components/FaceRecognitionAttendanceClient";
import { redirect } from "next/navigation";
import Image from "next/image";

const FaceRecognitionAttendancePage = async ({
	params,
}: {
	params: { id: string };
}) => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	// Only teachers and admins can access
	if (role !== "teacher" && role !== "admin") {
		redirect("/");
	}

	const classId = parseInt(params.id);

	// Fetch class details and students with images
	const classData = await prisma.class.findUnique({
		where: { id: classId },
		include: {
			students: {
				select: {
					id: true,
					name: true,
					surname: true,
					img: true,
				},
				orderBy: {
					name: "asc",
				},
			},
		},
	});

	if (!classData) {
		return <div>Class not found</div>;
	}

	return (
		<div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
			{/* LEFT */}
			<div className="w-full xl:w-2/3">
				<div className="h-full bg-white p-4 rounded-md">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-xl font-semibold">
							Face Recognition Attendance - {classData.name}
						</h1>
						<a
							href={`/list/classes/${classId}/attendance`}
							className="text-sm text-blue-600 hover:underline"
						>
							← Back to Manual Attendance
						</a>
					</div>

					<FaceRecognitionAttendanceClient
						students={classData.students}
						classId={classId}
					/>
				</div>
			</div>

			{/* RIGHT */}
			<div className="w-full xl:w-1/3 flex flex-col gap-4">
				{/* Class Info */}
				<div className="bg-white p-4 rounded-md">
					<h2 className="text-lg font-semibold mb-4">Class Information</h2>
					<div className="space-y-2">
						<p>
							<span className="font-medium">Class:</span> {classData.name}
						</p>
						<p>
							<span className="font-medium">Total Students:</span>{" "}
							{classData.students.length}
						</p>
						<p>
							<span className="font-medium">Students with Photos:</span>{" "}
							{classData.students.filter((s) => s.img).length}
						</p>
					</div>
				</div>

				{/* Students List */}
				<div className="bg-white p-4 rounded-md flex-1 overflow-y-auto">
					<h2 className="text-lg font-semibold mb-4">Students</h2>
					<div className="space-y-2">
						{classData.students.map((student) => (
							<div
								key={student.id}
								className="flex items-center gap-2 p-2 bg-gray-50 rounded"
							>
								{student.img ? (
									<Image
										src={student.img}
										alt={student.name}
										width={32}
										height={32}
										className="rounded-full object-cover"
									/>
								) : (
									<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
										{student.name[0]}
									</div>
								)}
								<span className="text-sm">
									{student.name} {student.surname}
								</span>
								{!student.img && (
									<span className="ml-auto text-xs text-red-500">No photo</span>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Tips */}
				<div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
					<h3 className="font-semibold text-yellow-900 mb-2">Tips:</h3>
					<ul className="text-xs text-yellow-800 space-y-1">
						<li>• Ensure good lighting in the room</li>
						<li>• Students should face the camera directly</li>
						<li>• One student at a time works best</li>
						<li>• Remove glasses if recognition fails</li>
						<li>
							• Students without photos need to be added to manual attendance
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default FaceRecognitionAttendancePage;
