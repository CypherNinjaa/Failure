import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { AdmissionsHero } from "@/components/ui/admissions-hero";
import { WhyChooseUs } from "@/components/ui/why-choose-us";
import { AdmissionProcess } from "@/components/ui/admission-process";
import { EligibilityCriteria } from "@/components/ui/eligibility-criteria";
import { FeeStructure } from "@/components/ui/fee-structure";
import { OnlineAdmissionForm } from "@/components/ui/online-admission-form";
import { AdmissionsFAQ } from "@/components/ui/admissions-faq";
import { ScholarshipHighlights } from "@/components/ui/scholarship-highlights";

export default function AdmissionsPage() {
	return (
		<main className="min-h-screen bg-background">
			<ModernHeader />
			<AdmissionsHero />
			<WhyChooseUs />
			<AdmissionProcess />
			<EligibilityCriteria />
			<FeeStructure />
			<OnlineAdmissionForm />
			<ScholarshipHighlights />
			<AdmissionsFAQ />
			<ModernFooter />
		</main>
	);
}
