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
    // dynamicIO: true,
    useCache: true,
    authInterrupts: true,
  }
};

export default nextConfig;
