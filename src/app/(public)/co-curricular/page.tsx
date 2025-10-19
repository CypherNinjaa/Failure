"use client";

import { ModernHeader } from "@/components/ui/modern-header";
import { CoCurricularHero } from "@/components/ui/co-curricular-hero";
import { ActivityTiles } from "@/components/ui/activity-tiles";
import { VideoShowcases } from "@/components/ui/video-showcases";
import { EventPhotoWalls } from "@/components/ui/event-photo-walls";
import { ModernFooter } from "@/components/ui/modern-footer";

export default function CoCurricularPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />
			<CoCurricularHero />
			<ActivityTiles />
			<VideoShowcases />
			<EventPhotoWalls />
			<ModernFooter />
		</div>
	);
}
