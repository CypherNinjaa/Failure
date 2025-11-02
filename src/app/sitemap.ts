import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = process.env.SITE_URL || "https://happychild.in";
	const currentDate = new Date();

	// Static public pages
	const staticPages: MetadataRoute.Sitemap = [
		// Homepage - Highest priority
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 1.0,
		},
		// About & Contact - High priority
		{
			url: `${baseUrl}/about`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		// Main sections - High priority
		{
			url: `${baseUrl}/admissions`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/gallery`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		// Testimonial submission - Medium priority
		{
			url: `${baseUrl}/submit-testimonial`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.5,
		},
		// Developer page - Medium priority
		{
			url: `${baseUrl}/developer`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		// Legal pages - Low priority
		{
			url: `${baseUrl}/privacy`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/accessibility`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	return staticPages;
}
