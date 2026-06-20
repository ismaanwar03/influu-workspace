const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '://cloudinary.com' },
      { protocol: 'https', hostname: '://githubusercontent.com' },
    ],
  },
  experimental: {
    // Keep whatever experimental flags you have here
  },
}

module.exports = nextConfig
