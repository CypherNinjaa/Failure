import prisma from "@/lib/prisma";
import { LeadershipTeamClient } from "./leadership-team";

export async function LeadershipTeamServer() {
	// Fetch leadership members from database
	const leadershipMembers = await prisma.leadershipMember.findMany({
		where: {
			isActive: true,
		},
		orderBy: {
			displayOrder: "asc",
		},
	});

	// Transform to match component interface
	const leaders = leadershipMembers.map((member) => ({
		name: member.name,
		position: member.position,
		experience: member.experience || "N/A",
		education: member.education || "N/A",
		image: member.photo,
		email: member.email || "",
		phone: member.phone || "",
		specialization: member.specialization || "",
		achievements: Array.isArray(member.achievements)
			? (member.achievements as string[])
			: [],
		quote: member.quote || "",
	}));

	return <LeadershipTeamClient leaders={leaders} />;
}
