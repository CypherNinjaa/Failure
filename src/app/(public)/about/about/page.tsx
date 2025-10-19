"use client";

import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { AboutHero } from "@/components/ui/about-hero";
import { SchoolHistory } from "@/components/ui/school-history";
import { PrincipalMessage } from "@/components/ui/principal-message";
import { VisionMission } from "@/components/ui/vision-mission";
import { LeadershipTeam } from "@/components/ui/leadership-team";
import { StaffDirectory } from "@/components/ui/staff-directory";
import { InfrastructureHighlights } from "@/components/ui/infrastructure-highlights";
import { AwardsAchievements } from "@/components/ui/awards-achievements";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />
			<AboutHero />
			<SchoolHistory />
			<PrincipalMessage />
			<VisionMission />
			<LeadershipTeam />
			<StaffDirectory />
			<InfrastructureHighlights />
			<AwardsAchievements />
			<ModernFooter />
		</div>
	);
}
