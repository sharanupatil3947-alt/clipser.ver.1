/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "commondatastorage.googleapis.com"],
  },
};
module.exports = nextConfig;
