import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const VALID_TIERS = new Set(["PRO", "ULTRA"]);

export async function GET(req: NextRequest) {
  const session = await auth();
  const token = (session as any)?.accessToken as string | undefined;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const tier = req.nextUrl.searchParams.get("tier")?.toUpperCase() ?? "";
  if (!VALID_TIERS.has(tier)) {
    return NextResponse.redirect(new URL("/pricing?error=invalid-tier", req.url));
  }

  try {
    const res = await fetch(`${API_BASE}/api/billing/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tier }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.redirect(
        new URL("/pricing?error=checkout-failed", req.url),
      );
    }

    const data = await res.json();
    const redirectUrl = data?.redirectUrl || "/dashboard";

    // Support absolute URLs returned by backend in mock mode.
    if (typeof redirectUrl === "string" && redirectUrl.startsWith("http")) {
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch {
    return NextResponse.redirect(
      new URL("/pricing?error=checkout-failed", req.url),
    );
  }
}
