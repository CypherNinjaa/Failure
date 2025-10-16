"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
	assignmentSchema,
	AssignmentSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

const AssignmentForm = ({
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
	} = useForm<AssignmentSchema>({
		resolver: zodResolver(assignmentSchema),
	});

	const [img, setImg] = useState<any>(data?.imageUrl || null);

	const [state, formAction] = useFormState(
		type === "create" ? createAssignment : updateAssignment,
		{
			success: false,
			error: false,
		}
	);

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		formAction(data);
	});

	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			toast(
				`Assignment has been ${type === "create" ? "created" : "updated"}!`
			);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	const { lessons } = relatedData;

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create"
					? "Create a new assignment"
					: "Update the assignment"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Assignment title"
					name="title"
					defaultValue={data?.title}
					register={register}
					error={errors?.title}
				/>
				<InputField
					label="Start Date"
					name="startDate"
					type="datetime-local"
					defaultValue={data?.startDate}
					register={register}
					error={errors?.startDate}
				/>
				<InputField
					label="Due Date"
					name="dueDate"
					type="datetime-local"
					defaultValue={data?.dueDate}
					register={register}
					error={errors?.dueDate}
				/>
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
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Lesson</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("lessonId")}
						defaultValue={data?.lessonId}
					>
						{lessons.map((lesson: { id: number; name: string }) => (
							<option value={lesson.id} key={lesson.id}>
								{lesson.name}
							</option>
						))}
					</select>
					{errors.lessonId?.message && (
						<p className="text-xs text-red-400">
							{errors.lessonId.message.toString()}
						</p>
					)}
				</div>
				{/* DESCRIPTION/INSTRUCTIONS */}
				<div className="flex flex-col gap-2 w-full">
					<label className="text-xs text-gray-500">
						Description / Instructions (Optional)
					</label>
					<textarea
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full min-h-[120px]"
						{...register("description")}
						defaultValue={data?.description}
						placeholder="Enter detailed assignment instructions, requirements, grading criteria, etc..."
					/>
					{errors.description?.message && (
						<p className="text-xs text-red-400">
							{errors.description.message.toString()}
						</p>
					)}
				</div>
				{/* PDF LINK */}
				<div className="flex flex-col gap-2 w-full md:w-[48%]">
					<label className="text-xs text-gray-500">
						PDF Resource Link (Optional)
					</label>
					<input
						type="text"
						{...register("pdfLink")}
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						placeholder="https://example.com/resource.pdf"
						defaultValue={data?.pdfLink}
					/>
					{errors.pdfLink?.message && (
						<p className="text-xs text-red-400">
							{errors.pdfLink.message.toString()}
						</p>
					)}
				</div>{" "}
				{/* IMAGE UPLOAD */}
				<div className="flex flex-col gap-2 w-full md:w-[48%]">
					<label className="text-xs text-gray-500">
						Image Resource (Optional)
					</label>
					<CldUploadWidget
						uploadPreset="school"
						onSuccess={(result, { widget }) => {
							setImg(result.info);
							setValue("imageUrl", (result.info as any).secure_url);
							widget.close();
						}}
					>
						{({ open }) => {
							return (
								<div
									className="flex items-center gap-2 cursor-pointer"
									onClick={() => open()}
								>
									{img ? (
										<div className="relative w-full h-32">
											<Image
												src={img?.secure_url || img}
												alt="Assignment Image"
												fill
												className="object-cover rounded-md"
											/>
										</div>
									) : (
										<div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-lamaSky transition-colors">
											<div className="text-center">
												<svg
													className="mx-auto h-12 w-12 text-gray-400"
													stroke="currentColor"
													fill="none"
													viewBox="0 0 48 48"
												>
													<path
														d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
												<p className="mt-1 text-sm text-gray-600">
													Click to upload image
												</p>
											</div>
										</div>
									)}
								</div>
							);
						}}
					</CldUploadWidget>
					{img && (
						<button
							type="button"
							onClick={() => {
								setImg(null);
								setValue("imageUrl", "");
							}}
							className="text-xs text-red-600 hover:text-red-700"
						>
							Remove Image
						</button>
					)}
					{errors.imageUrl?.message && (
						<p className="text-xs text-red-400">
							{errors.imageUrl.message.toString()}
						</p>
					)}
				</div>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
				<p className="text-xs text-blue-700">
					<strong>📎 Resources:</strong> Add helpful materials for students:
				</p>
				<ul className="text-xs text-blue-600 mt-1 ml-4 list-disc">
					<li>
						<strong>Description:</strong> Detailed instructions, requirements,
						and grading criteria
					</li>
					<li>
						<strong>PDF Link:</strong> Link to external PDF documents, guides,
						or reading materials
					</li>
					<li>
						<strong>Image:</strong> Visual aids, diagrams, reference images, or
						examples
					</li>
				</ul>
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

export default AssignmentForm;
