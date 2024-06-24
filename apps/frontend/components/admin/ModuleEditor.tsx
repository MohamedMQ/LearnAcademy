"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";

interface Course {
  id: string;
  title: string;
}

interface ModuleEditorProps {
  module?: {
    id?: string;
    title?: string;
    order?: number;
    courseId?: string;
  };
  courses: Course[];
}

export function ModuleEditor({ module, courses }: ModuleEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [title, setTitle] = useState(module?.title ?? "");
  const [order, setOrder] = useState(module?.order?.toString() ?? "1");
  const [courseId, setCourseId] = useState(module?.courseId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setLoading(true);
    setError("");
    try {
      const method = module?.id ? "PATCH" : "POST";
      const url = module?.id
        ? `${apiUrl}/api/modules/${module.id}`
        : `${apiUrl}/api/modules`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, order: Number(order), courseId: courseId || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Failed to save.");
        return;
      }
      router.push("/admin/modules");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <div className="space-y-1.5">
        <Label className="text-zinc-300">Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Module title"
          className="bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Course</Label>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-zinc-300">Order</Label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            min="1"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button
        onClick={save}
        disabled={loading || !title}
        className="gap-2 bg-violet-600 hover:bg-violet-500 text-white"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Module
      </Button>
    </div>
  );
}
