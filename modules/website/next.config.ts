import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    domains: ['assets.pixelastic.com'],
  },
};

export default nextConfig;
