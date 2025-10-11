"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

const onlinePaymentSchema = z.object({
	studentFeeId: z.string().min(1, "Required"),
	amount: z.string().min(1, "Amount is required"),
	paymentApp: z.enum([
		"PHONEPE",
		"PAYTM",
		"GPAY",
		"BHIM",
		"AMAZONPAY",
		"OTHER",
	]),
	transactionId: z.string().min(1, "Transaction ID is required"),
	screenshot: z.string().min(1, "Payment screenshot is required"),
	notes: z.string().optional(),
});

type OnlinePaymentSchema = z.infer<typeof onlinePaymentSchema>;

const ParentOnlinePaymentForm = ({
	studentFeeId,
	studentFeeName,
	pendingAmount,
	upiId,
	upiQRCode,
	onClose,
}: {
	studentFeeId: string;
	studentFeeName: string;
	pendingAmount: number;
	upiId: string;
	upiQRCode: string | null;
	onClose: () => void;
}) => {
	const [screenshotUrl, setScreenshotUrl] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [copied, setCopied] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<OnlinePaymentSchema>({
		resolver: zodResolver(onlinePaymentSchema),
		defaultValues: {
			studentFeeId,
			amount: pendingAmount.toString(),
		},
	});

	const router = useRouter();

	useEffect(() => {
		if (screenshotUrl) {
			setValue("screenshot", screenshotUrl);
		}
	}, [screenshotUrl, setValue]);

	const copyUpiId = () => {
		navigator.clipboard.writeText(upiId);
		setCopied(true);
		toast.success("UPI ID copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	const onSubmit = handleSubmit(async (data) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/parent-payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				toast.success(
					"Payment submitted! Waiting for admin approval. You will be notified once approved."
				);
				onClose();
				router.refresh();
			} else {
				const error = await response.json();
				toast.error(error.error || "Failed to submit payment");
			}
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong!");
		} finally {
			setIsSubmitting(false);
		}
	});

	return (
		<form className="flex flex-col gap-6" onSubmit={onSubmit}>
			<div className="flex justify-between items-start">
				<div>
					<h1 className="text-xl font-semibold">Pay Online (UPI)</h1>
					<p className="text-sm text-gray-500 mt-1">{studentFeeName}</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="text-gray-400 hover:text-gray-600"
				>
					✕
				</button>
			</div>

			{/* Amount Display */}
			<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
				<div className="flex justify-between items-center">
					<span className="text-sm text-gray-600">Amount to Pay:</span>
					<span className="text-2xl font-bold text-blue-600">
						₹{pendingAmount.toFixed(2)}
					</span>
				</div>
			</div>

			{/* UPI ID Section */}
			<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
				<label className="text-sm font-semibold text-gray-700 block mb-2">
					UPI ID
				</label>
				<div className="flex items-center gap-2">
					<input
						type="text"
						value={upiId}
						readOnly
						className="flex-1 bg-white p-3 rounded-md text-sm border border-gray-300 font-mono"
					/>
					<button
						type="button"
						onClick={copyUpiId}
						className="bg-blue-500 text-white px-4 py-3 rounded-md text-sm hover:bg-blue-600 whitespace-nowrap"
					>
						{copied ? "✓ Copied" : "📋 Copy"}
					</button>
				</div>
				<p className="text-xs text-gray-500 mt-2">
					Use this UPI ID to make payment from any UPI app
				</p>
			</div>

			{/* QR Code Section */}
			{upiQRCode && (
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<label className="text-sm font-semibold text-gray-700 block mb-3">
						Or Scan QR Code
					</label>
					<div className="flex justify-center">
						<div className="relative w-48 h-48 border-4 border-white rounded-lg shadow-lg overflow-hidden bg-white">
							<Image
								src={upiQRCode}
								alt="UPI QR Code"
								fill
								className="object-contain p-2"
							/>
						</div>
					</div>
					<p className="text-xs text-gray-500 mt-3 text-center">
						Scan with any UPI app to pay instantly
					</p>
				</div>
			)}

			{/* Divider */}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-300"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-4 bg-white text-gray-500">
						After making payment, fill the details below
					</span>
				</div>
			</div>

			{/* Payment App Selection */}
			<div className="flex flex-col gap-2">
				<label className="text-sm text-gray-700 font-medium">
					Payment App Used <span className="text-red-500">*</span>
				</label>
				<select
					className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full"
					{...register("paymentApp")}
				>
					<option value="">Select payment app</option>
					<option value="PHONEPE">PhonePe</option>
					<option value="PAYTM">Paytm</option>
					<option value="GPAY">Google Pay</option>
					<option value="BHIM">BHIM UPI</option>
					<option value="AMAZONPAY">Amazon Pay</option>
					<option value="OTHER">Other</option>
				</select>
				{errors.paymentApp && (
					<p className="text-xs text-red-400">{errors.paymentApp.message}</p>
				)}
			</div>

			{/* Amount Paid */}
			<div className="flex flex-col gap-2">
				<label className="text-sm text-gray-700 font-medium">
					Amount Paid <span className="text-red-500">*</span>
				</label>
				<input
					type="number"
					step="0.01"
					placeholder="Enter amount paid"
					className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full"
					{...register("amount")}
				/>
				{errors.amount && (
					<p className="text-xs text-red-400">{errors.amount.message}</p>
				)}
				<p className="text-xs text-gray-500">
					You can pay partial amount if needed
				</p>
			</div>

			{/* Transaction ID */}
			<div className="flex flex-col gap-2">
				<label className="text-sm text-gray-700 font-medium">
					Transaction ID / UPI Ref No <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					placeholder="Enter transaction ID from payment app"
					className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full font-mono"
					{...register("transactionId")}
				/>
				{errors.transactionId && (
					<p className="text-xs text-red-400">{errors.transactionId.message}</p>
				)}
				<p className="text-xs text-gray-500">
					Find this in your payment app&apos;s transaction history
				</p>
			</div>

			{/* Screenshot Upload */}
			<div className="flex flex-col gap-2">
				<label className="text-sm text-gray-700 font-medium">
					Payment Screenshot <span className="text-red-500">*</span>
				</label>
				<div className="flex items-start gap-4">
					<CldUploadWidget
						uploadPreset="school"
						onSuccess={(result: any) => {
							setScreenshotUrl(result.info.secure_url);
							toast.success("Screenshot uploaded!");
						}}
					>
						{({ open }) => (
							<button
								type="button"
								onClick={() => open()}
								className="bg-gray-500 text-white px-4 py-3 rounded-md text-sm hover:bg-gray-600"
							>
								📤 Upload Screenshot
							</button>
						)}
					</CldUploadWidget>

					{screenshotUrl && (
						<div className="relative w-24 h-24 border rounded-md overflow-hidden">
							<Image
								src={screenshotUrl}
								alt="Payment Screenshot"
								fill
								className="object-cover"
							/>
							<div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
								✓
							</div>
						</div>
					)}
				</div>
				{errors.screenshot && (
					<p className="text-xs text-red-400">{errors.screenshot.message}</p>
				)}
				<p className="text-xs text-gray-500">
					Take a screenshot of the payment confirmation from your UPI app
				</p>
			</div>

			{/* Notes */}
			<div className="flex flex-col gap-2">
				<label className="text-sm text-gray-700 font-medium">
					Additional Notes (Optional)
				</label>
				<textarea
					rows={3}
					placeholder="Any additional information..."
					className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full resize-none"
					{...register("notes")}
				/>
			</div>

			{/* Info Box */}
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<p className="text-sm text-yellow-800">
					<span className="font-semibold">⚠️ Important:</span> Your payment will
					be verified by admin. Please ensure all details are correct. You will
					receive a confirmation once approved (usually within 24 hours).
				</p>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isSubmitting || !screenshotUrl}
				className="bg-blue-500 text-white p-3 rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
			>
				{isSubmitting ? "Submitting..." : "Submit Payment for Verification"}
			</button>
		</form>
	);
};

export default ParentOnlinePaymentForm;
