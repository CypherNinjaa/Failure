# School Management Dashboard - AI Coding Instructions

## Architecture Overview

This is a **Next.js 14** full-stack school management system with role-based access control (RBAC). The app uses:

- **App Router** with route groups: `(dashboard)` for authenticated pages, `[[...sign-in]]` for auth
- **Prisma ORM** with PostgreSQL for data persistence
- **Clerk** for authentication with roles stored in `publicMetadata.role` (admin/teacher/student/parent)
- **Server Actions** pattern: all mutations in `src/lib/actions.ts` marked with `"use server"`
- **Server Components by default** with client components only when needed (forms, modals, charts)

## Key Architectural Patterns

### 1. Container/Presenter Pattern

- **Container components** (Server Components): Fetch data from Prisma, pass to presenters
  - Example: `BigCalendarContainer.tsx` fetches lessons, renders `BigCalendar.tsx`
  - Example: `FormContainer.tsx` fetches related data (teachers, subjects), renders `FormModal.tsx`
- **Presenter components** (Client Components): Handle interactivity, marked with `"use client"`
  - Forms, modals, charts, calendars

### 2. Role-Based Access Control

- Middleware (`src/middleware.ts`) enforces route access via `routeAccessMap` from `src/lib/settings.ts`
- Role extraction pattern used throughout:
  ```typescript
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  ```
- When creating users via Clerk, set role in `publicMetadata`:
  ```typescript
  await clerkClient.users.createUser({
  	username: data.username,
  	publicMetadata: { role: "teacher" },
  });
  ```

### 3. Server Actions Pattern

- All CRUD operations in `src/lib/actions.ts` use `"use server"` directive
- Actions return `{ success: boolean; error: boolean }` state
- Forms use `useFormState` hook to call actions with progressive enhancement
- Pattern:
  ```typescript
  const [state, formAction] = useFormState(createTeacher, {
  	success: false,
  	error: false,
  });
  ```
- **Important**: Commented-out `revalidatePath` calls exist but use `router.refresh()` instead

### 4. Form Architecture

- **Zod schemas** in `src/lib/formValidationSchemas.ts` define all form validation
- Forms in `src/components/forms/` use `react-hook-form` with `@hookform/resolvers/zod`
- `FormModal.tsx` dynamically imports forms (lazy loading) and maps table names to form components
- Forms handle both create/update modes with same component using `type` prop
- Image uploads use **Cloudinary** via `next-cloudinary` package with upload preset "school"

### 5. Data Fetching

- List pages fetch data with Prisma including pagination (`ITEM_PER_PAGE = 10`)
- Use Prisma transactions for atomic operations:
  ```typescript
  const [data, count] = await prisma.$transaction([
  	prisma.student.findMany({
  		/* query */
  	}),
  	prisma.student.count({ where: query }),
  ]);
  ```
- Dynamic query building based on URL search params in list pages

## Database Schema Key Points

- **User IDs**: Students/Teachers/Parents use Clerk user IDs as primary keys (string)
- **Relations**: Heavy use of Prisma relations (e.g., `Student` → `Class` → `Lessons` → `Teacher`)
- **Enums**: `UserSex` (MALE/FEMALE), `Day` (MONDAY-FRIDAY) defined in Prisma schema
- **Migrations**: Located in `prisma/migrations/`, seed file at `prisma/seed.ts`

## Development Workflow

### Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio GUI
npx prisma migrate dev --name <migration_name>  # Create migration
npx prisma db seed   # Run seed file (uses ts-node with CommonJS)
```

### Docker Setup

- `docker-compose.yml` defines PostgreSQL and app services
- **Note**: Dockerfile has Prisma migration command but shouldn't run in production
- Connection string pattern: `postgresql://myuser:mypassword@[HOST]:5432/mydb`

## Component Conventions

### Styling

- **Tailwind CSS** with custom color classes: `lamaSky`, `lamaYellow`, `lamaPurple`, `lamaPurpleLight`, `lamaSkyLight`
- Responsive utilities: hide columns on small screens with `hidden md:table-cell`
- Icon system: All icons in `/public` as PNGs, referenced by action name (`/create.png`, `/update.png`, `/delete.png`)

### Menu & Navigation

- Menu items defined in `src/components/Menu.tsx` with `visible` array per role
- Dashboard layout uses percentage-based widths that adjust per breakpoint
- Logo and app name: "SchooLama"

### Tables & Lists

- Reusable `Table.tsx` component with `columns` and `renderRow` props
- Column visibility controlled by `className` with Tailwind responsive classes
- Actions column only shown for admin role

## Critical Implementation Details

1. **Dynamic Forms**: `FormModal.tsx` uses `deleteActionMap` and `forms` objects to map table names to actions/components. Add new forms there.

2. **Calendar Adjustments**: `adjustScheduleToCurrentWeek` utility handles Big Calendar's weekend display quirk by normalizing lesson times to current week.

3. **Capacity Checking**: When creating students, check class capacity:

   ```typescript
   const classItem = await prisma.class.findUnique({
   	where: { id: data.classId },
   	include: { _count: { select: { students: true } } },
   });
   if (classItem.capacity === classItem._count.students) {
   	/* reject */
   }
   ```

4. **Toast Notifications**: Use `react-toastify` for success/error feedback in forms

5. **Optional Fields**: Email/phone can be null, handle with `optional().or(z.literal(""))` in Zod schemas

## TODO Markers

The codebase has several "TODO" comments for incomplete features:

- Parent, lesson, assignment, result, attendance, event, announcement forms need implementation
- Delete actions for these entities are stubs pointing to `deleteSubject`
- Look for `// TODO` comments when extending functionality

## Authentication Flow

1. User signs in via `[[...sign-in]]/page.tsx` using Clerk Elements
2. Clerk sets `publicMetadata.role` during user creation
3. Client redirects to `/${role}` home page after successful auth
4. Middleware checks `routeAccessMap` on each navigation
5. Server components extract role from `sessionClaims.metadata`
