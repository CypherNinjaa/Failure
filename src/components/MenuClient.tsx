"use client";

import Image from "next/image";
import Link from "next/link";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";

type MenuItemType = {
	icon: string;
	label: string;
	href: string;
	visible: string[];
};

type MenuSectionType = {
	title: string;
	items: MenuItemType[];
};

type MenuClientProps = {
	menuItems: MenuSectionType[];
	role: string;
	userId: string | null;
};

const MenuClient = ({ menuItems, role, userId }: MenuClientProps) => {
	const { unreadCount } = useUnreadMessageCount(userId);

	return (
		<div className="mt-4 text-sm overflow-y-auto h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
			{menuItems.map((i) => (
				<div className="flex flex-col gap-2" key={i.title}>
					<span className="hidden lg:block text-gray-400 font-light my-4">
						{i.title}
					</span>
					{i.items.map((item) => {
						if (item.visible.includes(role)) {
							const isMessagesLink = item.href === "/list/messages";
							return (
								<Link
									href={item.href}
									key={item.label}
									className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight relative"
								>
									<div className="relative">
										<Image src={item.icon} alt="" width={20} height={20} />
										{/* Badge on icon - only visible on mobile/collapsed sidebar (when text is hidden) */}
										{isMessagesLink && unreadCount > 0 && (
											<span className="lg:hidden absolute -top-2 -right-2 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-md animate-pulse">
												{unreadCount > 9 ? "9+" : unreadCount}
											</span>
										)}
									</div>
									<span className="hidden lg:block">{item.label}</span>
									{/* Badge at end - only visible on desktop/expanded sidebar */}
									{isMessagesLink && unreadCount > 0 && (
										<span className="hidden lg:flex ml-auto min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full items-center justify-center px-2 shadow-md animate-pulse">
											{unreadCount > 9 ? "9+" : unreadCount}
										</span>
									)}
								</Link>
							);
						}
					})}
				</div>
			))}
		</div>
	);
};

export default MenuClient;
