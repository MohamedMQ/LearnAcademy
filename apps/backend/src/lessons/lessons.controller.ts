import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get(':slug')
  findBySlug(@Param('slug') slug: string, @Request() req: any) {
    const userId = req.user?.id;
    return this.lessonsService.findBySlug(slug, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  create(
    @Body()
    body: {
      title: string;
      description?: string;
      videoUrl?: string;
      content?: string;
      moduleId: string;
      order?: number;
    },
  ) {
    return this.lessonsService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      description: string;
      videoUrl: string;
      content: string;
      order: number;
      moduleId: string;
    }>,
  ) {
    return this.lessonsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  delete(@Param('id') id: string) {
    return this.lessonsService.delete(id);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  toggleComplete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.lessonsService.toggleComplete(id, user.id);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  reorder(@Body() body: { moduleId: string; lessonIds: string[] }) {
    return this.lessonsService.reorder(body.moduleId, body.lessonIds);
  }
}
