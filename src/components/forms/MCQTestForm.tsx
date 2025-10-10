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
			message: "",
		}
	);

	const router = useRouter();

	const onSubmit = handleSubmit((formData) => {
		formAction(formData as any);
	});

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
				{type === "create" ? "Create a new MCQ Test" : "Update MCQ Test"}
			</h1>
			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Test Title"
					name="title"
					defaultValue={data?.title}
					register={register}
					error={errors?.title}
				/>
				<InputField
					label="Description"
					name="description"
					defaultValue={data?.description}
					register={register}
					error={errors?.description}
					type="textarea"
				/>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Subject</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("subjectId")}
						defaultValue={data?.subjectId}
					>
						<option value="">Select Subject</option>
						{subjects.map((subject: { id: number; name: string }) => (
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
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Class</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("classId")}
						defaultValue={data?.classId}
					>
						<option value="">Select Class</option>
						{classes.map((classItem: { id: number; name: string }) => (
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
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Teacher</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("teacherId")}
						defaultValue={data?.teacherId}
					>
						<option value="">Select Teacher</option>
						{teachers.map(
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
				<InputField
					label="Duration (minutes)"
					name="duration"
					defaultValue={data?.duration}
					register={register}
					error={errors?.duration}
					type="number"
				/>
				<InputField
					label="Start Time"
					name="startTime"
					defaultValue={
						data?.startTime
							? new Date(data.startTime).toISOString().slice(0, 16)
							: ""
					}
					register={register}
					error={errors?.startTime}
					type="datetime-local"
				/>
				<InputField
					label="Deadline"
					name="deadline"
					defaultValue={
						data?.deadline
							? new Date(data.deadline).toISOString().slice(0, 16)
							: ""
					}
					register={register}
					error={errors?.deadline}
					type="datetime-local"
				/>
				<InputField
					label="Passing Score (%)"
					name="passingScore"
					defaultValue={data?.passingScore || 70}
					register={register}
					error={errors?.passingScore}
					type="number"
				/>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Shuffle Questions?</label>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							{...register("shuffleQuestions")}
							defaultChecked={data?.shuffleQuestions}
							className="w-5 h-5"
						/>
						<span className="text-sm text-gray-600">
							Randomize question order
						</span>
					</div>
				</div>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Shuffle Options?</label>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							{...register("shuffleOptions")}
							defaultChecked={data?.shuffleOptions}
							className="w-5 h-5"
						/>
						<span className="text-sm text-gray-600">
							Randomize answer options
						</span>
					</div>
				</div>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Allow Review?</label>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							{...register("allowReview")}
							defaultChecked={data?.allowReview !== false}
							className="w-5 h-5"
						/>
						<span className="text-sm text-gray-600">
							Students can review answers
						</span>
					</div>
				</div>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Show Results?</label>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							{...register("showResults")}
							defaultChecked={data?.showResults !== false}
							className="w-5 h-5"
						/>
						<span className="text-sm text-gray-600">
							Show results after submission
						</span>
					</div>
				</div>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Publish Test?</label>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							{...register("isPublished")}
							defaultChecked={data?.isPublished}
							className="w-5 h-5"
						/>
						<span className="text-sm text-gray-600">
							Make test available to students
						</span>
					</div>
				</div>
				{data && (
					<InputField
						label="id"
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
