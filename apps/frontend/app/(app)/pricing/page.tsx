import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { CheckCircle2, Zap, Crown, Sparkles, Star } from "lucide-react";

const TIERS = [
  {
    name: "Free",
    slug: "FREE",
    price: "$0",
    period: "forever",
    description: "Perfect for beginners exploring programming",
    gradient: "from-emerald-500 to-teal-500",
    border: "border-emerald-500/30",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "Access to Free courses",
      "Community Discord",
      "Progress tracking",
      "Completion certificates",
    ],
  },
  {
    name: "Pro",
    slug: "PRO",
    price: "$19",
    period: "/ month",
    description: "For dedicated learners who want advanced content",
    gradient: "from-violet-500 to-fuchsia-500",
    border: "border-violet-500/50",
    icon: <Star className="w-6 h-6" />,
    popular: true,
    features: [
      "All Free features",
      "Pro-tier courses",
      "Advanced projects",
      "Priority email support",
      "Source code access",
    ],
  },
  {
    name: "Ultra",
    slug: "ULTRA",
    price: "$49",
    period: "/ month",
    description: "The ultimate learning experience with AI assistance",
    gradient: "from-cyan-400 to-blue-600",
    border: "border-cyan-500/30",
    icon: <Crown className="w-6 h-6" />,
    features: [
      "All Pro features",
      "Ultra-exclusive courses",
      "AI Learning Tutor",
      "1-on-1 mentoring sessions",
      "Private Discord community",
      "Early access to new courses",
    ],
  },
];

export default async function PricingPage() {
  const session = await auth();
  const currentTier = (session as any)?.tier ?? null;

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">Transparent pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Invest in your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              future
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Start free, upgrade when you're ready. All plans include lifetime
            access to purchased content.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const isCurrent = currentTier === tier.slug;
            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl border ${tier.border} bg-zinc-900/60 p-6 flex flex-col ${
                  tier.popular ? "shadow-xl shadow-violet-500/10" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3.5 right-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Current Plan
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-white mb-4`}
                >
                  {tier.icon}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">
                  {tier.name}
                </h2>
                <p className="text-zinc-500 text-sm mb-4">{tier.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-white">
                    {tier.price}
                  </span>
                  <span className="text-zinc-500 text-sm">{tier.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-zinc-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {session ? (
                  isCurrent ? (
                    <Button disabled className="w-full opacity-50">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className={`w-full bg-gradient-to-r ${tier.gradient} text-white border-0 hover:opacity-90`}
                    >
                      <Link href={`/api/billing/checkout?tier=${tier.slug}`}>
                        Upgrade to {tier.name}
                      </Link>
                    </Button>
                  )
                ) : (
                  <Button
                    asChild
                    className={`w-full bg-gradient-to-r ${tier.gradient} text-white border-0 hover:opacity-90`}
                  >
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-10">
          * Tier upgrades are managed by contacting support. Payment integration
          coming soon.
        </p>
      </div>
    </div>
  );
}
