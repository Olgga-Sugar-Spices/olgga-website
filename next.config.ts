import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jnuatrffwgopjtwfzzir.supabase.co",
      },
    ],
  },
};

export default nextConfig;
