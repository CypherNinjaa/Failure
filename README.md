# School Management Dashboard

A full-stack school management system built with Next.js 14, featuring role-based access control, real-time data management, and comprehensive admin tools.

## Features

- 🔐 **Authentication & Authorization** - Clerk-based auth with 4 roles (Admin, Teacher, Student, Parent)
- 📊 **Dashboard Analytics** - Real-time charts and statistics for each role
- 👥 **User Management** - CRUD operations for teachers, students, and parents
- 📚 **Academic Management** - Classes, subjects, lessons, exams, and assignments
- 📅 **Calendar System** - Big Calendar integration for lesson scheduling
- 📈 **Performance Tracking** - Attendance, results, and grade management
- 🖼️ **Image Uploads** - Cloudinary integration for profile pictures
- 🎨 **Modern UI** - Tailwind CSS with custom design system

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Image Upload**: Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account (for authentication)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/CypherNinjaa/Failure.git
cd Failure
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory (copy from `.env.example`):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/school"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
```

4. **Set up the database**

```bash
# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Open Prisma Studio to view/edit data
npx prisma studio
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Setup (Optional)

Run with Docker Compose:

```bash
docker-compose up
```

This will start both PostgreSQL and the Next.js app.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── admin/          # Admin-specific pages
│   │   │   ├── teacher/        # Teacher-specific pages
│   │   │   ├── student/        # Student-specific pages
│   │   │   ├── parent/         # Parent-specific pages
│   │   │   └── list/           # CRUD list pages
│   │   └── [[...sign-in]]/     # Clerk auth pages
│   ├── components/
│   │   ├── forms/              # Form components
│   │   ├── FormContainer.tsx   # Server component for forms
│   │   ├── FormModal.tsx       # Client modal wrapper
│   │   └── ...                 # Other components
│   ├── lib/
│   │   ├── actions.ts          # Server actions
│   │   ├── formValidationSchemas.ts  # Zod schemas
│   │   ├── settings.ts         # App configuration
│   │   └── prisma.ts           # Prisma client
│   └── middleware.ts           # Auth middleware
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed data
│   └── migrations/             # Database migrations
└── public/                     # Static assets
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev --name <name>  # Create migration
npx prisma db seed   # Seed database
```

## User Roles & Permissions

- **Admin**: Full access to all features and data
- **Teacher**: Manage classes, lessons, exams, view students
- **Student**: View own schedule, grades, assignments
- **Parent**: View child's academic information

## Key Features Explained

### Authentication Flow

1. Users sign in via Clerk authentication
2. Roles are stored in Clerk's `publicMetadata.role`
3. Middleware enforces route access based on role
4. Server components extract role from session claims

### Form System

- Forms use React Hook Form with Zod validation
- Server Actions handle all mutations
- FormContainer fetches related data (server component)
- FormModal provides interactive UI (client component)
- Supports create, update, and delete operations

### Data Fetching

- Server Components fetch data directly with Prisma
- Pagination: 10 items per page
- Search and filter capabilities
- Optimistic updates with router.refresh()

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Learn More

- [Lama Dev Youtube Channel](https://youtube.com/lamadev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
