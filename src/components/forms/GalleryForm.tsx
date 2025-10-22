"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { gallerySchema, GallerySchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createGalleryItem, updateGalleryItem } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import CloudinaryMediaPicker from "../CloudinaryMediaPicker";

const GalleryForm = ({
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
		formState: { errors },
		setValue,
		watch,
	} = useForm<GallerySchema>({
		resolver: zodResolver(gallerySchema),
		defaultValues: data
			? {
					...data,
					isActive: data.isActive ?? true,
					displayOrder: data.displayOrder ?? 0,
			  }
			: {
					type: "IMAGE",
					category: "FACILITY",
					isActive: true,
					displayOrder: 0,
			  },
	});

	const [img, setImg] = useState<any>(
		data?.src ? { secure_url: data.src } : null
	);
	const [showMediaPicker, setShowMediaPicker] = useState(false);

	const [state, formAction] = useFormState(
		type === "create" ? createGalleryItem : updateGalleryItem,
		{
			success: false,
			error: false,
		}
	);

	const onSubmit = handleSubmit((formData) => {
		console.log("Form data:", formData);
		console.log("Image URL:", img?.secure_url);

		// Validate that an image has been uploaded
		if (!img?.secure_url && !formData.src) {
			toast.error("Please upload an image!");
			return;
		}

		formAction({ ...formData, src: img?.secure_url || formData.src });
	});

	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			toast(
				`Gallery item has been ${type === "create" ? "created" : "updated"}!`
			);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	useEffect(() => {
		if (state.error) {
			toast.error("Something went wrong!");
		}
	}, [state]);

	const watchType = watch("type");

	const handleMediaSelect = (url: string, publicId: string) => {
		setImg({ secure_url: url, public_id: publicId });
		setValue("src", url);
		setShowMediaPicker(false);
		toast.success("Media selected from library!");
	};

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create" ? "Add New Gallery Item" : "Update Gallery Item"}
			</h1>
			{/* Image Upload */}
			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">
					{watchType === "VIDEO" ? "Video/Thumbnail" : "Image"}
				</label>

				{/* Show selected image if exists */}
				{img?.secure_url && (
					<div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-300 mb-2">
						<Image
							src={img.secure_url}
							alt="Selected"
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover"
						/>
						<div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs">
							Selected
						</div>
					</div>
				)}

				{/* Upload and Library Buttons */}
				<div className="flex gap-3">
					<CldUploadWidget
						uploadPreset="school"
						onSuccess={(result, { widget }) => {
							setImg(result.info);
							setValue("src", (result.info as any).secure_url);
							widget.close();
							toast.success("Media uploaded successfully!");
						}}
					>
						{({ open }) => {
							return (
								<button
									type="button"
									onClick={() => open()}
									className="flex-1 h-32 border-2 border-dashed border-blue-300 rounded-md flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-colors"
								>
									<Image
										src="/upload.png"
										alt="Upload"
										width={32}
										height={32}
										className="opacity-50"
									/>
									<span className="text-sm text-gray-600 font-medium">
										Upload New
									</span>
									<span className="text-xs text-gray-400">
										{watchType === "VIDEO" ? "Video/Thumbnail" : "Image"}
									</span>
								</button>
							);
						}}
					</CldUploadWidget>

					<button
						type="button"
						onClick={() => setShowMediaPicker(true)}
						className="flex-1 h-32 border-2 border-dashed border-green-300 rounded-md flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-colors"
					>
						<Image
							src="/images/gallery.png"
							alt="Library"
							width={32}
							height={32}
							className="opacity-50"
						/>
						<span className="text-sm text-gray-600 font-medium">
							Choose from Library
						</span>
						<span className="text-xs text-gray-400">Use existing media</span>
					</button>
				</div>

				{errors.src?.message && (
					<p className="text-xs text-red-400">
						{errors.src.message.toString()}
					</p>
				)}
			</div>{" "}
			<div className="flex justify-between flex-wrap gap-4">
				{/* Type */}
				<div className="flex flex-col gap-2 w-full md:w-[48%]">
					<label className="text-xs text-gray-500">Type</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("type")}
						defaultValue={data?.type || "IMAGE"}
					>
						<option value="IMAGE">Image</option>
						<option value="VIDEO">Video</option>
					</select>
					{errors.type?.message && (
						<p className="text-xs text-red-400">
							{errors.type.message.toString()}
						</p>
					)}
				</div>

				{/* Category */}
				<div className="flex flex-col gap-2 w-full md:w-[48%]">
					<label className="text-xs text-gray-500">Category</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("category")}
						defaultValue={data?.category || "FACILITY"}
					>
						<option value="FACILITY">Facility</option>
						<option value="EVENT">Event</option>
						<option value="ACTIVITY">Activity</option>
						<option value="ACHIEVEMENT">Achievement</option>
					</select>
					{errors.category?.message && (
						<p className="text-xs text-red-400">
							{errors.category.message.toString()}
						</p>
					)}
				</div>

				{/* Title */}
				<InputField
					label="Title"
					name="title"
					defaultValue={data?.title}
					register={register}
					error={errors?.title}
				/>

				{/* Location */}
				<InputField
					label="Location (Optional)"
					name="location"
					defaultValue={data?.location || ""}
					register={register}
					error={errors?.location}
				/>

				{/* Display Order */}
				<InputField
					label="Display Order"
					name="displayOrder"
					type="number"
					defaultValue={data?.displayOrder || 0}
					register={register}
					error={errors?.displayOrder}
				/>

				{/* Status */}
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Active Status</label>
					<button
						type="button"
						onClick={() => {
							const currentValue = watch("isActive");
							setValue("isActive", !currentValue);
						}}
						className={`ring-[1.5px] ring-gray-300 p-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
							watch("isActive")
								? "bg-green-100 text-green-700 hover:bg-green-200"
								: "bg-red-100 text-red-700 hover:bg-red-200"
						}`}
					>
						<span className="text-lg">{watch("isActive") ? "✓" : "✕"}</span>
						<span>{watch("isActive") ? "Active" : "Inactive"}</span>
					</button>
					{errors.isActive?.message && (
						<p className="text-xs text-red-400">
							{errors.isActive.message.toString()}
						</p>
					)}
				</div>
			</div>
			{/* Description */}
			<div className="flex flex-col gap-2 w-full">
				<label className="text-xs text-gray-500">Description</label>
				<textarea
					{...register("description")}
					className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
					rows={4}
					defaultValue={data?.description}
				/>
				{errors.description?.message && (
					<p className="text-xs text-red-400">
						{errors.description.message.toString()}
					</p>
				)}
			</div>
			{data && (
				<input type="hidden" {...register("id")} defaultValue={data.id} />
			)}
			{/* Hidden input to store image URL */}
			<input
				type="hidden"
				{...register("src")}
				value={img?.secure_url || data?.src || ""}
			/>
			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}
			<button className="bg-blue-400 text-white p-2 rounded-md">
				{type === "create" ? "Create" : "Update"}
			</button>
			{/* Media Picker Modal */}
			{showMediaPicker && (
				<CloudinaryMediaPicker
					onSelect={handleMediaSelect}
					onClose={() => setShowMediaPicker(false)}
					type={watchType === "VIDEO" ? "video" : "image"}
				/>
			)}
		</form>
	);
};

export default GalleryForm;
