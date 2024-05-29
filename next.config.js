let basePath = "/eirene";
if (process.env.NEXT_PUBLIC_NODE_ENV === "vercel" || process.env.ENV === "dev") {
  // Running from vercel or local machine
  basePath = ""
} 

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'export',
  webpack: (config, { isServer }) => {
    //if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
        },
      };
    //}
    return config;// Fixes npm packages that depend on `fs` module
  },
  async redirects() {
    return [
        {
            source: '/eumonia.txt',
            destination: '/index.txt',
            basePath: false,
            permanent: false
        }
    ]
  },
  basePath
}

module.exports = nextConfig
