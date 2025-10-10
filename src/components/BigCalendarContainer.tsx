import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import MobileSchedule from "./MobileSchedule";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
	type,
	id,
	selectedDate,
}: {
	type: "teacherId" | "classId";
	id: string | number;
	selectedDate?: Date;
}) => {
	// Get the day of the week from selected date
	const dayMap = [
		"SUNDAY",
		"MONDAY",
		"TUESDAY",
		"WEDNESDAY",
		"THURSDAY",
		"FRIDAY",
		"SATURDAY",
	];

	// Build where clause
	let whereClause: any = {
		...(type === "teacherId"
			? { teacherId: id as string }
			: { classId: id as number }),
	};

	// If a specific date is selected, filter by exact date range
	if (selectedDate) {
		const startOfDay = new Date(selectedDate);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(selectedDate);
		endOfDay.setHours(23, 59, 59, 999);

		whereClause = {
			...whereClause,
			startTime: {
				gte: startOfDay,
				lte: endOfDay,
			},
		};
	}

	const dataRes = await prisma.lesson.findMany({
		where: whereClause,
		include: {
			subject: { select: { name: true } },
			teacher: { select: { name: true, surname: true } },
			class: { select: { name: true } },
		},
	});

	const data = dataRes.map((lesson) => ({
		title: lesson.subject.name,
		start: lesson.startTime,
		end: lesson.endTime,
		resource: {
			lessonName: lesson.name,
			teacher: `${lesson.teacher.name} ${lesson.teacher.surname}`,
			class: lesson.class.name,
		},
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
