import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint checking
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  // env: {
  //   NEXT_PUBLIC_NINJAS_API_KEY: process.env.NEXT_PUBLIC_NINJAS_API_KEY,
  // },
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
