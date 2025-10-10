"use client";

import FaceRecognitionAttendance from "./FaceRecognitionAttendance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Student = {
	id: string;
	name: string;
	surname: string;
	img: string | null;
};

type FaceRecognitionAttendanceClientProps = {
	students: Student[];
	classId: number;
};

const FaceRecognitionAttendanceClient = ({
	students,
	classId,
}: FaceRecognitionAttendanceClientProps) => {
	const router = useRouter();

	const handleAttendanceMarked = async (studentIds: string[], date: Date) => {
		try {
			const response = await fetch("/api/face-attendance", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					studentIds,
					classId,
					date: date.toISOString(),
				}),
			});

			const result = await response.json();

			if (result.success) {
				toast.success(
					`Attendance recorded for ${
						studentIds.length
					} students on ${date.toLocaleDateString()}!`
				);
				router.push(`/list/attendance`);
				router.refresh();
			} else {
				toast.error(result.message || "Failed to record attendance");
			}
		} catch (error) {
			console.error("Error submitting attendance:", error);
			toast.error("Failed to submit attendance");
		}
	};

	return (
		<FaceRecognitionAttendance
			students={students}
			classId={classId}
			onAttendanceMarked={handleAttendanceMarked}
		/>
	);
};

export default FaceRecognitionAttendanceClient;
