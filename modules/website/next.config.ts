import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['assets.pixelastic.com'],
  },
};

export default nextConfig;
