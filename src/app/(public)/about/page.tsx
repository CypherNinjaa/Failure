import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { AboutHero } from "@/components/ui/about-hero";
import { SchoolHistoryServer } from "@/components/ui/school-history-server";
import { PrincipalMessageServer } from "@/components/ui/principal-message-server";
import { VisionMission } from "@/components/ui/vision-mission";
import { LeadershipTeamServer } from "@/components/ui/leadership-team-server";
import { StaffDirectoryServer } from "@/components/ui/staff-directory-server";
import { InfrastructureHighlights } from "@/components/ui/infrastructure-highlights";
import { AwardsAchievements } from "@/components/ui/awards-achievements";
import { Suspense } from "react";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />
			<AboutHero />
			<Suspense
				fallback={<div className="py-16 text-center">Loading history...</div>}
			>
				<SchoolHistoryServer />
			</Suspense>
			<Suspense
				fallback={<div className="py-16 text-center">Loading message...</div>}
			>
				<PrincipalMessageServer />
			</Suspense>
			<VisionMission />
			<Suspense
				fallback={
					<div className="py-16 text-center">Loading leadership...</div>
				}
			>
				<LeadershipTeamServer />
			</Suspense>
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
