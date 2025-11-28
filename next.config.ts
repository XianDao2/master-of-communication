import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure webpack to ignore the external folder
  webpack: (config: any) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules/**', '**/ref-project/**'],
    };
    return config;
  },
};

export default nextConfig;
