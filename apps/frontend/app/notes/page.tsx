import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NotesList } from "@/components/NotesList";
import { CreateNoteButton } from "@/components/CreateNoteButton";
import { StickyNote } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getNotes(token: string) {
  const res = await fetch(`${API_URL}/api/notes`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function NotesPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const token = (session as any)?.accessToken;
  const notes = await getNotes(token);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Notes</h1>
              <p className="text-xs text-zinc-500">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <CreateNoteButton />
        </div>

        <NotesList initialNotes={notes} />
      </div>
    </div>
  );
}
