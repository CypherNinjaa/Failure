"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createBadge, updateBadge } from "@/lib/actions";
import { z } from "zod";

const badgeSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, { message: "Badge name is required!" }),
	description: z.string().optional().or(z.literal("")),
	icon: z.string().optional().or(z.literal("")),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, {
		message: "Color must be a valid hex code (e.g., #FF5733)",
	}),
	criteria: z.string().optional().or(z.literal("")), // JSON string
	isActive: z.boolean().default(true),
	displayOrder: z.coerce.number().int().min(0).default(0),
});

type BadgeSchema = z.infer<typeof badgeSchema>;

const BadgeForm = ({
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
	} = useForm<BadgeSchema>({
		resolver: zodResolver(badgeSchema),
		defaultValues: data
			? {
					...data,
					criteria:
						typeof data.criteria === "object"
							? JSON.stringify(data.criteria, null, 2)
							: data.criteria,
			  }
			: undefined,
	});

	const [state, formAction] = useFormState(
		type === "create" ? createBadge : updateBadge,
		{
			success: false,
			error: false,
		}
	);

	const router = useRouter();

	const onSubmit = handleSubmit((formData) => {
		const data = new FormData();

		if (type === "update" && formData.id) {
			data.append("id", formData.id);
		}

		data.append("name", formData.name);
		data.append("description", formData.description || "");
		data.append("icon", formData.icon || "");
		data.append("color", formData.color);
		data.append("displayOrder", formData.displayOrder.toString());

		if (formData.isActive) {
			data.append("isActive", "on");
		}

		// Parse and validate criteria JSON
		if (formData.criteria && formData.criteria.trim()) {
			try {
				JSON.parse(formData.criteria);
				data.append("criteria", formData.criteria);
			} catch (e) {
				toast.error(
					"Invalid JSON format in criteria. Please check and try again."
				);
				return;
			}
		}

		formAction(data);
	});
	useEffect(() => {
		if (state.success) {
			toast.success(`Badge ${type === "create" ? "created" : "updated"}!`);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	useEffect(() => {
		if (state.error) {
			toast.error("Something went wrong!");
		}
	}, [state.error]);

	const [selectedColor, setSelectedColor] = useState(data?.color || "#8B5CF6");

	return (
		<form className="flex flex-col gap-6" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create" ? "Create a new badge" : "Update badge"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				{/* Badge Name */}
				<InputField
					label="Badge Name"
					name="name"
					defaultValue={data?.name}
					register={register}
					error={errors?.name}
				/>

				{/* Icon */}
				<InputField
					label="Icon (Emoji)"
					name="icon"
					defaultValue={data?.icon}
					register={register}
					error={errors?.icon}
					inputProps={{ placeholder: "🏆" }}
				/>
			</div>

			{/* Description */}
			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">Description</label>
				<textarea
					{...register("description")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					defaultValue={data?.description}
					rows={3}
					placeholder="Describe what this badge represents"
				/>
				{errors.description?.message && (
					<p className="text-xs text-red-400">
						{errors.description.message.toString()}
					</p>
				)}
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				{/* Color Picker */}
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Badge Color</label>
					<div className="flex items-center gap-2">
						<input
							type="color"
							{...register("color")}
							className="w-12 h-12 rounded-md border border-gray-300 cursor-pointer"
							defaultValue={data?.color || "#8B5CF6"}
							onChange={(e) => setSelectedColor(e.target.value)}
						/>
						<input
							type="text"
							{...register("color")}
							className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm flex-1"
							defaultValue={data?.color || "#8B5CF6"}
							placeholder="#8B5CF6"
						/>
					</div>
					{errors.color?.message && (
						<p className="text-xs text-red-400">
							{errors.color.message.toString()}
						</p>
					)}
				</div>

				{/* Display Order */}
				<InputField
					label="Display Order"
					name="displayOrder"
					defaultValue={data?.displayOrder}
					register={register}
					error={errors?.displayOrder}
					type="number"
				/>
			</div>

			{/* Criteria JSON */}
			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">Criteria (JSON format)</label>
				<textarea
					{...register("criteria")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full font-mono"
					defaultValue={
						data?.criteria && typeof data.criteria === "object"
							? JSON.stringify(data.criteria, null, 2)
							: data?.criteria
					}
					rows={5}
					placeholder='{"minAvgScore": 90, "minTests": 5}'
				/>
				{errors.criteria?.message && (
					<p className="text-xs text-red-400">
						{errors.criteria.message.toString()}
					</p>
				)}
				<p className="text-xs text-gray-500">
					Example: {`{"minAvgScore": 90, "minTests": 10}`} - Requires 90%+
					average with 10+ tests
				</p>
			</div>

			{/* Is Active */}
			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					{...register("isActive")}
					className="w-5 h-5"
					defaultChecked={data?.isActive ?? true}
				/>
				<label className="text-sm text-gray-700">
					Badge is active (visible to students)
				</label>
			</div>

			{/* Preview */}
			<div className="bg-gray-50 p-4 rounded-md border border-gray-200">
				<h3 className="text-sm font-medium mb-2">Preview:</h3>
				<div
					className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium"
					style={{
						backgroundColor: `${selectedColor}20`,
						color: selectedColor,
					}}
				>
					<span className="text-xl">{data?.icon || "🏅"}</span>
					<span>{data?.name || "Badge Name"}</span>
				</div>
			</div>

			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}
			<button
				type="submit"
				className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 transition"
			>
				{type === "create" ? "Create" : "Update"}
			</button>
		</form>
	);
};

export default BadgeForm;
