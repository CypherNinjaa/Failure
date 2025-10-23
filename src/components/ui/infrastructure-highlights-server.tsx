import prisma from "@/lib/prisma";
import { InfrastructureHighlightsClient } from "./infrastructure-highlights";

export async function InfrastructureHighlightsServer() {
	// Fetch all infrastructure data from database
	const [facilities, additionalFeatures, campusStats] = await Promise.all([
		prisma.facility.findMany({
			where: { isActive: true },
			orderBy: { displayOrder: "asc" },
		}),
		prisma.additionalFeature.findMany({
			where: { isActive: true },
			orderBy: { displayOrder: "asc" },
		}),
		prisma.campusStat.findMany({
			where: { isActive: true },
			orderBy: { displayOrder: "asc" },
		}),
	]);

	// Transform facilities to match component interface
	const transformedFacilities = facilities.map((facility) => ({
		title: facility.title,
		description: facility.description,
		icon: facility.icon,
		features: Array.isArray(facility.features)
			? (facility.features as string[])
			: [],
		image: facility.image,
		color: facility.color,
	}));

	// Transform additional features
	const transformedAdditionalFeatures = additionalFeatures.map((feature) => ({
		icon: feature.icon,
		title: feature.title,
		description: feature.description,
	}));

	// Transform campus stats
	const transformedCampusStats = campusStats.map((stat) => ({
		number: stat.number,
		label: stat.label,
		icon: stat.icon,
	}));

	return (
		<InfrastructureHighlightsClient
			facilities={transformedFacilities}
			additionalFeatures={transformedAdditionalFeatures}
			campusStats={transformedCampusStats}
		/>
	);
}
