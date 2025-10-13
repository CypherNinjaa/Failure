"use client";

import { useState, useEffect } from "react";
import { getAllUsers, createDirectConversation } from "@/lib/messageActions";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NewChatModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	const [users, setUsers] = useState<any[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (isOpen) {
			loadUsers();
		}
	}, [isOpen]);

	const loadUsers = async () => {
		const result = await getAllUsers();
		if (result.success && result.users) {
			setUsers(result.users);
		}
	};

	const handleStartChat = async (userId: string) => {
		setLoading(true);
		const result = await createDirectConversation(userId);
		setLoading(false);

		if (result.success && result.conversation) {
			router.push(`/list/messages/${result.conversation.id}`);
			onClose();
		}
	};

	const filteredUsers = users.filter((user) =>
		user.fullName.toLowerCase().includes(search.toLowerCase())
	);

	if (!isOpen) return null;

	const getRoleBadgeColor = (role: string) => {
		switch (role) {
			case "admin":
				return "bg-red-100 text-red-700";
			case "teacher":
				return "bg-blue-100 text-blue-700";
			case "student":
				return "bg-green-100 text-green-700";
			case "parent":
				return "bg-purple-100 text-purple-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
				{/* Header */}
				<div className="p-4 border-b flex items-center justify-between">
					<h2 className="text-lg font-semibold">New Message</h2>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Search */}
				<div className="p-4 border-b">
					<input
						type="text"
						placeholder="Search users..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lamaPurple"
						autoFocus
					/>
				</div>

				{/* User list */}
				<div className="flex-1 overflow-y-auto">
					{filteredUsers.length === 0 ? (
						<div className="p-8 text-center text-gray-500">
							<div className="text-4xl mb-2">👤</div>
							<p className="text-sm">No users found</p>
						</div>
					) : (
						<div className="divide-y divide-gray-200">
							{filteredUsers.map((user) => (
								<button
									key={user.id}
									onClick={() => handleStartChat(user.id)}
									disabled={loading}
									className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left disabled:opacity-50"
								>
									{/* Avatar */}
									{user.img ? (
										<Image
											src={user.img}
											alt={user.fullName}
											width={40}
											height={40}
											className="rounded-full object-cover"
										/>
									) : (
										<div className="w-10 h-10 rounded-full bg-lamaSky flex items-center justify-center text-white font-semibold">
											{user.name.charAt(0).toUpperCase()}
										</div>
									)}

									{/* User info */}
									<div className="flex-1 min-w-0">
										<div className="font-medium text-sm truncate">
											{user.fullName}
										</div>
										<div className="flex items-center gap-2 mt-1">
											<span
												className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(
													user.role
												)}`}
											>
												{user.role}
											</span>
										</div>
									</div>

									{/* Arrow icon */}
									<svg
										className="w-5 h-5 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default NewChatModal;
