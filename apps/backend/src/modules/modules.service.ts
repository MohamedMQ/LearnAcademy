import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ModulesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findByCourse(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          select: { id: true, title: true, slug: true, order: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string) {
    const mod = await this.prisma.module.findUnique({
      where: { id },
      include: {
        lessons: {
          select: { id: true, title: true, slug: true, order: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!mod) throw new NotFoundException('Module not found');
    return mod;
  }

  async create(data: { title: string; description?: string; courseId: string; order?: number }) {
    const count = await this.prisma.module.count({ where: { courseId: data.courseId } });
    const mod = await this.prisma.module.create({
      data: { ...data, order: data.order ?? count },
      include: {
        lessons: {
          select: { id: true, title: true, slug: true, order: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    await this.redis.delPattern('courses:*');
    return mod;
  }

  async update(id: string, data: Partial<{ title: string; description: string; order: number }>) {
    const mod = await this.prisma.module.update({
      where: { id },
      data,
      include: {
        lessons: {
          select: { id: true, title: true, slug: true, order: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    await this.redis.delPattern('courses:*');
    return mod;
  }

  async delete(id: string) {
    await this.prisma.module.delete({ where: { id } });
    await this.redis.delPattern('courses:*');
    return { success: true };
  }

  async reorder(courseId: string, moduleIds: string[]) {
    await Promise.all(
      moduleIds.map((id, index) =>
        this.prisma.module.update({ where: { id }, data: { order: index } }),
      ),
    );
    await this.redis.delPattern('courses:*');
    return { success: true };
  }
}
