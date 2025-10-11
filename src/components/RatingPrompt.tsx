"use client";

import TeacherRatingForm from "@/components/TeacherRatingForm";
import { useState, useEffect } from "react";

type RatingPromptProps = {
	testId: string;
	teacherId: string;
	teacherName: string;
	subjectId?: number;
	hasRated: boolean;
};

const RatingPrompt = ({
	testId,
	teacherId,
	teacherName,
	subjectId,
	hasRated,
}: RatingPromptProps) => {
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		// Show rating form automatically if not rated yet
		if (!hasRated) {
			// Small delay to let the user see the results first
			const timer = setTimeout(() => {
				setShowForm(true);
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [hasRated]);

	if (hasRated) {
		return (
			<div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
				<p className="text-green-700 font-medium">
					✓ You&apos;ve already rated this teacher for this test. Thank you for
					your feedback!
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="bg-lamaPurpleLight border-2 border-lamaPurple p-4 rounded-lg">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="font-semibold text-lamaPurple text-lg">
							Rate Your Teacher
						</h3>
						<p className="text-sm text-gray-600 mt-1">
							Help us improve teaching quality by sharing your feedback about{" "}
							<strong>{teacherName}</strong>
						</p>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="px-4 py-2 bg-lamaPurple text-white rounded-lg font-medium hover:bg-opacity-90 transition"
					>
						Rate Now
					</button>
				</div>
			</div>

			{showForm && (
				<TeacherRatingForm
					teacherId={teacherId}
					teacherName={teacherName}
					testId={testId}
					subjectId={subjectId}
					onClose={() => setShowForm(false)}
				/>
			)}
		</>
	);
};

export default RatingPrompt;
