/** @type {import('next').NextConfig} */
const nextConfig = {
  reactDevOverlay: false,
  reactStrictMode: false,
  experimental: {
    externalDir: true,
  },
}

module.exports = nextConfig
