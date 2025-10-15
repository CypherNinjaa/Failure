/**
 * PWA Icon Generator Script
 * Generates all required PWA icons from a source logo
 *
 * Usage:
 * 1. Place your logo as "logo.png" in the public folder (minimum 512x512)
 * 2. Install sharp: npm install sharp
 * 3. Run: node scripts/generateIcons.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Icon sizes required for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Paths
const SOURCE_LOGO = path.join(__dirname, "../public/logo.png");
const OUTPUT_DIR = path.join(__dirname, "../public/icons");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Check if source logo exists
if (!fs.existsSync(SOURCE_LOGO)) {
	console.error("❌ Error: logo.png not found in public folder");
	console.log(
		'📝 Please add your school logo as "logo.png" in the public folder'
	);
	console.log("   Minimum size: 512x512 pixels");
	console.log("   Format: PNG with transparent or solid background");
	process.exit(1);
}

// Generate icons
async function generateIcons() {
	console.log("🎨 Generating PWA icons...\n");

	for (const size of ICON_SIZES) {
		const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

		try {
			await sharp(SOURCE_LOGO)
				.resize(size, size, {
					fit: "contain",
					background: { r: 255, g: 255, b: 255, alpha: 0 }, // Transparent background
				})
				.png()
				.toFile(outputPath);

			console.log(`✅ Generated ${size}x${size} icon`);
		} catch (error) {
			console.error(`❌ Error generating ${size}x${size} icon:`, error.message);
		}
	}

	console.log("\n🎉 Icon generation complete!");
	console.log(`📁 Icons saved to: ${OUTPUT_DIR}`);
	console.log("\n📋 Next steps:");
	console.log("   1. Verify icons in public/icons/ folder");
	console.log("   2. Build your app: npm run build");
	console.log("   3. Test PWA: npm start");
	console.log(
		"   4. Check manifest in Chrome DevTools → Application → Manifest"
	);
}

// Generate maskable icons (icons with safe zone for different OS masks)
async function generateMaskableIcons() {
	console.log("\n🎭 Generating maskable icons...\n");

	for (const size of [192, 512]) {
		const outputPath = path.join(
			OUTPUT_DIR,
			`icon-${size}x${size}-maskable.png`
		);

		try {
			// Add padding for maskable safe zone (20% on each side)
			const padding = Math.floor(size * 0.2);
			const contentSize = size - padding * 2;

			await sharp(SOURCE_LOGO)
				.resize(contentSize, contentSize, {
					fit: "contain",
					background: { r: 255, g: 255, b: 255, alpha: 0 },
				})
				.extend({
					top: padding,
					bottom: padding,
					left: padding,
					right: padding,
					background: { r: 41, g: 121, b: 255, alpha: 1 }, // lamaSky color
				})
				.png()
				.toFile(outputPath);

			console.log(`✅ Generated ${size}x${size} maskable icon`);
		} catch (error) {
			console.error(
				`❌ Error generating ${size}x${size} maskable icon:`,
				error.message
			);
		}
	}
}

// Generate favicon
async function generateFavicon() {
	console.log("\n🔖 Generating favicon...\n");

	const faviconPath = path.join(__dirname, "../public/favicon.ico");

	try {
		await sharp(SOURCE_LOGO)
			.resize(32, 32, {
				fit: "contain",
				background: { r: 255, g: 255, b: 255, alpha: 0 },
			})
			.png()
			.toFile(faviconPath.replace(".ico", ".png"));

		console.log("✅ Generated favicon.png");
		console.log("ℹ️  Rename to favicon.ico or use online converter");
	} catch (error) {
		console.error("❌ Error generating favicon:", error.message);
	}
}

// Generate Apple touch icon
async function generateAppleIcon() {
	console.log("\n🍎 Generating Apple touch icon...\n");

	const applePath = path.join(OUTPUT_DIR, "apple-touch-icon.png");

	try {
		await sharp(SOURCE_LOGO)
			.resize(180, 180, {
				fit: "contain",
				background: { r: 41, g: 121, b: 255, alpha: 1 }, // lamaSky color
			})
			.png()
			.toFile(applePath);

		console.log("✅ Generated apple-touch-icon.png");
	} catch (error) {
		console.error("❌ Error generating apple touch icon:", error.message);
	}
}

// Generate splash screens for iOS
async function generateSplashScreens() {
	console.log("\n📱 Generating iOS splash screens...\n");

	const splashDir = path.join(OUTPUT_DIR, "splash");
	if (!fs.existsSync(splashDir)) {
		fs.mkdirSync(splashDir, { recursive: true });
	}

	const splashSizes = [
		{ width: 640, height: 1136, name: "iphone5" },
		{ width: 750, height: 1334, name: "iphone6" },
		{ width: 1242, height: 2208, name: "iphone6plus" },
		{ width: 1125, height: 2436, name: "iphonex" },
		{ width: 828, height: 1792, name: "iphonexr" },
		{ width: 1242, height: 2688, name: "iphonexsmax" },
		{ width: 1536, height: 2048, name: "ipad" },
		{ width: 2048, height: 2732, name: "ipadpro" },
	];

	for (const splash of splashSizes) {
		const outputPath = path.join(splashDir, `splash-${splash.name}.png`);

		try {
			// Logo size is 30% of screen width
			const logoSize = Math.floor(splash.width * 0.3);

			await sharp(SOURCE_LOGO)
				.resize(logoSize, logoSize, {
					fit: "contain",
					background: { r: 255, g: 255, b: 255, alpha: 0 },
				})
				.extend({
					top: Math.floor((splash.height - logoSize) / 2),
					bottom: Math.floor((splash.height - logoSize) / 2),
					left: Math.floor((splash.width - logoSize) / 2),
					right: Math.floor((splash.width - logoSize) / 2),
					background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
				})
				.png()
				.toFile(outputPath);

			console.log(
				`✅ Generated ${splash.name} splash screen (${splash.width}x${splash.height})`
			);
		} catch (error) {
			console.error(
				`❌ Error generating ${splash.name} splash:`,
				error.message
			);
		}
	}
}

// Main execution
(async () => {
	try {
		await generateIcons();
		await generateMaskableIcons();
		await generateFavicon();
		await generateAppleIcon();

		console.log("\n❓ Generate iOS splash screens? (They are large files)");
		console.log(
			"   Run with --splash flag: node scripts/generateIcons.js --splash"
		);

		if (process.argv.includes("--splash")) {
			await generateSplashScreens();
		}

		console.log("\n✨ All done! Your PWA is ready to install.");
	} catch (error) {
		console.error("\n❌ Fatal error:", error);
		process.exit(1);
	}
})();
