"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Module {
  id: string;
  title: string;
}

interface LessonEditorProps {
  lesson?: {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    videoUrl?: string;
    content?: string;
    order?: number;
    moduleId?: string;
  };
  modules: Module[];
}

export function LessonEditor({ lesson, modules }: LessonEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [title, setTitle] = useState(lesson?.title ?? "");
  const [slug, setSlug] = useState(lesson?.slug ?? "");
  const [description, setDescription] = useState(lesson?.description ?? "");
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl ?? "");
  const [order, setOrder] = useState(lesson?.order?.toString() ?? "1");
  const [moduleId, setModuleId] = useState(lesson?.moduleId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: lesson?.content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-zinc-200",
      },
    },
  });

  const autoSlug = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!lesson?.slug) setSlug(autoSlug(val));
  };

  const save = async () => {
    setLoading(true);
    setError("");
    try {
      const content = editor?.getHTML() ?? "";
      const method = lesson?.id ? "PATCH" : "POST";
      const url = lesson?.id
        ? `${apiUrl}/api/lessons/${lesson.id}`
        : `${apiUrl}/api/lessons`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          videoUrl: videoUrl || undefined,
          content,
          order: Number(order),
          moduleId: moduleId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Failed to save.");
        return;
      }
      router.push("/admin/lessons");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Title</Label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Lesson title"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="lesson-slug"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-zinc-300">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description..."
          className="bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-zinc-300">Video URL (YouTube, Vimeo, or direct)</Label>
        <Input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-zinc-300">Module</Label>
          <Select value={moduleId} onValueChange={setModuleId}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              {modules.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
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

      {/* Tiptap Editor */}
      <div className="space-y-1.5">
        <Label className="text-zinc-300">Content</Label>
        {/* Toolbar */}
        {editor && (
          <div className="flex flex-wrap gap-1 p-2 bg-zinc-800 rounded-t-lg border border-zinc-700 border-b-0">
            {[
              { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
              { label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
              { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
              { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
              { label: "• List", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
              { label: "1. List", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
              { label: "</> Code", action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
            ].map(({ label, action, active }) => (
              <button
                key={label}
                onClick={action}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  active
                    ? "bg-violet-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-700"
                }`}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div className="bg-zinc-800 rounded-b-lg border border-zinc-700">
          <EditorContent editor={editor} />
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
        Save Lesson
      </Button>
    </div>
  );
}
