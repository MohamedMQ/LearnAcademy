"use client";

import { VideoPlayer } from "./VideoPlayer";
import { LessonCompleteButton } from "./LessonCompleteButton";
import { LessonSidebar } from "./LessonSidebar";

interface LessonPageContentProps {
  lesson: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    videoUrl?: string | null;
    content?: string | null;
    isCompleted: boolean;
    prevLesson: { slug: string; title: string } | null;
    nextLesson: { slug: string; title: string } | null;
    course: {
      id: string;
      title: string;
      slug: string;
      tier: string;
      modules: Array<{
        id: string;
        title: string;
        lessons: Array<{
          id: string;
          slug: string;
          title: string;
          isCompleted: boolean;
        }>;
      }>;
    };
  };
}

export function LessonPageContent({ lesson }: LessonPageContentProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-zinc-400">{lesson.description}</p>
          )}
        </div>

        {lesson.videoUrl && (
          <div className="mb-8">
            <VideoPlayer url={lesson.videoUrl} />
          </div>
        )}

        {lesson.content && (
          <div
            className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-a:text-violet-400 prose-code:text-fuchsia-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <LessonCompleteButton
            lessonId={lesson.id}
            isCompleted={lesson.isCompleted}
            lessonSlug={lesson.slug}
          />
        </div>
      </main>

      {/* Sidebar */}
      <LessonSidebar
        currentSlug={lesson.slug}
        modules={lesson.course.modules}
        prevLesson={lesson.prevLesson}
        nextLesson={lesson.nextLesson}
        courseSlug={lesson.course.slug}
        courseTitle={lesson.course.title}
      />
    </div>
  );
}
