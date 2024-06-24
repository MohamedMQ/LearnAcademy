import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseHero } from "@/components/courses/CourseHero";
import { ModuleAccordion } from "@/components/courses/ModuleAccordion";
import { GatedFallback } from "@/components/courses/GatedFallback";
import { CourseCompleteButton } from "@/components/courses/CourseCompleteButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getCourse(slug: string, token?: string) {
  const res = await fetch(`${API_URL}/api/courses/${slug}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const token = (session as any)?.accessToken;
  const course = await getCourse(slug, token);

  if (!course) redirect("/courses");

  const userTier = (session as any)?.tier ?? "FREE";

  const tierOrder: Record<string, number> = { FREE: 0, PRO: 1, ULTRA: 2 };
  const hasTierAccess = !session
    ? course.tier === "FREE"
    : tierOrder[userTier] >= tierOrder[course.tier];

  return (
    <div className="min-h-screen bg-[#09090b]">
      <CourseHero
        title={course.title}
        description={course.description}
        tier={course.tier}
        thumbnail={course.thumbnail}
        moduleCount={course.moduleCount ?? course.modules?.length ?? 0}
        lessonCount={course.lessonCount ?? 0}
        isCompleted={course.isCompleted}
      />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {hasTierAccess ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                Course Content
              </h2>
              <ModuleAccordion
                modules={course.modules ?? []}
                userTier={userTier}
                courseTier={course.tier}
              />
            </div>

            {course.isCompleted !== undefined && (
              <div className="pt-4">
                <CourseCompleteButton
                  courseId={course.id}
                  isCompleted={course.isCompleted}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                Course Content
              </h2>
              <ModuleAccordion
                modules={course.modules ?? []}
                userTier={userTier}
                courseTier={course.tier}
              />
            </div>
            <GatedFallback requiredTier={course.tier} />
          </div>
        )}
      </div>
    </div>
  );
}
