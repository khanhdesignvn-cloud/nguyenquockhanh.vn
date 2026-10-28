import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nguyenquockhanh.vn"),
  title: {
    default: "Nguyễn Quốc Khánh – Người kể chuyện thương hiệu",
    template: "%s | Nguyễn Quốc Khánh",
  },
  description:
    "Nguyễn Quốc Khánh, Giám đốc sáng tạo Horus Agency: tư vấn và thiết kế nhận diện thương hiệu, logo, bao bì, website cho doanh nghiệp Việt.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnam.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
