import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Tier } from '@prisma/client';
import slugify from 'slugify';

const MODULE_WITH_LESSONS = {
  id: true,
  title: true,
  description: true,
  order: true,
  lessons: {
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      videoUrl: true,
      order: true,
    },
    orderBy: { order: 'asc' as const },
  },
};

const COURSE_FULL_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  thumbnail: true,
  tier: true,
  featured: true,
  published: true,
  createdAt: true,
  category: { select: { id: true, title: true, icon: true } },
  modules: {
    select: MODULE_WITH_LESSONS,
    orderBy: { order: 'asc' as const },
  },
  _count: { select: { modules: true } },
};

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(filters?: {
    featured?: boolean;
    tier?: Tier;
    categoryId?: string;
    published?: boolean;
  }) {
    const cacheKey = `courses:list:${JSON.stringify(filters || {})}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = {};
    if (filters?.featured !== undefined) where.featured = filters.featured;
    if (filters?.tier) where.tier = filters.tier;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.published !== undefined) where.published = filters.published;

    const courses = await this.prisma.course.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        tier: true,
        featured: true,
        published: true,
        createdAt: true,
        category: { select: { id: true, title: true, icon: true } },
        _count: {
          select: {
            modules: true,
            completedBy: true,
          },
        },
        modules: {
          select: {
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = courses.map((c) => ({
      ...c,
      lessonCount: c.modules.reduce((sum, m) => sum + m._count.lessons, 0),
      moduleCount: c._count.modules,
      modules: undefined,
      _count: undefined,
    }));

    await this.redis.set(cacheKey, result, 300);
    return result;
  }

  async findBySlug(slug: string, userId?: string) {
    const cacheKey = userId
      ? `courses:slug:${slug}:user:${userId}`
      : `courses:slug:${slug}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const course = await this.prisma.course.findUnique({
      where: { slug },
      select: {
        ...COURSE_FULL_SELECT,
        modules: {
          select: {
            id: true,
            title: true,
            description: true,
            order: true,
            lessons: {
              select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                videoUrl: true,
                order: true,
                completedBy: userId
                  ? {
                      where: { userId },
                      select: { id: true },
                    }
                  : false,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) throw new NotFoundException('Course not found');

    const result = {
      ...course,
      modules: course.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({
          ...l,
          isCompleted: userId
            ? Array.isArray(l.completedBy) && (l.completedBy as any[]).length > 0
            : false,
          completedBy: undefined,
        })),
      })),
    };

    await this.redis.set(cacheKey, result, 120);
    return result;
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: COURSE_FULL_SELECT,
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async getStats() {
    const cached = await this.redis.get('courses:stats');
    if (cached) return cached;

    const [courseCount, lessonCount] = await Promise.all([
      this.prisma.course.count({ where: { published: true } }),
      this.prisma.lesson.count(),
    ]);

    const stats = { courseCount, lessonCount };
    await this.redis.set('courses:stats', stats, 600);
    return stats;
  }

  async create(dto: CreateCourseDto) {
    const slug =
      dto.slug ||
      slugify(dto.title, { lower: true, strict: true }) +
        '-' +
        Date.now().toString(36);

    const course = await this.prisma.course.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        thumbnail: dto.thumbnail,
        tier: dto.tier,
        featured: dto.featured ?? false,
        published: dto.published ?? false,
        categoryId: dto.categoryId,
      },
      select: COURSE_FULL_SELECT,
    });

    await this.redis.delPattern('courses:*');
    return course;
  }

  async update(id: string, dto: Partial<CreateCourseDto>) {
    const course = await this.prisma.course.update({
      where: { id },
      data: dto,
      select: COURSE_FULL_SELECT,
    });
    await this.redis.delPattern('courses:*');
    return course;
  }

  async delete(id: string) {
    await this.prisma.course.delete({ where: { id } });
    await this.redis.delPattern('courses:*');
    return { success: true };
  }

  async toggleComplete(courseId: string, userId: string) {
    const exists = await this.prisma.courseCompletion.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (exists) {
      await this.prisma.courseCompletion.delete({
        where: { userId_courseId: { userId, courseId } },
      });
      return { completed: false };
    } else {
      await this.prisma.courseCompletion.create({
        data: { userId, courseId },
      });
      return { completed: true };
    }
  }

  async getDashboardCourses(userId: string) {
    const cacheKey = `dashboard:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const courses = await this.prisma.course.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        tier: true,
        featured: true,
        category: { select: { id: true, title: true, icon: true } },
        modules: {
          select: {
            lessons: {
              select: {
                id: true,
                completedBy: {
                  where: { userId },
                  select: { id: true },
                },
              },
            },
          },
        },
        completedBy: {
          where: { userId },
          select: { id: true },
        },
        _count: { select: { modules: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = courses.map((c) => {
      let totalLessons = 0;
      let completedLessons = 0;
      for (const mod of c.modules) {
        for (const lesson of mod.lessons) {
          totalLessons++;
          if ((lesson.completedBy as any[]).length > 0) completedLessons++;
        }
      }
      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        thumbnail: c.thumbnail,
        tier: c.tier,
        featured: c.featured,
        category: c.category,
        moduleCount: c._count.modules,
        lessonCount: totalLessons,
        completedLessonCount: completedLessons,
        isCompleted: (c.completedBy as any[]).length > 0,
      };
    });

    await this.redis.set(cacheKey, result, 60);
    return result;
  }
}
