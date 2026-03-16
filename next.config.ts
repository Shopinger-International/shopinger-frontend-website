import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    unoptimized:true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "shopinger-uploads.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "shopinger.co.in",
      },
    ],
  },
};

export default nextConfig;
