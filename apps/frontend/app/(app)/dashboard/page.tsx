import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CourseCard } from "@/components/courses/CourseCard";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getDashboardCourses(token: string) {
  const res = await fetch(`${API_URL}/api/courses/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const token = (session as any)?.accessToken;
  const courses = await getDashboardCourses(token);

  const completedCount = courses.filter((c: any) => c.isCompleted).length;
  const inProgressCount = courses.filter((c: any) => !c.isCompleted && c.progress > 0).length;

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {(session as any)?.name ?? "learner"}!
          </h1>
          <p className="text-zinc-400">Track your learning progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: "All Courses", value: courses.length, icon: BookOpen, color: "text-violet-400" },
            { label: "In Progress", value: inProgressCount, icon: ArrowRight, color: "text-amber-400" },
            { label: "Completed", value: completedCount, icon: Trophy, color: "text-emerald-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Courses */}
        {courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
            <p className="text-zinc-400 mb-6">Start learning by exploring our course catalog.</p>
            <Link href="/courses">
              <Button className="bg-violet-600 hover:bg-violet-500 text-white">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">All Courses</h2>
              <Link href="/dashboard/courses">
                <Button variant="ghost" className="text-zinc-400 hover:text-white gap-1">
                  My Courses <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course: any) => (
                <div key={course.id} className="space-y-2">
                  <CourseCard
                    id={course.id}
                    slug={course.slug}
                    title={course.title}
                    description={course.description}
                    tier={course.tier}
                    thumbnail={course.thumbnail}
                    moduleCount={course.moduleCount}
                    lessonCount={course.lessonCount}
                    isCompleted={course.isCompleted}
                  />
                  {course.progress > 0 && (
                    <div className="px-1">
                      <div className="flex justify-between text-xs text-zinc-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(course.progress)}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
