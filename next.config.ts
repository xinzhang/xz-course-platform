import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },  
  experimental: {
    dynamicIO: true,
    authInterrupts: true,
  }
};

export default nextConfig;
