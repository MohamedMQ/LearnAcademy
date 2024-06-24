"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  GraduationCap,
  Tag,
  BookOpenCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/modules", label: "Modules", icon: Layers },
  { href: "/admin/lessons", label: "Lessons", icon: GraduationCap },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-zinc-900/80 border-r border-zinc-800 min-h-screen px-4 py-6">
      <div className="flex items-center gap-2 mb-8 px-2">
        <BookOpenCheck className="w-6 h-6 text-violet-400" />
        <span className="font-bold text-white">Admin Panel</span>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href) && pathname !== "/admin";
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
