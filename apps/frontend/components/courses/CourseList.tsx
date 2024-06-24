"use client";

import { useState } from "react";
import { CourseCard, type CourseCardProps } from "./CourseCard";
import { TierFilterTabs } from "./TierFilterTabs";
import type { Tier } from "@/lib/constants";

interface CourseListProps {
  courses: CourseCardProps[];
  showFilter?: boolean;
  showProgress?: boolean;
  lockedTiers?: Tier[];
}

export function CourseList({
  courses,
  showFilter = true,
  showProgress = false,
  lockedTiers = [],
}: CourseListProps) {
  const [activeTier, setActiveTier] = useState<Tier | "ALL">("ALL");

  const filtered =
    activeTier === "ALL" ? courses : courses.filter((c) => c.tier === activeTier);

  return (
    <div>
      {showFilter && (
        <TierFilterTabs activeTier={activeTier} onChange={setActiveTier} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course) => (
          <CourseCard
            key={course.id}
            {...course}
            isLocked={lockedTiers.includes(course.tier)}
            showProgress={showProgress}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-zinc-500 py-12">
            No courses found for this tier.
          </p>
        )}
      </div>
    </div>
  );
}
