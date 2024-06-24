import { PrismaClient, Tier, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@learnacademy.dev' },
    update: {},
    create: {
      email: 'admin@learnacademy.dev',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
      tier: Tier.ULTRA,
    },
  });

  // Create demo users
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@learnacademy.dev' },
    update: {},
    create: {
      email: 'free@learnacademy.dev',
      name: 'Free User',
      password: await bcrypt.hash('Password@123', 12),
      tier: Tier.FREE,
    },
  });

  const proUser = await prisma.user.upsert({
    where: { email: 'pro@learnacademy.dev' },
    update: {},
    create: {
      email: 'pro@learnacademy.dev',
      name: 'Pro User',
      password: await bcrypt.hash('Password@123', 12),
      tier: Tier.PRO,
    },
  });

  console.log('✅ Users created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'cat-web' },
      update: {},
      create: {
        id: 'cat-web',
        title: 'Web Development',
        description: 'HTML, CSS, JavaScript and modern frameworks',
        icon: 'Globe',
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-backend' },
      update: {},
      create: {
        id: 'cat-backend',
        title: 'Backend Development',
        description: 'Server-side programming and APIs',
        icon: 'Server',
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-ai' },
      update: {},
      create: {
        id: 'cat-ai',
        title: 'AI & Machine Learning',
        description: 'Artificial intelligence and data science',
        icon: 'Brain',
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-devops' },
      update: {},
      create: {
        id: 'cat-devops',
        title: 'DevOps & Cloud',
        description: 'Infrastructure, CI/CD and cloud services',
        icon: 'Cloud',
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create courses with modules and lessons
  const course1 = await prisma.course.upsert({
    where: { slug: 'next-js-fundamentals' },
    update: {},
    create: {
      title: 'Next.js Fundamentals',
      slug: 'next-js-fundamentals',
      description:
        'Master Next.js from the ground up. Learn App Router, Server Components, data fetching, and deployment.',
      tier: Tier.FREE,
      featured: true,
      published: true,
      categoryId: categories[0].id,
    },
  });

  const module1 = await prisma.module.upsert({
    where: { id: 'mod-nextjs-1' },
    update: {},
    create: {
      id: 'mod-nextjs-1',
      title: 'Getting Started',
      description: 'Set up your Next.js project and understand the basics',
      order: 0,
      courseId: course1.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'introduction-to-nextjs' },
    update: {},
    create: {
      title: 'Introduction to Next.js',
      slug: 'introduction-to-nextjs',
      description: 'What is Next.js and why you should use it',
      videoUrl: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA',
      content: '<h2>Welcome to Next.js</h2><p>Next.js is a React framework that gives you building blocks to create web applications. By framework, we mean Next.js handles the tooling and configuration needed for React, and provides additional structure, features, and optimizations for your application.</p>',
      order: 0,
      moduleId: module1.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'project-structure' },
    update: {},
    create: {
      title: 'Project Structure',
      slug: 'project-structure',
      description: 'Understanding the Next.js project structure',
      videoUrl: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA',
      content: '<h2>Project Structure</h2><p>A Next.js project has a specific structure. The <code>app</code> directory is where you define your routes and pages using the App Router. The <code>public</code> directory holds static assets.</p>',
      order: 1,
      moduleId: module1.id,
    },
  });

  const module2 = await prisma.module.upsert({
    where: { id: 'mod-nextjs-2' },
    update: {},
    create: {
      id: 'mod-nextjs-2',
      title: 'App Router & Routing',
      description: 'Learn the powerful App Router system',
      order: 1,
      courseId: course1.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'app-router-basics' },
    update: {},
    create: {
      title: 'App Router Basics',
      slug: 'app-router-basics',
      description: 'File-based routing with the App Router',
      videoUrl: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA',
      content: '<h2>App Router</h2><p>The App Router in Next.js 13+ uses a file-system based router where folders define routes. Each folder represents a route segment mapped to a URL segment.</p>',
      order: 0,
      moduleId: module2.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'dynamic-routes' },
    update: {},
    create: {
      title: 'Dynamic Routes',
      slug: 'dynamic-routes',
      description: 'Create dynamic routes with params',
      videoUrl: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA',
      content: '<h2>Dynamic Routes</h2><p>You can create dynamic route segments by wrapping a folder name in square brackets: <code>[slug]</code>. These segments are passed as the <code>params</code> prop to layout, page, route, and generateMetadata functions.</p>',
      order: 1,
      moduleId: module2.id,
    },
  });

  // Pro course
  const course2 = await prisma.course.upsert({
    where: { slug: 'advanced-react-patterns' },
    update: {},
    create: {
      title: 'Advanced React Patterns',
      slug: 'advanced-react-patterns',
      description:
        'Deep dive into advanced React patterns: compound components, render props, custom hooks, and performance optimization.',
      tier: Tier.PRO,
      featured: true,
      published: true,
      categoryId: categories[0].id,
    },
  });

  const module3 = await prisma.module.upsert({
    where: { id: 'mod-react-1' },
    update: {},
    create: {
      id: 'mod-react-1',
      title: 'Component Patterns',
      description: 'Master advanced component design patterns',
      order: 0,
      courseId: course2.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'compound-components' },
    update: {},
    create: {
      title: 'Compound Components',
      slug: 'compound-components',
      description: 'Build flexible component APIs with compound pattern',
      videoUrl: 'https://www.youtube.com/watch?v=23jg3FMTOZo',
      content: '<h2>Compound Components</h2><p>The compound component pattern is an advanced React pattern that allows components to work together to form a coherent UI while giving the end user full control over rendering.</p>',
      order: 0,
      moduleId: module3.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'render-props-pattern' },
    update: {},
    create: {
      title: 'Render Props Pattern',
      slug: 'render-props-pattern',
      description: 'Share code between components using render props',
      videoUrl: 'https://www.youtube.com/watch?v=NdapMDgNhtE',
      content: '<h2>Render Props</h2><p>A render prop is a technique for sharing code between React components using a prop whose value is a function. A component with a render prop takes a function that returns a React element.</p>',
      order: 1,
      moduleId: module3.id,
    },
  });

  // Ultra course
  const course3 = await prisma.course.upsert({
    where: { slug: 'ai-engineering-with-nextjs' },
    update: {},
    create: {
      title: 'AI Engineering with Next.js',
      slug: 'ai-engineering-with-nextjs',
      description:
        'Build production-grade AI applications with Next.js, Vercel AI SDK, and Google Gemini. Ship real AI features.',
      tier: Tier.ULTRA,
      featured: true,
      published: true,
      categoryId: categories[2].id,
    },
  });

  const module4 = await prisma.module.upsert({
    where: { id: 'mod-ai-1' },
    update: {},
    create: {
      id: 'mod-ai-1',
      title: 'AI SDK Foundations',
      description: 'Get started with the Vercel AI SDK',
      order: 0,
      courseId: course3.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'vercel-ai-sdk-intro' },
    update: {},
    create: {
      title: 'Vercel AI SDK Introduction',
      slug: 'vercel-ai-sdk-intro',
      description: 'Overview of the Vercel AI SDK and its capabilities',
      videoUrl: 'https://www.youtube.com/watch?v=mZKZRkkL9Ls',
      content: '<h2>Vercel AI SDK</h2><p>The Vercel AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more.</p>',
      order: 0,
      moduleId: module4.id,
    },
  });

  // More featured courses
  const course4 = await prisma.course.upsert({
    where: { slug: 'nestjs-microservices' },
    update: {},
    create: {
      title: 'NestJS Microservices',
      slug: 'nestjs-microservices',
      description:
        'Build scalable microservices with NestJS. Learn patterns, message brokers, and distributed systems.',
      tier: Tier.PRO,
      featured: true,
      published: true,
      categoryId: categories[1].id,
    },
  });

  const module5 = await prisma.module.upsert({
    where: { id: 'mod-nest-1' },
    update: {},
    create: {
      id: 'mod-nest-1',
      title: 'NestJS Basics',
      description: 'Core concepts of NestJS',
      order: 0,
      courseId: course4.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'nestjs-architecture' },
    update: {},
    create: {
      title: 'NestJS Architecture',
      slug: 'nestjs-architecture',
      description: 'Understanding NestJS modules, controllers, and providers',
      videoUrl: 'https://www.youtube.com/watch?v=0M8AYU_hPas',
      content: '<h2>NestJS Architecture</h2><p>NestJS uses a modular architecture inspired by Angular. The core building blocks are Modules, Controllers, and Providers (Services).</p>',
      order: 0,
      moduleId: module5.id,
    },
  });

  const course5 = await prisma.course.upsert({
    where: { slug: 'typescript-mastery' },
    update: {},
    create: {
      title: 'TypeScript Mastery',
      slug: 'typescript-mastery',
      description:
        'From TypeScript basics to advanced generics, decorators, and type utilities. Essential for any serious developer.',
      tier: Tier.FREE,
      featured: true,
      published: true,
      categoryId: categories[0].id,
    },
  });

  const module6 = await prisma.module.upsert({
    where: { id: 'mod-ts-1' },
    update: {},
    create: {
      id: 'mod-ts-1',
      title: 'TypeScript Basics',
      description: 'Types, interfaces, and basic TypeScript concepts',
      order: 0,
      courseId: course5.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'typescript-types-and-interfaces' },
    update: {},
    create: {
      title: 'Types and Interfaces',
      slug: 'typescript-types-and-interfaces',
      description: 'Understanding TypeScript types and interfaces',
      videoUrl: 'https://www.youtube.com/watch?v=d56mG7DezGs',
      content: '<h2>TypeScript Types and Interfaces</h2><p>TypeScript provides several ways to define the shape of objects. Types and interfaces are the two main ways, and each has its use cases.</p>',
      order: 0,
      moduleId: module6.id,
    },
  });

  const course6 = await prisma.course.upsert({
    where: { slug: 'docker-and-kubernetes' },
    update: {},
    create: {
      title: 'Docker & Kubernetes',
      slug: 'docker-and-kubernetes',
      description:
        'Containerize your applications with Docker and orchestrate them with Kubernetes. From dev to production.',
      tier: Tier.PRO,
      featured: true,
      published: true,
      categoryId: categories[3].id,
    },
  });

  const module7 = await prisma.module.upsert({
    where: { id: 'mod-docker-1' },
    update: {},
    create: {
      id: 'mod-docker-1',
      title: 'Docker Fundamentals',
      description: 'Containers, images, and Docker basics',
      order: 0,
      courseId: course6.id,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: 'docker-introduction' },
    update: {},
    create: {
      title: 'Introduction to Docker',
      slug: 'docker-introduction',
      description: 'What is Docker and why containers matter',
      videoUrl: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
      content: '<h2>Introduction to Docker</h2><p>Docker is a platform for developing, shipping, and running applications in containers. Containers allow you to package an application with all of its dependencies into a standardized unit for software development.</p>',
      order: 0,
      moduleId: module7.id,
    },
  });

  console.log('✅ Courses, modules, and lessons created');
  console.log('\n🎉 Seeding complete!');
  console.log('\nDemo accounts:');
  console.log('  admin@learnacademy.dev / Admin@123456 (ADMIN + ULTRA)');
  console.log('  free@learnacademy.dev  / Password@123 (FREE)');
  console.log('  pro@learnacademy.dev   / Password@123 (PRO)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
