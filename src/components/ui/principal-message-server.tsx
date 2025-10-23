import prisma from "@/lib/prisma";
import { PrincipalMessageClient } from "./principal-message";

export async function PrincipalMessageServer() {
	// Fetch principal info from database
	const principalInfo = await prisma.principalInfo.findFirst();

	if (!principalInfo) {
		// Return default data if none exists
		return (
			<PrincipalMessageClient
				principalData={{
					name: "Dr. Sarah Johnson",
					title: "Principal",
					message:
						"Welcome to our school! We are committed to providing excellent education.",
					photo: "👩‍🏫",
					qualifications: "Ph.D. in Education",
					email: "principal@school.com",
					phone: "+1 234 567 8900",
				}}
			/>
		);
	}

	// Transform to match component interface
	const principalData = {
		name: principalInfo.name,
		title: principalInfo.title,
		message: principalInfo.message,
		photo: principalInfo.photo,
		qualifications: principalInfo.qualifications || "",
		email: principalInfo.email || "",
		phone: principalInfo.phone || "",
	};

	return <PrincipalMessageClient principalData={principalData} />;
}
