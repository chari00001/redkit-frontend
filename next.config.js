/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Fix module compilation issues
  transpilePackages: [
    "framer-motion",
    "@reduxjs/toolkit",
    "react-redux"
  ],
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Improve compilation by enabling SWC minification
  swcMinify: true,
  async rewrites() {
    // Default localhost URLs with correct port numbers:
    // - User service: 3010
    // - Post service: 3002
    // - Community service: 3005
    const USER_API_URL = process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:3010';
    const POST_API_URL = process.env.NEXT_PUBLIC_POST_API_URL || 'http://localhost:3002';
    const COMMUNITY_API_URL = process.env.NEXT_PUBLIC_COMMUNITY_API_URL || 'http://localhost:3005';
    
    return [
      // User service rewrites - User service API endpointleri api/users/ altında
      {
        source: '/api/users/:path*',
        destination: `${USER_API_URL}/api/users/:path*`,
      },
      // Direct access to user API
      {
        source: '/api/user/:path*',
        destination: `${USER_API_URL}/api/users/:path*`,
      },
      // Backward compatibility - /api/auth/ -> /api/users/ yönlendirmesi
      {
        source: '/api/auth/:path*',
        destination: `${USER_API_URL}/api/users/:path*`,
      },
      
      // Post service rewrites
      {
        source: '/api/post/:path*',
        destination: `${POST_API_URL}/posts/:path*`,
      },
      {
        source: '/api/posts/:path*',
        destination: `${POST_API_URL}/posts/:path*`,
      },
      
      // Community service rewrites
      {
        source: '/api/community/:path*',
        destination: `${COMMUNITY_API_URL}/communities/:path*`,
      },
      {
        source: '/api/communities/:path*',
        destination: `${COMMUNITY_API_URL}/communities/:path*`,
      },
    ]
  },
};

module.exports = nextConfig;
