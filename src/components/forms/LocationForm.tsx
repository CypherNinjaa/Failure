"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { locationSchema, LocationSchema } from "@/lib/formValidationSchemas";
import { createLocation, updateLocation } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LocationForm = ({
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
	} = useForm<LocationSchema>({
		resolver: zodResolver(locationSchema),
	});

	const [state, formAction] = useFormState(
		type === "create" ? createLocation : updateLocation,
		{
			success: false,
			error: false,
		}
	);

	const [useCurrentLocation, setUseCurrentLocation] = useState(false);
	const [gettingLocation, setGettingLocation] = useState(false);

	const router = useRouter();

	const onSubmit = handleSubmit((formData) => {
		formAction(formData);
	});

	useEffect(() => {
		if (state.success) {
			toast.success(
				`Location ${type === "create" ? "created" : "updated"} successfully!`
			);
			setOpen(false);
			router.refresh();
		}
	}, [state, router, type, setOpen]);

	useEffect(() => {
		if (state.error) {
			toast.error("Something went wrong!");
		}
	}, [state.error]);

	// Get current location
	const getCurrentLocation = () => {
		if (!navigator.geolocation) {
			toast.error("Geolocation is not supported by your browser");
			return;
		}

		setGettingLocation(true);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setValue("latitude", position.coords.latitude);
				setValue("longitude", position.coords.longitude);
				setGettingLocation(false);
				toast.success("Location obtained successfully!");
			},
			(error) => {
				console.error("Error getting location:", error);
				toast.error("Failed to get location. Please enter manually.");
				setGettingLocation(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			}
		);
	};

	const latitude = watch("latitude");
	const longitude = watch("longitude");

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<h1 className="text-xl font-semibold">
				{type === "create" ? "Create a new location" : "Update location"}
			</h1>

			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Location Name"
					name="name"
					defaultValue={data?.name}
					register={register}
					error={errors?.name}
				/>
				<InputField
					label="Address"
					name="address"
					defaultValue={data?.address}
					register={register}
					error={errors?.address}
				/>
			</div>

			{/* GPS Coordinates Section */}
			<div className="border-t pt-4">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-semibold text-gray-700">GPS Coordinates</h3>
					<button
						type="button"
						onClick={getCurrentLocation}
						disabled={gettingLocation}
						className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2"
					>
						{gettingLocation ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								Getting...
							</>
						) : (
							<>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
								</svg>
								Use Current Location
							</>
						)}
					</button>
				</div>

				<div className="flex justify-between flex-wrap gap-4">
					<InputField
						label="Latitude"
						name="latitude"
						defaultValue={data?.latitude}
						register={register}
						error={errors?.latitude}
						type="number"
						step="any"
					/>
					<InputField
						label="Longitude"
						name="longitude"
						defaultValue={data?.longitude}
						register={register}
						error={errors?.longitude}
						type="number"
						step="any"
					/>
				</div>

				{/* Map Preview (if coordinates are set) */}
				{latitude && longitude && (
					<div className="mt-4">
						<p className="text-sm text-gray-600 mb-2">Location Preview:</p>
						<a
							href={`https://www.google.com/maps?q=${latitude},${longitude}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:underline text-sm flex items-center gap-1"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
							View on Google Maps
						</a>
					</div>
				)}
			</div>

			{/* Radius and Status */}
			<div className="flex justify-between flex-wrap gap-4">
				<InputField
					label="Radius (meters)"
					name="radius"
					defaultValue={data?.radius || 100}
					register={register}
					error={errors?.radius}
					type="number"
				/>
				<div className="flex flex-col gap-2 w-full md:w-1/4">
					<label className="text-xs text-gray-500">Status</label>
					<select
						className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
						{...register("isActive")}
						defaultValue={data?.isActive ? "true" : "false"}
					>
						<option value="true">Active</option>
						<option value="false">Inactive</option>
					</select>
					{errors.isActive?.message && (
						<p className="text-xs text-red-400">
							{errors.isActive.message.toString()}
						</p>
					)}
				</div>
			</div>

			{/* Info box */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
				<p className="text-xs text-blue-800">
					💡 <strong>Tip:</strong> The radius defines how far away teachers can
					be from this location to mark attendance. Typical values: 50-200
					meters.
				</p>
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

			{state.error && (
				<span className="text-red-500">Something went wrong!</span>
			)}

			<button className="bg-blue-400 text-white p-2 rounded-md">
				{type === "create" ? "Create" : "Update"}
			</button>
		</form>
	);
};

export default LocationForm;
