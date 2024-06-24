import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";
import {
  ArrowRight,
  Play,
  BookOpen,
  Code2,
  Rocket,
  Crown,
  CheckCircle2,
  Star,
  Users,
  Trophy,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { auth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getFeaturedCourses() {
  try {
    const res = await fetch(`${API_URL}/api/courses?featured=true&published=true`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const courses = await res.json();
    return courses.slice(0, 6);
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const res = await fetch(`${API_URL}/api/courses/stats`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return { courseCount: 0, lessonCount: 0 };
    return res.json();
  } catch {
    return { courseCount: 0, lessonCount: 0 };
  }
}

export default async function Home() {
  const [courses, stats, session] = await Promise.all([
    getFeaturedCourses(),
    getStats(),
    auth(),
  ]);

  const isSignedIn = !!session;

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-16 pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">
              Learn to code with real-world projects
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="block text-white">Master coding</span>
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              the modern way
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Join LearnAcademy and learn from expertly crafted courses, modules, and hands-on
            lessons. From free fundamentals to{" "}
            <span className="text-fuchsia-400">Pro exclusives</span> and{" "}
            <span className="text-cyan-400">Ultra gems</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 bg-violet-600 hover:bg-violet-500 text-white border-0 px-8">
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 bg-violet-600 hover:bg-violet-500 text-white border-0 px-8">
                  Start Learning Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
            <Link href="/courses">
              <Button size="lg" variant="outline" className="gap-2 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500">
                <Play className="w-4 h-4" />
                Browse Courses
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-14 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: BookOpen, value: stats.courseCount, label: "Courses" },
              { icon: Code2, value: stats.lessonCount, label: "Lessons" },
              { icon: Users, value: "1,200+", label: "Students" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-2xl font-bold text-white">
                  <Icon className="w-5 h-5 text-violet-400" />
                  {value}
                </div>
                <span className="text-xs text-zinc-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="relative z-10 px-6 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
            <p className="text-zinc-500">Handpicked courses to accelerate your learning</p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="text-zinc-400 hover:text-white gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course: any) => (
            <CourseCard
              key={course.id}
              id={course.id}
              slug={course.slug}
              title={course.title}
              description={course.description}
              tier={course.tier}
              thumbnail={course.thumbnail}
              moduleCount={course.moduleCount}
              lessonCount={course.lessonCount}
            />
          ))}
        </div>
      </section>

      {/* Tier showcase */}
      <section className="relative z-10 px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Choose Your Path</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            From free fundamentals to AI-powered learning — find the plan that fits your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Free",
              color: "emerald",
              gradient: "from-emerald-500 to-teal-600",
              icon: <BookOpen className="w-6 h-6" />,
              features: ["Foundational courses", "Community Discord", "Basic projects", "Email support"],
            },
            {
              name: "Pro",
              color: "violet",
              gradient: "from-violet-500 to-fuchsia-600",
              icon: <Rocket className="w-6 h-6" />,
              features: ["All Pro courses", "Advanced projects", "Priority support", "Certificates"],
              popular: true,
            },
            {
              name: "Ultra",
              color: "cyan",
              gradient: "from-cyan-400 to-blue-600",
              icon: <Crown className="w-6 h-6" />,
              features: ["AI Learning Assistant", "Ultra-only content", "1-on-1 mentoring", "Private Discord"],
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border ${
                tier.popular ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : "border-zinc-800"
              } bg-zinc-900/50 p-6`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold">
                  <Star className="w-3 h-3" /> Most Popular
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-white mb-4`}>
                {tier.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{tier.name}</h3>
              <ul className="space-y-2.5 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <CheckCircle2 className={`w-4 h-4 text-${tier.color}-400 shrink-0`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing">
                <Button
                  className={`w-full bg-gradient-to-r ${tier.gradient} text-white border-0 hover:opacity-90`}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Get {tier.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 px-6 py-8 text-center">
        <p className="text-sm text-zinc-600">
          © {new Date().getFullYear()} LearnAcademy. Built with Next.js & NestJS.
        </p>
      </footer>
    </div>
  );
}
