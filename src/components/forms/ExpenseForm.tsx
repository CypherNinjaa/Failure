"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { expenseSchema, ExpenseSchema } from "@/lib/formValidationSchemas";
import { recordExpense } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

const ExpenseForm = ({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ExpenseSchema>({
		resolver: zodResolver(expenseSchema),
	});

	const [receipt, setReceipt] = useState<any>();

	const [state, formAction] = useFormState(recordExpense, {
		success: false,
		error: false,
	});

	const onSubmit = handleSubmit((data) => {
		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			const value = data[key as keyof ExpenseSchema];
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
			toast("Expense recorded successfully!");
			setOpen(false);
			router.refresh();
		}
	}, [state, router, setOpen]);

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">Record Expense</h1>
			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Title"
					name="title"
					register={register}
					error={errors?.title}
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
						<option value="SALARY">Salary</option>
						<option value="UTILITIES">Utilities</option>
						<option value="SUPPLIES">Supplies</option>
						<option value="MAINTENANCE">Maintenance</option>
						<option value="TRANSPORT">Transport</option>
						<option value="FOOD">Food</option>
						<option value="INFRASTRUCTURE">Infrastructure</option>
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
				<CldUploadWidget
					uploadPreset="school"
					onSuccess={(result, { widget }) => {
						setReceipt(result.info);
						setValue("receipt", (result.info as any).secure_url);
						widget.close();
					}}
				>
					{({ open }) => {
						return (
							<div
								className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
								onClick={() => open()}
							>
								<Image src="/upload.png" alt="" width={28} height={28} />
								<span>Upload Receipt (Optional)</span>
							</div>
						);
					}}
				</CldUploadWidget>
				{receipt && (
					<div className="w-full flex items-center gap-2">
						<Image
							src={receipt.secure_url}
							alt="Receipt"
							width={100}
							height={100}
							className="object-cover rounded-md"
						/>
						<span className="text-xs text-gray-500">Receipt uploaded</span>
					</div>
				)}
			</div>
			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}
			<button className="bg-blue-400 text-white p-2 rounded-md">
				Record Expense
			</button>
		</form>
	);
};

export default ExpenseForm;
