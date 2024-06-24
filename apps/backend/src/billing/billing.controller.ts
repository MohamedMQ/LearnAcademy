import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BillingService } from "./billing.service";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";

@ApiTags("Billing")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("billing")
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post("checkout")
  createCheckout(@CurrentUser() user: any, @Body() dto: CreateCheckoutDto) {
    return this.billingService.createCheckout(user.id, dto.tier);
  }
}
