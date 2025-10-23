"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	principalInfoSchema,
	PrincipalInfoSchema,
} from "@/lib/formValidationSchemas";
import { createPrincipalInfo, updatePrincipalInfo } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const PrincipalInfoForm = ({
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
	} = useForm<PrincipalInfoSchema>({
		resolver: zodResolver(principalInfoSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createPrincipalInfo : updatePrincipalInfo,
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
				`Principal info ${
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
				{type === "create" ? "Add Principal Info" : "Update Principal Info"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Principal Name"
						name="name"
						defaultValue={data?.name}
						register={register}
						error={errors?.name}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Title/Position"
						name="title"
						defaultValue={data?.title}
						register={register}
						error={errors?.title}
					/>
				</div>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="w-full md:w-[48%]">
					<InputField
						label="Qualifications (e.g., M.Ed, Ph.D.)"
						name="qualifications"
						defaultValue={data?.qualifications}
						register={register}
						error={errors?.qualifications}
					/>
				</div>
				<div className="w-full md:w-[48%]">
					<InputField
						label="Photo URL or Emoji"
						name="photo"
						defaultValue={data?.photo}
						register={register}
						error={errors?.photo}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">
					Principal&apos;s Message
				</label>
				<textarea
					{...register("message")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					rows={6}
					defaultValue={data?.message}
					placeholder="Enter the principal's message to students and parents..."
				/>
				{errors.message?.message && (
					<p className="text-xs text-red-400">
						{errors.message.message.toString()}
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

			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}

			<button className="bg-blue-400 text-white p-2 rounded-md">
				{type === "create" ? "Create" : "Update"}
			</button>
		</form>
	);
};

export default PrincipalInfoForm;
