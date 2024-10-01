import dotenv from "dotenv";

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: [
      "plus.unsplash.com",
      "upload.wikimedia.org",
      "images.immediate.co.uk",
      "simplytibetan.files.wordpress.com",
    ],
  },
};

export default nextConfig;
