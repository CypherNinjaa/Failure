/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "images.pexels.com" },
			{ hostname: "res.cloudinary.com" },
		],
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
