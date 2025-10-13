"use client";

import { useRef, useEffect } from "react";

const EmojiPicker = ({
	onSelect,
	onClose,
}: {
	onSelect: (emoji: string) => void;
	onClose: () => void;
}) => {
	const pickerRef = useRef<HTMLDivElement>(null);

	const emojis = [
		"😀",
		"😃",
		"😄",
		"😁",
		"😆",
		"😅",
		"🤣",
		"😂",
		"🙂",
		"🙃",
		"😉",
		"😊",
		"😇",
		"🥰",
		"😍",
		"🤩",
		"😘",
		"😗",
		"😚",
		"😙",
		"🥲",
		"😋",
		"😛",
		"😜",
		"🤪",
		"😝",
		"🤑",
		"🤗",
		"🤭",
		"🤫",
		"🤔",
		"🤐",
		"🤨",
		"😐",
		"😑",
		"😶",
		"😏",
		"😒",
		"🙄",
		"😬",
		"🤥",
		"😌",
		"😔",
		"😪",
		"🤤",
		"😴",
		"😷",
		"🤒",
		"🤕",
		"🤢",
		"🤮",
		"🤧",
		"🥵",
		"🥶",
		"🥴",
		"😵",
		"🤯",
		"🤠",
		"🥳",
		"🥸",
		"😎",
		"🤓",
		"🧐",
		"😕",
		"😟",
		"🙁",
		"☹️",
		"😮",
		"😯",
		"😲",
		"😳",
		"🥺",
		"😦",
		"😧",
		"😨",
		"😰",
		"😥",
		"😢",
		"😭",
		"😱",
		"😖",
		"😣",
		"😞",
		"😓",
		"😩",
		"😫",
		"🥱",
		"😤",
		"😡",
		"😠",
		"🤬",
		"😈",
		"👿",
		"💀",
		"☠️",
		"💩",
		"🤡",
		"👹",
		"👺",
		"👻",
		"👽",
		"👾",
		"🤖",
		"😺",
		"👍",
		"👎",
		"👌",
		"✌️",
		"🤞",
		"🤟",
		"🤘",
		"🤙",
		"👈",
		"👉",
		"👆",
		"👇",
		"☝️",
		"👏",
		"🙌",
		"🤝",
		"🙏",
		"💪",
		"🦾",
		"🦿",
		"🦵",
		"🦶",
		"👂",
		"👃",
		"❤️",
		"🧡",
		"💛",
		"💚",
		"💙",
		"💜",
		"🖤",
		"🤍",
		"🤎",
		"💔",
		"❤️‍🔥",
		"❤️‍🩹",
		"💕",
		"💞",
		"💓",
		"💗",
		"💖",
		"💘",
		"💝",
		"💟",
		"☮️",
		"✝️",
		"☪️",
		"🕉️",
		"🔥",
		"✨",
		"🌟",
		"💫",
		"⭐",
		"🌈",
		"☀️",
		"🌙",
		"⚡",
		"☁️",
		"❄️",
		"🌊",
		"🎉",
		"🎊",
		"🎁",
		"🎈",
	];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	return (
		<div
			ref={pickerRef}
			className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50"
			style={{ width: "320px", maxHeight: "300px" }}
		>
			<div
				className="grid grid-cols-8 gap-2 overflow-y-auto max-h-64 scrollbar-thin"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#833ab4 transparent",
				}}
			>
				{emojis.map((emoji, index) => (
					<button
						key={index}
						onClick={() => {
							onSelect(emoji);
							onClose();
						}}
						className="w-8 h-8 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center text-2xl"
					>
						{emoji}
					</button>
				))}
			</div>
		</div>
	);
};

export default EmojiPicker;
