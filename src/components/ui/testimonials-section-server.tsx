import prisma from "@/lib/prisma";
import TestimonialsSectionClient from "./testimonials-section-client";

export default async function TestimonialsSection() {
	try {
		// Fetch published testimonials only
		const testimonials = await prisma.testimonial.findMany({
			where: {
				isPublished: true,
				status: "APPROVED",
			},
			orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
			take: 20, // Limit to 20 testimonials
		});

		return <TestimonialsSectionClient testimonials={testimonials} />;
	} catch (error) {
		console.error("Error fetching testimonials:", error);
		// Return empty array on error
		return <TestimonialsSectionClient testimonials={[]} />;
	}
}
