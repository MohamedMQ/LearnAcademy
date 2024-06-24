import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Tier } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const TIER_RANK: Record<Tier, number> = {
  FREE: 0,
  PRO: 1,
  ULTRA: 2,
};

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async createCheckout(userId: string, tier: Tier) {
    if (tier === "FREE") {
      throw new BadRequestException("Cannot checkout free tier");
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    if (TIER_RANK[user.tier] >= TIER_RANK[tier]) {
      return {
        success: true,
        mode: "noop",
        message: "You already have this plan or higher",
        tier: user.tier,
      };
    }

    // Free-friendly default mode: immediate upgrade in development/demo.
    const billingMode = this.config.get<string>("BILLING_MODE", "mock");

    if (billingMode !== "mock") {
      throw new BadRequestException(
        "Only BILLING_MODE=mock is configured right now",
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { tier },
      select: { id: true, tier: true },
    });

    return {
      success: true,
      mode: "mock",
      message: `Upgraded to ${tier}`,
      tier: updated.tier,
      redirectUrl: `${this.config.get<string>("FRONTEND_URL", "http://localhost:3000")}/dashboard?upgraded=${tier}`,
    };
  }
}
