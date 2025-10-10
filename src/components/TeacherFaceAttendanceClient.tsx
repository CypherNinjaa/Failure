"use client";

import TeacherFaceAttendance from "./TeacherFaceAttendance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Teacher = {
	id: string;
	name: string;
	surname: string;
	img: string | null;
};

type TeacherFaceAttendanceClientProps = {
	teacher: Teacher;
};

const TeacherFaceAttendanceClient = ({
	teacher,
}: TeacherFaceAttendanceClientProps) => {
	const router = useRouter();

	const handleAttendanceMarked = async (
		teacherId: string,
		date: Date,
		locationId: number,
		coords: GeolocationCoordinates
	) => {
		try {
			const response = await fetch("/api/teacher-attendance", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					teacherId,
					date: date.toISOString(),
					locationId,
					latitude: coords.latitude,
					longitude: coords.longitude,
					livenessVerified: true,
				}),
			});

			const result = await response.json();

			if (result.success) {
				toast.success(
					`Attendance marked successfully for ${date.toLocaleDateString()}!`
				);
				router.push(`/list/teacher-attendance`);
				router.refresh();
			} else {
				toast.error(result.message || "Failed to mark attendance");
			}
		} catch (error) {
			console.error("Error submitting attendance:", error);
			toast.error("Failed to submit attendance");
		}
	};

	return (
		<TeacherFaceAttendance
			teacher={teacher}
			onAttendanceMarked={handleAttendanceMarked}
		/>
	);
};

export default TeacherFaceAttendanceClient;
