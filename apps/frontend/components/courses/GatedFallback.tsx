import { Lock, Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Tier } from "@/lib/constants";
import { TIER_STYLES } from "@/lib/constants";

const tierLabels: Record<Tier, string> = {
  FREE: "Free",
  PRO: "Pro",
  ULTRA: "Ultra",
};

export function GatedFallback({ requiredTier }: { requiredTier: Tier }) {
  const styles = TIER_STYLES[requiredTier];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 rounded-2xl border ${styles.border} bg-zinc-900/50 p-12 text-center`}
    >
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${styles.gradient} flex items-center justify-center opacity-80`}
      >
        <Lock className="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 className={`text-xl font-bold mb-2 ${styles.text}`}>
          {tierLabels[requiredTier]} Content
        </h3>
        <p className="text-zinc-400 text-sm max-w-sm">
          This content requires a{" "}
          <span className={styles.text}>{tierLabels[requiredTier]}</span> subscription.
          Upgrade to unlock access.
        </p>
      </div>
      <Link href="/pricing">
        <Button
          className={`gap-2 bg-gradient-to-r ${styles.gradient} text-white border-0 hover:opacity-90`}
        >
          <Crown className="w-4 h-4" />
          Upgrade to {tierLabels[requiredTier]}
        </Button>
      </Link>
    </div>
  );
}
