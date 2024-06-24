import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findByCourse(courseId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.modulesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  create(@Body() body: { title: string; description?: string; courseId: string; order?: number }) {
    return this.modulesService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ title: string; description: string; order: number }>,
  ) {
    return this.modulesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  delete(@Param('id') id: string) {
    return this.modulesService.delete(id);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  reorder(@Body() body: { courseId: string; moduleIds: string[] }) {
    return this.modulesService.reorder(body.courseId, body.moduleIds);
  }
}
