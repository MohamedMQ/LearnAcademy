"use client";

import { useSession } from "next-auth/react";
import type { Tier } from "@/lib/constants";

export function useUserTier(): Tier {
  const { data: session } = useSession();
  const tier = (session?.user as any)?.tier as Tier | undefined;
  return tier ?? "FREE";
}

export function useUserRole(): string {
  const { data: session } = useSession();
  return (session?.user as any)?.role ?? "USER";
}

export function hasTierAccess(userTier: Tier, contentTier: Tier | null | undefined): boolean {
  if (!contentTier || contentTier === "FREE") return true;

  const tierOrder: Record<Tier, number> = { FREE: 0, PRO: 1, ULTRA: 2 };
  return tierOrder[userTier] >= tierOrder[contentTier];
}
