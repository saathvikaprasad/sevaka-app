import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Configuration options go here
	eslint: {
		ignoreDuringBuilds: true, // Disables ESLint checks during deployment
	},
};

export default nextConfig;
