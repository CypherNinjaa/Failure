import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import MobileSchedule from "./MobileSchedule";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
	type,
	id,
}: {
	type: "teacherId" | "classId";
	id: string | number;
}) => {
	const dataRes = await prisma.lesson.findMany({
		where: {
			...(type === "teacherId"
				? { teacherId: id as string }
				: { classId: id as number }),
		},
		include: {
			subject: { select: { name: true } },
			teacher: { select: { name: true, surname: true } },
			class: { select: { name: true } },
		},
	});

	const data = dataRes.map((lesson) => ({
		title: lesson.name,
		start: lesson.startTime,
		end: lesson.endTime,
	}));

	const schedule = adjustScheduleToCurrentWeek(data);

	return (
		<div className="">
			{/* Desktop View - Calendar Grid */}
			<div className="hidden md:block">
				<BigCalendar data={schedule} />
			</div>

			{/* Mobile View - Accordion List */}
			<div className="block md:hidden">
				<MobileSchedule lessons={dataRes} />
			</div>
		</div>
	);
};

export default BigCalendarContainer;
