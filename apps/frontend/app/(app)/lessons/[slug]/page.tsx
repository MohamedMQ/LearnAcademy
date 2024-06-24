import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LessonPageContent } from "@/components/lessons/LessonPageContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getLesson(slug: string, token: string) {
  const res = await fetch(`${API_URL}/api/lessons/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!session) redirect("/auth/login");

  const token = (session as any)?.accessToken;
  const lesson = await getLesson(slug, token);

  if (!lesson) redirect("/courses");

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <LessonPageContent lesson={lesson} />
      </div>
    </div>
  );
}
