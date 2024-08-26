import dotenv from "dotenv";

dotenv.config();

/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.immediate.co.uk",
      },
      {
        protocol: "https",
        hostname: "simplytibetan.files.wordpress.com",
      },
    ],
  },
};

export default nextConfig;
