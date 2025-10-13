"use client";

import { useState } from "react";
import NewChatModal from "./NewChatModal";

const NewChatButton = ({
	hasConversations = true,
}: {
	hasConversations?: boolean;
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsModalOpen(true)}
				className={`bg-white text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50 transition-all font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 ${
					!hasConversations
						? "animate-pulse ring-2 ring-white ring-opacity-50"
						: ""
				}`}
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
						strokeWidth={2.5}
						d="M12 4v16m8-8H4"
					/>
				</svg>
				<span className="hidden md:inline">New</span>
			</button>

			<NewChatModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};

export default NewChatButton;
