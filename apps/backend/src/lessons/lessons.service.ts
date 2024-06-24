import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import slugify from 'slugify';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findBySlug(slug: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { slug },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                tier: true,
                modules: {
                  select: {
                    id: true,
                    title: true,
                    order: true,
                    lessons: {
                      select: {
                        id: true,
                        title: true,
                        slug: true,
                        order: true,
                        completedBy: userId
                          ? { where: { userId }, select: { id: true } }
                          : false,
                      },
                      orderBy: { order: 'asc' },
                    },
                  },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        completedBy: userId
          ? { where: { userId }, select: { id: true } }
          : false,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    // Build flat list of all lessons for prev/next
    const allLessons: { id: string; slug: string; title: string }[] = [];
    for (const mod of lesson.module.course.modules) {
      for (const l of mod.lessons) {
        allLessons.push({ id: l.id, slug: l.slug, title: l.title });
      }
    }
    const currentIndex = allLessons.findIndex((l) => l.slug === slug);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return {
      ...lesson,
      isCompleted: userId
        ? Array.isArray(lesson.completedBy) && (lesson.completedBy as any[]).length > 0
        : false,
      completedBy: undefined,
      prevLesson,
      nextLesson,
      course: {
        ...lesson.module.course,
        modules: lesson.module.course.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) => ({
            ...l,
            isCompleted: userId
              ? Array.isArray(l.completedBy) && (l.completedBy as any[]).length > 0
              : false,
            completedBy: undefined,
          })),
        })),
      },
    };
  }

  async findById(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async create(data: {
    title: string;
    description?: string;
    videoUrl?: string;
    content?: string;
    moduleId: string;
    order?: number;
  }) {
    const slug =
      slugify(data.title, { lower: true, strict: true }) +
      '-' +
      Date.now().toString(36);

    const count = await this.prisma.lesson.count({ where: { moduleId: data.moduleId } });
    const lesson = await this.prisma.lesson.create({
      data: { ...data, slug, order: data.order ?? count },
    });
    await this.redis.delPattern('courses:*');
    return lesson;
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      videoUrl: string;
      content: string;
      order: number;
      moduleId: string;
    }>,
  ) {
    const lesson = await this.prisma.lesson.update({ where: { id }, data });
    await this.redis.delPattern('courses:*');
    return lesson;
  }

  async delete(id: string) {
    await this.prisma.lesson.delete({ where: { id } });
    await this.redis.delPattern('courses:*');
    return { success: true };
  }

  async toggleComplete(lessonId: string, userId: string) {
    const exists = await this.prisma.lessonCompletion.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (exists) {
      await this.prisma.lessonCompletion.delete({
        where: { userId_lessonId: { userId, lessonId } },
      });
      await this.redis.del(`dashboard:${userId}`);
      return { completed: false };
    } else {
      await this.prisma.lessonCompletion.create({
        data: { userId, lessonId },
      });
      await this.redis.del(`dashboard:${userId}`);
      return { completed: true };
    }
  }

  async reorder(moduleId: string, lessonIds: string[]) {
    await Promise.all(
      lessonIds.map((id, index) =>
        this.prisma.lesson.update({ where: { id }, data: { order: index } }),
      ),
    );
    await this.redis.delPattern('courses:*');
    return { success: true };
  }
}
