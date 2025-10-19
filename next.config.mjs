/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "images.pexels.com" },
			{ hostname: "res.cloudinary.com" },
			{ hostname: "img.clerk.com" },
			{ hostname: "images.clerk.dev" },
			{ hostname: "images.unsplash.com" },
		],
		unoptimized: false,
	},
	experimental: {
		serverActions: {
			allowedOrigins: [
				"localhost:3000",
				"hgv24btw-3000.inc1.devtunnels.ms",
				"*.devtunnels.ms",
				"*.railway.app", // Railway deployment domains
				"*.up.railway.app", // Alternative Railway domains
			],
		},
	},
	webpack: (config, { isServer }) => {
		// Fix for face-api.js trying to use Node.js modules in browser
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				path: false,
				crypto: false,
			};
		}
		return config;
	},
	// Enable standalone output for optimized production builds
	output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
};

export default nextConfig;
