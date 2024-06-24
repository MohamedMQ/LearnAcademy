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
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NoteStatus } from '@prisma/client';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.notesService.findByUser(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() body: { title: string; content?: string; status?: NoteStatus },
  ) {
    return this.notesService.create(user.id, body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: Partial<{ title: string; content: string; status: NoteStatus }>,
  ) {
    return this.notesService.update(id, user.id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notesService.delete(id, user.id);
  }
}
