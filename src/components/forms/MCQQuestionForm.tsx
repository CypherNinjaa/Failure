"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const questionTypes = [
	{ value: "MULTIPLE_CHOICE", label: "Multiple Choice (Single Answer)" },
	{ value: "MULTI_SELECT", label: "Multiple Select (Multiple Answers)" },
	{ value: "TRUE_FALSE", label: "True/False" },
	{ value: "FILL_BLANK", label: "Fill in the Blank" },
	{ value: "MATCH_FOLLOWING", label: "Match the Following" },
];

const MCQQuestionForm = ({
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
		watch,
		setValue,
		formState: { errors },
	} = useForm<MCQQuestionSchema>({
		resolver: zodResolver(mcqQuestionSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createMCQQuestion : updateMCQQuestion,
		{
			success: false,
			error: false,
			message: "",
		}
	);

	const router = useRouter();
	const selectedType = watch("questionType");
	const [options, setOptions] = useState<string[]>(
		data?.options ? JSON.parse(data.options) : ["", "", "", ""]
	);
	const [matchPairs, setMatchPairs] = useState<
		{ left: string; right: string }[]
	>(
		data?.questionType === "MATCH_FOLLOWING" && data?.options
			? JSON.parse(data.options)
			: [
					{ left: "", right: "" },
					{ left: "", right: "" },
			  ]
	);

	const onSubmit = handleSubmit((formData) => {
		// Serialize options and correct answer based on question type
		if (selectedType === "MATCH_FOLLOWING") {
			formData.options = JSON.stringify(matchPairs);
			formData.correctAnswer = JSON.stringify(matchPairs); // Correct matching
		} else if (
			selectedType === "MULTIPLE_CHOICE" ||
			selectedType === "MULTI_SELECT" ||
			selectedType === "TRUE_FALSE"
		) {
			formData.options = JSON.stringify(options.filter((o) => o.trim()));
		}

		formAction(formData as any);
	});

	useEffect(() => {
		if (state.success) {
			toast(
				`MCQ Question has been ${type === "create" ? "created" : "updated"}!`
			);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	const addOption = () => {
		setOptions([...options, ""]);
	};

	const removeOption = (index: number) => {
		setOptions(options.filter((_, i) => i !== index));
	};

	const addMatchPair = () => {
		setMatchPairs([...matchPairs, { left: "", right: "" }]);
	};

	const removeMatchPair = (index: number) => {
		setMatchPairs(matchPairs.filter((_, i) => i !== index));
	};

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create" ? "Add a new Question" : "Update Question"}
			</h1>
			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Test ID"
					name="testId"
					defaultValue={data?.testId || relatedData?.testId}
					register={register}
					error={errors?.testId}
					type="number"
					hidden
				/>
				<div className="flex flex-col gap-2 w-full">
					<label className="text-xs text-gray-500">Question Type</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("questionType")}
						defaultValue={data?.questionType || "MULTIPLE_CHOICE"}
					>
						{questionTypes.map((type) => (
							<option value={type.value} key={type.value}>
								{type.label}
							</option>
						))}
					</select>
					{errors.questionType?.message && (
						<p className="text-xs text-red-400">
							{errors.questionType.message.toString()}
						</p>
					)}
				</div>
				<InputField
					label="Question Text"
					name="questionText"
					defaultValue={data?.questionText}
					register={register}
					error={errors?.questionText}
					type="textarea"
				/>
				{/* Options for MCQ, Multi-Select, True/False */}
				{(selectedType === "MULTIPLE_CHOICE" ||
					selectedType === "MULTI_SELECT" ||
					selectedType === "TRUE_FALSE") && (
					<div className="flex flex-col gap-4 w-full">
						<label className="text-xs text-gray-500 font-semibold">
							Answer Options
						</label>
						{selectedType === "TRUE_FALSE" ? (
							<>
								<div className="flex items-center gap-2">
									<input
										type="radio"
										value="true"
										{...register("correctAnswer")}
										defaultChecked={data?.correctAnswer === "true"}
									/>
									<span>True</span>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="radio"
										value="false"
										{...register("correctAnswer")}
										defaultChecked={data?.correctAnswer === "false"}
									/>
									<span>False</span>
								</div>
							</>
						) : (
							options.map((option, index) => (
								<div key={index} className="flex items-center gap-2">
									<input
										type={
											selectedType === "MULTI_SELECT" ? "checkbox" : "radio"
										}
										value={index}
										{...register("correctAnswer")}
										defaultChecked={
											data?.correctAnswer &&
											JSON.parse(data.correctAnswer).includes(index)
										}
									/>
									<input
										type="text"
										className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm flex-1"
										placeholder={`Option ${index + 1}`}
										value={option}
										onChange={(e) => {
											const newOptions = [...options];
											newOptions[index] = e.target.value;
											setOptions(newOptions);
										}}
									/>
									{options.length > 2 && (
										<button
											type="button"
											onClick={() => removeOption(index)}
											className="text-red-500 text-sm"
										>
											Remove
										</button>
									)}
								</div>
							))
						)}
						{selectedType !== "TRUE_FALSE" && (
							<button
								type="button"
								onClick={addOption}
								className="text-blue-500 text-sm self-start"
							>
								+ Add Option
							</button>
						)}
					</div>
				)}
				{/* Fill in the Blank */}
				{selectedType === "FILL_BLANK" && (
					<InputField
						label="Correct Answer"
						name="correctAnswer"
						defaultValue={data?.correctAnswer}
						register={register}
						error={errors?.correctAnswer}
						inputProps={{ placeholder: "Enter the correct answer" }}
					/>
				)}{" "}
				{/* Match the Following */}
				{selectedType === "MATCH_FOLLOWING" && (
					<div className="flex flex-col gap-4 w-full">
						<label className="text-xs text-gray-500 font-semibold">
							Match Pairs
						</label>
						{matchPairs.map((pair, index) => (
							<div key={index} className="flex items-center gap-2">
								<input
									type="text"
									className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm flex-1"
									placeholder="Left side"
									value={pair.left}
									onChange={(e) => {
										const newPairs = [...matchPairs];
										newPairs[index].left = e.target.value;
										setMatchPairs(newPairs);
									}}
								/>
								<span>↔</span>
								<input
									type="text"
									className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm flex-1"
									placeholder="Right side"
									value={pair.right}
									onChange={(e) => {
										const newPairs = [...matchPairs];
										newPairs[index].right = e.target.value;
										setMatchPairs(newPairs);
									}}
								/>
								{matchPairs.length > 2 && (
									<button
										type="button"
										onClick={() => removeMatchPair(index)}
										className="text-red-500 text-sm"
									>
										Remove
									</button>
								)}
							</div>
						))}
						<button
							type="button"
							onClick={addMatchPair}
							className="text-blue-500 text-sm self-start"
						>
							+ Add Pair
						</button>
					</div>
				)}
				<InputField
					label="Points"
					name="points"
					defaultValue={data?.points || 1}
					register={register}
					error={errors?.points}
					type="number"
				/>
				<InputField
					label="Negative Marking (max 4)"
					name="negativeMarking"
					defaultValue={data?.negativeMarking || 0}
					register={register}
					error={errors?.negativeMarking}
					type="number"
					step="0.25"
				/>
				<InputField
					label="Explanation (optional)"
					name="explanation"
					defaultValue={data?.explanation}
					register={register}
					error={errors?.explanation}
					type="textarea"
				/>
				<InputField
					label="Image URL (optional)"
					name="imageUrl"
					defaultValue={data?.imageUrl}
					register={register}
					error={errors?.imageUrl}
				/>
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
				{type === "create" ? "Add Question" : "Update Question"}
			</button>
		</form>
	);
};

export default MCQQuestionForm;
