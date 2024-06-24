import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Tier } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: any,
    @Body() body: { name?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Patch('tier')
  upgradeTier(@CurrentUser() user: any, @Body() body: { tier: Tier }) {
    return this.usersService.upgradeTier(user.id, body.tier);
  }

  @Get('progress/:courseId')
  getCourseProgress(@CurrentUser() user: any, @Param('courseId') courseId: string) {
    return this.usersService.getCourseProgress(user.id, courseId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }
}
