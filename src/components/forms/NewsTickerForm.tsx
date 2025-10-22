"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	newsTickerSchema,
	NewsTickerSchema,
} from "@/lib/formValidationSchemas";
import { createNewsTicker, updateNewsTicker } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const NewsTickerForm = ({
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
		setValue,
	} = useForm<NewsTickerSchema>({
		resolver: zodResolver(newsTickerSchema),
		defaultValues: data || {
			isActive: true,
			displayOrder: 0,
		},
	});

	const [state, formAction] = useFormState(
		type === "create" ? createNewsTicker : updateNewsTicker,
		{
			success: false,
			error: false,
		}
	);

	const router = useRouter();

	// Available icons (use emojis or you can replace with actual icon paths)
	const iconOptions = [
		{ value: "🎉", label: "🎉 Party Popper" },
		{ value: "📚", label: "📚 Books" },
		{ value: "🏆", label: "🏆 Trophy" },
		{ value: "📢", label: "📢 Megaphone" },
		{ value: "🎓", label: "🎓 Graduation Cap" },
		{ value: "⚽", label: "⚽ Soccer Ball" },
		{ value: "🎨", label: "🎨 Art Palette" },
		{ value: "🔬", label: "🔬 Microscope" },
		{ value: "🎭", label: "🎭 Theater Masks" },
		{ value: "🏅", label: "🏅 Medal" },
		{ value: "📝", label: "📝 Memo" },
		{ value: "🌟", label: "🌟 Star" },
		{ value: "🎪", label: "🎪 Circus Tent" },
		{ value: "🎬", label: "🎬 Clapperboard" },
		{ value: "🏫", label: "🏫 School" },
	];

	const onSubmit = handleSubmit((formData) => {
		formAction(formData);
	});

	useEffect(() => {
		if (state.success) {
			toast(
				`News ticker item has been ${
					type === "create" ? "created" : "updated"
				}!`
			);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	useEffect(() => {
		if (state.error) {
			toast.error("Something went wrong!");
		}
	}, [state.error]);

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create" ? "Create a new" : "Update"} news ticker item
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Icon</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("icon")}
					>
						<option value="">Select an icon</option>
						{iconOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					{errors.icon?.message && (
						<p className="text-xs text-red-400">
							{errors.icon.message.toString()}
						</p>
					)}
				</div>

				<div className="w-full md:w-2/3">
					<InputField
						label="Text"
						name="text"
						register={register}
						error={errors?.text}
					/>
				</div>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="flex flex-col gap-2 w-full md:w-1/3">
					<label className="text-xs text-gray-500">Type</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("type")}
					>
						<option value="">Select type</option>
						<option value="EVENT">Event</option>
						<option value="FACILITY">Facility</option>
						<option value="ACHIEVEMENT">Achievement</option>
						<option value="ANNOUNCEMENT">Announcement</option>
					</select>
					{errors.type?.message && (
						<p className="text-xs text-red-400">
							{errors.type.message.toString()}
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
					<label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							{...register("isActive")}
							className="w-4 h-4"
						/>
						<span>Active</span>
					</label>
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

export default NewsTickerForm;
