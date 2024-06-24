import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getCategories(token: string) {
  const res = await fetch(`${API_URL}/api/categories`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminCategoriesPage() {
  const session = await auth();
  const token = (session as any)?.accessToken;
  const categories = await getCategories(token);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <Link href="/admin/categories/new">
          <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-500 text-white">
            <Plus className="w-4 h-4" /> New Category
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="text-left px-4 py-3 text-zinc-400 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-zinc-400 font-medium">Slug</th>
              <th className="text-right px-4 py-3 text-zinc-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-white font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-zinc-400">{cat.slug}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/categories/${cat.id}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-white">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-12 text-zinc-500">No categories yet.</div>
        )}
      </div>
    </div>
  );
}
