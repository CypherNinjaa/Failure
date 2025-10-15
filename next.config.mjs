/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "images.pexels.com" },
			{ hostname: "res.cloudinary.com" },
			{ hostname: "img.clerk.com" },
			{ hostname: "images.clerk.dev" },
		],
		unoptimized: false,
	},
	experimental: {
		serverActions: {
			allowedOrigins: [
				"localhost:3000",
				"hgv24btw-3000.inc1.devtunnels.ms",
				"*.devtunnels.ms",
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
};

export default nextConfig;
