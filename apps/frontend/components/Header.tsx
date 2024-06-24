"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, LayoutDashboard, LogOut, User, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserTier } from "@/lib/hooks/use-user-tier";
import { TIER_STYLES } from "@/lib/constants";

export function Header() {
  const { data: session, status } = useSession();
  const tier = useUserTier();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="relative z-20 px-6 lg:px-12 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg text-white">LearnAcademy</span>
      </Link>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/courses" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Courses
        </Link>
        {session && (
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
        )}
        <Link
          href="/pricing"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Pricing
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        )}
      </nav>

      {/* Auth */}
      <div className="flex items-center gap-3">
        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
        ) : session ? (
          <>
            {tier !== "FREE" && (
              <span
                className={`hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${TIER_STYLES[tier].border} ${TIER_STYLES[tier].text}`}
              >
                <Crown className="w-3 h-3" />
                {tier}
              </span>
            )}
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-zinc-400 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-500 text-white border-0"
              >
                Get Started
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
