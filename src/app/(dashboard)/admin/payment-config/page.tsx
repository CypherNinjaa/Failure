import PaymentConfigForm from "@/components/forms/PaymentConfigForm";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const PaymentConfigPage = async () => {
	const { sessionClaims } = auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	if (role !== "admin") {
		redirect("/");
	}

	// Fetch existing config
	const config = await prisma.paymentConfig.findFirst({
		where: { id: 1 },
	});

	return (
		<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
			<div className="max-w-2xl mx-auto">
				<PaymentConfigForm existingConfig={config} />
			</div>
		</div>
	);
};

export default PaymentConfigPage;
