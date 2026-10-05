import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopinger.co.in",
      },
      {
        protocol: "https",
        hostname: "cdn-staging.shopinger.co.in",
      },
    ],
  },
};

export default nextConfig;
