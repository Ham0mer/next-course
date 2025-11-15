import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { strEnv } from "@/lib/env";
import { inter } from "@/lib/fonts";
import PWAInstaller from "@/components/pwa_installer";
import { Navbar } from "@/components/navbar";

const siteTitle = strEnv(
  "NEXT_PUBLIC_SITE_TITLE",
  "网课查询平台 - 综合网课课程信息查询",
);
const siteDescription = strEnv(
  "NEXT_PUBLIC_SITE_DESCRIPTION",
  "🎓 便捷的网课课程查询工具，支持手机号和用户名查询，查看课程进度、完成状态等详细信息。",
);
const siteKeywords = strEnv(
  "NEXT_PUBLIC_SITE_KEYWORDS",
  "网课查询, 课程查询, 学习进度, 在线教育, 学习通",
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="tags" content={siteKeywords} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Toaster />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PWAInstaller
          manifest-url="/manifest.json"
          name="网课课程查询"
          description="🎓 便捷的网课课程查询工具，支持手机号和用户名查询，查看课程进度、完成状态等详细信息。"
        />
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-dot-pattern opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>
        <div className={cn(`relative w-full min-h-screen`, inter.className)}>
          <Navbar />
          <main className="pt-16">
            <Component {...pageProps} />
          </main>
        </div>
      </ThemeProvider>
    </>
  );
}
