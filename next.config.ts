import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "dxzwkppesxirrhmgoguk.supabase.co",
      },
    ],
  },
};

export default nextConfig;