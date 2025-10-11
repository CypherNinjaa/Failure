"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

const paymentConfigSchema = z.object({
	upiId: z.string().min(1, "UPI ID is required"),
	upiQRCode: z.string().optional(),
});

type PaymentConfigSchema = z.infer<typeof paymentConfigSchema>;

const PaymentConfigForm = ({
	existingConfig,
}: {
	existingConfig?: { upiId: string | null; upiQRCode: string | null };
}) => {
	const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(
		existingConfig?.upiQRCode || null
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<PaymentConfigSchema>({
		resolver: zodResolver(paymentConfigSchema),
		defaultValues: {
			upiId: existingConfig?.upiId || "",
			upiQRCode: existingConfig?.upiQRCode || "",
		},
	});

	const router = useRouter();

	useEffect(() => {
		if (qrCodeUrl) {
			setValue("upiQRCode", qrCodeUrl);
		}
	}, [qrCodeUrl, setValue]);

	const onSubmit = handleSubmit(async (data) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/payment-config", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				toast.success("Payment configuration saved successfully!");
				router.refresh();
			} else {
				toast.error("Failed to save payment configuration");
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
			<h1 className="text-xl font-semibold">Payment Configuration</h1>
			<p className="text-sm text-gray-500">
				Configure UPI payment details for online fee payments
			</p>

			{/* UPI ID */}
			<div className="flex flex-col gap-2">
				<label className="text-sm text-gray-700 font-medium">
					UPI ID <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					placeholder="yourname@paytm / yourname@phonepe"
					className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full"
					{...register("upiId")}
				/>
				{errors.upiId && (
					<p className="text-xs text-red-400">{errors.upiId.message}</p>
				)}
				<p className="text-xs text-gray-500">
					Parents will use this UPI ID to make payments
				</p>
			</div>

			{/* QR Code Upload */}
			<div className="flex flex-col gap-2">
				<label className="text-sm text-gray-700 font-medium">
					UPI QR Code (Optional)
				</label>
				<div className="flex items-center gap-4">
					<CldUploadWidget
						uploadPreset="school"
						onSuccess={(result: any) => {
							setQrCodeUrl(result.info.secure_url);
						}}
					>
						{({ open }) => (
							<button
								type="button"
								onClick={() => open()}
								className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
							>
								Upload QR Code
							</button>
						)}
					</CldUploadWidget>

					{qrCodeUrl && (
						<div className="relative w-32 h-32 border rounded-md overflow-hidden">
							<Image
								src={qrCodeUrl}
								alt="UPI QR Code"
								fill
								className="object-contain"
							/>
						</div>
					)}
				</div>
				<p className="text-xs text-gray-500">
					Upload a QR code image for easy payments (PNG/JPG)
				</p>
			</div>

			{/* Preview Section */}
			{existingConfig && (
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h3 className="text-sm font-semibold mb-3">Current Configuration</h3>
					<div className="space-y-2">
						<div>
							<span className="text-xs text-gray-500">UPI ID:</span>
							<p className="text-sm font-medium">
								{existingConfig.upiId || "Not set"}
							</p>
						</div>
						{existingConfig.upiQRCode && (
							<div>
								<span className="text-xs text-gray-500">QR Code:</span>
								<div className="relative w-24 h-24 mt-2 border rounded-md overflow-hidden">
									<Image
										src={existingConfig.upiQRCode}
										alt="Current QR Code"
										fill
										className="object-contain"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className="bg-blue-500 text-white p-3 rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
			>
				{isSubmitting ? "Saving..." : "Save Configuration"}
			</button>
		</form>
	);
};

export default PaymentConfigForm;
