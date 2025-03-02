/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/nextjs-mothership-terminal",
  images: {
    unoptimized: true, 
  },
};

module.exports = nextConfig;