import { CourseList } from "@/components/courses/CourseList";
import { TierFilterTabs } from "@/components/courses/TierFilterTabs";
import type { Tier } from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getCourses(tier?: string) {
  const params = new URLSearchParams({ published: "true", limit: "100" });
  if (tier && tier !== "ALL") params.set("tier", tier);
  const res = await fetch(`${API_URL}/api/courses?${params}`, {
    next: { revalidate: 120 },
  });
  if (!res.ok) return [];
  return res.json();
}

async function getCategories() {
  const res = await fetch(`${API_URL}/api/categories`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const tier = resolvedSearchParams.tier;
  const selectedTier: Tier | "ALL" =
    tier === "FREE" || tier === "PRO" || tier === "ULTRA" ? tier : "ALL";
  const [courses, categories] = await Promise.all([
    getCourses(selectedTier),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">All Courses</h1>
          <p className="text-zinc-400">
            Explore our library of {courses.length} courses
          </p>
        </div>

        <TierFilterTabs selectedTier={selectedTier} />

        <div className="mt-8">
          <CourseList courses={courses} />
        </div>
      </div>
    </div>
  );
}
