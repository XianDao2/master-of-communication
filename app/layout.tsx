import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const baseUrl = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: "沟通大师 - 提升沟通能力的专业平台",
  description: "沟通大师帮助你通过AI驱动的工具、个性化学习计划和实践反馈，有效提升沟通能力和技巧。",
  keywords: "沟通技巧,沟通能力提升,有效沟通,职场沟通,人际关系,沟通训练",
  icons: {
    icon: "/images/lgo.png",
    shortcut: "/images/lgo.png",
  },
  openGraph: {
    title: "沟通大师 - 提升沟通能力的专业平台",
    description: "沟通大师帮助你通过AI驱动的工具、个性化学习计划和实践反馈，有效提升沟通能力和技巧。",
    type: "website",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "沟通大师 - 提升沟通能力的专业平台",
    description: "沟通大师帮助你有效提升沟通能力和技巧。",
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <Header user={user} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
