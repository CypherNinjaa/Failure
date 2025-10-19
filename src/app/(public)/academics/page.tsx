"use client";

import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { AcademicsHero } from "@/components/ui/academics-hero";
import { CurriculumOverview } from "@/components/ui/curriculum-overview";
import { SubjectsDownload } from "@/components/ui/subjects-download";
import { AcademicCalendar } from "@/components/ui/academic-calendar";
import { TeachingMethodology } from "@/components/ui/teaching-methodology";

export default function AcademicsPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />
			<main className="pt-16 md:pt-20">
				<AcademicsHero />
				<CurriculumOverview />
				<SubjectsDownload />
				<AcademicCalendar />
				<TeachingMethodology />
			</main>
			<ModernFooter />
		</div>
	);
}
