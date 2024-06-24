"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { NoteCard } from "./NoteCard";

export type NoteStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETE";

interface Note {
  id: string;
  title: string;
  content?: string | null;
  status: NoteStatus;
  createdAt: string;
}

interface NotesListProps {
  initialNotes: Note[];
}

export function NotesList({ initialNotes }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const deleteNote = async (id: string) => {
    await fetch(`${apiUrl}/api/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateStatus = async (id: string, status: NoteStatus) => {
    const res = await fetch(`${apiUrl}/api/notes/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    }
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No notes yet. Create your first note to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={deleteNote}
          onStatusChange={updateStatus}
        />
      ))}
    </div>
  );
}
