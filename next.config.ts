// FILE: next.config.ts (root of project)

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for Docker standalone build
  output: 'standalone',

  // Allow images from Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig