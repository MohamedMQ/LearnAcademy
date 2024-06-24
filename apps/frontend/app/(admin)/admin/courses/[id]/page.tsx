import { auth } from "@/lib/auth";
import { CourseEditor } from "@/components/admin/CourseEditor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getCategories(token: string) {
  const res = await fetch(`${API_URL}/api/categories`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getCourse(id: string, token: string) {
  if (id === "new") return null;
  const res = await fetch(`${API_URL}/api/courses/by-id/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function CourseEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const token = (session as any)?.accessToken;

  const [categories, course] = await Promise.all([
    getCategories(token),
    getCourse(id, token),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">
        {id === "new" ? "New Course" : "Edit Course"}
      </h1>
      <CourseEditor course={course ?? undefined} categories={categories} />
    </div>
  );
}
