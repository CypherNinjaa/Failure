"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createBulkAttendance } from "@/lib/actions";
import { useFormState } from "react-dom";

type Student = {
	id: string;
	name: string;
	surname: string;
};

const BulkAttendanceForm = ({
	classId,
	students,
}: {
	classId: number;
	students: Student[];
}) => {
	const router = useRouter();
	const [date, setDate] = useState(() => {
		// Set default to today's date in local timezone
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	});

	// Initialize all students as present
	const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>(
		{}
	);

	// Update attendance map when students are loaded
	useEffect(() => {
		if (students && students.length > 0) {
			const map: Record<string, boolean> = {};
			students.forEach((student) => {
				map[student.id] = true; // Default to present
			});
			setAttendanceMap(map);
		}
	}, [students]);

	const [state, formAction] = useFormState(createBulkAttendance, {
		success: false,
		error: false,
	});

	const toggleAttendance = (studentId: string) => {
		setAttendanceMap((prev) => ({
			...prev,
			[studentId]: !prev[studentId],
		}));
	};

	const markAllPresent = () => {
		const map: Record<string, boolean> = {};
		students.forEach((student) => {
			map[student.id] = true;
		});
		setAttendanceMap(map);
	};

	const markAllAbsent = () => {
		const map: Record<string, boolean> = {};
		students.forEach((student) => {
			map[student.id] = false;
		});
		setAttendanceMap(map);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const attendances = students.map((student) => ({
			studentId: student.id,
			present: attendanceMap[student.id],
		}));

		const formData = new FormData();
		formData.append("date", new Date(date).toISOString());
		formData.append("classId", classId.toString());
		formData.append("attendances", JSON.stringify(attendances));

		formAction(formData);
	};

	useEffect(() => {
		if (state.success) {
			toast.success("Attendance recorded successfully!");
			router.push("/list/classes");
			router.refresh();
		} else if (state.error) {
			toast.error(state.message || "Failed to record attendance");
		}
	}, [state, router]);

	const presentCount = Object.values(attendanceMap).filter(Boolean).length;
	const absentCount = students.length - presentCount;

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			{/* Date Selection */}
			<div className="flex flex-col gap-2 w-full md:w-1/3">
				<label className="text-sm font-medium text-gray-700">
					Attendance Date
				</label>
				<input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
					required
				/>
			</div>

			{/* Summary */}
			<div className="flex gap-4 text-sm">
				<div className="bg-green-100 px-4 py-2 rounded-md">
					<span className="font-semibold text-green-700">Present: </span>
					<span className="text-green-900">{presentCount}</span>
				</div>
				<div className="bg-red-100 px-4 py-2 rounded-md">
					<span className="font-semibold text-red-700">Absent: </span>
					<span className="text-red-900">{absentCount}</span>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="flex gap-2">
				<button
					type="button"
					onClick={markAllPresent}
					className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600"
				>
					Mark All Present
				</button>
				<button
					type="button"
					onClick={markAllAbsent}
					className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
				>
					Mark All Absent
				</button>
			</div>

			{/* Student List */}
			<div className="border rounded-md overflow-hidden">
				<table className="w-full">
					<thead className="bg-gray-100">
						<tr>
							<th className="text-left p-3 text-sm font-semibold">Student</th>
							<th className="text-center p-3 text-sm font-semibold">Status</th>
						</tr>
					</thead>
					<tbody>
						{students.length === 0 ? (
							<tr>
								<td colSpan={2} className="text-center p-4 text-gray-500">
									No students found in this class
								</td>
							</tr>
						) : (
							students.map((student) => (
								<tr
									key={student.id}
									className="border-b hover:bg-gray-50 cursor-pointer"
									onClick={() => toggleAttendance(student.id)}
								>
									<td className="p-3">
										<span className="font-medium">
											{student.name} {student.surname}
										</span>
									</td>
									<td className="p-3 text-center">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												toggleAttendance(student.id);
											}}
											className={`px-8 py-2.5 rounded-md text-sm font-bold transition-all shadow-sm ${
												attendanceMap[student.id]
													? "bg-green-600 text-white hover:bg-green-700 border-2 border-green-700"
													: "bg-red-600 text-white hover:bg-red-700 border-2 border-red-700"
											}`}
										>
											{attendanceMap[student.id] ? "✓ Present" : "✗ Absent"}
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				className="bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 w-full md:w-auto"
			>
				Save Attendance
			</button>
		</form>
	);
};

export default BulkAttendanceForm;
