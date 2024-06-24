import { auth } from "@/lib/auth";
import { CategoryEditor } from "@/components/admin/CategoryEditor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getCategory(id: string, token: string) {
  if (id === "new") return null;
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function CategoryEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const token = (session as any)?.accessToken;
  const category = await getCategory(id, token);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">
        {id === "new" ? "New Category" : "Edit Category"}
      </h1>
      <CategoryEditor category={category ?? undefined} />
    </div>
  );
}
