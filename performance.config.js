// Performance optimization configuration
module.exports = {
  // Bundle analysis
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Performance budgets
  budgets: {
    js: '500kb',
    css: '100kb',
    images: '1mb',
  },
  
  // Caching strategies
  caching: {
    static: {
      maxAge: 31536000, // 1 year
      immutable: true,
    },
    dynamic: {
      maxAge: 3600, // 1 hour
    },
  },
  
  // Compression settings
  compression: {
    enabled: true,
    level: 6,
    threshold: 1024,
  },
  
  // Monitoring thresholds
  monitoring: {
    firstContentfulPaint: 2000, // 2 seconds
    largestContentfulPaint: 4000, // 4 seconds
    firstInputDelay: 100, // 100ms
    cumulativeLayoutShift: 0.1,
  },
  
  // Lazy loading settings
  lazyLoading: {
    threshold: 0.1,
    rootMargin: '50px',
    delay: 200,
  },
  
  // Debouncing settings
  debouncing: {
    search: 300,
    resize: 250,
    scroll: 100,
    input: 200,
  },
  
  // Memoization settings
  memoization: {
    maxSize: 100,
    ttl: 300000, // 5 minutes
  },
  
  // Virtual scrolling settings
  virtualScrolling: {
    itemHeight: 60,
    overscan: 5,
    containerHeight: 400,
  },
  
  // Prefetching settings
  prefetching: {
    enabled: true,
    distance: 100, // pixels from viewport
    delay: 1000, // 1 second delay
  },
  
  // Service worker settings
  serviceWorker: {
    enabled: false, // Enable for PWA features
    scope: '/',
    cacheName: 'meet-app-v1',
  },
  
  // Performance monitoring
  monitoring: {
    enabled: process.env.NODE_ENV === 'production',
    sampleRate: 0.1, // 10% of users
    endpoint: '/api/performance',
  },
  
  // Error tracking
  errorTracking: {
    enabled: process.env.NODE_ENV === 'production',
    sampleRate: 1.0, // 100% of errors
  },
  
  // Analytics
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    provider: 'google', // or 'plausible', 'fathom', etc.
    trackPerformance: true,
    trackErrors: true,
  },
  
  // Development optimizations
  development: {
    hotReload: true,
    fastRefresh: true,
    sourceMaps: true,
    bundleAnalyzer: false,
  },
  
  // Production optimizations
  production: {
    minify: true,
    compress: true,
    treeShaking: true,
    codeSplitting: true,
    dynamicImports: true,
  },
}

// Performance utilities
const performanceUtils = {
  // Debounce function
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },
  
  // Throttle function
  throttle: (func, limit) => {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },
  
  // Measure performance
  measure: (name, fn) => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    console.log(`${name} took ${end - start}ms`)
    return result
  },
  
  // Check if element is in viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  },
  
  // Preload critical resources
  preload: (urls) => {
    urls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = url.endsWith('.css') ? 'style' : 'script'
      document.head.appendChild(link)
    })
  },
  
  // Lazy load images
  lazyLoadImages: () => {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      })
    })
    
    images.forEach(img => imageObserver.observe(img))
  },
  
  // Optimize fonts
  optimizeFonts: () => {
    const fontDisplay = 'swap'
    const fontPreload = document.querySelectorAll('link[rel="preload"][as="font"]')
    fontPreload.forEach(link => {
      link.setAttribute('font-display', fontDisplay)
    })
  },
  
  // Monitor Core Web Vitals
  monitorCoreWebVitals: () => {
    if (typeof window !== 'undefined') {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FCP:', entry.startTime)
        }
      }).observe({ entryTypes: ['paint'] })
      
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('LCP:', entry.startTime)
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })
      
      // First Input Delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime)
        }
      }).observe({ entryTypes: ['first-input'] })
      
      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let cls = 0
        for (const entry of list.getEntries()) {
          cls += entry.value
        }
        console.log('CLS:', cls)
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }
}

module.exports.utils = performanceUtils 