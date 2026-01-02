import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },
  compress: true,
  poweredByHeader: false,
  // Optimize bundle
  // Reduce JavaScript bundle size
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'three'],
  },
};

export default nextConfig;
