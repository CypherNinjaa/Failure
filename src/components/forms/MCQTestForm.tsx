"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { mcqTestSchema, MCQTestSchema } from "@/lib/formValidationSchemas";
import { createMCQTest, updateMCQTest } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MCQTestForm = ({
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
	} = useForm<MCQTestSchema>({
		resolver: zodResolver(mcqTestSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createMCQTest : updateMCQTest,
		{
			success: false,
			error: false,
		}
	);

	const onSubmit = handleSubmit((data) => {
		formAction(data);
	});

	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			toast(`MCQ Test has been ${type === "create" ? "created" : "updated"}!`);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	const { subjects, classes, teachers } = relatedData;

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create" ? "Create a new MCQ test" : "Update the MCQ test"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="flex flex-col gap-2 w-full">
					<InputField
						label="Test Title"
						name="title"
						defaultValue={data?.title}
						register={register}
						error={errors?.title}
					/>
				</div>
				<div className="flex flex-col gap-2 w-full">
					<label className="text-xs text-gray-500">
						Description (Optional)
					</label>
					<textarea
						{...register("description")}
						defaultValue={data?.description || ""}
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						rows={3}
						placeholder="Describe what this test covers..."
					/>
					{errors.description?.message && (
						<p className="text-xs text-red-400">
							{errors.description.message.toString()}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2 w-full md:w-1/3">
					<label className="text-xs text-gray-500">Subject (Optional)</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("subjectId")}
						defaultValue={data?.subjectId || ""}
					>
						<option value="">Select a subject</option>
						{subjects?.map((subject: { id: number; name: string }) => (
							<option value={subject.id} key={subject.id}>
								{subject.name}
							</option>
						))}
					</select>
					{errors.subjectId?.message && (
						<p className="text-xs text-red-400">
							{errors.subjectId.message.toString()}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2 w-full md:w-1/3">
					<label className="text-xs text-gray-500">Class (Optional)</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("classId")}
						defaultValue={data?.classId || ""}
					>
						<option value="">Select a class</option>
						{classes?.map((classItem: { id: number; name: string }) => (
							<option value={classItem.id} key={classItem.id}>
								{classItem.name}
							</option>
						))}
					</select>
					{errors.classId?.message && (
						<p className="text-xs text-red-400">
							{errors.classId.message.toString()}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2 w-full md:w-1/3">
					<label className="text-xs text-gray-500">Teacher</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("teacherId")}
						defaultValue={data?.teacherId}
					>
						<option value="">Select a teacher</option>
						{teachers?.map(
							(teacher: { id: string; name: string; surname: string }) => (
								<option value={teacher.id} key={teacher.id}>
									{teacher.name} {teacher.surname}
								</option>
							)
						)}
					</select>
					{errors.teacherId?.message && (
						<p className="text-xs text-red-400">
							{errors.teacherId.message.toString()}
						</p>
					)}
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

export default MCQTestForm;
