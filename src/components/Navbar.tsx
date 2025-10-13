import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import prisma from "@/lib/prisma";
import AnnouncementNotification from "./AnnouncementNotification";
import MessageIcon from "./MessageIcon";

const Navbar = async () => {
	const user = await currentUser();
	const role = (user?.publicMetadata?.role as string) || "student";

	// Fetch recent announcements (last 7 days)
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const announcements = await prisma.announcement.findMany({
		where: {
			date: {
				gte: sevenDaysAgo,
			},
		},
		include: {
			class: {
				select: {
					name: true,
				},
			},
		},
		orderBy: {
			date: "desc",
		},
		take: 10, // Limit to 10 most recent
	});

	// Format announcements for the component
	const formattedAnnouncements = announcements.map((announcement) => ({
		id: announcement.id,
		title: announcement.title,
		description: announcement.description || "",
		date: announcement.date.toISOString(),
		className: announcement.class?.name,
	}));

	return (
		<div className="flex items-center justify-between p-4">
			{/* LOGO AND BRANDING - Mobile Only */}
			<div className="flex md:hidden items-center gap-2">
				<Image
					src="/logo.png"
					alt="HCS Logo"
					width={40}
					height={40}
					className="w-auto h-auto"
				/>
				<span className="text-xl font-bold text-gray-800">HCS</span>
			</div>

			{/* SEARCH BAR - Desktop Only */}
			<div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
				<Image src="/search.png" alt="" width={14} height={14} />
				<input
					type="text"
					placeholder="Search..."
					className="w-[200px] p-2 bg-transparent outline-none"
				/>
			</div>
			{/* ICONS AND USER */}
			<div className="flex items-center gap-6 justify-end w-full md:w-auto">
				<MessageIcon userId={user?.id || ""} />
				<AnnouncementNotification announcements={formattedAnnouncements} />
				<div className="flex flex-col">
					<span className="text-xs leading-3 font-medium">
						{user?.firstName && user?.lastName
							? `${user.firstName} ${user.lastName}`
							: user?.username || "User"}
					</span>
					<span className="text-[10px] text-gray-500 text-right">
						{user?.publicMetadata?.role as string}
					</span>
				</div>
				{/* <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/> */}
				<UserButton />
			</div>
		</div>
	);
};

export default Navbar;
