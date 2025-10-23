"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { awardSchema, AwardSchema } from "@/lib/formValidationSchemas";
import { createAward, updateAward } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AwardForm = ({
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
	} = useForm<AwardSchema>({
		resolver: zodResolver(awardSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createAward : updateAward,
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
				`Award has been ${type === "create" ? "created" : "updated"}!`
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
				{type === "create" ? "Create a new award" : "Update the award"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Year (e.g., 2024)"
					name="year"
					register={register}
					error={errors?.year}
				/>
				<InputField
					label="Category"
					name="category"
					register={register}
					error={errors?.category}
				/>
			</div>

			<InputField
				label="Title"
				name="title"
				register={register}
				error={errors?.title}
			/>

			<InputField
				label="Organization"
				name="organization"
				register={register}
				error={errors?.organization}
			/>

			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">Description</label>
				<textarea
					{...register("description")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					rows={4}
				/>
				{errors.description?.message && (
					<p className="text-xs text-red-400">
						{errors.description.message.toString()}
					</p>
				)}
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Icon Name (Trophy, Medal, Award, Star)"
					name="icon"
					register={register}
					error={errors?.icon}
				/>
				<InputField
					label="Color Gradient"
					name="color"
					register={register}
					error={errors?.color}
				/>
			</div>

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

export default AwardForm;
