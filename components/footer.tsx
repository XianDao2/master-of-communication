"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { Github } from "lucide-react";
import { usePathname } from "next/navigation";

const footerLinks = [
  {
    title: "产品",
    links: [
      { label: "功能特性", href: "/#features" },
      { label: "定价方案", href: "/#pricing" },
    ],
  },
  {
    title: "公司",
    links: [
      { label: "关于我们", href: "/about" },
      { label: "博客", href: "#blog" },
    ],
  },
  {
    title: "法律",
    links: [
      { label: "隐私政策", href: "/privacy" },
      { label: "服务条款", href: "/terms" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              由 
              <Link
                href="https://Raphael.app"
                className="font-medium underline underline-offset-4"
              >
                Raphael Starter
              </Link>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-full lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              沟通大师帮助你通过AI驱动的工具和个性化学习计划，有效提升沟通能力和技巧。
            </p>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">{group.title}</h3>
                <nav className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            由 
            <Link href="#" className="font-medium underline underline-offset-4">
              Raphael Starter
            </Link>
            开发
          </p>
        </div>
      </div>
    </footer>
  );
}
