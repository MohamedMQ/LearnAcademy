"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";

interface CategoryEditorProps {
  category?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  };
}

export function CategoryEditor({ category }: CategoryEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const autoSlug = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!category?.slug) setSlug(autoSlug(val));
  };

  const save = async () => {
    setLoading(true);
    setError("");
    try {
      const method = category?.id ? "PATCH" : "POST";
      const url = category?.id
        ? `${apiUrl}/api/categories/${category.id}`
        : `${apiUrl}/api/categories`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, slug, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Failed to save.");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Name</Label>
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Category name"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="category-slug"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-zinc-300">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category description..."
          className="bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button
        onClick={save}
        disabled={loading || !name || !slug}
        className="gap-2 bg-violet-600 hover:bg-violet-500 text-white"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Category
      </Button>
    </div>
  );
}
