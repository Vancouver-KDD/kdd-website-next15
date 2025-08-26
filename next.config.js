/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  typedRoutes: true,
  images: {
    qualities: [75, 100],
  },
}

module.exports = nextConfig
