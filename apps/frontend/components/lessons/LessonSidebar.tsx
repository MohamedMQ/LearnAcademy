import Link from "next/link";
import { CheckCircle2, Play, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonNav {
  slug: string;
  title: string;
}

interface SidebarLesson {
  id: string;
  slug: string;
  title: string;
  isCompleted?: boolean;
}

interface SidebarModule {
  id: string;
  title: string;
  lessons: SidebarLesson[];
}

interface LessonSidebarProps {
  currentSlug: string;
  modules: SidebarModule[];
  prevLesson: LessonNav | null;
  nextLesson: LessonNav | null;
  courseSlug: string;
  courseTitle: string;
}

export function LessonSidebar({
  currentSlug,
  modules,
  prevLesson,
  nextLesson,
  courseSlug,
  courseTitle,
}: LessonSidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="sticky top-6 space-y-4">
        {/* Course link */}
        <Link
          href={`/courses/${courseSlug}`}
          className="block text-xs text-zinc-500 hover:text-white transition-colors mb-2"
        >
          ← Back to {courseTitle}
        </Link>

        {/* Navigation */}
        <div className="flex gap-2">
          <Button
            asChild={!!prevLesson}
            disabled={!prevLesson}
            variant="outline"
            size="sm"
            className="flex-1 border-zinc-800 text-zinc-400 hover:text-white"
          >
            {prevLesson ? (
              <Link href={`/lessons/${prevLesson.slug}`}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Link>
            ) : (
              <span>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </span>
            )}
          </Button>
          <Button
            asChild={!!nextLesson}
            disabled={!nextLesson}
            variant="outline"
            size="sm"
            className="flex-1 border-zinc-800 text-zinc-400 hover:text-white"
          >
            {nextLesson ? (
              <Link href={`/lessons/${nextLesson.slug}`}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            ) : (
              <span>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            )}
          </Button>
        </div>

        {/* Lessons list */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800">
            <h3 className="text-sm font-semibold text-white">Course Content</h3>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {modules.map((mod) => (
              <div key={mod.id}>
                <div className="px-4 py-2.5 bg-zinc-800/50">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {mod.title}
                  </p>
                </div>
                {mod.lessons.map((lesson) => {
                  const isCurrent = lesson.slug === currentSlug;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.slug}`}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-zinc-800/50 last:border-0 ${
                        isCurrent
                          ? "bg-violet-500/10 text-violet-300"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                      }`}
                    >
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Play className="w-4 h-4 text-violet-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-zinc-600 shrink-0" />
                      )}
                      <span className="line-clamp-2">{lesson.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
