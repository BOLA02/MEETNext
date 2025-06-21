// Performance optimization configuration
module.exports = {
  // Bundle analyzer configuration
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression settings
  compression: {
    enabled: true,
    algorithm: 'gzip',
    threshold: 1024,
    minRatio: 0.8,
  },
  
  // Caching strategies
  caching: {
    staticAssets: {
      maxAge: 31536000, // 1 year
      immutable: true,
    },
    apiRoutes: {
      maxAge: 300, // 5 minutes
    },
  },
  
  // Code splitting
  codeSplitting: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'all',
        enforce: true,
      },
    },
  },
} 