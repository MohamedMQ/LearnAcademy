"use client";

import Link from "next/link";
import { CheckCircle2, Play, Lock, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { Tier } from "@/lib/constants";
import { hasTierAccess } from "@/lib/hooks/use-user-tier";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  isCompleted?: boolean;
}

interface Module {
  id: string;
  title: string;
  description?: string | null;
  lessons: Lesson[];
}

interface ModuleAccordionProps {
  modules: Module[];
  userTier: Tier;
  courseTier: Tier;
}

export function ModuleAccordion({ modules, userTier, courseTier }: ModuleAccordionProps) {
  const hasAccess = hasTierAccess(userTier, courseTier);

  return (
    <Accordion type="multiple" className="space-y-3" defaultValue={[modules[0]?.id]}>
      {modules.map((mod) => {
        const completedCount = mod.lessons.filter((l) => l.isCompleted).length;
        const progressPercent =
          mod.lessons.length > 0 ? (completedCount / mod.lessons.length) * 100 : 0;

        return (
          <AccordionItem
            key={mod.id}
            value={mod.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-0 overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-zinc-800/50">
              <div className="flex-1 text-left">
                <div className="font-semibold text-white text-sm">{mod.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {completedCount}/{mod.lessons.length} lessons completed
                </div>
                {progressPercent > 0 && (
                  <Progress value={progressPercent} className="h-1 mt-2 w-32 bg-zinc-700" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-0">
              <div className="divide-y divide-zinc-800">
                {mod.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 group">
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : hasAccess ? (
                      <Play className="w-4 h-4 text-zinc-600 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-zinc-600 shrink-0" />
                    )}

                    {hasAccess ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="flex-1 text-sm text-zinc-300 hover:text-white transition-colors"
                      >
                        {lesson.title}
                      </Link>
                    ) : (
                      <span className="flex-1 text-sm text-zinc-500">{lesson.title}</span>
                    )}

                    {hasAccess && (
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
