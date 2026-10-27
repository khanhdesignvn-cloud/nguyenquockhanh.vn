import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
import type { Metadata } from "next";
import "./bao-gia.css";

export const metadata: Metadata = {
  title: "Báo giá thiết kế nhận diện thương hiệu",
  description:
    "Chọn gói và hạng mục nhận diện thương hiệu, nhận báo giá tạm tính ngay, tải PDF hoặc gửi yêu cầu cho Khánh.",
};

// Giao diện trang chủ cũ (WordPress) được giữ nguyên làm trang /bao-gia.
const markup = fs.readFileSync(path.join(process.cwd(), "src/app/bao-gia/markup.html"), "utf8");

const cfg = `window.NQK_CFG={api:'/api.php',default:'/nqk-default.json',theme:'light'};
(function(){var t='light';try{t=localStorage.getItem('nqk-theme')||t}catch(e){}if(t==='light')document.documentElement.classList.add('nqk-light')})();`;

export default function BaoGiaPage() {
  return (
    <>
      <link rel="stylesheet" href="/nqk/nqk-btn.css" precedence="default" />
      <link rel="stylesheet" href="/nqk/nqk.css" precedence="default" />
      <link rel="stylesheet" href="/nqk/nqk-brief.css" precedence="default" />
      <script dangerouslySetInnerHTML={{ __html: cfg }} />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/nqk/nqk.js" strategy="afterInteractive" />
      <Script src="/nqk/nqk-brief.js" strategy="afterInteractive" />
    </>
  );
}
