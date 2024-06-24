import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const TIER_COLORS: Record<string, string> = {
  FREE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  PRO: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  ULTRA: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

async function getCourses(token: string) {
  const res = await fetch(`${API_URL}/api/courses?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminCoursesPage() {
  const session = await auth();
  const token = (session as any)?.accessToken;
  const courses = await getCourses(token);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <Link href="/admin/courses/new">
          <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-500 text-white">
            <Plus className="w-4 h-4" /> New Course
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="text-left px-4 py-3 text-zinc-400 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-zinc-400 font-medium">Tier</th>
              <th className="text-left px-4 py-3 text-zinc-400 font-medium">Status</th>
              <th className="text-right px-4 py-3 text-zinc-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course: any) => (
              <tr key={course.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 text-white font-medium">{course.title}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${TIER_COLORS[course.tier] ?? ""}`}>
                    {course.tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                    course.isPublished
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-zinc-700/30 text-zinc-500 border-zinc-700"
                  }`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/courses/${course.id}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-white">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div className="text-center py-12 text-zinc-500">No courses yet.</div>
        )}
      </div>
    </div>
  );
}
