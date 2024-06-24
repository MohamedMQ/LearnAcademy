export const TIER_OPTIONS = [
  { value: "FREE", label: "Free" },
  { value: "PRO", label: "Pro" },
  { value: "ULTRA", label: "Ultra" },
] as const;

export type Tier = "FREE" | "PRO" | "ULTRA";

export const TIER_STYLES: Record<
  Tier,
  { gradient: string; border: string; text: string; badge: string }
> = {
  FREE: {
    gradient: "from-emerald-500 to-teal-600",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    badge: "bg-emerald-500/90 text-white",
  },
  PRO: {
    gradient: "from-violet-500 to-fuchsia-600",
    border: "border-violet-500/30",
    text: "text-violet-400",
    badge: "bg-violet-500/90 text-white",
  },
  ULTRA: {
    gradient: "from-cyan-400 to-blue-600",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    badge: "bg-cyan-500/90 text-white",
  },
};

export const TIER_FEATURES = [
  {
    tier: "Free",
    color: "emerald",
    value: "FREE" as Tier,
    price: "$0/mo",
    features: [
      "Access to foundational courses",
      "Community Discord access",
      "Basic projects & exercises",
      "Email support",
    ],
  },
  {
    tier: "Pro",
    color: "violet",
    value: "PRO" as Tier,
    price: "$29/mo",
    features: [
      "Everything in Free",
      "All Pro-tier courses",
      "Advanced real-world projects",
      "Priority support",
      "Course completion certificates",
    ],
  },
  {
    tier: "Ultra",
    color: "cyan",
    value: "ULTRA" as Tier,
    price: "$79/mo",
    features: [
      "Everything in Pro",
      "AI Learning Assistant",
      "Ultra-exclusive content",
      "1-on-1 mentoring sessions",
      "Private Discord community",
      "Early access to new courses",
    ],
  },
];

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
