"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface CourseEditorProps {
  course?: {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    tier?: string;
    thumbnail?: string;
    categoryId?: string;
    isFeatured?: boolean;
    isPublished?: boolean;
  };
  categories: Category[];
}

export function CourseEditor({ course, categories }: CourseEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [title, setTitle] = useState(course?.title ?? "");
  const [slug, setSlug] = useState(course?.slug ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [tier, setTier] = useState(course?.tier ?? "FREE");
  const [thumbnail, setThumbnail] = useState(course?.thumbnail ?? "");
  const [categoryId, setCategoryId] = useState(course?.categoryId ?? "");
  const [isFeatured, setIsFeatured] = useState(course?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState(course?.isPublished ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const autoSlug = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!course?.slug) setSlug(autoSlug(val));
  };

  const save = async () => {
    setLoading(true);
    setError("");
    try {
      const method = course?.id ? "PATCH" : "POST";
      const url = course?.id
        ? `${apiUrl}/api/courses/${course.id}`
        : `${apiUrl}/api/courses`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, slug, description, tier, thumbnail, categoryId: categoryId || undefined, isFeatured, isPublished }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Failed to save.");
        return;
      }
      router.push("/admin/courses");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Title</Label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Course title"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="course-slug"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-zinc-300">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course description..."
          className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Tier</Label>
          <Select value={tier} onValueChange={setTier}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              <SelectItem value="FREE">Free</SelectItem>
              <SelectItem value="PRO">Pro</SelectItem>
              <SelectItem value="ULTRA">Ultra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-zinc-300">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-zinc-300">Thumbnail URL</Label>
        <Input
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="https://..."
          className="bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          <Label className="text-zinc-300">Featured</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          <Label className="text-zinc-300">Published</Label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button
        onClick={save}
        disabled={loading || !title || !slug}
        className="gap-2 bg-violet-600 hover:bg-violet-500 text-white"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Course
      </Button>
    </div>
  );
}
