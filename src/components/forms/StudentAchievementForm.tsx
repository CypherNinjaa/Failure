"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	studentAchievementSchema,
	StudentAchievementSchema,
} from "@/lib/formValidationSchemas";
import {
	createStudentAchievement,
	updateStudentAchievement,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const StudentAchievementForm = ({
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
	} = useForm<StudentAchievementSchema>({
		resolver: zodResolver(studentAchievementSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createStudentAchievement : updateStudentAchievement,
		{
			success: false,
			error: false,
		}
	);

	const router = useRouter();

	const onSubmit = handleSubmit((formData) => {
		const formDataObj = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formDataObj.append(key, value.toString());
			}
		});
		formAction(formDataObj);
	});

	useEffect(() => {
		if (state.success) {
			toast.success(
				`Student Achievement has been ${
					type === "create" ? "created" : "updated"
				}!`
			);
			setOpen(false);
			router.refresh();
		}
		if (state.error) {
			toast.error("Something went wrong!");
		}
	}, [state, router, type, setOpen]);

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create"
					? "Create a new student achievement"
					: "Update the student achievement"}
			</h1>

			<InputField
				label="Achievement Name"
				name="name"
				register={register}
				error={errors?.name}
			/>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Year (e.g., 2024)"
					name="year"
					register={register}
					error={errors?.year}
				/>
				<InputField
					label="Winners (e.g., 5 Gold Medals)"
					name="winners"
					register={register}
					error={errors?.winners}
				/>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Icon/Emoji (e.g., 🥇)"
					name="icon"
					register={register}
					error={errors?.icon}
				/>
				<InputField
					label="Display Order"
					name="displayOrder"
					type="number"
					register={register}
					error={errors?.displayOrder}
					defaultValue={0}
				/>
			</div>

			<div className="flex flex-col gap-2 w-full md:w-1/4">
				<label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						{...register("isActive")}
						className="w-4 h-4"
						defaultChecked={data?.isActive !== false}
					/>
					Active
				</label>
			</div>

			{data && <input type="hidden" {...register("id")} value={data.id} />}

			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}
			<button
				type="submit"
				className="bg-blue-400 text-white p-2 rounded-md relative"
			>
				{type === "create" ? "Create" : "Update"}
			</button>
		</form>
	);
};

export default StudentAchievementForm;
