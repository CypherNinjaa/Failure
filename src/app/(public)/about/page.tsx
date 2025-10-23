import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { AboutHero } from "@/components/ui/about-hero";
import { SchoolHistory } from "@/components/ui/school-history";
import { PrincipalMessage } from "@/components/ui/principal-message";
import { VisionMission } from "@/components/ui/vision-mission";
import { LeadershipTeam } from "@/components/ui/leadership-team";
import { StaffDirectoryServer } from "@/components/ui/staff-directory-server";
import { InfrastructureHighlights } from "@/components/ui/infrastructure-highlights";
import { AwardsAchievements } from "@/components/ui/awards-achievements";
import { Suspense } from "react";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />
			<AboutHero />
			<SchoolHistory />
			<PrincipalMessage />
			<VisionMission />
			<LeadershipTeam />
			<Suspense
				fallback={<div className="py-16 text-center">Loading staff...</div>}
			>
				<StaffDirectoryServer />
			</Suspense>
			<InfrastructureHighlights />
			<AwardsAchievements />
			<ModernFooter />
		</div>
	);
}
