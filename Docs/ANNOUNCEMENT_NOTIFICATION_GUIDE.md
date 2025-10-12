# Announcement Notification System - Implementation Guide

## Overview

This document describes the dynamic announcement notification system implemented in the navbar.

## Features Implemented

### 1. **Dynamic User Name Display**

- Shows actual logged-in user's name instead of hardcoded "John Doe"
- Displays `firstName + lastName` if available
- Falls back to `username` if names not set
- Shows "User" as final fallback

**Location:** `src/components/Navbar.tsx`

### 2. **Dynamic Announcement Notifications**

- Fetches recent announcements from database (last 7 days)
- Shows unread count badge with purple background
- Animated pulse effect on badge when there are unread announcements
- Badge shows "9+" when there are more than 9 unread items

**Location:** `src/components/Navbar.tsx` and `src/components/AnnouncementNotification.tsx`

### 3. **Read/Unread Tracking**

- Uses localStorage to persist read status
- Automatically marks all announcements as read when dropdown is opened
- Visual indicators for read vs unread announcements:
  - **Unread:** White background, purple icon circle, purple dot indicator
  - **Read:** Gray background, gray icon circle, no dot indicator
- Count updates dynamically based on unread status

**Persistence:** localStorage key `readAnnouncements`

### 4. **Responsive Design**

#### Desktop (md and above):

- Dropdown appears as floating card below the notification icon
- Width: 384px (24rem)
- Max height: 500px with scroll
- Positioned absolutely relative to icon

#### Mobile (below md):

- Full-screen modal overlay with dark backdrop
- Dropdown slides up from bottom (bottom sheet style)
- Rounded top corners for modern mobile UI
- Max height: 85vh to allow space for system UI
- Close button (X) in top-right corner
- Backdrop dismisses dropdown when tapped

### 5. **Interactive Features**

- Click notification icon to toggle dropdown
- Click outside to close (desktop)
- Click backdrop to close (mobile)
- Click X button to close (mobile)
- Click "View All Announcements" to navigate to full list
- Clicking any announcement closes the dropdown

## Database Schema

The system uses the existing `Announcement` model from Prisma:

```prisma
model Announcement {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  date        DateTime
  classId     Int?
  class       Class?   @relation(fields: [classId], references: [id])
}
```

## Query Logic

```typescript
// Fetch announcements from last 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const announcements = await prisma.announcement.findMany({
	where: {
		date: { gte: sevenDaysAgo },
	},
	include: {
		class: { select: { name: true } },
	},
	orderBy: { date: "desc" },
	take: 10,
});
```

## Component Structure

### Navbar.tsx (Server Component)

- Fetches announcements from database
- Formats data for client component
- Passes data to `AnnouncementNotification`

### AnnouncementNotification.tsx (Client Component)

- Manages dropdown state
- Tracks read/unread status in localStorage
- Handles responsive UI
- Manages click-outside detection
- Renders announcement list

## Styling Classes

### Badge Colors

- Unread badge: `bg-purple-500 text-white`
- New count: `bg-purple-500 text-white`
- Unread dot: `bg-purple-500`

### Responsive Classes

```css
/* Desktop */
md:absolute md:inset-auto md:right-0 md:top-10 md:w-96 md:rounded-lg

/* Mobile */
fixed bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh]
```

## localStorage Structure

```json
{
	"readAnnouncements": [1, 2, 3, 4, 5]
}
```

- Stores array of announcement IDs that have been read
- Persists across sessions
- Updates when dropdown is opened or individual announcements clicked

## User Flow

1. User logs in
2. Navbar fetches recent announcements
3. Unread count displays on notification icon
4. User clicks notification icon:
   - Desktop: Dropdown appears below icon
   - Mobile: Bottom sheet slides up with backdrop
5. All visible announcements marked as read
6. Badge count updates to 0
7. Read announcements show with gray styling
8. User can:
   - View announcement details
   - Click to navigate to full announcements page
   - Close dropdown (outside click, backdrop, or X button)

## Browser Compatibility

- Uses localStorage (supported in all modern browsers)
- Responsive design works on:
  - Mobile devices (portrait/landscape)
  - Tablets
  - Desktop browsers
- Fallback for no localStorage: announcements still display, just won't persist read status

## Performance Considerations

1. **Database Query**

   - Limited to last 7 days
   - Maximum 10 announcements
   - Only necessary fields fetched

2. **Client-Side**

   - localStorage reads are fast
   - Set operations for tracking reads
   - Efficient filtering for unread count

3. **Rendering**
   - Conditional rendering based on dropdown state
   - Line clamp for long text to prevent layout shifts
   - Smooth animations with CSS transitions

## Testing Checklist

- ✅ Badge shows correct unread count
- ✅ Count updates when opening dropdown
- ✅ Read status persists on page refresh
- ✅ Responsive on mobile devices
- ✅ Dropdown closes on outside click (desktop)
- ✅ Backdrop closes dropdown (mobile)
- ✅ X button closes dropdown (mobile)
- ✅ "View All" link navigates correctly
- ✅ Visual distinction between read/unread
- ✅ Dynamic user name displays correctly

## Future Enhancements

Possible improvements for the future:

1. **Database-backed read tracking**

   - Store read status in database per user
   - Sync across devices

2. **Real-time updates**

   - WebSocket or polling for new announcements
   - Toast notifications for urgent announcements

3. **Filtering**

   - Filter by class
   - Filter by date range
   - Search functionality

4. **Mark as unread**

   - Allow users to mark as unread
   - "Mark all as read" button

5. **Announcement categories**
   - Color coding by importance
   - Icons for different types
   - Priority sorting

## Troubleshooting

### Badge not updating

- Check localStorage in browser DevTools
- Clear "readAnnouncements" from localStorage
- Verify announcements are within 7-day window

### Dropdown not closing

- Check click-outside detection
- Verify dropdownRef is attached correctly
- Test on different browsers

### Mobile layout issues

- Check responsive breakpoints (md: 768px)
- Verify fixed positioning on mobile
- Test on actual devices, not just browser resize
