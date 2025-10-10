"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = ({
	data,
}: {
	data: {
		title: string;
		start: Date;
		end: Date;
		resource?: {
			lessonName: string;
			teacher: string;
			class: string;
		};
	}[];
}) => {
	const [view, setView] = useState<View>(Views.WORK_WEEK);

	const handleOnChangeView = (selectedView: View) => {
		setView(selectedView);
	};

	// Custom event component to show lesson details
	const EventComponent = ({ event }: any) => {
		return (
			<div
				className="flex flex-col h-full p-2 gap-0.5"
				title={`${event.title} - ${event.resource?.lessonName}\nTeacher: ${
					event.resource?.teacher
				}\nClass: ${event.resource?.class}\nTime: ${moment(event.start).format(
					"h:mm A"
				)} - ${moment(event.end).format("h:mm A")}`}
			>
				<span className="font-bold text-sm leading-tight">{event.title}</span>
				{event.resource && (
					<>
						<span className="text-xs font-medium leading-tight">
							📚 {event.resource.lessonName}
						</span>
						<span className="text-xs opacity-90 leading-tight">
							👨‍🏫 {event.resource.teacher}
						</span>
					</>
				)}
				<span className="text-xs opacity-75 leading-tight mt-auto">
					⏰ {moment(event.start).format("h:mm A")} -{" "}
					{moment(event.end).format("h:mm A")}
				</span>
			</div>
		);
	};

	// Custom event style getter for better visual appearance
	const eventStyleGetter = () => {
		return {
			style: {
				backgroundColor: "#8b5cf6",
				borderRadius: "8px",
				opacity: 0.95,
				color: "white",
				border: "none",
				display: "flex",
				fontSize: "12px",
				padding: "8px",
				minHeight: "90px",
				boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
			},
		};
	};

	return (
		<>
			<style jsx global>{`
				.rbc-time-slot {
					min-height: 60px !important;
				}
				.rbc-event {
					min-height: 80px !important;
					padding: 8px !important;
				}
				.rbc-event-content {
					height: 100%;
					overflow: visible !important;
				}
				.rbc-timeslot-group {
					min-height: 60px !important;
				}
			`}</style>
			<Calendar
				localizer={localizer}
				events={data}
				startAccessor="start"
				endAccessor="end"
				views={["work_week", "day"]}
				view={view}
				style={{ height: "98%" }}
				onView={handleOnChangeView}
				min={new Date(2025, 1, 0, 8, 0, 0)}
				max={new Date(2025, 1, 0, 17, 0, 0)}
				components={{
					event: EventComponent,
				}}
				eventPropGetter={eventStyleGetter}
				step={60}
				timeslots={1}
			/>
		</>
	);
};

export default BigCalendar;
