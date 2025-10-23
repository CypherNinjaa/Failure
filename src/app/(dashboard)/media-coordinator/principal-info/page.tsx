import FormModal from "@/components/FormModal";
import prisma from "@/lib/prisma";
import Image from "next/image";

const PrincipalInfoPage = async () => {
	// Fetch the principal info (there should only be one record)
	const principalInfo = await prisma.principalInfo.findFirst();

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			{/* TOP */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-lg font-semibold">Principal Information</h1>
				<div className="flex items-center gap-4">
					{principalInfo ? (
						<FormModal
							table="principalInfo"
							type="update"
							data={principalInfo}
						/>
					) : (
						<FormModal table="principalInfo" type="create" />
					)}
				</div>
			</div>

			{/* CONTENT */}
			{principalInfo ? (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex flex-col gap-2">
							<label className="text-xs text-gray-500 font-semibold">
								Name
							</label>
							<p className="text-sm">{principalInfo.name}</p>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-xs text-gray-500 font-semibold">
								Title
							</label>
							<p className="text-sm">{principalInfo.title}</p>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-xs text-gray-500 font-semibold">
								Qualifications
							</label>
							<p className="text-sm">{principalInfo.qualifications || "N/A"}</p>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-xs text-gray-500 font-semibold">
								Photo/Emoji
							</label>
							<div className="text-4xl">{principalInfo.photo}</div>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-xs text-gray-500 font-semibold">
								Email
							</label>
							<p className="text-sm">{principalInfo.email || "N/A"}</p>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-xs text-gray-500 font-semibold">
								Phone
							</label>
							<p className="text-sm">{principalInfo.phone || "N/A"}</p>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-xs text-gray-500 font-semibold">
							Message
						</label>
						<p className="text-sm whitespace-pre-wrap">
							{principalInfo.message}
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-xs text-gray-500 font-semibold">
							Last Updated
						</label>
						<p className="text-sm">
							{new Date(principalInfo.updatedAt).toLocaleDateString()}
						</p>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-12 text-gray-500">
					<Image
						src="/noData.png"
						alt="No data"
						width={100}
						height={100}
						className="mb-4"
					/>
					<p className="text-sm">No principal information added yet.</p>
					<p className="text-xs mt-2">Click the + button to add information.</p>
				</div>
			)}
		</div>
	);
};

export default PrincipalInfoPage;
