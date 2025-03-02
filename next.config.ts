import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/nextjs-mothership-terminal' : '',
  images: {
    unoptimized: true,
  },
  // Disable server-side features since we're exporting static files
  trailingSlash: true,
  // Ensure we can deploy to GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nextjs-mothership-terminal' : '',
};

export default nextConfig;