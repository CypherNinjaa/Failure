const fs = require("fs");
const path = require("path");

/**
 * Clean old sitemap files from the public directory
 * This ensures Next.js's dynamic sitemap.ts is used instead of static files
 */
function cleanSitemapFiles() {
	const publicDir = path.join(__dirname, "..", "public");

	try {
		// Get all files in public directory
		const files = fs.readdirSync(publicDir);

		// Filter sitemap-related files
		const sitemapFiles = files.filter(
			(file) => file.startsWith("sitemap") && file.endsWith(".xml")
		);

		if (sitemapFiles.length === 0) {
			console.log("✓ No old sitemap files to clean");
			return;
		}

		// Delete each sitemap file
		sitemapFiles.forEach((file) => {
			const filePath = path.join(publicDir, file);
			fs.unlinkSync(filePath);
			console.log(`✓ Removed old sitemap file: ${file}`);
		});

		console.log(`✓ Cleaned ${sitemapFiles.length} old sitemap file(s)`);
	} catch (error) {
		console.error("Error cleaning sitemap files:", error.message);
		// Don't fail the build if cleanup fails
	}
}

// Run the cleanup
cleanSitemapFiles();
