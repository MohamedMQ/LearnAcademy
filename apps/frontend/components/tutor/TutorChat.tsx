"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TutorMessages } from "./TutorMessages";
import { useSession } from "next-auth/react";

export function TutorChat() {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`,
    headers: {
      Authorization: `Bearer ${(session as any)?.accessToken ?? ""}`,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm your AI learning assistant. I can help you find courses, explain concepts, and guide your learning journey. What would you like to learn today?",
      },
    ],
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <TutorMessages messages={messages as any} />
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
              <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
            </div>
            <div className="bg-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything about learning..."
            className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-500/50"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-cyan-600 hover:bg-cyan-500 text-white shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
