"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	feeStructureSchema,
	FeeStructureSchema,
} from "@/lib/formValidationSchemas";
import { createFeeStructure, updateFeeStructure } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const FeeStructureForm = ({
	type,
	data,
	setOpen,
	relatedData,
}: {
	type: "create" | "update";
	data?: any;
	setOpen: Dispatch<SetStateAction<boolean>>;
	relatedData?: any;
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FeeStructureSchema>({
		resolver: zodResolver(feeStructureSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createFeeStructure : updateFeeStructure,
		{
			success: false,
			error: false,
		}
	);

	const onSubmit = handleSubmit((data) => {
		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			const value = data[key as keyof FeeStructureSchema];
			if (value !== undefined && value !== null && value !== "") {
				formData.append(key, value.toString());
			}
		});
		formAction(formData);
	});

	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			toast(
				`Fee structure has been ${type === "create" ? "created" : "updated"}!`
			);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	const { classes, grades } = relatedData;

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create"
					? "Create a new fee structure"
					: "Update the fee structure"}
			</h1>
			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Fee Name"
					name="name"
					defaultValue={data?.name}
					register={register}
					error={errors?.name}
				/>
				<InputField
					label="Amount"
					name="amount"
					type="number"
					defaultValue={data?.amount}
					register={register}
					error={errors?.amount}
				/>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Frequency</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("frequency")}
						defaultValue={data?.frequency}
					>
						<option value="MONTHLY">Monthly</option>
						<option value="QUARTERLY">Quarterly</option>
						<option value="SEMI_ANNUAL">Semi-Annual</option>
						<option value="ANNUAL">Annual</option>
						<option value="ONE_TIME">One-Time</option>
					</select>
					{errors.frequency?.message && (
						<p className="text-xs text-red-400">
							{errors.frequency.message.toString()}
						</p>
					)}
				</div>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Fee Type</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("feeType")}
						defaultValue={data?.feeType}
					>
						<option value="TUITION">Tuition</option>
						<option value="TRANSPORT">Transport</option>
						<option value="LIBRARY">Library</option>
						<option value="EXAM">Exam</option>
						<option value="SPORTS">Sports</option>
						<option value="LAB">Laboratory</option>
						<option value="ADMISSION">Admission</option>
						<option value="HOSTEL">Hostel</option>
						<option value="OTHER">Other</option>
					</select>
					{errors.feeType?.message && (
						<p className="text-xs text-red-400">
							{errors.feeType.message.toString()}
						</p>
					)}
				</div>
				{classes && (
					<div className="flex flex-col gap-2 w-full md:w-1/4">
						<label className="text-xs text-gray-500">Class (Optional)</label>
						<select
							className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
							{...register("classId")}
							defaultValue={data?.classId}
						>
							<option value="">None</option>
							{classes.map((classItem: { id: number; name: string }) => (
								<option value={classItem.id} key={classItem.id}>
									{classItem.name}
								</option>
							))}
						</select>
						{errors.classId?.message && (
							<p className="text-xs text-red-400">
								{errors.classId.message.toString()}
							</p>
						)}
					</div>
				)}
				{grades && (
					<div className="flex flex-col gap-2 w-full md:w-1/4">
						<label className="text-xs text-gray-500">Grade (Optional)</label>
						<select
							className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
							{...register("gradeId")}
							defaultValue={data?.gradeId}
						>
							<option value="">None</option>
							{grades.map((grade: { id: number; level: number }) => (
								<option value={grade.id} key={grade.id}>
									Grade {grade.level}
								</option>
							))}
						</select>
						{errors.gradeId?.message && (
							<p className="text-xs text-red-400">
								{errors.gradeId.message.toString()}
							</p>
						)}
					</div>
				)}
				<InputField
					label="Description (Optional)"
					name="description"
					defaultValue={data?.description}
					register={register}
					error={errors?.description}
				/>
			</div>
			{data && (
				<InputField
					label="Id"
					name="id"
					defaultValue={data?.id}
					register={register}
					error={errors?.id}
					hidden
				/>
			)}
			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}
			<button className="bg-blue-400 text-white p-2 rounded-md">
				{type === "create" ? "Create" : "Update"}
			</button>
		</form>
	);
};

export default FeeStructureForm;
