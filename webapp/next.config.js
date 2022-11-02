/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['page.tsx'],
  webpack: (config, { dev }) => {
    config.module.rules = [
      ...config.module.rules,
      // ensure barrel files don't constitute imports
      {
        test: /src\/.*index.ts/i,
        sideEffects: false,
      },
    ];
    return config;
  }
}

module.exports = nextConfig
