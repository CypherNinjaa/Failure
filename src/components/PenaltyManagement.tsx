"use client";

import {
	applyPenaltyReduction,
	checkPenaltyReductionEligibility,
	forgivePenalty,
} from "@/lib/actions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
	studentId: string;
	studentName: string;
};

export default function PenaltyManagement({ studentId, studentName }: Props) {
	const [loading, setLoading] = useState(false);
	const [eligibility, setEligibility] = useState<any>(null);
	const [showDetails, setShowDetails] = useState(false);

	const loadEligibility = async () => {
		const result = await checkPenaltyReductionEligibility(studentId);
		setEligibility(result);
	};

	useEffect(() => {
		loadEligibility();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [studentId]);

	const handleAutoReduce = async () => {
		if (!eligibility?.isEligible) {
			toast.error("Student not eligible for automatic reduction!");
			return;
		}

		setLoading(true);
		try {
			const result = await applyPenaltyReduction(
				{ success: false, error: false },
				{
					studentId,
					adminId: "admin", // Replace with actual admin ID
					reason: `Automatic reduction: ${eligibility.cleanTestsCompleted} clean tests, ${eligibility.daysWithoutViolation} days without violation`,
					violationsToRemove: eligibility.canReduceBy,
				}
			);

			if (result.success) {
				toast.success(result.message);
				await loadEligibility();
			} else {
				toast.error(result.message || "Failed to reduce penalty");
			}
		} catch (error) {
			toast.error("Error reducing penalty");
		} finally {
			setLoading(false);
		}
	};

	const handleManualForgive = async (fullForgiveness: boolean) => {
		const reason = prompt(
			`Enter reason for ${
				fullForgiveness ? "full forgiveness" : "50% reduction"
			}:`
		);
		if (!reason) return;

		setLoading(true);
		try {
			const result = await forgivePenalty(
				{ success: false, error: false },
				{
					studentId,
					adminId: "admin", // Replace with actual admin ID
					reason,
					fullForgiveness,
				}
			);

			if (result.success) {
				toast.success(result.message);
				await loadEligibility();
			} else {
				toast.error(result.message || "Failed to forgive penalty");
			}
		} catch (error) {
			toast.error("Error forgiving penalty");
		} finally {
			setLoading(false);
		}
	};

	if (!eligibility) {
		return <div className="animate-pulse">Loading penalty info...</div>;
	}

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold">
					Penalty Management - {studentName}
				</h3>
				<button
					onClick={() => setShowDetails(!showDetails)}
					className="text-blue-500 text-sm"
				>
					{showDetails ? "Hide Details" : "Show Details"}
				</button>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-red-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-red-600">
						{eligibility.totalViolations}
					</div>
					<div className="text-sm text-gray-600">Total Violations</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-green-600">
						{eligibility.cleanTestsCompleted}
					</div>
					<div className="text-sm text-gray-600">Clean Tests</div>
				</div>
				<div className="bg-blue-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-blue-600">
						{eligibility.daysWithoutViolation}
					</div>
					<div className="text-sm text-gray-600">Days Clean</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg">
					<div className="text-2xl font-bold text-purple-600">
						{eligibility.goodBehaviorScore.toFixed(0)}
					</div>
					<div className="text-sm text-gray-600">Behavior Score</div>
				</div>
			</div>

			{/* Eligibility Status */}
			<div
				className={`p-4 rounded-lg mb-6 ${
					eligibility.isEligible
						? "bg-green-50 border border-green-200"
						: "bg-gray-50 border border-gray-200"
				}`}
			>
				<div className="flex items-center gap-2">
					{eligibility.isEligible ? (
						<>
							<span className="text-2xl">✅</span>
							<div>
								<div className="font-semibold text-green-700">
									Eligible for Penalty Reduction
								</div>
								<div className="text-sm text-green-600">
									Can reduce by {eligibility.canReduceBy} violations
								</div>
							</div>
						</>
					) : (
						<>
							<span className="text-2xl">⏳</span>
							<div>
								<div className="font-semibold text-gray-700">
									Not Yet Eligible
								</div>
								<div className="text-sm text-gray-600">
									Requirements: 5 clean tests + 30 days clean, OR 10 clean
									tests, OR 60 days clean
								</div>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Detailed Info */}
			{showDetails && (
				<div className="mb-6 p-4 bg-gray-50 rounded-lg">
					<h4 className="font-semibold mb-2">Detailed Information</h4>
					<ul className="text-sm space-y-1 text-gray-700">
						<li>
							• Last Violation:{" "}
							{eligibility.lastViolationDate
								? new Date(eligibility.lastViolationDate).toLocaleDateString()
								: "Never"}
						</li>
						<li>
							• Clean Tests Required: 5 (Current:{" "}
							{eligibility.cleanTestsCompleted})
						</li>
						<li>
							• Days Without Violation Required: 30 (Current:{" "}
							{eligibility.daysWithoutViolation})
						</li>
						<li>
							• Good Behavior Score: {eligibility.goodBehaviorScore.toFixed(0)}
							/100
						</li>
					</ul>
				</div>
			)}

			{/* Action Buttons */}
			<div className="flex flex-wrap gap-3">
				{eligibility.isEligible && (
					<button
						onClick={handleAutoReduce}
						disabled={loading}
						className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
					>
						{loading ? "Processing..." : "🎉 Apply Auto Reduction"}
					</button>
				)}

				<button
					onClick={() => handleManualForgive(false)}
					disabled={loading || eligibility.totalViolations === 0}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{loading ? "Processing..." : "✨ Reduce by 50%"}
				</button>

				<button
					onClick={() => handleManualForgive(true)}
					disabled={loading || eligibility.totalViolations === 0}
					className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{loading ? "Processing..." : "🎊 Full Forgiveness"}
				</button>

				<button
					onClick={loadEligibility}
					disabled={loading}
					className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{loading ? "Loading..." : "🔄 Refresh"}
				</button>
			</div>

			{/* Help Text */}
			<div className="mt-6 text-xs text-gray-500 border-t pt-4">
				<strong>How Penalty Reduction Works:</strong>
				<ul className="mt-2 space-y-1">
					<li>
						• <strong>Auto Reduction:</strong> Student earns reduction through
						good behavior (clean tests + time)
					</li>
					<li>
						• <strong>50% Reduction:</strong> Manual reduction by admin for
						special circumstances
					</li>
					<li>
						• <strong>Full Forgiveness:</strong> Complete penalty removal (use
						sparingly)
					</li>
					<li>• All reductions are logged and can be audited</li>
				</ul>
			</div>
		</div>
	);
}
