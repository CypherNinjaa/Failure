"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { salarySchema, SalarySchema } from "@/lib/formValidationSchemas";
import { recordSalary } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SalaryForm = ({
	setOpen,
	relatedData,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>;
	relatedData?: any;
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<SalarySchema>({
		resolver: zodResolver(salarySchema),
	});

	const [state, formAction] = useFormState(recordSalary, {
		success: false,
		error: false,
	});

	const onSubmit = handleSubmit((data) => {
		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			const value = data[key as keyof SalarySchema];
			if (value !== undefined && value !== null && value !== "") {
				formData.append(key, value.toString());
			}
		});
		formAction(formData);
	});

	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			toast("Salary recorded successfully!");
			setOpen(false);
			router.refresh();
		}
	}, [state, router, setOpen]);

	const { teachers } = relatedData;
	const teacherId = watch("teacherId");

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">Record Salary Payment</h1>
			<div className="flex justify-between flex-wrap gap-4">
				<div className="flex flex-col gap-2 w-full md:w-1/2">
					<label className="text-xs text-gray-500">Teacher (Optional)</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("teacherId")}
					>
						<option value="">Select Teacher (or enter staff name)</option>
						{teachers?.map((teacher: { id: string; name: string }) => (
							<option value={teacher.id} key={teacher.id}>
								{teacher.name}
							</option>
						))}
					</select>
					{errors.teacherId?.message && (
						<p className="text-xs text-red-400">
							{errors.teacherId.message.toString()}
						</p>
					)}
				</div>
				{!teacherId && (
					<InputField
						label="Staff Name (if not teacher)"
						name="staffName"
						register={register}
						error={errors?.staffName}
					/>
				)}
				<InputField
					label="Amount"
					name="amount"
					type="number"
					register={register}
					error={errors?.amount}
				/>
				<InputField
					label="Month (1-12)"
					name="month"
					type="number"
					register={register}
					error={errors?.month}
				/>
				<InputField
					label="Year"
					name="year"
					type="number"
					defaultValue={new Date().getFullYear()}
					register={register}
					error={errors?.year}
				/>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Status</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("status")}
						defaultValue="PAID"
					>
						<option value="PENDING">Pending</option>
						<option value="PAID">Paid</option>
					</select>
					{errors.status?.message && (
						<p className="text-xs text-red-400">
							{errors.status.message.toString()}
						</p>
					)}
				</div>
				<InputField
					label="Notes (Optional)"
					name="notes"
					register={register}
					error={errors?.notes}
				/>
			</div>
			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}
			<button className="bg-blue-400 text-white p-2 rounded-md">
				Record Salary
			</button>
		</form>
	);
};

export default SalaryForm;
