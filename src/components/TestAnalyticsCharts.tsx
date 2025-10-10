"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";

const COLORS = ["#ef4444", "#f59e0b", "#eab308", "#84cc16", "#22c55e"];

const TestAnalyticsCharts = ({
	scoreRanges,
	questionStats,
}: {
	scoreRanges: { range: string; count: number }[];
	questionStats: {
		id: number;
		text: string;
		difficulty: string;
		correctPercentage: number;
	}[];
}) => {
	// Difficulty distribution
	const difficultyData = [
		{
			name: "Easy",
			count: questionStats.filter((q) => q.difficulty === "Easy").length,
		},
		{
			name: "Medium",
			count: questionStats.filter((q) => q.difficulty === "Medium").length,
		},
		{
			name: "Hard",
			count: questionStats.filter((q) => q.difficulty === "Hard").length,
		},
	];

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
			{/* Score Distribution */}
			<div className="bg-white border rounded-lg p-6">
				<h3 className="font-semibold text-gray-700 mb-4">Score Distribution</h3>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={scoreRanges}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="range" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="count" fill="#8b5cf6" name="Number of Students" />
					</BarChart>
				</ResponsiveContainer>
			</div>

			{/* Question Difficulty Distribution */}
			<div className="bg-white border rounded-lg p-6">
				<h3 className="font-semibold text-gray-700 mb-4">
					Question Difficulty Distribution
				</h3>
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={difficultyData}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={({ name, count }) => `${name}: ${count}`}
							outerRadius={100}
							fill="#8884d8"
							dataKey="count"
						>
							{difficultyData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										entry.name === "Easy"
											? "#22c55e"
											: entry.name === "Medium"
											? "#eab308"
											: "#ef4444"
									}
								/>
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default TestAnalyticsCharts;
