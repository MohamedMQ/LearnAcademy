# LearnAcademy 🎓

A full-stack Learning Management System (LMS) built with **Next.js** and **NestJS**, featuring AI-powered tutoring, role-based access control, and a rich course management admin panel.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Caching | Redis (ioredis) |
| Auth | NextAuth.js v5 + JWT (NestJS) |
| AI Tutor | Google Gemini 2.0 Flash (Vercel AI SDK) |
| Video | react-player (YouTube/Vimeo/direct URLs) |
| Rich Text | Tiptap editor |
| Styling | Tailwind CSS v4, shadcn/ui |
| Uploads | Multer (local) / Cloudinary (production) |
| Package Manager | pnpm workspaces |

## Features

- **Three-tier access system** — Free, Pro, Ultra
- **Course management** — Courses → Modules → Lessons hierarchy
- **Video lessons** — Supports YouTube, Vimeo, and direct video URLs
- **Progress tracking** — Per-lesson and per-course completion
- **AI Tutor Chat** — Gemini-powered assistant (Ultra tier)
- **Notes system** — Personal notes with draft/in-progress/complete status
- **Admin panel** — Full CRUD for courses, modules, lessons, categories
- **Drag-and-drop** — Reorder modules and lessons
- **Redis caching** — All public API routes cached for performance

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL 16+
- Redis 7+

### Quick Start with Docker

```bash
docker-compose up -d   # Starts PostgreSQL + Redis
```

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.local.example apps/frontend/.env.local
# Fill in the values
```

### Run database migrations & seed

```bash
cd apps/backend
pnpm prisma migrate dev
pnpm prisma db seed
```

### Start development servers

```bash
pnpm dev   # Starts both frontend (port 3000) and backend (port 3001)
```

## Project Structure

```
LearnAcademy/
  apps/
    frontend/    (Next.js — UI, pages, components)
    backend/     (NestJS — REST API, database, auth)
  package.json   (pnpm workspace root)
  docker-compose.yml
```

## Environment Variables

### Backend (`apps/backend/.env`)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/learnacademy
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
GOOGLE_AI_API_KEY=your-gemini-api-key
UPLOAD_DIR=./uploads
FRONTEND_URL=http://localhost:3000
```

### Frontend (`apps/frontend/.env.local`)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## License

MIT
