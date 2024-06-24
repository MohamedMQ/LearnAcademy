import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CourseCard } from "@/components/courses/CourseCard";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getMyCourses(token: string) {
  const res = await fetch(`${API_URL}/api/courses/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const all = await res.json();
  return all.filter((c: any) => c.progress > 0 || c.isCompleted);
}

export default async function MyCoursesPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const token = (session as any)?.accessToken;
  const courses = await getMyCourses(token);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white gap-1">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">My Courses</h1>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses started yet</h3>
            <p className="text-zinc-400 mb-6">Start a lesson to track progress here.</p>
            <Link href="/courses">
              <Button className="bg-violet-600 hover:bg-violet-500 text-white">Browse Courses</Button>
            </Link>
          </div>
        ) : (
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
                <div className="px-1">
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(course.progress)}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
