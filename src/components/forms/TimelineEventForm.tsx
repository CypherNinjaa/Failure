"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	timelineEventSchema,
	TimelineEventSchema,
} from "@/lib/formValidationSchemas";
import { createTimelineEvent, updateTimelineEvent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const TimelineEventForm = ({
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
	} = useForm<TimelineEventSchema>({
		resolver: zodResolver(timelineEventSchema),
		defaultValues: data || {
			displayOrder: 0,
		},
	});

	const [state, formAction] = useFormState(
		type === "create" ? createTimelineEvent : updateTimelineEvent,
		{
			success: false,
			error: false,
		}
	);

	const router = useRouter();

	const onSubmit = handleSubmit((data) => {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formData.append(key, value.toString());
			}
		});
		formAction(formData);
	});

	useEffect(() => {
		if (state.success) {
			toast.success(
				`Timeline event ${
					type === "create" ? "created" : "updated"
				} successfully!`
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
		<form className="flex flex-col gap-6" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create" ? "Add Timeline Event" : "Update Timeline Event"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Year"
						name="year"
						type="number"
						defaultValue={data?.year}
						register={register}
						error={errors?.year}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Icon/Emoji (e.g., 🏫)"
						name="icon"
						defaultValue={data?.icon}
						register={register}
						error={errors?.icon}
					/>
				</div>
			</div>

			<InputField
				label="Title"
				name="title"
				defaultValue={data?.title}
				register={register}
				error={errors?.title}
			/>

			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">Description</label>
				<textarea
					{...register("description")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					rows={4}
					defaultValue={data?.description}
					placeholder="Describe this milestone in school history..."
				/>
				{errors.description?.message && (
					<p className="text-xs text-red-400">
						{errors.description.message.toString()}
					</p>
				)}
			</div>

			<InputField
				label="Display Order"
				name="displayOrder"
				type="number"
				defaultValue={data?.displayOrder || 0}
				register={register}
				error={errors?.displayOrder}
			/>

			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}

			<button className="bg-blue-400 text-white p-2 rounded-md">
				{type === "create" ? "Create" : "Update"}
			</button>
		</form>
	);
};

export default TimelineEventForm;
