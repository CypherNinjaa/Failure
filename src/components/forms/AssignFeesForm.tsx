"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { assignFeesToClass, assignFeesToStudents } from "@/lib/actions";
import { z } from "zod";

// Validation schema
const assignFeesSchema = z.object({
	feeStructureId: z.string().min(1, "Fee structure is required"),
	assignmentType: z.enum(["class", "students"]),
	classId: z.string().optional(),
	studentIds: z.array(z.string()).optional(),
	dueDate: z.string().min(1, "Due date is required"),
	month: z.string().min(1, "Month is required"),
	year: z.string().min(1, "Year is required"),
});

type AssignFeesSchema = z.infer<typeof assignFeesSchema>;

const AssignFeesForm = ({
	type,
	setOpen,
	feeStructures,
	classes,
	students,
}: {
	type: "create";
	setOpen: Dispatch<SetStateAction<boolean>>;
	feeStructures: { id: string; name: string; amount: number }[];
	classes: { id: number; name: string }[];
	students: { id: string; name: string; surname: string; classId: number }[];
}) => {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<AssignFeesSchema>({
		resolver: zodResolver(assignFeesSchema),
	});

	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

	const assignmentType = watch("assignmentType");
	const selectedClassId = watch("classId");

	// Filter students by selected class
	const filteredStudents =
		selectedClassId && assignmentType === "students"
			? students.filter((s) => s.classId === parseInt(selectedClassId))
			: students;

	const onSubmit = handleSubmit(async (data) => {
		setIsSubmitting(true);

		try {
			const dueDate = new Date(data.dueDate);
			const month = parseInt(data.month);
			const year = parseInt(data.year);

			let result;

			if (data.assignmentType === "class" && data.classId) {
				// Assign to entire class
				result = await assignFeesToClass(
					data.feeStructureId,
					parseInt(data.classId),
					dueDate,
					month,
					year
				);
			} else if (
				data.assignmentType === "students" &&
				selectedStudents.length > 0
			) {
				// Assign to selected students
				result = await assignFeesToStudents(
					data.feeStructureId,
					selectedStudents,
					dueDate,
					month,
					year
				);
			} else {
				throw new Error("Invalid assignment configuration");
			}

			if (result.success) {
				toast.success(
					`Fees assigned successfully to ${
						result.count || selectedStudents.length
					} student(s)!`
				);
				setOpen(false);
				router.refresh();
			} else {
				toast.error("Failed to assign fees. Please try again.");
			}
		} catch (err: any) {
			console.error(err);
			toast.error(err.message || "Something went wrong!");
		} finally {
			setIsSubmitting(false);
		}
	});

	// Toggle student selection
	const toggleStudent = (studentId: string) => {
		setSelectedStudents((prev) =>
			prev.includes(studentId)
				? prev.filter((id) => id !== studentId)
				: [...prev, studentId]
		);
	};

	// Select/deselect all students
	const toggleAllStudents = () => {
		if (selectedStudents.length === filteredStudents.length) {
			setSelectedStudents([]);
		} else {
			setSelectedStudents(filteredStudents.map((s) => s.id));
		}
	};

	// Update studentIds in form when selectedStudents changes
	useEffect(() => {
		setValue("studentIds", selectedStudents);
	}, [selectedStudents, setValue]);

	return (
		<form className="flex flex-col gap-4" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">Assign Fees to Students</h1>
			<p className="text-sm text-gray-500">
				Select a fee structure and assign it to a class or specific students
			</p>

			<div className="flex flex-col gap-4">
				{/* Fee Structure Selection */}
				<div className="flex flex-col gap-2">
					<label className="text-xs text-gray-500">Fee Structure *</label>
					<select
						{...register("feeStructureId")}
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					>
						<option value="">Select Fee Structure</option>
						{feeStructures.map((fee) => (
							<option key={fee.id} value={fee.id}>
								{fee.name} - ₹{fee.amount}
							</option>
						))}
					</select>
					{errors.feeStructureId && (
						<p className="text-xs text-red-400">
							{errors.feeStructureId.message}
						</p>
					)}
				</div>

				{/* Assignment Type */}
				<div className="flex flex-col gap-2">
					<label className="text-xs text-gray-500">Assignment Type *</label>
					<div className="flex gap-4">
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								{...register("assignmentType")}
								value="class"
								className="cursor-pointer"
							/>
							<span className="text-sm">Entire Class</span>
						</label>
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								{...register("assignmentType")}
								value="students"
								className="cursor-pointer"
							/>
							<span className="text-sm">Specific Students</span>
						</label>
					</div>
					{errors.assignmentType && (
						<p className="text-xs text-red-400">
							{errors.assignmentType.message}
						</p>
					)}
				</div>

				{/* Class Selection (for both types) */}
				{assignmentType && (
					<div className="flex flex-col gap-2">
						<label className="text-xs text-gray-500">
							Class {assignmentType === "class" ? "*" : "(Filter)"}
						</label>
						<select
							{...register("classId")}
							className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						>
							<option value="">
								{assignmentType === "class" ? "Select Class" : "All Classes"}
							</option>
							{classes.map((cls) => (
								<option key={cls.id} value={cls.id}>
									{cls.name}
								</option>
							))}
						</select>
						{errors.classId && (
							<p className="text-xs text-red-400">{errors.classId.message}</p>
						)}
					</div>
				)}

				{/* Student Selection (only for students type) */}
				{assignmentType === "students" && (
					<div className="flex flex-col gap-2">
						<div className="flex justify-between items-center">
							<label className="text-xs text-gray-500">Select Students *</label>
							<button
								type="button"
								onClick={toggleAllStudents}
								className="text-xs text-blue-500 hover:underline"
							>
								{selectedStudents.length === filteredStudents.length
									? "Deselect All"
									: "Select All"}
							</button>
						</div>
						<div className="border ring-[1.5px] ring-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
							{filteredStudents.length === 0 ? (
								<p className="text-sm text-gray-400">
									No students found
									{selectedClassId && " in selected class"}
								</p>
							) : (
								<div className="space-y-2">
									{filteredStudents.map((student) => (
										<label
											key={student.id}
											className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
										>
											<input
												type="checkbox"
												checked={selectedStudents.includes(student.id)}
												onChange={() => toggleStudent(student.id)}
												className="cursor-pointer"
											/>
											<span className="text-sm">
												{student.name} {student.surname}
											</span>
										</label>
									))}
								</div>
							)}
						</div>
						{selectedStudents.length === 0 && (
							<p className="text-xs text-red-400">
								Please select at least one student
							</p>
						)}
						<p className="text-xs text-gray-500">
							{selectedStudents.length} student(s) selected
						</p>
					</div>
				)}

				{/* Due Date, Month, Year */}
				<div className="flex gap-4">
					<InputField
						label="Due Date"
						name="dueDate"
						type="date"
						register={register}
						error={errors.dueDate}
					/>
					<div className="flex flex-col gap-2 flex-1">
						<label className="text-xs text-gray-500">Month *</label>
						<select
							{...register("month")}
							className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						>
							<option value="">Select Month</option>
							<option value="1">January</option>
							<option value="2">February</option>
							<option value="3">March</option>
							<option value="4">April</option>
							<option value="5">May</option>
							<option value="6">June</option>
							<option value="7">July</option>
							<option value="8">August</option>
							<option value="9">September</option>
							<option value="10">October</option>
							<option value="11">November</option>
							<option value="12">December</option>
						</select>
						{errors.month && (
							<p className="text-xs text-red-400">{errors.month.message}</p>
						)}
					</div>
					<InputField
						label="Year"
						name="year"
						defaultValue="2025"
						register={register}
						error={errors.year}
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className="bg-blue-400 text-white p-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
			>
				{isSubmitting ? "Assigning..." : "Assign Fees"}
			</button>
		</form>
	);
};

export default AssignFeesForm;
