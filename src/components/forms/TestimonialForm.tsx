"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	testimonialSchema,
	TestimonialSchema,
} from "@/lib/formValidationSchemas";
import { createTestimonial, updateTestimonial } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const TestimonialForm = ({
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
	} = useForm<TestimonialSchema>({
		resolver: zodResolver(testimonialSchema),
		defaultValues: data || {
			rating: 5,
			displayOrder: 0,
		},
	});

	const [state, formAction] = useFormState(
		type === "create" ? createTestimonial : updateTestimonial,
		{
			success: false,
			error: false,
		}
	);

	const router = useRouter();

	const onSubmit = handleSubmit((data) => {
		formAction(data);
	});

	useEffect(() => {
		if (state.success) {
			toast.success(
				type === "create"
					? "Testimonial submitted successfully! Waiting for review."
					: "Testimonial updated successfully!"
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
				{type === "create" ? "Share Your Experience" : "Update Testimonial"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Full Name"
					name="name"
					defaultValue={data?.name}
					register={register}
					error={errors?.name}
					className="w-full md:w-[48%]"
				/>
				<InputField
					label="Role (e.g., Parent - Grade 8)"
					name="role"
					defaultValue={data?.role}
					register={register}
					error={errors?.role}
					className="w-full md:w-[48%]"
				/>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Avatar (Emoji like 👨‍👩‍👧 or 🎓)"
					name="avatar"
					defaultValue={data?.avatar}
					register={register}
					error={errors?.avatar}
					className="w-full md:w-[48%]"
				/>
				<div className="flex flex-col gap-2 w-full md:w-[48%]">
					<label className="text-xs text-gray-500">Rating (1-5 stars)</label>
					<input
						type="number"
						min="1"
						max="5"
						{...register("rating")}
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						defaultValue={data?.rating || 5}
					/>
					{errors.rating?.message && (
						<p className="text-xs text-red-400">
							{errors.rating.message.toString()}
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">Your Testimonial</label>
				<textarea
					{...register("content")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					rows={4}
					defaultValue={data?.content}
					placeholder="Share your experience with our school..."
				/>
				{errors.content?.message && (
					<p className="text-xs text-red-400">
						{errors.content.message.toString()}
					</p>
				)}
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Email (Optional)"
					name="email"
					type="email"
					defaultValue={data?.email}
					register={register}
					error={errors?.email}
					className="w-full md:w-[48%]"
				/>
				<InputField
					label="Phone (Optional)"
					name="phone"
					defaultValue={data?.phone}
					register={register}
					error={errors?.phone}
					className="w-full md:w-[48%]"
				/>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">
					Gradient (e.g., from-blue-500 to-cyan-500)
				</label>
				<select
					{...register("gradient")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					defaultValue={data?.gradient || "from-blue-500 to-cyan-500"}
				>
					<option value="from-blue-500 to-cyan-500">Blue to Cyan</option>
					<option value="from-purple-500 to-pink-500">Purple to Pink</option>
					<option value="from-green-500 to-emerald-500">
						Green to Emerald
					</option>
					<option value="from-orange-500 to-red-500">Orange to Red</option>
					<option value="from-pink-500 to-rose-500">Pink to Rose</option>
					<option value="from-indigo-500 to-purple-500">
						Indigo to Purple
					</option>
				</select>
				{errors.gradient?.message && (
					<p className="text-xs text-red-400">
						{errors.gradient.message.toString()}
					</p>
				)}
			</div>

			{type === "update" && (
				<InputField
					label="Display Order"
					name="displayOrder"
					type="number"
					defaultValue={data?.displayOrder}
					register={register}
					error={errors?.displayOrder}
				/>
			)}

			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}

			<button className="bg-blue-400 text-white p-2 rounded-md">
				{type === "create" ? "Submit for Review" : "Update"}
			</button>
		</form>
	);
};

export default TestimonialForm;
