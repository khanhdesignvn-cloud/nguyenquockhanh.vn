import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // cho phép máy chủ cũ (cPanel) lấy ảnh, font trang chủ để dùng chung
      { source: "/home/:path*", headers: [{ key: "Access-Control-Allow-Origin", value: "https://nguyenquockhanh.vn:2083" }] },
    ];
  },
  async rewrites() {
    return [
      { source: "/api.php", destination: "/api/nqk" },
      { source: "/branding", destination: "/branding/index.html" },
      { source: "/admin", destination: "/admin/index.html" },
    ];
  },
};

export default nextConfig;
