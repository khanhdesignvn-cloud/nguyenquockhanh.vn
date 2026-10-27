import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api.php", destination: "/api/nqk" },
      { source: "/branding", destination: "/branding/index.html" },
    ];
  },
};

export default nextConfig;
