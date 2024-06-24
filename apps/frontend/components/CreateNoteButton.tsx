"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function CreateNoteButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const create = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      setTitle("");
      setContent("");
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 bg-violet-600 hover:bg-violet-500 text-white"
      >
        <Plus className="w-4 h-4" />
        New Note
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4 space-y-3 w-full max-w-sm">
      <h3 className="text-sm font-semibold text-white">Create Note</h3>
      <Input
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-zinc-800 border-zinc-700"
      />
      <Textarea
        placeholder="Content (optional)..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-zinc-800 border-zinc-700 min-h-[80px]"
      />
      <div className="flex gap-2">
        <Button
          onClick={create}
          disabled={!title.trim() || loading}
          size="sm"
          className="bg-violet-600 hover:bg-violet-500 text-white"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
          Create
        </Button>
        <Button
          onClick={() => setOpen(false)}
          variant="ghost"
          size="sm"
          className="text-zinc-400"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
