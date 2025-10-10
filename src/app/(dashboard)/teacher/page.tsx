import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { auth } from "@clerk/nextjs/server";

const TeacherPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { userId } = auth();

	// Get selected date from URL or use today
	const selectedDate = searchParams.date
		? new Date(searchParams.date)
		: new Date();

	return (
		<div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
			{/* LEFT */}
			<div className="w-full xl:w-2/3">
				<div className="h-full bg-white p-4 rounded-md">
					<h1 className="text-xl font-semibold">
						Schedule -{" "}
						{selectedDate.toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</h1>
					<BigCalendarContainer
						type="teacherId"
						id={userId!}
						selectedDate={selectedDate}
					/>
				</div>
			</div>
			{/* RIGHT */}
			<div className="w-full xl:w-1/3 flex flex-col gap-8">
				<EventCalendar />
				<Announcements />
			</div>
		</div>
	);
};

export default TeacherPage;
