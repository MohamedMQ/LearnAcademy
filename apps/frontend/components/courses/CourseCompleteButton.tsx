"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CourseCompleteButtonProps {
  courseId: string;
  isCompleted: boolean;
}

export function CourseCompleteButton({ courseId, isCompleted }: CourseCompleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const { data: session } = useSession();
  const router = useRouter();

  const toggle = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${(session as any).accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setCompleted(data.completed);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={toggle}
      disabled={loading}
      variant={completed ? "outline" : "default"}
      className={
        completed
          ? "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
          : "bg-violet-600 hover:bg-violet-500 text-white"
      }
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : completed ? (
        <>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Completed
        </>
      ) : (
        "Mark Complete"
      )}
    </Button>
  );
}
