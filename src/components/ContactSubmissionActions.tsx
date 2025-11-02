"use client";

import { useState } from "react";
import { Eye, CheckCircle, Clock, X } from "lucide-react";
import {
	updateContactSubmissionStatus,
	deleteContactSubmission,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type ContactSubmission = {
	id: number;
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	type: string;
	status: "NEW" | "PENDING" | "RESOLVED";
	createdAt: Date;
	notes?: string | null;
	resolvedAt?: Date | null;
	resolvedBy?: string | null;
};

const ContactSubmissionActions = ({
	submission,
}: {
	submission: ContactSubmission;
}) => {
	const [showModal, setShowModal] = useState(false);
	const [status, setStatus] = useState(submission.status);
	const [notes, setNotes] = useState(submission.notes || "");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleUpdateStatus = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData();
		formData.append("id", submission.id.toString());
		formData.append("status", status);
		formData.append("notes", notes);

		try {
			const result = await updateContactSubmissionStatus(
				{ success: false, error: false },
				formData
			);

			if (result.success) {
				toast.success("Status updated successfully!");
				setShowModal(false);
				router.refresh();
			} else {
				toast.error("Failed to update status");
			}
		} catch (error) {
			toast.error("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this submission?")) return;

		setIsLoading(true);
		const formData = new FormData();
		formData.append("id", submission.id.toString());

		try {
			const result = await deleteContactSubmission(
				{ success: false, error: false },
				formData
			);

			if (result.success) {
				toast.success("Submission deleted successfully!");
				router.refresh();
			} else {
				toast.error("Failed to delete submission");
			}
		} catch (error) {
			toast.error("An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "NEW":
				return "text-blue-600";
			case "PENDING":
				return "text-yellow-600";
			case "RESOLVED":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<>
			<div className="flex items-center gap-2">
				<button
					onClick={() => setShowModal(true)}
					className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky hover:bg-lamaSkyLight transition"
					title="View/Update"
				>
					<Eye width={16} height={16} />
				</button>
				<button
					onClick={handleDelete}
					disabled={isLoading}
					className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple hover:bg-lamaPurpleLight transition disabled:opacity-50"
					title="Delete"
				>
					<X width={16} height={16} className="text-white" />
				</button>
			</div>

			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold">
									Contact Submission Details
								</h2>
								<button
									onClick={() => setShowModal(false)}
									className="text-gray-500 hover:text-gray-700"
								>
									<X className="w-6 h-6" />
								</button>
							</div>

							<form onSubmit={handleUpdateStatus}>
								{/* Submission Details */}
								<div className="space-y-4 mb-6">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-600">
												Name
											</label>
											<p className="text-sm font-semibold">{submission.name}</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-600">
												Email
											</label>
											<p className="text-sm">{submission.email}</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-600">
												Phone
											</label>
											<p className="text-sm">{submission.phone}</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-600">
												Type
											</label>
											<p className="text-sm capitalize">{submission.type}</p>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-600">
											Subject
										</label>
										<p className="text-sm font-semibold">
											{submission.subject}
										</p>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-600">
											Message
										</label>
										<p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded">
											{submission.message}
										</p>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-600">
												Current Status
											</label>
											<p
												className={`text-sm font-semibold ${getStatusColor(
													submission.status
												)}`}
											>
												{submission.status}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-600">
												Submitted On
											</label>
											<p className="text-sm">
												{new Date(submission.createdAt).toLocaleString()}
											</p>
										</div>
									</div>

									{submission.resolvedAt && (
										<div>
											<label className="text-sm font-medium text-gray-600">
												Resolved On
											</label>
											<p className="text-sm">
												{new Date(submission.resolvedAt).toLocaleString()}
											</p>
										</div>
									)}
								</div>

								<hr className="my-6" />

								{/* Update Status Form */}
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Update Status
										</label>
										<select
											value={status}
											onChange={(e) =>
												setStatus(
													e.target.value as "NEW" | "PENDING" | "RESOLVED"
												)
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaSky"
										>
											<option value="NEW">New</option>
											<option value="PENDING">Pending</option>
											<option value="RESOLVED">Resolved</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Admin Notes
										</label>
										<textarea
											value={notes}
											onChange={(e) => setNotes(e.target.value)}
											rows={4}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lamaSky"
											placeholder="Add notes about this submission..."
										/>
									</div>

									{submission.notes && submission.notes !== notes && (
										<div className="bg-gray-50 p-3 rounded">
											<label className="text-sm font-medium text-gray-600">
												Previous Notes
											</label>
											<p className="text-sm whitespace-pre-wrap">
												{submission.notes}
											</p>
										</div>
									)}
								</div>

								<div className="flex justify-end gap-3 mt-6">
									<button
										type="button"
										onClick={() => setShowModal(false)}
										className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
										disabled={isLoading}
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isLoading}
										className="px-4 py-2 bg-lamaSky text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
									>
										{isLoading ? (
											<>Processing...</>
										) : (
											<>
												<CheckCircle className="w-4 h-4" />
												Update Status
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ContactSubmissionActions;
