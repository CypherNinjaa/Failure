import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Prisma } from "@prisma/client";

type StudentPointsWithStudent = Prisma.StudentPointsGetPayload<{
	include: {
		student: {
			select: {
				name: true;
				surname: true;
				img: true;
				class: {
					select: {
						name: true;
					};
				};
			};
		};
	};
}>;

const LeaderboardPage = async () => {
	const { sessionClaims, userId } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "student" && role !== "teacher" && role !== "admin") {
		redirect("/");
	}

	// Fetch top students
	const topStudents: StudentPointsWithStudent[] =
		await prisma.studentPoints.findMany({
			include: {
				student: {
					select: {
						name: true,
						surname: true,
						img: true,
						class: {
							select: {
								name: true,
							},
						},
					},
				},
			},
			orderBy: {
				totalPoints: "desc",
			},
			take: 50, // Top 50 students
		});

	// Find current student's position if they are a student
	const currentStudentPoints: StudentPointsWithStudent | null =
		role === "student" && userId
			? await prisma.studentPoints.findUnique({
					where: { studentId: userId },
					include: {
						student: {
							select: {
								name: true,
								surname: true,
								img: true,
								class: { select: { name: true } },
							},
						},
					},
			  })
			: null;

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">🏆 Leaderboard</h1>
			</div>

			{/* Current Student Card (if student) */}
			{role === "student" && currentStudentPoints && (
				<div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-6 mb-6 shadow-lg">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 relative">
								<Image
									src={currentStudentPoints.student.img || "/noAvatar.png"}
									alt="You"
									fill
									className="rounded-full object-cover"
								/>
							</div>
							<div>
								<p className="text-sm opacity-90">Your Rank</p>
								<h2 className="text-3xl font-bold">
									#{currentStudentPoints.rank}
								</h2>
								<p className="text-sm opacity-90">
									{currentStudentPoints.student.name}{" "}
									{currentStudentPoints.student.surname}
								</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm opacity-90">Total Points</p>
							<p className="text-4xl font-bold">
								{currentStudentPoints.totalPoints}
							</p>
							<p className="text-sm opacity-90">
								{currentStudentPoints.testsCompleted} tests completed
							</p>
							<p className="text-sm opacity-90">
								Avg: {currentStudentPoints.averageScore.toFixed(1)}%
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Top 3 Podium */}
			<div className="grid grid-cols-3 gap-4 mb-8">
				{topStudents.slice(0, 3).map((student, index) => {
					const medals = ["🥇", "🥈", "🥉"];
					const colors = [
						"from-yellow-400 to-yellow-600",
						"from-gray-300 to-gray-500",
						"from-orange-400 to-orange-600",
					];
					return (
						<div
							key={student.id}
							className={`bg-gradient-to-br ${
								colors[index]
							} text-white rounded-lg p-6 shadow-xl transform hover:scale-105 transition ${
								index === 0 ? "col-span-3 md:col-span-1" : ""
							}`}
						>
							<div className="text-center">
								<div className="text-6xl mb-2">{medals[index]}</div>
								<div className="w-20 h-20 mx-auto mb-3 relative">
									<Image
										src={student.student.img || "/noAvatar.png"}
										alt={student.student.name}
										fill
										className="rounded-full object-cover border-4 border-white"
									/>
								</div>
								<h3 className="font-bold text-lg mb-1">
									{student.student.name} {student.student.surname}
								</h3>
								<p className="text-sm opacity-90 mb-2">
									{student.student.class?.name}
								</p>
								<div className="bg-white bg-opacity-20 rounded-lg p-3 mt-2">
									<p className="text-2xl font-bold">{student.totalPoints}</p>
									<p className="text-xs opacity-90">points</p>
								</div>
								<p className="text-xs mt-2 opacity-90">
									{student.testsCompleted} tests •{" "}
									{student.averageScore.toFixed(1)}% avg
								</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* Full Leaderboard Table */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="bg-gray-50 px-6 py-3 border-b">
					<h2 className="font-semibold text-gray-700">Full Rankings</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-100 border-b">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Rank
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Student
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Class
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Points
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tests
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Average
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{topStudents.map((student, index) => {
								const isCurrentStudent =
									role === "student" && student.studentId === userId;
								return (
									<tr
										key={student.id}
										className={`hover:bg-gray-50 ${
											isCurrentStudent ? "bg-blue-50" : ""
										}`}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center">
												<span
													className={`text-lg font-bold ${
														index < 3 ? "text-yellow-600" : "text-gray-600"
													}`}
												>
													#{student.rank}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 relative">
													<Image
														src={student.student.img || "/noAvatar.png"}
														alt={student.student.name}
														fill
														className="rounded-full object-cover"
													/>
												</div>
												<div>
													<div className="text-sm font-medium text-gray-900">
														{student.student.name} {student.student.surname}
														{isCurrentStudent && (
															<span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
																You
															</span>
														)}
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm text-gray-600">
												{student.student.class?.name || "N/A"}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-lg font-bold text-blue-600">
												{student.totalPoints}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm text-gray-600">
												{student.testsCompleted}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm font-medium text-gray-900">
												{student.averageScore.toFixed(1)}%
											</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default LeaderboardPage;
