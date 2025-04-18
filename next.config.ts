import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vrhgamns3dfuintx.public.blob.vercel-storage.com",
      },
    ],
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  },
  experimental: {
    dynamicIO: true,
    authInterrupts: true,
  }
};

export default nextConfig;
