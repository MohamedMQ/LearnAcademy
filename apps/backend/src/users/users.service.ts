import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tier } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly SELECT = {
    id: true,
    email: true,
    name: true,
    tier: true,
    role: true,
    avatar: true,
    createdAt: true,
  };

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, data: { name?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: this.SELECT,
    });
  }

  async upgradeTier(userId: string, tier: Tier) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { tier },
      select: this.SELECT,
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                completedBy: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');

    let total = 0;
    let completed = 0;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        total++;
        if (lesson.completedBy.length > 0) completed++;
      }
    }

    return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  async findAll() {
    return this.prisma.user.findMany({ select: this.SELECT, orderBy: { createdAt: 'desc' } });
  }
}
