import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  experimental: {
    // Allows R3F canvas components to be dynamically imported without SSR
  },
};

export default nextConfig;
