"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	supportStaffSchema,
	SupportStaffSchema,
} from "@/lib/formValidationSchemas";
import { createSupportStaff, updateSupportStaff } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SupportStaffForm = ({
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
	} = useForm<SupportStaffSchema>({
		resolver: zodResolver(supportStaffSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createSupportStaff : updateSupportStaff,
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
				`Support staff ${
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
				{type === "create" ? "Add Support Staff" : "Update Support Staff"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Name"
						name="name"
						defaultValue={data?.name}
						register={register}
						error={errors?.name}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Role"
						name="role"
						defaultValue={data?.role}
						register={register}
						error={errors?.role}
					/>
				</div>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Department"
						name="department"
						defaultValue={data?.department}
						register={register}
						error={errors?.department}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Photo URL or Initials"
						name="photo"
						defaultValue={data?.photo}
						register={register}
						error={errors?.photo}
					/>
				</div>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Education"
						name="education"
						defaultValue={data?.education}
						register={register}
						error={errors?.education}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Experience"
						name="experience"
						defaultValue={data?.experience}
						register={register}
						error={errors?.experience}
					/>
				</div>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Specialization"
						name="specialization"
						defaultValue={data?.specialization}
						register={register}
						error={errors?.specialization}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Display Order"
						name="displayOrder"
						type="number"
						defaultValue={data?.displayOrder}
						register={register}
						error={errors?.displayOrder}
					/>
				</div>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Email (Optional)"
						name="email"
						type="email"
						defaultValue={data?.email}
						register={register}
						error={errors?.email}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Phone (Optional)"
						name="phone"
						defaultValue={data?.phone}
						register={register}
						error={errors?.phone}
					/>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					{...register("isActive")}
					defaultChecked={data?.isActive ?? true}
					className="w-4 h-4"
				/>
				<label className="text-xs text-gray-500">Active</label>
			</div>

			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}

			<button className="bg-blue-400 text-white p-2 rounded-md">
				{type === "create" ? "Create" : "Update"}
			</button>
		</form>
	);
};

export default SupportStaffForm;
