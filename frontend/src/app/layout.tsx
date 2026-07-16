import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "培英 AI 行政平台",
  description: "培英中學 AI 數智化行政平台 — 文件智能歸檔、租務管理、掃描件處理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className="h-full">
      <body className="min-h-full">
        {/* Skip-to-content link for keyboard users */}
        <a href="#main-content" className="skip-to-content">
          跳到主要內容
        </a>

        <AntdRegistry>
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}
