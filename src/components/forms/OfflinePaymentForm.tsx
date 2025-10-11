"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
	offlinePaymentSchema,
	OfflinePaymentSchema,
} from "@/lib/formValidationSchemas";
import { recordOfflinePayment } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const OfflinePaymentForm = ({
	setOpen,
	relatedData,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>;
	relatedData?: any;
}) => {
	const [selectedClass, setSelectedClass] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<OfflinePaymentSchema>({
		resolver: zodResolver(offlinePaymentSchema),
	});

	const [state, formAction] = useFormState(recordOfflinePayment, {
		success: false,
		error: false,
	});

	const onSubmit = handleSubmit((data) => {
		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			const value = data[key as keyof OfflinePaymentSchema];
			if (value !== undefined && value !== null && value !== "") {
				formData.append(key, value.toString());
			}
		});
		formAction(formData);
	});

	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			toast("Payment recorded successfully!");
			setOpen(false);
			router.refresh();
		}
	}, [state, router, setOpen]);

	const { studentFees } = relatedData;

	// Get unique classes from student fees
	const classes = Array.from(
		new Set(
			studentFees
				?.map((fee: any) => fee.student.class)
				.filter((cls: any) => cls)
		)
	);

	// Filter student fees by selected class and search query
	const filteredStudentFees = studentFees?.filter((fee: any) => {
		const matchesClass =
			selectedClass === "all" || fee.student.class?.name === selectedClass;
		const matchesSearch =
			searchQuery === "" ||
			fee.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			fee.student.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
			fee.feeStructure.name.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesClass && matchesSearch;
	});

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">Record Offline Payment</h1>

			{/* Filter Section */}
			<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
				<h3 className="text-sm font-semibold text-gray-700 mb-3">
					Filter Students
				</h3>
				<div className="flex gap-4 flex-wrap">
					{/* Class Filter */}
					<div className="flex flex-col gap-2 flex-1 min-w-[200px]">
						<label className="text-xs text-gray-500">Filter by Class</label>
						<select
							className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white"
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}
						>
							<option value="all">All Classes</option>
							{classes?.map((cls: any) => (
								<option value={cls.name} key={cls.id}>
									{cls.name} - Grade {cls.grade?.level || "N/A"}
								</option>
							))}
						</select>
					</div>

					{/* Search Filter */}
					<div className="flex flex-col gap-2 flex-1 min-w-[200px]">
						<label className="text-xs text-gray-500">Search Student/Fee</label>
						<input
							type="text"
							placeholder="Search by name or fee..."
							className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
				<p className="text-xs text-gray-500 mt-2">
					Showing {filteredStudentFees?.length || 0} of{" "}
					{studentFees?.length || 0} student fees
				</p>
			</div>

			<div className="flex justify-between flex-wrap gap-4">
				<div className="flex flex-col gap-2 w-full md:w-1/2">
					<label className="text-xs text-gray-500">Student Fee</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("studentFeeId")}
					>
						<option value="">Select Student Fee</option>
						{filteredStudentFees?.length === 0 ? (
							<option value="" disabled>
								No students found
							</option>
						) : (
							filteredStudentFees?.map((fee: any) => (
								<option value={fee.id} key={fee.id}>
									{fee.student.name} {fee.student.surname} |{" "}
									{fee.student.class?.name || "No Class"} |{" "}
									{fee.feeStructure.name} | ₹{fee.pendingAmount.toFixed(2)}{" "}
									pending
								</option>
							))
						)}
					</select>
					{errors.studentFeeId?.message && (
						<p className="text-xs text-red-400">
							{errors.studentFeeId.message.toString()}
						</p>
					)}
				</div>
				<InputField
					label="Amount"
					name="amount"
					type="number"
					register={register}
					error={errors?.amount}
				/>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Payment Method</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("paymentMethod")}
					>
						<option value="CASH">Cash</option>
						<option value="CARD">Card</option>
						<option value="BANK_TRANSFER">Bank Transfer</option>
						<option value="CHEQUE">Cheque</option>
						<option value="OTHER">Other</option>
					</select>
					{errors.paymentMethod?.message && (
						<p className="text-xs text-red-400">
							{errors.paymentMethod.message.toString()}
						</p>
					)}
				</div>
				<InputField
					label="Notes (Optional)"
					name="notes"
					register={register}
					error={errors?.notes}
				/>
			</div>
			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}
			<button className="bg-blue-400 text-white p-2 rounded-md">
				Record Payment
			</button>
		</form>
	);
};

export default OfflinePaymentForm;
