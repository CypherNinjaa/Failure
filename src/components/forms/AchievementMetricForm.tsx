"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	achievementMetricSchema,
	AchievementMetricSchema,
} from "@/lib/formValidationSchemas";
import {
	createAchievementMetric,
	updateAchievementMetric,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AchievementMetricForm = ({
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
	} = useForm<AchievementMetricSchema>({
		resolver: zodResolver(achievementMetricSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createAchievementMetric : updateAchievementMetric,
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
				`Achievement Metric has been ${
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
					? "Create a new achievement metric"
					: "Update the achievement metric"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Metric Value (e.g., 98%, 150+)"
					name="metric"
					register={register}
					error={errors?.metric}
				/>
				<InputField
					label="Description"
					name="description"
					register={register}
					error={errors?.description}
				/>
			</div>

			<InputField
				label="Detail"
				name="detail"
				register={register}
				error={errors?.detail}
			/>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Display Order"
					name="displayOrder"
					type="number"
					register={register}
					error={errors?.displayOrder}
					defaultValue={0}
				/>
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

export default AchievementMetricForm;
