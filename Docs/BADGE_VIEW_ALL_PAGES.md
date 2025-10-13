# Badge "View All" Pages - Implementation Guide

## Problem Identified

When clicking "View All" on the teacher or student profile badges section, users were getting a Next.js image error:

```
Error: Failed to parse src "🏆" on 'next/image', if using relative image it must start with a leading slash "/" or be an absolute URL (http:// or https://)
```

**Root Cause:**

- The "View All" link was pointing to `/list/badges` (admin badge management page)
- That page uses `next/image` component which cannot handle emoji strings as image sources
- Teachers and students need to see THEIR earned badges, not all system badges

## Solution Implemented

### 1. Created Dedicated Badge Pages

**Teacher Badges Page:** `src/app/(dashboard)/teacher-badges/page.tsx`

- Shows only badges earned by the logged-in teacher
- Fetches from `TeacherBadge` table with `badge` relation
- Beautiful grid layout with badge cards
- Displays: icon, name, description, criteria, earned date, badge type
- Responsive design (1-4 columns based on screen size)

**Student Badges Page:** `src/app/(dashboard)/student-badges/page.tsx`

- Shows only badges earned by the logged-in student
- Fetches from `StudentBadge` table with `badge` relation
- Same beautiful design as teacher page
- Personalized empty state for students

### 2. Updated Profile Page Links

**Before:**

```tsx
<Link href="/list/badges">View All ({userData.badges.length})</Link>
```

**After (Teachers):**

```tsx
<Link href="/teacher-badges">View All ({userData.badges.length})</Link>
```

**After (Students):**

```tsx
<Link href="/student-badges">View All ({userData.studentBadges.length})</Link>
```

## Features

### Badge Card Display

Each badge shows:

1. **Circular Icon** - Large emoji with colored border matching badge color
2. **Badge Name** - Bold title
3. **Description** - Brief explanation of the badge
4. **Criteria Box** - Gray background showing what was achieved
5. **Earned Date** - When the badge was awarded (formatted: "Oct 13, 2025")
6. **Badge Type Pill** - Color-coded type (Rank Based, Score Based, Activity Based)

### Design Details

- **Hover Effects**: Cards lift up slightly on hover with shadow increase
- **Color Coordination**: Each badge uses its custom color for borders and backgrounds
- **Responsive Grid**:
  - Mobile: 1 column
  - Small tablets: 2 columns
  - Large tablets: 3 columns
  - Desktop: 4 columns

### Empty States

- Large 🏅 emoji
- Encouraging message
- Different text for teachers vs students

## File Structure

```
src/app/(dashboard)/
├── teacher-badges/
│   └── page.tsx          # Teacher's earned badges page
├── student-badges/
│   └── page.tsx          # Student's earned badges page
└── profile/
    └── page.tsx          # Updated with correct links
```

## Code Examples

### Fetching Teacher Badges

```typescript
const teacherBadges = await prisma.teacherBadge.findMany({
	where: { teacherId: userId },
	include: { badge: true },
	orderBy: { earnedAt: "desc" },
});
```

### Dynamic Styling with Badge Colors

```tsx
<div
	style={{
		backgroundColor: badgeItem.badge.color + "20", // 20% opacity
		border: `3px solid ${badgeItem.badge.color}`,
	}}
>
	{badgeItem.badge.icon}
</div>
```

### Criteria Extraction

```tsx
{
	(() => {
		const criteria = badgeItem.badge.criteria as any;
		return criteria.description || "Badge criteria met";
	})();
}
```

## Security

- **Role-based Access**: Only teachers can access `/teacher-badges`, only students can access `/student-badges`
- **Auto-redirect**: Unauthorized users redirected to home page
- **User Isolation**: Each user only sees THEIR earned badges, not others

## Testing Checklist

- [x] Teacher with badges can view all badges
- [x] Student with badges can view all badges
- [x] Empty state displays when no badges earned
- [x] Badge icons render correctly (emojis, not images)
- [x] Earned dates format properly
- [x] Badge colors apply correctly to borders and backgrounds
- [x] Responsive layout works on all screen sizes
- [x] "Back to Profile" link works
- [x] Unauthorized access redirects properly
- [x] Badge type displays correctly (Rank Based, etc.)

## Next Steps

If you want to add more features:

1. **Filtering**: Filter badges by type (Rank/Score/Activity)
2. **Sorting**: Sort by date, name, or type
3. **Search**: Search badges by name
4. **Statistics**: Show total badges, completion percentage
5. **Achievements Progress**: Show unearned badges with progress bars
6. **Share**: Share badge achievements on social media

## Related Files

- `src/app/(dashboard)/profile/page.tsx` - Profile page with badge sections
- `src/lib/actions.ts` - Badge award/removal logic
- `prisma/schema.prisma` - Badge, TeacherBadge, StudentBadge models
- `scripts/seedTeacherBadges.ts` - Teacher badge creation script
