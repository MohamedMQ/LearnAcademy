"use client";

import { TIER_OPTIONS, type Tier } from "@/lib/constants";
import Link from "next/link";

interface TierFilterTabsProps {
  activeTier?: Tier | "ALL";
  selectedTier?: Tier | "ALL";
  onChange?: (tier: Tier | "ALL") => void;
}

const colors: Record<string, string> = {
  ALL: "text-zinc-400 border-zinc-700 hover:border-zinc-500",
  FREE: "text-emerald-400 border-emerald-500/40 hover:border-emerald-500",
  PRO: "text-violet-400 border-violet-500/40 hover:border-violet-500",
  ULTRA: "text-cyan-400 border-cyan-500/40 hover:border-cyan-500",
};

const activeColors: Record<string, string> = {
  ALL: "border-white text-white bg-zinc-800",
  FREE: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
  PRO: "border-violet-500 text-violet-400 bg-violet-500/10",
  ULTRA: "border-cyan-500 text-cyan-400 bg-cyan-500/10",
};

export function TierFilterTabs({
  activeTier,
  selectedTier,
  onChange,
}: TierFilterTabsProps) {
  const currentTier = activeTier ?? selectedTier ?? "ALL";
  const tabs: (Tier | "ALL")[] = ["ALL", ...TIER_OPTIONS.map((t) => t.value)];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <Link
          key={tab}
          href={tab === "ALL" ? "/courses" : `/courses?tier=${tab}`}
          onClick={(event) => {
            if (onChange) {
              event.preventDefault();
              onChange(tab);
            }
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            currentTier === tab ? activeColors[tab] : colors[tab]
          }`}
        >
          {tab === "ALL"
            ? "All Tiers"
            : tab.charAt(0) + tab.slice(1).toLowerCase()}
        </Link>
      ))}
    </div>
  );
}
