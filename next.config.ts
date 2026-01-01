import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // Uncomment and set basePath if your repo is not at root (e.g., basePath: '/jazz-utilities')
  // basePath: '/chord-utility',
};

export default nextConfig;
