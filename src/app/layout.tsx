import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Nguyễn Quốc Khánh – Chuyên gia Nhận diện Thương hiệu",
    template: "%s | Nguyễn Quốc Khánh",
  },
  description:
    "Khóa học, podcast và kiến thức thực chiến về nhận diện thương hiệu từ chuyên gia Nguyễn Quốc Khánh. Xây dựng thương hiệu có bản sắc, có chiến lược, có kết quả.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink-950 text-foreground">
        <div className="gradient-mesh" aria-hidden="true" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
