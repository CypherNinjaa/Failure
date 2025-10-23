"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	leadershipMemberSchema,
	LeadershipMemberSchema,
} from "@/lib/formValidationSchemas";
import { createLeadershipMember, updateLeadershipMember } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LeadershipMemberForm = ({
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
	} = useForm<LeadershipMemberSchema>({
		resolver: zodResolver(leadershipMemberSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createLeadershipMember : updateLeadershipMember,
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
				`Leadership member ${
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
				{type === "create"
					? "Add Leadership Member"
					: "Update Leadership Member"}
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
						label="Position"
						name="position"
						defaultValue={data?.position}
						register={register}
						error={errors?.position}
					/>
				</div>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Photo URL or Emoji"
						name="photo"
						defaultValue={data?.photo}
						register={register}
						error={errors?.photo}
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

			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">Bio</label>
				<textarea
					{...register("bio")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					rows={4}
					defaultValue={data?.bio}
					placeholder="Enter professional bio (50-1000 characters)..."
				/>
				{errors.bio?.message && (
					<p className="text-xs text-red-400">
						{errors.bio.message.toString()}
					</p>
				)}
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Email"
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

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Years of Experience"
						name="experience"
						defaultValue={data?.experience}
						register={register}
						error={errors?.experience}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Education"
						name="education"
						defaultValue={data?.education}
						register={register}
						error={errors?.education}
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
						label="LinkedIn Profile (Optional)"
						name="linkedIn"
						defaultValue={data?.linkedIn}
						register={register}
						error={errors?.linkedIn}
					/>
				</div>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<label className="text-xs text-gray-500 mb-1 block">Category</label>
					<select
						{...register("category")}
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						defaultValue={data?.category || "leadership"}
					>
						<option value="leadership">Leadership</option>
						<option value="academic">Academic</option>
						<option value="administrative">Administrative</option>
					</select>
					{errors.category?.message && (
						<p className="text-xs text-red-400">
							{errors.category.message.toString()}
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">Quote (Optional)</label>
				<textarea
					{...register("quote")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					rows={2}
					defaultValue={data?.quote}
					placeholder="Enter an inspirational quote..."
				/>
				{errors.quote?.message && (
					<p className="text-xs text-red-400">
						{errors.quote.message.toString()}
					</p>
				)}
			</div>

			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					{...register("isActive")}
					defaultChecked={data?.isActive ?? true}
					className="w-4 h-4"
				/>
				<label className="text-xs text-gray-500">Active Member</label>
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

export default LeadershipMemberForm;
