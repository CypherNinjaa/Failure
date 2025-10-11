"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { incomeSchema, IncomeSchema } from "@/lib/formValidationSchemas";
import { recordIncome } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const IncomeForm = ({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IncomeSchema>({
		resolver: zodResolver(incomeSchema),
	});

	const [state, formAction] = useFormState(recordIncome, {
		success: false,
		error: false,
	});

	const onSubmit = handleSubmit((data) => {
		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			const value = data[key as keyof IncomeSchema];
			if (value !== undefined && value !== null && value !== "") {
				if (value instanceof Date) {
					formData.append(key, value.toISOString());
				} else {
					formData.append(key, value.toString());
				}
			}
		});
		formAction(formData);
	});

	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			toast("Income recorded successfully!");
			setOpen(false);
			router.refresh();
		}
	}, [state, router, setOpen]);

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">Record Income</h1>
			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Title"
					name="title"
					register={register}
					error={errors?.title}
				/>
				<InputField
					label="Source"
					name="source"
					register={register}
					error={errors?.source}
				/>
				<InputField
					label="Amount"
					name="amount"
					type="number"
					register={register}
					error={errors?.amount}
				/>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Category</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("category")}
					>
						<option value="DONATION">Donation</option>
						<option value="EVENT">Event</option>
						<option value="SPONSORSHIP">Sponsorship</option>
						<option value="ADMISSION_FEE">Admission Fee</option>
						<option value="OTHER">Other</option>
					</select>
					{errors.category?.message && (
						<p className="text-xs text-red-400">
							{errors.category.message.toString()}
						</p>
					)}
				</div>
				<InputField
					label="Date"
					name="date"
					type="date"
					defaultValue={new Date().toISOString().split("T")[0]}
					register={register}
					error={errors?.date}
				/>
				<InputField
					label="Description (Optional)"
					name="description"
					register={register}
					error={errors?.description}
				/>
			</div>
			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}
			<button className="bg-blue-400 text-white p-2 rounded-md">
				Record Income
			</button>
		</form>
	);
};

export default IncomeForm;
