import { Tier } from "@prisma/client";
import { IsEnum } from "class-validator";

export class CreateCheckoutDto {
  @IsEnum(Tier)
  tier: Tier;
}
