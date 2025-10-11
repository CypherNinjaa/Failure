"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import InputField from "../InputField";
import {
	mcqQuestionSchema,
	MCQQuestionSchema,
} from "@/lib/formValidationSchemas";
import { createMCQQuestion, updateMCQQuestion } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MCQQuestionForm = ({
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
		control,
		watch,
		formState: { errors },
	} = useForm<MCQQuestionSchema>({
		resolver: zodResolver(mcqQuestionSchema),
		defaultValues: {
			testId: data?.testId || "",
			question: data?.question || "",
			answer: data?.answer || "",
			options: (data?.options as string[]) || ["", ""],
			questionType: data?.questionType || "MULTIPLE_CHOICE",
			explanation: data?.explanation || "",
			orderIndex: data?.orderIndex || 1,
		},
	});

	const questionType = watch("questionType");
	const isOpenEnded = questionType === "OPEN_ENDED";

	const { fields, append, remove } = useFieldArray<MCQQuestionSchema>({
		control,
		name: "options" as never,
	});

	const [state, formAction] = useFormState(
		type === "create" ? createMCQQuestion : updateMCQQuestion,
		{
			success: false,
			error: false,
		}
	);

	const onSubmit = handleSubmit((formData) => {
		formAction(formData);
	});

	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			toast(`Question has been ${type === "create" ? "created" : "updated"}!`);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	return (
		<form className="flex flex-col gap-6" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create" ? "Create a new question" : "Update the question"}
			</h1>

			<div className="flex flex-col gap-4">
				{/* Question Text */}
				<div className="flex flex-col gap-2 w-full">
					<label className="text-xs text-gray-500">Question</label>
					<textarea
						{...register("question")}
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						rows={3}
						placeholder="Enter your question here..."
					/>
					{errors.question?.message && (
						<p className="text-xs text-red-400">
							{errors.question.message.toString()}
						</p>
					)}
				</div>

				{/* Question Type */}
				<div className="flex flex-col gap-2 w-full md:w-1/2">
					<label className="text-xs text-gray-500">Question Type</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("questionType")}
					>
						<option value="MULTIPLE_CHOICE">Multiple Choice</option>
						<option value="TRUE_FALSE">True/False</option>
						<option value="OPEN_ENDED">Open Ended</option>
					</select>
					{errors.questionType?.message && (
						<p className="text-xs text-red-400">
							{errors.questionType.message.toString()}
						</p>
					)}
					{isOpenEnded && (
						<p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-md mt-1">
							<strong>Open Ended:</strong> Student will type their answer in a
							text box. This requires manual grading by the teacher. Options and
							correct answer are optional - use them as reference if needed.
						</p>
					)}
				</div>

				{/* Options - Only show for MULTIPLE_CHOICE and TRUE_FALSE */}
				{!isOpenEnded && (
					<div className="flex flex-col gap-2 w-full">
						<div className="flex items-center justify-between">
							<label className="text-xs text-gray-500">
								Options (Add at least 2)
							</label>
							<button
								type="button"
								onClick={() => append("")}
								className="text-xs bg-lamaSky text-white px-3 py-1 rounded-md flex items-center gap-1"
							>
								<Image src="/plus.png" alt="" width={12} height={12} />
								Add Option
							</button>
						</div>
						<div className="flex flex-col gap-2">
							{fields.map((field, index) => (
								<div key={field.id} className="flex items-center gap-2">
									<span className="text-sm font-medium text-gray-500 w-8">
										{index + 1}.
									</span>
									<input
										{...register(`options.${index}` as const)}
										className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm flex-1"
										placeholder={`Option ${index + 1}`}
									/>
									{fields.length > 2 && (
										<button
											type="button"
											onClick={() => remove(index)}
											className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200"
										>
											<Image src="/delete.png" alt="" width={14} height={14} />
										</button>
									)}
								</div>
							))}
						</div>
						{errors.options?.message && (
							<p className="text-xs text-red-400">
								{errors.options.message.toString()}
							</p>
						)}
					</div>
				)}

				{/* Correct Answer - Only show for MULTIPLE_CHOICE and TRUE_FALSE */}
				{!isOpenEnded && (
					<InputField
						label="Correct Answer"
						name="answer"
						register={register}
						error={errors?.answer}
						inputProps={{
							placeholder:
								"Enter the exact correct answer (must match one of the options)",
						}}
					/>
				)}

				{/* Reference Answer - Only for OPEN_ENDED */}
				{isOpenEnded && (
					<div className="flex flex-col gap-2 w-full">
						<label className="text-xs text-gray-500">
							Reference Answer (Optional)
						</label>
						<textarea
							{...register("answer")}
							className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
							rows={3}
							placeholder="Provide a sample/reference answer for grading reference..."
						/>
						<p className="text-xs text-gray-400">
							This will be shown to the teacher when grading student responses.
						</p>
						{errors.answer?.message && (
							<p className="text-xs text-red-400">
								{errors.answer.message.toString()}
							</p>
						)}
					</div>
				)}

				{/* Explanation (Optional) */}
				<div className="flex flex-col gap-2 w-full">
					<label className="text-xs text-gray-500">
						Explanation (Optional)
					</label>
					<textarea
						{...register("explanation")}
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						rows={2}
						placeholder="Explain why this is the correct answer..."
					/>
					{errors.explanation?.message && (
						<p className="text-xs text-red-400">
							{errors.explanation.message.toString()}
						</p>
					)}
				</div>

				{/* Order Index */}
				<InputField
					label="Question Order"
					name="orderIndex"
					type="number"
					register={register}
					error={errors?.orderIndex}
				/>

				{/* Hidden Fields */}
				<InputField
					label="Test ID"
					name="testId"
					register={register}
					error={errors?.testId}
					hidden
				/>
				{data?.id && (
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

export default MCQQuestionForm;
