import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["react-leaflet", "leaflet"],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com', // ✅ IMDb (Amazon Media)
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // ✅ Google Profile Images
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // ✅ GitHub Profile Images
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.BACKEND_URL}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;