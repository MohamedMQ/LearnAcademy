import { auth } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, Layers, GraduationCap, Tag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getStats(token: string) {
  const res = await fetch(`${API_URL}/api/courses/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return {};
  return res.json();
}

export default async function AdminDashboard() {
  const session = await auth();
  const token = (session as any)?.accessToken;
  const stats = await getStats(token);

  const cards = [
    { label: "Courses", value: stats.courseCount ?? 0, icon: BookOpen, href: "/admin/courses", color: "text-violet-400" },
    { label: "Modules", value: stats.moduleCount ?? 0, icon: Layers, href: "/admin/modules", color: "text-fuchsia-400" },
    { label: "Lessons", value: stats.lessonCount ?? 0, icon: GraduationCap, href: "/admin/lessons", color: "text-cyan-400" },
    { label: "Categories", value: stats.categoryCount ?? 0, icon: Tag, href: "/admin/categories", color: "text-amber-400" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Overview</h1>
        <p className="text-zinc-500">Content management dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors"
          >
            <Icon className={`w-8 h-8 ${color} mb-3`} />
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-zinc-400">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/courses/new">
            <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-500 text-white">
              <Plus className="w-4 h-4" /> New Course
            </Button>
          </Link>
          <Link href="/admin/lessons/new">
            <Button size="sm" variant="outline" className="gap-2 border-zinc-700 text-zinc-300">
              <Plus className="w-4 h-4" /> New Lesson
            </Button>
          </Link>
          <Link href="/admin/categories/new">
            <Button size="sm" variant="outline" className="gap-2 border-zinc-700 text-zinc-300">
              <Plus className="w-4 h-4" /> New Category
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
