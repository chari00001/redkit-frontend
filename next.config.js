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
  transpilePackages: ["framer-motion", "@reduxjs/toolkit", "react-redux"],
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Improve compilation by enabling SWC minification
  swcMinify: true,
  async rewrites() {
    // Updated port numbers based on API documentation:
    // - User service: 3001
    // - Post service: 3002
    // - Community service: 3003
    // - Search service: 3004
    // - Interaction service: 3005
    const USER_API_URL =
      process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:3001";
    const POST_API_URL =
      process.env.NEXT_PUBLIC_POST_API_URL || "http://localhost:3002";
    const COMMUNITY_API_URL =
      process.env.NEXT_PUBLIC_COMMUNITY_API_URL || "http://localhost:3003";
    const SEARCH_API_URL =
      process.env.NEXT_PUBLIC_SEARCH_API_URL || "http://localhost:3004";
    const INTERACTION_API_URL =
      process.env.NEXT_PUBLIC_INTERACTION_API_URL || "http://localhost:3005";

    return [
      // User service rewrites - User service API endpointleri api/users/ altında
      {
        source: "/api/users/:path*",
        destination: `${USER_API_URL}/api/users/:path*`,
      },
      // Direct access to user API
      {
        source: "/api/user/:path*",
        destination: `${USER_API_URL}/api/users/:path*`,
      },
      // Backward compatibility - /api/auth/ -> /api/users/ yönlendirmesi
      {
        source: "/api/auth/:path*",
        destination: `${USER_API_URL}/api/users/:path*`,
      },

      // Post service rewrites - Fixed to include /api/posts prefix
      {
        source: "/api/post/:path*",
        destination: `${POST_API_URL}/api/posts/:path*`,
      },
      {
        source: "/api/posts/:path*",
        destination: `${POST_API_URL}/api/posts/:path*`,
      },

      // Community service rewrites - Fixed to include /api/communities prefix
      {
        source: "/api/community/:path*",
        destination: `${COMMUNITY_API_URL}/api/communities/:path*`,
      },
      {
        source: "/api/communities/:path*",
        destination: `${COMMUNITY_API_URL}/api/communities/:path*`,
      },

      // Search service rewrites
      {
        source: "/api/search/:path*",
        destination: `${SEARCH_API_URL}/api/search/:path*`,
      },

      // Interaction service rewrites
      {
        source: "/api/interactions/:path*",
        destination: `${INTERACTION_API_URL}/:path*`,
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    // Production'da console.log'ları kaldır
    if (!dev && !isServer) {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
    return config;
  },
};

module.exports = nextConfig;
