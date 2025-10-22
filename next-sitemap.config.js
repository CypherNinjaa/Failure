/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || "https://happychild.in",
	generateRobotsTxt: true, // (optional) Generate robots.txt
	sitemapSize: 7000,
	changefreq: "daily",
	priority: 0.7,
	exclude: [
		"/admin*",
		"/teacher*",
		"/student*",
		"/parent*",
		"/media-coordinator*",
		"/list/*",
		"/profile",
		"/settings",
		"**/sign-in",
		"**/sign-up",
	],
	// Default transformation function
	transform: async (config, path) => {
		// Custom priority and changefreq based on path
		let priority = config.priority;
		let changefreq = config.changefreq;

		// Homepage gets highest priority
		if (path === "/") {
			priority = 1.0;
			changefreq = "daily";
		}
		// About & Contact - High priority
		else if (path.startsWith("/about") || path.startsWith("/contact")) {
			priority = 0.9;
			changefreq = "weekly";
		}
		// Main sections - High priority
		else if (path.startsWith("/academics") || path.startsWith("/admissions")) {
			priority = 0.8;
			changefreq = "weekly";
		}
		// Facilities & Co-curricular - Medium-high priority
		else if (
			path.startsWith("/facilities") ||
			path.startsWith("/co-curricular")
		) {
			priority = 0.7;
			changefreq = "monthly";
		}
		// Content sections - Medium priority
		else if (
			path.startsWith("/gallery") ||
			path.startsWith("/news") ||
			path.startsWith("/blog")
		) {
			priority = 0.6;
			changefreq = path.startsWith("/news") ? "daily" : "weekly";
		}

		return {
			loc: path,
			changefreq,
			priority,
			lastmod: new Date().toISOString(),
		};
	},
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/admin",
					"/teacher",
					"/student",
					"/parent",
					"/media-coordinator",
					"/list",
					"/profile",
					"/settings",
				],
			},
		],
		additionalSitemaps: ["https://happychild.in/sitemap.xml"],
	},
};
