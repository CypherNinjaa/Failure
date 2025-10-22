"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Search, Image as ImageIcon, Film, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

interface CloudinaryResource {
	public_id: string;
	secure_url: string;
	format: string;
	resource_type: string;
	created_at: string;
	width: number;
	height: number;
}

interface CloudinaryMediaPickerProps {
	onSelect: (url: string, publicId: string) => void;
	onClose: () => void;
	type?: "image" | "video" | "all";
}

const CloudinaryMediaPicker = ({
	onSelect,
	onClose,
	type = "all",
}: CloudinaryMediaPickerProps) => {
	const [media, setMedia] = useState<CloudinaryResource[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedType, setSelectedType] = useState<string>(type);
	const [deleting, setDeleting] = useState<string | null>(null);

	const fetchMedia = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/cloudinary/media?type=${selectedType}`
			);
			const data = await response.json();
			setMedia(data.resources || []);
		} catch (error) {
			console.error("Error fetching media:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMedia();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedType]);

	const handleDelete = async (publicId: string, resourceType: string) => {
		if (
			!confirm(
				"Are you sure you want to delete this media? This action cannot be undone."
			)
		) {
			return;
		}

		setDeleting(publicId);
		try {
			const response = await fetch("/api/cloudinary/media", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ publicId, resourceType }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Media deleted successfully!");
				// Remove from local state
				setMedia(media.filter((item) => item.public_id !== publicId));
			} else {
				toast.error(data.error || "Failed to delete media");
			}
		} catch (error) {
			console.error("Error deleting media:", error);
			toast.error("Failed to delete media");
		} finally {
			setDeleting(null);
		}
	};

	const filteredMedia = media.filter((item) =>
		item.public_id.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-xl font-semibold">Select from Library</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Search and Filter */}
				<div className="p-4 border-b flex gap-4 flex-wrap">
					<div className="flex-1 min-w-[200px]">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search by filename..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border rounded-md"
							/>
						</div>
					</div>
					{type === "all" && (
						<div className="flex gap-2">
							<button
								onClick={() => setSelectedType("all")}
								className={`px-4 py-2 rounded-md flex items-center gap-2 ${
									selectedType === "all"
										? "bg-blue-500 text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								All
							</button>
							<button
								onClick={() => setSelectedType("image")}
								className={`px-4 py-2 rounded-md flex items-center gap-2 ${
									selectedType === "image"
										? "bg-blue-500 text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								<ImageIcon className="w-4 h-4" />
								Images
							</button>
							<button
								onClick={() => setSelectedType("video")}
								className={`px-4 py-2 rounded-md flex items-center gap-2 ${
									selectedType === "video"
										? "bg-blue-500 text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								<Film className="w-4 h-4" />
								Videos
							</button>
						</div>
					)}
				</div>

				{/* Media Grid */}
				<div className="flex-1 overflow-y-auto p-4">
					{loading ? (
						<div className="flex items-center justify-center h-64">
							<div className="text-gray-500">Loading media...</div>
						</div>
					) : filteredMedia.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-gray-500">
							<ImageIcon className="w-16 h-16 mb-4 opacity-30" />
							<p>No media found</p>
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{filteredMedia.map((item) => (
								<div
									key={item.public_id}
									className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all"
								>
									{item.resource_type === "video" ? (
										<div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
											<Film className="w-12 h-12 text-gray-400" />
											<div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
												VIDEO
											</div>
										</div>
									) : (
										<Image
											src={item.secure_url}
											alt={item.public_id}
											fill
											sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
											className="object-cover"
										/>
									)}

									{/* Action Buttons Overlay */}
									<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-3">
										<button
											onClick={(e) => {
												e.stopPropagation();
												onSelect(item.secure_url, item.public_id);
											}}
											className="opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all transform scale-90 group-hover:scale-100 font-medium"
											disabled={deleting === item.public_id}
										>
											Select
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(item.public_id, item.resource_type);
											}}
											className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-all transform scale-90 group-hover:scale-100"
											disabled={deleting === item.public_id}
											title="Delete media"
										>
											{deleting === item.public_id ? (
												<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
											) : (
												<Trash2 className="w-5 h-5" />
											)}
										</button>
									</div>

									{/* Filename */}
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
										<p className="text-white text-xs truncate">
											{item.public_id.split("/").pop()}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CloudinaryMediaPicker;
