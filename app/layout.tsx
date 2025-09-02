import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 从环境变量读取配置，提供默认值
const siteTitle = process.env.SITE_TITLE || "IP信息查询";
const siteDescription = process.env.SITE_DESCRIPTION || "IP信息查询";
const analyticsCode = process.env.ANALYTICS_CODE || "";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
        {/* 动态插入统计代码 */}
        {analyticsCode && (
          <div dangerouslySetInnerHTML={{ __html: analyticsCode }} />
        )}
      </body>
    </html>
  );
}
