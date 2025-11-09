import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  images: {
    domains: ["t4.ftcdn.net", "png.pngtree.com", "yourdomain.com"],
  },
};

export default nextConfig;
