/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  generateEtags: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.pixabay.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/',
        permanent: false,
      },
    ]
  },

  // Rewrites
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    }
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'ArabGram',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Turbopack configuration (Next.js 16)
  turbopack: {
    resolveAlias: {
      '@/components/ui/dialog': '@/components/ui/dialog',
    },
  },

  // Server external packages
  serverExternalPackages: ['simple-peer', 'web-push', 'argon2'],

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Production source maps (disable for smaller bundle and faster builds)
  productionBrowserSourceMaps: false,

  // Trailing slash
  trailingSlash: false,

  // Compression
  compress: true,
}

// Export configuration
module.exports = nextConfig
