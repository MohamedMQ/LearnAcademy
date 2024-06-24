import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll() {
    const cached = await this.redis.get('categories:all');
    if (cached) return cached;

    const categories = await this.prisma.category.findMany({
      include: { _count: { select: { courses: true } } },
      orderBy: { title: 'asc' },
    });

    await this.redis.set('categories:all', categories, 600);
    return categories;
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { courses: true } } },
    });
  }

  async create(data: { title: string; description?: string; icon?: string }) {
    const category = await this.prisma.category.create({ data });
    await this.redis.del('categories:all');
    return category;
  }

  async update(id: string, data: Partial<{ title: string; description: string; icon: string }>) {
    const category = await this.prisma.category.update({ where: { id }, data });
    await this.redis.del('categories:all');
    return category;
  }

  async delete(id: string) {
    await this.prisma.category.delete({ where: { id } });
    await this.redis.del('categories:all');
    return { success: true };
  }
}
