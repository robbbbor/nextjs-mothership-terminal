import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/nextjs-mothership-terminal' : '',
  images: {
    unoptimized: true,
  },
  // Configure for static export
  trailingSlash: true,
  // Ensure assets are properly referenced on GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nextjs-mothership-terminal/' : '',
};

export default nextConfig;