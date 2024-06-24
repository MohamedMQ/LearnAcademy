"use client";

import { useState } from "react";
import { MoreVertical, Trash2, Edit3, CheckCircle2, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NoteStatus } from "./NotesList";

const STATUS_STYLES: Record<NoteStatus, { label: string; color: string; icon: React.ReactNode }> = {
  DRAFT: {
    label: "Draft",
    color: "text-zinc-400 border-zinc-600",
    icon: <FileText className="w-3.5 h-3.5" />,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-amber-400 border-amber-500/40",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  COMPLETE: {
    label: "Complete",
    color: "text-emerald-400 border-emerald-500/40",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

interface Note {
  id: string;
  title: string;
  content?: string | null;
  status: NoteStatus;
  createdAt: string;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: NoteStatus) => void;
}

export function NoteCard({ note, onDelete, onStatusChange }: NoteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const style = STATUS_STYLES[note.status];
  const statuses: NoteStatus[] = ["DRAFT", "IN_PROGRESS", "COMPLETE"];

  return (
    <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors group">
      {/* Status badge */}
      <div className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded-full px-2.5 py-0.5 mb-3 ${style.color}`}>
        {style.icon}
        {style.label}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-white text-sm mb-2">{note.title}</h3>

      {/* Content */}
      {note.content && (
        <p className="text-xs text-zinc-500 line-clamp-3">{note.content}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-zinc-600">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>

        {/* Actions */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 bottom-8 z-10 w-44 rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg overflow-hidden">
              <div className="p-1">
                <p className="text-xs text-zinc-500 px-3 py-1.5">Change status</p>
                {statuses
                  .filter((s) => s !== note.status)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        onStatusChange(note.id, s);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
                    >
                      {STATUS_STYLES[s].icon}
                      {STATUS_STYLES[s].label}
                    </button>
                  ))}
                <div className="border-t border-zinc-800 my-1" />
                <button
                  onClick={() => {
                    onDelete(note.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
