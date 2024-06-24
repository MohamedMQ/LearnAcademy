import { auth } from "@/lib/auth";
import { ModuleEditor } from "@/components/admin/ModuleEditor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getCourses(token: string) {
  const res = await fetch(`${API_URL}/api/courses?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getModule(id: string, token: string) {
  if (id === "new") return null;
  const res = await fetch(`${API_URL}/api/modules/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ModuleEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const token = (session as any)?.accessToken;

  const [courses, mod] = await Promise.all([
    getCourses(token),
    getModule(id, token),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">
        {id === "new" ? "New Module" : "Edit Module"}
      </h1>
      <ModuleEditor module={mod ?? undefined} courses={courses} />
    </div>
  );
}
