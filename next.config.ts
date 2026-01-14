import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Optimize for faster navigation
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react'],
  },
  // Compress output for faster loading
  compress: true,
  // Optimize images if used
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
