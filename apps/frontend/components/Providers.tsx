"use client";

import { SessionProvider } from "next-auth/react";
import { TutorProvider } from "@/components/tutor/TutorContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TutorProvider>{children}</TutorProvider>
    </SessionProvider>
  );
}
