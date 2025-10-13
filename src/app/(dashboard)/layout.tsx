import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { sessionClaims, userId } = auth();
	const role =
		(sessionClaims?.metadata as { role?: string })?.role || "student";

	return (
		<div className="h-screen flex">
			{/* LEFT SIDEBAR - Hidden on mobile, visible on tablet+ */}
			<div className="hidden md:block md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 dashboard-sidebar">
				<Link
					href="/"
					className="flex items-center justify-center lg:justify-start gap-2"
				>
					<Image
						src="/logo.png"
						alt="logo"
						width={32}
						height={32}
						className="w-auto h-auto"
					/>
					<span className="hidden lg:block font-bold ">HCS</span>
				</Link>
				<Menu />
			</div>
			{/* RIGHT - Full width on mobile, adjusted on tablet+ */}
			<div className="w-full md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col dashboard-content">
				<div className="dashboard-navbar">
					<Navbar />
				</div>
				{/* Main content with bottom padding on mobile for nav bar */}
				<div className="pb-20 md:pb-0">{children}</div>
			</div>
			{/* BOTTOM NAVIGATION - Mobile only */}
			<BottomNav role={role} userId={userId || null} />
		</div>
	);
}
