"use client";

import { useState } from "react";
import { Lesson } from "@prisma/client";

type MobileScheduleProps = {
	lessons: (Lesson & {
		subject: { name: string };
		teacher: { name: string; surname: string };
		class: { name: string };
	})[];
};

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const DAY_NAMES = {
	MONDAY: "Monday",
	TUESDAY: "Tuesday",
	WEDNESDAY: "Wednesday",
	THURSDAY: "Thursday",
	FRIDAY: "Friday",
};

const MobileSchedule = ({ lessons }: MobileScheduleProps) => {
	const [expandedDay, setExpandedDay] = useState<string | null>("MONDAY");

	// Group lessons by day
	const lessonsByDay = lessons.reduce((acc, lesson) => {
		if (!acc[lesson.day]) {
			acc[lesson.day] = [];
		}
		acc[lesson.day].push(lesson);
		return acc;
	}, {} as Record<string, typeof lessons>);

	// Sort lessons by start time
	Object.keys(lessonsByDay).forEach((day) => {
		lessonsByDay[day].sort(
			(a, b) => a.startTime.getTime() - b.startTime.getTime()
		);
	});

	const toggleDay = (day: string) => {
		setExpandedDay(expandedDay === day ? null : day);
	};

	const formatTime = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}).format(date);
	};

	return (
		<div className="flex flex-col gap-2">
			{DAYS.map((day) => {
				const dayLessons = lessonsByDay[day] || [];
				const isExpanded = expandedDay === day;

				return (
					<div
						key={day}
						className="border rounded-lg overflow-hidden bg-white shadow-sm"
					>
						{/* Day Header */}
						<button
							onClick={() => toggleDay(day)}
							className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
						>
							<div className="flex items-center gap-3">
								<span className="text-lg font-semibold text-gray-800">
									{DAY_NAMES[day as keyof typeof DAY_NAMES]}
								</span>
								<span className="text-sm bg-lamaPurple text-white px-2 py-1 rounded-full">
									{dayLessons.length}{" "}
									{dayLessons.length === 1 ? "lesson" : "lessons"}
								</span>
							</div>
							<svg
								className={`w-5 h-5 text-gray-600 transition-transform ${
									isExpanded ? "rotate-180" : ""
								}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{/* Lessons List */}
						{isExpanded && (
							<div className="divide-y divide-gray-100">
								{dayLessons.length === 0 ? (
									<div className="p-4 text-center text-gray-500 text-sm">
										No lessons scheduled
									</div>
								) : (
									dayLessons.map((lesson) => (
										<div
											key={lesson.id}
											className="p-4 hover:bg-gray-50 transition-colors"
										>
											<div className="flex items-start justify-between mb-3">
												<div className="flex-1">
													<h3 className="font-semibold text-gray-900 text-base mb-2">
														{lesson.name}
													</h3>
													<div className="flex items-center gap-2 text-sm text-gray-600">
														<span className="font-medium">Subject:</span>
														<span>{lesson.subject.name}</span>
													</div>
												</div>
												<div className="text-right ml-4">
													<p className="text-sm font-medium text-lamaPurple whitespace-nowrap">
														{formatTime(lesson.startTime)}
													</p>
													<p className="text-xs text-gray-500 whitespace-nowrap">
														{formatTime(lesson.endTime)}
													</p>
												</div>
											</div>
											<div className="flex flex-col gap-1 text-sm text-gray-600 pt-2 border-t border-gray-100">
												<div className="flex items-center gap-2">
													<span className="font-medium min-w-[60px]">
														Teacher:
													</span>
													<span>
														{lesson.teacher.name} {lesson.teacher.surname}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="font-medium min-w-[60px]">
														Class:
													</span>
													<span>{lesson.class.name}</span>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default MobileSchedule;
