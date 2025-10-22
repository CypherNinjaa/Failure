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
			url: `${baseUrl}/academics`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/admissions`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/facilities`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/co-curricular`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		// Content sections - Medium priority
		{
			url: `${baseUrl}/gallery`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/news`,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.6,
		},
	];

	return staticPages;
}
