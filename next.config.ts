import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint checking
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   reactCompiler: false,
  // },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.openfoodfacts.org',
        pathname: '**',
      },
    ],
  },
};

export default withPayload(nextConfig);
