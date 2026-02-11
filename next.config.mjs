/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    qualities: [25, 50, 75, 80, 85, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uploads-ssl.webflow.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scrollimedia.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // CSP Headers for Instorier integration (hikayeler articles)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.instorier.com *.instorier-cdn.com https://va.vercel-scripts.com https://js.stripe.com https://public.flourish.studio",
              "style-src 'self' 'unsafe-inline' *.instorier.com *.instorier-cdn.com https://public.flourish.studio",
              "font-src 'self' data: *.instorier-cdn.com https://fonts.gstatic.com https://files.instorier.com",
              "img-src 'self' data: blob: *.instorier.com *.instorier-cdn.com https: scrollimedia.blob.core.windows.net *.maptiler.com *.openstreetmap.org *.stadiamaps.com *.flourish.studio",
              "media-src 'self' *.instorier.com *.instorier-cdn.com https://www.youtube.com https://*.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self' *.instorier.com *.instorier-cdn.com https://vitals.vercel-insights.com https://*.supabase.co wss://*.supabase.co https://*.revenue.cat https://api.revenuecat.com https://e.revenue.cat https://*.maptiler.com https://*.openstreetmap.org https://*.stadiamaps.com https://public.flourish.studio http://127.0.0.1:7244 http://localhost:7244",
              "frame-src 'self' https://js.stripe.com https://*.revenue.cat https://api.revenuecat.com https://e.revenue.cat https://www.youtube.com https://*.youtube.com https://www.youtube-nocookie.com https://flo.uri.sh https://public.flourish.studio",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-tabs', '@radix-ui/react-checkbox'],
    // Disable optimizeCss - requires critters package which causes build errors
    // optimizeCss: true,
  },
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default nextConfig;
