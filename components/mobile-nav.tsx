"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

interface MobileNavProps {
  items: { label: string; href: string }[];
  user: any;
  isDashboard: boolean;
}

export function MobileNav({ items, user, isDashboard }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          {/* 已移除Pronunciation链接 */}
          
          {/* Ensure Communication links are always available */}
          {!items.some(item => item.href === '/communication') && (
            <Link
              href="/communication"
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              沟通
            </Link>
          )}
          {!items.some(item => item.href === '/communication/ai-practice') && (
            <Link
              href="/communication/ai-practice"
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary ml-4"
            >
              AI练习
            </Link>
          )}
          {!items.some(item => item.href === '/communication/assessment') && (
            <Link
              href="/communication/assessment"
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary ml-4"
            >
              评估
            </Link>
          )}
          {!items.some(item => item.href === '/communication/knowledge') && (
            <Link
              href="/communication/knowledge"
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary ml-4"
            >
              知识
            </Link>
          )}
          {!items.some(item => item.href === '/communication/progress') && (
            <Link
              href="/communication/progress"
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary ml-4"
            >
              进度
            </Link>
          )}
          {!items.some(item => item.href === '/communication/settings') && (
            <Link
              href="/communication/settings"
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary ml-4"
            >
              设置
            </Link>
          )}
        </nav>
        <div className="mt-auto pt-4 border-t">
          {user ? (
            <div className="flex flex-col gap-2">
              {user.email && (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
              {!isDashboard && (
                <>
                  <Button asChild variant="default" className="w-full">
                    <Link href="/profile">Profile</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </>
              )}
              <form action={signOutAction} className="w-full">
                <Button type="submit" variant="outline" className="w-full">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild variant="default" className="w-full">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
