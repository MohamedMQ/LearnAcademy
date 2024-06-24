import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getLessons(token: string) {
  const res = await fetch(`${API_URL}/api/lessons?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminLessonsPage() {
  const session = await auth();
  const token = (session as any)?.accessToken;
  const lessons = await getLessons(token);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Lessons</h1>
        <Link href="/admin/lessons/new">
          <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-500 text-white">
            <Plus className="w-4 h-4" /> New Lesson
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="text-left px-4 py-3 text-zinc-400 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-zinc-400 font-medium">Module</th>
              <th className="text-left px-4 py-3 text-zinc-400 font-medium">Order</th>
              <th className="text-right px-4 py-3 text-zinc-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson: any) => (
              <tr key={lesson.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-white font-medium">{lesson.title}</td>
                <td className="px-4 py-3 text-zinc-400">{lesson.module?.title ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-400">{lesson.order}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/lessons/${lesson.id}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-white">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {lessons.length === 0 && (
          <div className="text-center py-12 text-zinc-500">No lessons yet.</div>
        )}
      </div>
    </div>
  );
}
