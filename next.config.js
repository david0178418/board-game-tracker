/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		legacyBrowsers: false,
	  // Enabled in preperation of release of canary feature.
	  // serverComponents: true,
	},
}

module.exports = nextConfig
