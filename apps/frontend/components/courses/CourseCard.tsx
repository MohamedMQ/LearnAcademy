"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, Play, Layers, CheckCircle2 } from "lucide-react";
import { TIER_STYLES, type Tier } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";

export interface CourseCardProps {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  tier: Tier;
  thumbnail?: string | null;
  moduleCount?: number;
  lessonCount?: number;
  completedLessonCount?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  showProgress?: boolean;
  href?: string;
}

export function CourseCard({
  slug,
  href,
  title,
  description,
  tier,
  thumbnail,
  moduleCount,
  lessonCount,
  completedLessonCount = 0,
  isCompleted = false,
  isLocked = false,
  showProgress = false,
}: CourseCardProps) {
  const styles = TIER_STYLES[tier];
  const totalLessons = lessonCount ?? 0;
  const completed = completedLessonCount ?? 0;
  const progressPercent = totalLessons > 0 ? (completed / totalLessons) * 100 : 0;
  const linkHref = href ?? `/courses/${slug}`;

  return (
    <Link href={linkHref} className="group block">
      <div className="relative rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5">
        {/* Thumbnail */}
        <div
          className={`h-36 bg-gradient-to-br ${styles.gradient} flex items-center justify-center relative overflow-hidden`}
        >
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-6xl opacity-50">📚</div>
          )}
          <div className="absolute inset-0 bg-black/20" />

          {isCompleted ? (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/90 text-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </div>
          ) : (
            <div
              className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${styles.badge}`}
            >
              {isLocked && <Lock className="w-3 h-3" />}
              {tier}
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm mb-1.5 line-clamp-2 group-hover:text-violet-300 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{description}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            {moduleCount !== undefined && (
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {moduleCount} {moduleCount === 1 ? "module" : "modules"}
              </span>
            )}
            {lessonCount !== undefined && (
              <span className="flex items-center gap-1">
                <Play className="w-3.5 h-3.5" />
                {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
              </span>
            )}
          </div>

          {showProgress && totalLessons > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                <span>{completed}/{totalLessons} lessons</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <Progress
                value={progressPercent}
                className={`h-1.5 bg-zinc-800 [&>div]:${styles.gradient}`}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
