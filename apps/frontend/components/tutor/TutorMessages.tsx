"use client";

import ReactMarkdown from "react-markdown";
import { Bot, User, Search } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  parts?: Array<{ type: string; toolName?: string }>;
}

export function TutorMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "user"
                ? "bg-violet-600"
                : "bg-gradient-to-br from-cyan-500 to-blue-600"
            }`}
          >
            {msg.role === "user" ? (
              <User className="w-3.5 h-3.5 text-white" />
            ) : (
              <Bot className="w-3.5 h-3.5 text-white" />
            )}
          </div>

          <div
            className={`flex-1 rounded-xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "bg-violet-600/20 text-white ml-8"
                : "bg-zinc-800 text-zinc-200 mr-8"
            }`}
          >
            {/* Tool call indicator */}
            {msg.parts?.some((p) => p.type === "tool-invocation" && p.toolName === "searchCourses") && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 mb-2">
                <Search className="w-3.5 h-3.5 animate-pulse" />
                Searching courses...
              </div>
            )}

            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-violet-400 hover:text-violet-300 underline"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="bg-zinc-900 text-fuchsia-300 px-1.5 py-0.5 rounded text-xs">
                    {children}
                  </code>
                ),
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
