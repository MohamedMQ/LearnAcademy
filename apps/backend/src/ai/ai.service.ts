import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class AiService {
  private google: ReturnType<typeof createGoogleGenerativeAI>;

  constructor(
    private config: ConfigService,
    private coursesService: CoursesService,
  ) {
    this.google = createGoogleGenerativeAI({
      apiKey: this.config.get<string>('GOOGLE_AI_API_KEY', ''),
    });
  }

  async createChatStream(messages: any[]) {
    const courses = await this.coursesService.findAll({ published: true });

    const result = streamText({
      model: this.google('gemini-2.0-flash'),
      system: `You are an expert learning assistant for LearnAcademy, an online coding education platform.
      
Your role is to:
1. Help students find relevant courses and learning paths
2. Answer questions about programming concepts covered in our courses
3. Guide students on what to learn next based on their goals
4. Explain technical concepts clearly

Always be encouraging, precise, and suggest specific courses when relevant.
When recommending courses, always include the course URL as /courses/[slug].
You have access to a searchCourses tool to find relevant courses.`,
      messages,
      tools: {
        searchCourses: tool({
          description:
            'Search for courses on LearnAcademy that match a query. Use this to find relevant courses to recommend.',
          parameters: z.object({
            query: z.string().describe('The search query to find relevant courses'),
          }),
          execute: async ({ query }) => {
            const lq = query.toLowerCase();
            const scored = courses.map((course: any) => {
              let score = 0;
              if (course.title?.toLowerCase().includes(lq)) score += 100;
              if (course.description?.toLowerCase().includes(lq)) score += 50;
              if (course.category?.title?.toLowerCase().includes(lq)) score += 30;
              return { ...course, score };
            });

            const top = scored
              .filter((c: any) => c.score > 0)
              .sort((a: any, b: any) => b.score - a.score)
              .slice(0, 3)
              .map((c: any) => ({
                title: c.title,
                description: c.description,
                tier: c.tier,
                category: c.category?.title,
                url: `/courses/${c.slug}`,
                moduleCount: c.moduleCount,
                lessonCount: c.lessonCount,
              }));

            if (top.length === 0) {
              return { found: false, message: 'No matching courses found for that query.' };
            }

            return { found: true, courses: top };
          },
        }),
      },
      maxSteps: 5,
    });

    return result;
  }
}
