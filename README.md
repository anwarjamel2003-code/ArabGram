# Arabgram

Modern Instagram-like social platform with elegant design, strict security, Neon Postgres.

## Setup

1. **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Create `.env.local` file** with the following variables:
   ```
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST/neondb?sslmode=require&channel_binding=require"
   NEXTAUTH_SECRET="your-generated-secret-from-step-1"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Push database schema:**
   ```bash
   npm run db:push
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

Open http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio

## Features

- User authentication (email/password)
- Create and browse posts
- Like posts
- Comments on posts
- Follow/unfollow users
- Direct messages
- Stories
- Notifications
- Search functionality
- Responsive mobile-first design

## Tech Stack

- Next.js 16 with App Router
- Tailwind CSS
- Prisma ORM
- Neon Postgres Database
- NextAuth.js for authentication
- React Query for data fetching
- Zod for validation
- Lucide icons

## Architecture

- **Authentication:** JWT-based with NextAuth.js and bcrypt password hashing
- **Database:** PostgreSQL with Prisma schema for type-safe queries
- **API Routes:** RESTful API routes in `/app/api` with proper authorization
- **Frontend:** React Server Components with client components for interactivity
- **Styling:** Tailwind CSS with dark mode support