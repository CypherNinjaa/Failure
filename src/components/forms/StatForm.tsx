"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { statSchema, StatSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createStatItem, updateStatItem } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const StatForm = ({
	type,
	data,
	setOpen,
}: {
	type: "create" | "update";
	data?: any;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<StatSchema>({
		resolver: zodResolver(statSchema),
		defaultValues: data
			? {
					...data,
					isActive: data.isActive ?? true,
					displayOrder: data.displayOrder ?? 0,
			  }
			: {
					isActive: true,
					displayOrder: 0,
					suffix: "+",
			  },
	});

	const [state, formAction] = useFormState(
		type === "create" ? createStatItem : updateStatItem,
		{
			success: false,
			error: false,
		}
	);

	const onSubmit = handleSubmit((formData) => {
		console.log("Form data:", formData);

		// Ensure proper types
		const submitData = {
			...formData,
			value: Number(formData.value) || 0,
			displayOrder: Number(formData.displayOrder) || 0,
			isActive: Boolean(formData.isActive),
		};

		console.log("Submitting:", submitData);
		formAction(submitData as any);
	});

	const router = useRouter();

	useEffect(() => {
		console.log("State changed:", state);
		if (state.success) {
			toast(`Stat item has been ${type === "create" ? "created" : "updated"}!`);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	useEffect(() => {
		if (state.error) {
			toast.error("Something went wrong!");
		}
	}, [state]);

	// Icon options
	const iconOptions = [
		{ value: "Users", label: "Users" },
		{ value: "BookOpen", label: "Book Open" },
		{ value: "Trophy", label: "Trophy" },
		{ value: "Star", label: "Star" },
		{ value: "Award", label: "Award" },
		{ value: "GraduationCap", label: "Graduation Cap" },
		{ value: "Building", label: "Building" },
		{ value: "Calendar", label: "Calendar" },
	];

	// Gradient options
	const gradientOptions = [
		{ value: "from-blue-500 to-cyan-500", label: "Blue to Cyan" },
		{ value: "from-purple-500 to-pink-500", label: "Purple to Pink" },
		{ value: "from-green-500 to-emerald-500", label: "Green to Emerald" },
		{ value: "from-orange-500 to-red-500", label: "Orange to Red" },
		{ value: "from-yellow-500 to-orange-500", label: "Yellow to Orange" },
		{ value: "from-indigo-500 to-purple-500", label: "Indigo to Purple" },
		{ value: "from-pink-500 to-rose-500", label: "Pink to Rose" },
		{ value: "from-teal-500 to-cyan-500", label: "Teal to Cyan" },
	];

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create" ? "Create a new" : "Update"} stat item
			</h1>
			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Value"
						name="value"
						type="number"
						register={register}
						error={errors?.value}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Suffix (e.g., +, %, K)"
						name="suffix"
						register={register}
						error={errors?.suffix}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Label (e.g., Happy Students)"
						name="label"
						register={register}
						error={errors?.label}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Emoji (e.g., 🎓)"
						name="emoji"
						register={register}
						error={errors?.emoji}
					/>
				</div>{" "}
				<div className="flex flex-col gap-2 w-full md:w-[48%]">
					<label className="text-xs text-gray-500">Icon Name</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("iconName")}
					>
						<option value="">Select an icon</option>
						{iconOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					{errors.iconName?.message && (
						<p className="text-xs text-red-400">
							{errors.iconName.message.toString()}
						</p>
					)}
				</div>
				<div className="flex flex-col gap-2 w-full md:w-[48%]">
					<label className="text-xs text-gray-500">Gradient</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("gradient")}
					>
						<option value="">Select a gradient</option>
						{gradientOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					{errors.gradient?.message && (
						<p className="text-xs text-red-400">
							{errors.gradient.message.toString()}
						</p>
					)}
				</div>
				<div className="w-full md:w-1/3">
					<InputField
						label="Display Order"
						name="displayOrder"
						type="number"
						register={register}
						error={errors?.displayOrder}
					/>
				</div>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Active Status</label>
					<button
						type="button"
						onClick={() => {
							const currentValue = watch("isActive");
							setValue("isActive", !currentValue);
						}}
						className={`ring-[1.5px] ring-gray-300 p-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
							watch("isActive")
								? "bg-green-100 text-green-700 hover:bg-green-200"
								: "bg-red-100 text-red-700 hover:bg-red-200"
						}`}
					>
						<span className="text-lg">{watch("isActive") ? "✓" : "✕"}</span>
						<span>{watch("isActive") ? "Active" : "Inactive"}</span>
					</button>
					{errors.isActive?.message && (
						<p className="text-xs text-red-400">
							{errors.isActive.message.toString()}
						</p>
					)}
				</div>
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

			<button className="bg-blue-400 text-white p-2 rounded-md">
				{type === "create" ? "Create" : "Update"}
			</button>
		</form>
	);
};

export default StatForm;
