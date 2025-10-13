# Profile Page Implementation Guide

## Overview

A comprehensive, role-based profile page system has been implemented at `/profile` for all user types: Admin, Teacher, Student, and Parent.

## Features

### 🎯 Universal Features (All Roles)

- **Responsive Design**: Fully responsive layout using Tailwind CSS breakpoints (mobile, tablet, desktop)
- **Role Detection**: Automatically displays the correct profile based on user role
- **Consistent Design**: Matches the existing school management system design language
- **Grid Layout**: 3-column layout on desktop (1 sidebar + 2 main content), stacks on mobile
- **Quick Actions**: Role-specific shortcuts to frequently used pages

---

## Role-Specific Features

### 👨‍💼 Admin Profile

#### Display Sections:

1. **Profile Card**

   - Administrator avatar (gradient with username initial)
   - Username display
   - User ID
   - System administrator badge

2. **Quick Actions**

   - Settings
   - Cron Jobs
   - Manage Students
   - Manage Teachers

3. **Account Information**

   - Username
   - Role
   - User ID (full)
   - Access Level

4. **System Overview**

   - Students count (placeholder)
   - Teachers count (placeholder)
   - Classes count (placeholder)
   - Parents count (placeholder)

5. **Permissions & Access**
   - Manage Users: Enabled
   - Financial Management: Enabled
   - System Configuration: Enabled
   - Reports & Analytics: Enabled

---

### 👨‍🏫 Teacher Profile

#### Display Sections:

1. **Profile Card**

   - Teacher photo or avatar with initials
   - Full name
   - Username
   - Teacher badge
   - Leaderboard rank (if available)
   - Total lessons count
   - Badges earned count

2. **Quick Actions**

   - Mark Attendance
   - My Lessons
   - Rankings (Teacher Leaderboard)
   - Settings

3. **Personal Information**

   - Full Name
   - Blood Type
   - Email
   - Phone
   - Gender
   - Birthday
   - Address

4. **Teaching Information**

   - Subjects (as badges)
   - Classes (as badges)

5. **Performance Statistics** (if on leaderboard)

   - Leaderboard Rank
   - Total Score
   - Average Rating

6. **Recent Badges** (up to 5)
   - Badge icon
   - Badge name
   - Award date

---

### 🎓 Student Profile

#### Display Sections:

1. **Profile Card**

   - Student photo or avatar with initials
   - Full name
   - Username
   - Student badge
   - Leaderboard rank (if available)
   - Total score
   - Badges earned count

2. **Quick Actions**

   - MCQ Tests
   - Leaderboard
   - Attendance
   - Settings

3. **Personal Information**

   - Full Name
   - Blood Type
   - Email
   - Phone
   - Gender
   - Birthday
   - Address

4. **Academic Information**

   - Class (with student/lesson count)
   - Grade level
   - Parent name and contact
   - Enrollment date

5. **Academic Statistics**

   - Attendance records count
   - Results submissions count
   - MCQ test attempts count

6. **Recent Badges** (up to 5)
   - Badge icon
   - Badge name
   - Award date

---

### 👨‍👩‍👧 Parent Profile

#### Display Sections:

1. **Profile Card**

   - Parent avatar with initials
   - Full name
   - Username
   - Parent badge
   - Number of children
   - Join date

2. **Quick Actions**

   - My Fees
   - Payment History
   - Announcements
   - Settings

3. **Contact Information**

   - Full Name
   - Username
   - Email
   - Phone
   - Address

4. **My Children** (detailed cards for each child)

   - Child photo or avatar
   - Full name and username
   - View Details button (links to student detail page)
   - Class
   - Grade
   - Gender

5. **Quick Links**
   - Children's Attendance
   - Academic Results
   - Upcoming Exams
   - School Events

---

## Technical Implementation

### File Structure

```
src/app/(dashboard)/profile/page.tsx
├── ProfilePage (main component)
│   ├── Role detection via Clerk auth
│   ├── User data fetching via Prisma
│   └── Role-based profile rendering
├── AdminProfile
├── TeacherProfile
├── StudentProfile
└── ParentProfile
```

### Data Fetching

#### Admin

```typescript
prisma.admin.findUnique({
	where: { id: userId },
});
```

#### Teacher

```typescript
prisma.teacher.findUnique({
  where: { id: userId },
  include: {
    subjects: true,
    classes: true,
    _count: { lessons, teacherAttendances, ratings },
    leaderboard: { rank, totalScore, averageRating },
    badges: { first 5, ordered by date }
  }
})
```

#### Student

```typescript
prisma.student.findUnique({
  where: { id: userId },
  include: {
    class: { with counts },
    grade: true,
    parent: true,
    _count: { attendances, results, mcqAttempts },
    studentBadges: { first 5, ordered by date },
    leaderboardSnapshots: { latest }
  }
})
```

#### Parent

```typescript
prisma.parent.findUnique({
  where: { id: userId },
  include: {
    students: {
      include: { class, grade }
    }
  }
})
```

---

## Responsive Design

### Breakpoints

- **Mobile**: Default (full width, stacked)
- **Tablet (md)**: 2-column grid where applicable
- **Desktop (lg)**: 3-column grid (sidebar + 2 main)
- **Large (xl)**: Enhanced spacing

### Mobile Optimizations

- Stacked layout on small screens
- Smaller avatars (w-24 h-24 on mobile, w-32 h-32 on desktop)
- Compact padding (p-4 on mobile, p-6 on desktop)
- Responsive text sizes (text-xs md:text-sm, text-lg md:text-xl)
- Horizontal scroll prevention (break-all for long IDs)
- Touch-friendly button sizes

---

## Design Consistency

### Color Scheme

- **Admin**: Purple gradient (purple-400 to purple-600)
- **Teacher**: Blue gradient (blue-400 to blue-600)
- **Student**: Green gradient (green-400 to green-600)
- **Parent**: Yellow gradient (yellow-400 to yellow-600)

### Card Styles

- White background with subtle shadow
- Border: `border-gray-200`
- Rounded corners: `rounded-lg`
- Responsive padding: `p-4 md:p-6`

### Badge Colors

- Purple: Subjects, Management
- Blue: Classes, Attendance
- Green: Finance, Success
- Yellow: Achievements, Events
- Gray: Settings, Utilities

---

## Navigation Integration

The profile page is accessible from:

1. **Desktop Sidebar**: Menu.tsx → "Profile" link
2. **Mobile Bottom Nav**: BottomNav.tsx → "More" → "Profile"
3. **Direct URL**: `/profile`

All roles have access to their respective profile pages via the same route - role detection handles the display logic.

---

## Future Enhancements

### Potential Additions:

1. **Edit Profile**: Add inline editing capabilities
2. **Statistics Charts**: Visual representation of performance data
3. **Activity Timeline**: Recent activities and notifications
4. **Photo Upload**: Allow users to update profile pictures
5. **Export Data**: Download profile information as PDF
6. **Privacy Settings**: Control what information is visible
7. **Two-Factor Authentication**: Enhanced security settings
8. **Theme Preferences**: Dark mode / light mode toggle

---

## Usage

Users simply navigate to `/profile` from any authenticated page. The system automatically:

1. Detects their role via Clerk authentication
2. Fetches relevant data from the database
3. Renders the appropriate profile component
4. Displays role-specific information and actions

No manual role selection or configuration required!

---

## Security

- ✅ Authentication required (redirects to sign-in if not authenticated)
- ✅ Role-based data fetching (users only see their own data)
- ✅ Secure Prisma queries (parameterized, no SQL injection risk)
- ✅ 404 handling (returns notFound() if user data doesn't exist)
- ✅ Email/phone privacy (marked as "Not provided" if null)

---

## Testing Checklist

### For Each Role:

- [ ] Profile loads without errors
- [ ] Avatar displays correctly (image or initials)
- [ ] Personal information shows accurately
- [ ] Quick actions link to correct pages
- [ ] Statistics display proper counts
- [ ] Badges render correctly
- [ ] Mobile layout stacks properly
- [ ] Tablet layout uses grid effectively
- [ ] Desktop layout shows 3-column structure
- [ ] Text is readable at all sizes
- [ ] Images load properly
- [ ] Links navigate correctly

---

## Maintenance

### To Update Profile Sections:

1. Edit the respective component (AdminProfile, TeacherProfile, etc.)
2. Modify the Prisma query in the main ProfilePage component if adding new data
3. Test on mobile, tablet, and desktop viewports
4. Ensure consistent design with existing components

### Adding New Fields:

1. Ensure field exists in Prisma schema
2. Include field in Prisma query
3. Add display section in appropriate profile component
4. Style consistently with existing fields
5. Add responsive classes for mobile compatibility
