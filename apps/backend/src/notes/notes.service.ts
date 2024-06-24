import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NoteStatus } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(userId: string, data: { title: string; content?: string; status?: NoteStatus }) {
    return this.prisma.note.create({
      data: { ...data, userId },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<{ title: string; content: string; status: NoteStatus }>,
  ) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.note.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new ForbiddenException('Access denied');

    await this.prisma.note.delete({ where: { id } });
    return { success: true };
  }
}
