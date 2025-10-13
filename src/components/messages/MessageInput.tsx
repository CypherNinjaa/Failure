"use client";

import { useState, useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import EmojiPicker from "./EmojiPicker";

const MessageInput = ({
	onSend,
	onTyping,
}: {
	onSend: (content: string, attachments?: string[]) => void;
	onTyping?: (isTyping: boolean) => void;
}) => {
	const [message, setMessage] = useState("");
	const [attachments, setAttachments] = useState<string[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleSend = () => {
		if (message.trim() || attachments.length > 0) {
			onSend(message.trim(), attachments);
			setMessage("");
			setAttachments([]);
			setIsTyping(false);
			if (onTyping) onTyping(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleTyping = (value: string) => {
		setMessage(value);

		if (!isTyping && value.length > 0) {
			setIsTyping(true);
			if (onTyping) onTyping(true);
		}

		// Clear existing timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set new timeout to stop typing indicator after 2 seconds
		typingTimeoutRef.current = setTimeout(() => {
			setIsTyping(false);
			if (onTyping) onTyping(false);
		}, 2000);
	};

	const handleUploadSuccess = (result: any) => {
		if (result.info && result.info.secure_url) {
			setAttachments((prev) => [...prev, result.info.secure_url]);
		}
	};

	const removeAttachment = (index: number) => {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	};

	const handleEmojiSelect = (emoji: string) => {
		setMessage((prev) => prev + emoji);
		setShowEmojiPicker(false);
	};

	return (
		<div className="sticky bottom-0 z-20 border-t border-gray-100 bg-white p-3 md:p-4 safe-area-bottom">
			{/* Attachments preview */}
			{attachments.length > 0 && (
				<div className="mb-3 flex gap-2 flex-wrap pb-3 border-b border-gray-100">
					{attachments.map((url, index) => (
						<div key={index} className="relative group">
							<Image
								src={url}
								alt="Attachment"
								width={80}
								height={80}
								className="w-20 h-20 rounded-xl object-cover shadow-sm border border-gray-200"
							/>
							<button
								onClick={() => removeAttachment(index)}
								className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-all flex items-center justify-center text-sm font-bold"
							>
								×
							</button>
						</div>
					))}
				</div>
			)}

			{/* Input area */}
			<div className="flex items-end gap-2.5">
				{/* Action buttons */}
				<div className="flex items-center gap-1.5">
					{/* Upload button */}
					<CldUploadWidget
						uploadPreset="school"
						onSuccess={handleUploadSuccess}
					>
						{({ open }) => (
							<button
								type="button"
								onClick={() => open()}
								className="flex-shrink-0 w-9 h-9 rounded-full hover:bg-purple-50 flex items-center justify-center transition-all group"
								title="Upload image"
							>
								<svg
									className="w-5 h-5 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</button>
						)}
					</CldUploadWidget>

					{/* Emoji button */}
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowEmojiPicker(!showEmojiPicker)}
							className="flex-shrink-0 w-9 h-9 rounded-full hover:bg-purple-50 flex items-center justify-center transition-all"
							title="Add emoji"
						>
							<svg
								className="w-5 h-5 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</button>

						{/* Emoji Picker */}
						{showEmojiPicker && (
							<EmojiPicker
								onSelect={handleEmojiSelect}
								onClose={() => setShowEmojiPicker(false)}
							/>
						)}
					</div>
				</div>

				{/* Text input */}
				<div className="flex-1 relative">
					<textarea
						value={message}
						onChange={(e) => handleTyping(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Message..."
						rows={1}
						className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none max-h-32 overflow-y-auto text-sm transition-all"
						style={{
							minHeight: "42px",
							height: "auto",
						}}
					/>
				</div>

				{/* Send button */}
				<button
					onClick={handleSend}
					disabled={!message.trim() && attachments.length === 0}
					className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all transform ${
						message.trim() || attachments.length > 0
							? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95"
							: "bg-gray-100 text-gray-400 cursor-not-allowed"
					}`}
				>
					{message.trim() || attachments.length > 0 ? (
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
						</svg>
					) : (
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
								d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
							/>
						</svg>
					)}
				</button>
			</div>

			{/* Character count */}
			{message.length > 500 && (
				<div className="mt-2 text-xs text-gray-400 text-right">
					{message.length} / 1000
				</div>
			)}
		</div>
	);
};

export default MessageInput;
