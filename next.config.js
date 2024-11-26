/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apiv2.allsportsapi.com',
      },
      {
        protocol: 'https',
        hostname: 'media-3.api-sports.io',
      },
      {
        protocol: 'https',
        hostname: 'media-1.api-sports.io',
      }
    ],
  },
}

module.exports = nextConfig
