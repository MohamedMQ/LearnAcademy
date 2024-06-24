"use client";

import { Bot, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorChat } from "./TutorChat";
import { useTutor } from "./TutorContext";
import { useUserTier } from "@/lib/hooks/use-user-tier";
import Link from "next/link";

export function TutorWidget() {
  const { isOpen, toggle, close } = useTutor();
  const tier = useUserTier();

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] md:w-[420px] h-[520px] rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-gradient-to-r from-cyan-600/20 to-blue-600/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Tutor</p>
                <p className="text-xs text-cyan-400">Powered by Gemini</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={close}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          {tier === "ULTRA" ? (
            <TutorChat />
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Ultra Feature</h3>
                <p className="text-zinc-400 text-sm">
                  The AI Tutor is available exclusively for Ultra plan members.
                </p>
              </div>
              <Link href="/pricing">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:opacity-90">
                  Upgrade to Ultra
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 hover:scale-110 transition-transform"
        aria-label="Toggle AI Tutor"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
      </button>
    </>
  );
}
