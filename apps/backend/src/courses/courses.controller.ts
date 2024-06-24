import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Tier } from '@prisma/client';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get('stats')
  getStats() {
    return this.coursesService.getStats();
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getDashboard(@CurrentUser() user: any) {
    return this.coursesService.getDashboardCourses(user.id);
  }

  @Get()
  findAll(
    @Query('featured') featured?: string,
    @Query('tier') tier?: Tier,
    @Query('categoryId') categoryId?: string,
    @Query('published') published?: string,
  ) {
    return this.coursesService.findAll({
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      tier,
      categoryId,
      published: published !== undefined ? published !== 'false' : true,
    });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string, @Request() req: any) {
    const userId = req.user?.id;
    return this.coursesService.findBySlug(slug, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<CreateCourseDto>) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  toggleComplete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.toggleComplete(id, user.id);
  }
}
