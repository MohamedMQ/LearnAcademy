import { TIER_STYLES, type Tier } from "@/lib/constants";
import { BookOpen, Layers, Play } from "lucide-react";

interface CourseHeroProps {
  title: string;
  description?: string | null;
  tier: Tier;
  thumbnail?: string | null;
  moduleCount: number;
  lessonCount: number;
  isCompleted?: boolean;
  category?: { title: string; icon?: string | null } | null;
}

export function CourseHero({
  title,
  description,
  tier,
  moduleCount,
  lessonCount,
  isCompleted,
  category,
}: CourseHeroProps) {
  const styles = TIER_STYLES[tier];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.gradient} p-8 md:p-12 mb-8`}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          {category && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white">
              {category.title}
            </span>
          )}
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white uppercase">
            {tier.charAt(0) + tier.slice(1).toLowerCase()}
          </span>
          {isCompleted && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/80 text-white uppercase">
              Completed
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-white/80 text-base max-w-2xl mb-6">
            {description}
          </p>
        )}
        <div className="flex items-center gap-5 text-white/70 text-sm">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            {moduleCount} {moduleCount === 1 ? "module" : "modules"}
          </span>
          <span className="flex items-center gap-1.5">
            <Play className="w-4 h-4" />
            {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
          </span>
        </div>
      </div>
    </div>
  );
}
