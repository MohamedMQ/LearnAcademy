import { auth } from "@/lib/auth";
import { LessonEditor } from "@/components/admin/LessonEditor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getModules(token: string) {
  const res = await fetch(`${API_URL}/api/modules?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getLesson(id: string, token: string) {
  if (id === "new") return null;
  const res = await fetch(`${API_URL}/api/lessons/by-id/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function LessonEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const token = (session as any)?.accessToken;

  const [modules, lesson] = await Promise.all([
    getModules(token),
    getLesson(id, token),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">
        {id === "new" ? "New Lesson" : "Edit Lesson"}
      </h1>
      <LessonEditor lesson={lesson ?? undefined} modules={modules} />
    </div>
  );
}
