import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (dev server uses Turbopack by default in Next.js 15+)
  turbopack: {
    resolveAlias: {
      canvas: "./empty-module.ts",
    },
  },

  // Webpack config (used for production builds)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;