import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { FacilitiesHero } from "@/components/ui/facilities-hero";
import { InteractiveCampusMap } from "@/components/ui/interactive-campus-map";
import { SmartClassroomTour } from "@/components/ui/smart-classroom-tour";
import { HostelLifeGallery } from "@/components/ui/hostel-life-gallery";
import { CafeteriaMenu } from "@/components/ui/cafeteria-menu";
import { MedicalServices } from "@/components/ui/medical-services";

export default function FacilitiesPage() {
	return (
		<div className="min-h-screen bg-background">
			<ModernHeader />

			<main className="pt-20">
				{/* Hero Section */}
				<FacilitiesHero />

				{/* Interactive Campus Map */}
				<InteractiveCampusMap />

				{/* Smart Classroom Virtual Tour */}
				<SmartClassroomTour />

				{/* Hostel Life Gallery */}
				<HostelLifeGallery />

				{/* Cafeteria Menu Preview */}
				<CafeteriaMenu />

				{/* Medical and Counseling Services */}
				<MedicalServices />
			</main>

			<ModernFooter />
		</div>
	);
}
