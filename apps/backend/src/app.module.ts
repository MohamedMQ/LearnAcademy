import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CoursesModule } from "./courses/courses.module";
import { ModulesModule } from "./modules/modules.module";
import { LessonsModule } from "./lessons/lessons.module";
import { CategoriesModule } from "./categories/categories.module";
import { NotesModule } from "./notes/notes.module";
import { AiModule } from "./ai/ai.module";
import { UploadModule } from "./upload/upload.module";
import { BillingModule } from "./billing/billing.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    ModulesModule,
    LessonsModule,
    CategoriesModule,
    NotesModule,
    AiModule,
    UploadModule,
    BillingModule,
  ],
})
export class AppModule {}
