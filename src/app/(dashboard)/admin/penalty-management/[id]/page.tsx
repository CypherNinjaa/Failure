import PenaltyManagement from "@/components/PenaltyManagement";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const StudentPenaltyPage = async ({ params }: { params: { id: string } }) => {
	const { id } = params;

	// Fetch student data
	const student = await prisma.student.findUnique({
		where: { id },
		include: {
			class: {
				select: { name: true },
			},
			mcqAttempts: {
				select: {
					id: true,
					test: {
						select: {
							title: true,
						},
					},
					score: true,
					cheatingViolations: true,
					violationDetails: true,
					isTerminatedForCheating: true,
					finalPenaltyPercentage: true,
					completedAt: true,
				},
				orderBy: {
					completedAt: "desc",
				},
			},
			cheatingSuspensions: {
				where: {
					isActive: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	if (!student) {
		notFound();
	}

	const studentName = `${student.name} ${student.surname}`;

	return (
		<div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
			{/* LEFT */}
			<div className="w-full xl:w-2/3">
				{/* TOP */}
				<div className="flex flex-col lg:flex-row gap-4">
					{/* USER INFO CARD */}
					<div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
						<div className="w-1/3">
							<Image
								src={student.img || "/noAvatar.png"}
								alt=""
								width={144}
								height={144}
								className="w-36 h-36 rounded-full object-cover"
							/>
						</div>
						<div className="w-2/3 flex flex-col justify-between gap-4">
							<div className="flex items-center gap-4">
								<h1 className="text-xl font-semibold">{studentName}</h1>
							</div>
							<p className="text-sm text-gray-500">
								Student information and penalty status
							</p>
							<div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
								<div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
									<Image src="/class.png" alt="" width={14} height={14} />
									<span>{student.class.name}</span>
								</div>
								<div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
									<Image src="/exam.png" alt="" width={14} height={14} />
									<span>{student.mcqAttempts.length} Tests Taken</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* PENALTY MANAGEMENT */}
				<div className="mt-4">
					<PenaltyManagement studentId={id} studentName={studentName} />
				</div>

				{/* ACTIVE SUSPENSIONS */}
				{student.cheatingSuspensions.length > 0 && (
					<div className="mt-4 bg-red-50 border-2 border-red-200 p-6 rounded-lg">
						<h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
							<span className="text-2xl">🚫</span>
							Active Suspensions
						</h3>
						{student.cheatingSuspensions.map((suspension) => (
							<div key={suspension.id} className="mb-4 last:mb-0">
								<div className="flex items-center justify-between mb-2">
									<span className="font-semibold text-red-700">
										Suspended until:{" "}
										{new Date(suspension.suspendedUntil).toLocaleDateString()}
									</span>
									<span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
										{suspension.violationCount} violations
									</span>
								</div>
								<p className="text-sm text-gray-700">{suspension.reason}</p>
							</div>
						))}
					</div>
				)}
			</div>

			{/* RIGHT */}
			<div className="w-full xl:w-1/3 flex flex-col gap-4">
				{/* TEST HISTORY */}
				<div className="bg-white p-4 rounded-md">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-xl font-semibold">Test History</h1>
						<Link href={`/list/students/${id}`}>
							<span className="text-xs text-gray-400">View All</span>
						</Link>
					</div>
					<div className="space-y-3 max-h-[600px] overflow-y-auto">
						{student.mcqAttempts.map((attempt) => (
							<div
								key={attempt.id}
								className={`p-3 rounded-lg border ${
									attempt.cheatingViolations > 0
										? "bg-red-50 border-red-200"
										: "bg-green-50 border-green-200"
								}`}
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<h3 className="font-semibold text-sm">
											{attempt.test.title}
										</h3>
										<p className="text-xs text-gray-500">
											{attempt.completedAt
												? new Date(attempt.completedAt).toLocaleDateString()
												: "In Progress"}
										</p>
									</div>
									<div className="text-right">
										{attempt.score !== null && (
											<p className="font-bold text-sm">
												Score: {attempt.score.toFixed(1)}%
											</p>
										)}
									</div>
								</div>

								{/* Violation Info */}
								{attempt.cheatingViolations > 0 && (
									<div className="mt-2 pt-2 border-t border-red-200">
										<div className="flex items-center justify-between text-xs">
											<span className="text-red-600 font-semibold">
												⚠️ {attempt.cheatingViolations} Violations
											</span>
											<span className="text-red-600">
												-{attempt.finalPenaltyPercentage}% penalty
											</span>
										</div>
										{attempt.isTerminatedForCheating && (
											<p className="text-xs text-red-700 mt-1">
												🚫 Test terminated for cheating
											</p>
										)}
										{/* Show violation details */}
										{attempt.violationDetails && (
											<div className="mt-2 space-y-1">
												{(attempt.violationDetails as any[]).map(
													(violation, idx) => (
														<div
															key={idx}
															className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded"
														>
															{violation.type} at{" "}
															{new Date(
																violation.timestamp
															).toLocaleTimeString()}
														</div>
													)
												)}
											</div>
										)}
									</div>
								)}

								{/* Clean test indicator */}
								{attempt.cheatingViolations === 0 && attempt.completedAt && (
									<div className="mt-2 pt-2 border-t border-green-200">
										<p className="text-xs text-green-600 font-semibold">
											✅ Clean test - no violations
										</p>
									</div>
								)}
							</div>
						))}

						{student.mcqAttempts.length === 0 && (
							<p className="text-center text-gray-400 text-sm py-4">
								No test attempts yet
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default StudentPenaltyPage;
