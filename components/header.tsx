"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";

interface HeaderProps {
  user: any;
}

interface NavItem {
  label: string;
  href: string;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // 沟通大师主导航项
  const mainNavItems: NavItem[] = [
    { label: "首页", href: "/" },
    { label: "AI练习", href: "/communication/ai-practice" },
    { label: "评估", href: "/communication/assessment" },
    { label: "知识", href: "/communication/knowledge" },
    { label: "进度", href: "/communication/progress" },
    { label: "设置", href: "/communication/settings" },
    { label: "定价", href: "/pricing" },
    { label: "关于我们", href: "/product/about" },
  ];

  // Dashboard items - empty array as we don't want navigation items in dashboard
  const dashboardItems: NavItem[] = [];

  // Choose which navigation items to show
  const navItems = isDashboard ? dashboardItems : mainNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isDashboard && (
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {user.email}
                </span>
              )}
              {!isDashboard && (
                <>
                  <Button asChild size="sm" variant="default">
                    <Link href="/profile">个人中心</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/dashboard">仪表盘</Link>
                  </Button>
                </>
              )}
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  退出
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button asChild size="sm" variant="outline">
                  <Link href="/sign-in">登录</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">注册</Link>
                </Button>
            </div>
          )}
          <MobileNav items={navItems} user={user} isDashboard={isDashboard} />
        </div>
      </div>
    </header>
  );
}
