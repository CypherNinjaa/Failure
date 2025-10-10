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
		defaultValues: {
			questionType: data?.questionType || "MULTIPLE_CHOICE",
			points: data?.points || 1,
			negativeMarking: data?.negativeMarking || 0,
			order: data?.order || 1,
		},
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
	const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
	const [selectedAnswer, setSelectedAnswer] = useState<string>(""); // For MULTIPLE_CHOICE radio buttons

	// Log validation errors
	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			console.log("=== FORM VALIDATION ERRORS ===");
			console.log(errors);
		}
	}, [errors]);

	// Set dummy correctAnswer for MATCH_FOLLOWING to pass validation
	useEffect(() => {
		if (selectedType === "MATCH_FOLLOWING") {
			setValue("correctAnswer", "MATCH_PAIRS"); // Dummy value, will be replaced in onSubmit
		}
	}, [selectedType, setValue]);

	const onSubmit = handleSubmit(
		(formData) => {
			console.log("=== FORM SUBMIT STARTED ===");
			console.log("selectedType:", selectedType);
			console.log("Raw formData:", formData);

			// Serialize options and correct answer based on question type
			if (selectedType === "MATCH_FOLLOWING") {
				formData.options = JSON.stringify(matchPairs);
				formData.correctAnswer = JSON.stringify(matchPairs); // Correct matching
			} else if (
				selectedType === "MULTIPLE_CHOICE" ||
				selectedType === "MULTI_SELECT"
			) {
				const filteredOptions = options.filter((o) => o.trim());
				formData.options = JSON.stringify(filteredOptions);

				// For MULTIPLE_CHOICE: correctAnswer is the option text
				// For MULTI_SELECT: correctAnswer is array of option texts
				if (selectedType === "MULTIPLE_CHOICE") {
					// Get the selected radio button index and convert to option text
					console.log("MULTIPLE_CHOICE - selectedAnswer:", selectedAnswer);
					console.log("MULTIPLE_CHOICE - filteredOptions:", filteredOptions);

					if (selectedAnswer === "") {
						toast.error("Please select the correct answer!");
						return;
					}

					const selectedIndex = parseInt(selectedAnswer);
					if (!isNaN(selectedIndex) && filteredOptions[selectedIndex]) {
						formData.correctAnswer = JSON.stringify([
							filteredOptions[selectedIndex],
						]);
						console.log(
							"MULTIPLE_CHOICE - correctAnswer JSON:",
							formData.correctAnswer
						);
					} else {
						toast.error("Please select a valid option!");
						return;
					}
				} else if (selectedType === "MULTI_SELECT") {
					// correctAnswer should already be an array from checkboxes
					// Convert to array of option texts
					console.log("MULTI_SELECT - selectedAnswers:", selectedAnswers);
					console.log("MULTI_SELECT - filteredOptions:", filteredOptions);

					if (selectedAnswers.length === 0) {
						toast.error("Please select at least one correct answer!");
						return;
					}
					const selectedOptions = selectedAnswers
						.map((idx) => filteredOptions[parseInt(idx)])
						.filter(Boolean);

					console.log("MULTI_SELECT - selectedOptions:", selectedOptions);
					formData.correctAnswer = JSON.stringify(selectedOptions);
					console.log(
						"MULTI_SELECT - correctAnswer JSON:",
						formData.correctAnswer
					);
				}
			} else if (selectedType === "TRUE_FALSE") {
				// TRUE_FALSE: No options needed, just correctAnswer
				// correctAnswer is "true" or "false" from radio button
				if (!formData.correctAnswer) {
					toast.error("Please select True or False!");
					return;
				}
				formData.correctAnswer = JSON.stringify([formData.correctAnswer]);
				// Don't set options for TRUE_FALSE
				formData.options = undefined;
			} else if (selectedType === "FILL_BLANK") {
				// For FILL_BLANK, wrap single answer in array, no options needed
				if (!formData.correctAnswer || !formData.correctAnswer.trim()) {
					toast.error("Please enter the correct answer!");
					return;
				}
				formData.correctAnswer = JSON.stringify([formData.correctAnswer]);
				// Don't set options for FILL_BLANK
				formData.options = undefined;
			}

			console.log("=== FINAL FORM DATA ===");
			console.log("questionType:", formData.questionType);
			console.log("questionText:", formData.questionText);
			console.log("options:", formData.options);
			console.log("correctAnswer:", formData.correctAnswer);
			console.log("points:", formData.points);
			console.log("negativeMarking:", formData.negativeMarking);
			console.log("========================");

			formAction(formData as any);
		},
		(errors) => {
			console.log("=== FORM VALIDATION FAILED ===");
			console.log("Validation errors:", errors);
			console.log("Error details:");
			Object.keys(errors).forEach((key) => {
				console.log(`  ${key}:`, (errors as any)[key]?.message);
			});
			toast.error("Please fill in all required fields correctly!");
		}
	);

	useEffect(() => {
		if (state.success) {
			toast.success(
				`MCQ Question has been ${type === "create" ? "created" : "updated"}!`
			);
			setOpen(false);
			router.refresh();
		} else if (state.error) {
			toast.error(state.message || "Failed to save question!");
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
				<InputField
					label="Order"
					name="order"
					defaultValue={data?.order || 1}
					register={register}
					error={errors?.order}
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
									{selectedType === "MULTI_SELECT" ? (
										<input
											type="checkbox"
											value={index}
											checked={selectedAnswers.includes(index.toString())}
											onChange={(e) => {
												let newSelectedAnswers;
												if (e.target.checked) {
													newSelectedAnswers = [
														...selectedAnswers,
														index.toString(),
													];
												} else {
													newSelectedAnswers = selectedAnswers.filter(
														(a) => a !== index.toString()
													);
												}
												setSelectedAnswers(newSelectedAnswers);
												// Update react-hook-form with comma-separated values
												setValue("correctAnswer", newSelectedAnswers.join(","));
											}}
										/>
									) : (
										<input
											type="radio"
											name="correctAnswer"
											value={index}
											checked={selectedAnswer === index.toString()}
											onChange={(e) => {
												console.log(
													"Radio button clicked, value:",
													e.target.value
												);
												setSelectedAnswer(e.target.value);
												setValue("correctAnswer", e.target.value);
												console.log(
													"selectedAnswer state updated to:",
													e.target.value
												);
											}}
										/>
									)}
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
