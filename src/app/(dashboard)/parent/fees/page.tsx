import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import ParentFeeCard from "@/components/ParentFeeCard";

const ParentFeesPage = async () => {
	const { userId, sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "parent" || !userId) {
		redirect("/");
	}

	// Get payment config
	const paymentConfig = await prisma.paymentConfig.findFirst({
		where: { id: 1 },
	});

	// Get parent's students
	const parent = await prisma.parent.findUnique({
		where: { id: userId },
		include: {
			students: {
				include: {
					class: true,
					grade: true,
					studentFees: {
						include: {
							feeStructure: true,
							payments: {
								orderBy: { createdAt: "desc" },
							},
						},
						orderBy: { dueDate: "asc" },
					},
				},
			},
		},
	});

	if (!parent || parent.students.length === 0) {
		return (
			<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
				<h1 className="text-lg font-semibold mb-4">My Children&apos;s Fees</h1>
				<p className="text-gray-500">No students linked to your account.</p>
			</div>
		);
	}

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-lg font-semibold">My Children&apos;s Fees</h1>
			</div>

			{parent.students.map((student) => (
				<div key={student.id} className="mb-8">
					<div className="flex items-center gap-4 mb-4 pb-2 border-b-2">
						<Image
							src={student.img || "/noAvatar.png"}
							alt={student.name}
							width={48}
							height={48}
							className="rounded-full object-cover"
						/>
						<div>
							<h2 className="text-xl font-bold">
								{student.name} {student.surname}
							</h2>
							<p className="text-sm text-gray-500">
								Class: {student.class?.name || "N/A"} | Grade:{" "}
								{student.grade?.level || "N/A"}
							</p>
						</div>
					</div>

					{student.studentFees.length === 0 ? (
						<p className="text-gray-500 text-sm">No fees assigned yet.</p>
					) : (
						<div className="grid gap-4">
							{student.studentFees.map((fee) => (
								<ParentFeeCard
									key={fee.id}
									fee={fee}
									studentName={`${student.name} ${student.surname}`}
									upiId={paymentConfig?.upiId || null}
									upiQRCode={paymentConfig?.upiQRCode || null}
								/>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default ParentFeesPage;
