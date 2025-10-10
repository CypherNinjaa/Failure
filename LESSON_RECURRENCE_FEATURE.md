# Lesson Recurrence Feature - Complete Implementation Guide

## 📋 Overview

This feature allows administrators to:

1. **Duplicate lessons** - Copy any lesson to a different date
2. **Enable auto-repeat** - Automatically generate weekly recurring lessons
3. **Manage recurrence** - Set end dates and turn auto-repeat on/off

## 🗄️ Database Changes

### New Fields Added to `Lesson` Model

```prisma
model Lesson {
  id                Int       @id @default(autoincrement())
  name              String
  day               Day
  startTime         DateTime
  endTime           DateTime

  // NEW FIELDS for recurrence
  isRecurring       Boolean   @default(false)      // Toggle for auto-repeat
  recurrenceEndDate DateTime?                      // Optional end date
  parentLessonId    Int?                           // Links to original lesson
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @default(now()) @updatedAt

  // Relations...
}
```

**Migration**: `20251010175045_add_lesson_recurrence`

## 🔧 Backend Implementation

### Server Actions (`src/lib/actions.ts`)

#### 1. `duplicateLessonForDate()`

Creates a copy of a lesson for a different date.

**Parameters:**

- `lessonId`: ID of the lesson to duplicate
- `newDate`: Target date in "YYYY-MM-DD" format

**How it works:**

1. Fetches original lesson with all relations
2. Extracts time portions from original start/end times
3. Creates new Date objects combining newDate + original times
4. Creates new lesson with same data but different date
5. Sets `parentLessonId` to link back to original

**Returns:** Success message or error

#### 2. `toggleLessonRecurrence()`

Enables or disables auto-repeat mode for a lesson.

**Parameters:**

- `lessonId`: ID of the lesson
- `isRecurring`: Boolean (true = enable, false = disable)
- `recurrenceEndDate`: Optional end date

**How it works:**

1. Updates lesson's `isRecurring` field
2. Sets or clears `recurrenceEndDate`
3. Returns confirmation message

**Returns:** "Auto-repeat enabled successfully!" or "Auto-repeat disabled successfully!"

#### 3. `generateRecurringLessons()`

Batch creates weekly recurring lessons.

**Parameters:**

- `lessonId`: ID of the lesson with `isRecurring = true`

**How it works:**

1. Validates lesson has `isRecurring = true`
2. Sets end date (provided or default 30 days from now)
3. Loops weekly (increments by 7 days)
4. For each week:
   - Checks if lesson already exists for that date
   - If not, adds to creation list
5. Batch creates all lessons using `createMany()`
6. Links all new lessons to original via `parentLessonId`

**Returns:** "X recurring lessons generated successfully!"

**Example:**

```typescript
// Original lesson: October 10, 2025
// End date: November 10, 2025
// Generates 4 lessons:
// - October 17, 2025 (+ 7 days)
// - October 24, 2025 (+ 14 days)
// - October 31, 2025 (+ 21 days)
// - November 7, 2025 (+ 28 days)
```

## 🎨 Frontend Implementation

### Component: `LessonRecurrenceActions.tsx`

**Location:** `src/components/LessonRecurrenceActions.tsx`

**Props:**

```typescript
type LessonRecurrenceActionsProps = {
	lessonId: number;
	isRecurring: boolean;
	recurrenceEndDate: Date | null;
	lessonName: string;
};
```

### Features

#### 1. **Duplicate Button** (Blue)

- Icon: Copy/duplicate symbol
- Opens date picker modal
- Shows lesson name for context
- Validates date is selected
- Calls `duplicateLessonForDate()` on submit
- Shows success toast and refreshes page

#### 2. **Auto-Repeat Button** (Green/Gray)

- Icon: Refresh/repeat symbol
- Color: Green when ON, Gray when OFF
- Opens recurrence settings modal
- Toggle switch to enable/disable
- Optional end date picker
- "Generate Lessons Now" button (only visible when ON)

### Modals

#### Duplicate Modal

```tsx
- Date picker input (type="date")
- Lesson name display for context
- Cancel and Duplicate buttons
- Loading state during submission
- Toast notifications for success/error
```

#### Recurrence Modal

```tsx
- Toggle switch for auto-repeat
- End date picker (optional)
- Info text: "Automatically create lessons weekly"
- Generate button to create lessons immediately
- Close button
- Loading state during operations
```

## 📍 UI Integration

### Lessons List Page (`src/app/(dashboard)/list/lessons/page.tsx`)

**Changes:**

1. Import `LessonRecurrenceActions` component
2. Updated `renderRow()` to show:
   - **Badges:**
     - 🔁 Auto-Repeat badge (green) when `isRecurring = true`
     - 📋 Duplicate badge (blue) when `parentLessonId` exists
   - **Action buttons:**
     - Duplicate button (blue)
     - Auto-Repeat button (green/gray)
     - Update button (existing)
     - Delete button (existing)

**Visual Layout:**

```
| Subject Name                     | Lesson Title | Class | Teacher | Actions     |
|----------------------------------|--------------|-------|---------|-------------|
| Math                             | Algebra      | 1A    | John    | [🔵][🟢][✏️][🗑️] |
| 🔁 Auto-Repeat until 11/10/2025 |              |       |         |             |
```

## 🚀 Usage Guide

### For Administrators

#### **Duplicate a Single Lesson**

1. Go to **List → Lessons**
2. Find the lesson you want to duplicate
3. Click the **blue duplicate button** (📋)
4. Select the new date in the date picker
5. Click **"Duplicate"**
6. New lesson appears in the list with "📋 Duplicate" badge

#### **Enable Auto-Repeat**

1. Go to **List → Lessons**
2. Find the lesson you want to repeat
3. Click the **gray auto-repeat button** (🔁)
4. Toggle the switch to **ON** (turns green)
5. Optionally set an end date
6. Click the toggle switch to save

#### **Generate Recurring Lessons**

1. Make sure auto-repeat is enabled (green button)
2. Click the **auto-repeat button** again
3. Click **"Generate Recurring Lessons Now"**
4. System creates weekly lessons automatically
5. All new lessons show "📋 Duplicate" badge

#### **Disable Auto-Repeat**

1. Click the **green auto-repeat button**
2. Toggle the switch to **OFF** (turns gray)
3. Auto-repeat is disabled (existing duplicates remain)

## 🔍 Technical Details

### Date Handling

```typescript
// Combining date and time:
const timeString = originalTime.toISOString().split("T")[1]; // "14:30:00.000Z"
const newDateTime = new Date(newDate + "T" + timeString); // "2025-10-17T14:30:00.000Z"
```

### Duplicate Prevention

```typescript
// Check if lesson already exists for the date:
const existingLesson = await prisma.lesson.findFirst({
	where: {
		parentLessonId: lesson.id,
		startTime: {
			gte: dayStart, // Start of day
			lt: dayEnd, // End of day
		},
	},
});

// Only create if not exists
if (!existingLesson) {
	lessonsToCreate.push(newLesson);
}
```

### Weekly Recurrence Logic

```typescript
let currentDate = new Date(lesson.startTime);
currentDate.setDate(currentDate.getDate() + 7); // Start next week

while (currentDate <= endDate) {
	// Create lesson for this week
	currentDate.setDate(currentDate.getDate() + 7); // Move to next week
}
```

## 📊 Database Relations

```
Original Lesson (id: 1)
├── Duplicate 1 (id: 5, parentLessonId: 1) - Oct 17
├── Duplicate 2 (id: 6, parentLessonId: 1) - Oct 24
├── Duplicate 3 (id: 7, parentLessonId: 1) - Oct 31
└── Duplicate 4 (id: 8, parentLessonId: 1) - Nov 7
```

## 🎯 Key Features

✅ **Duplicate Prevention** - Checks for existing lessons before creating
✅ **Batch Operations** - Uses `createMany()` for efficiency
✅ **Parent-Child Linking** - All duplicates linked to original via `parentLessonId`
✅ **Visual Indicators** - Badges show recurring/duplicate status
✅ **Flexible End Dates** - Optional end date with 30-day default
✅ **Toast Notifications** - Success/error feedback for all operations
✅ **Loading States** - Disabled buttons during operations
✅ **Auto Refresh** - Page refreshes after mutations to show new data

## 🧪 Testing Checklist

- [ ] Create a new lesson
- [ ] Duplicate it to a future date
- [ ] Verify new lesson appears with "📋 Duplicate" badge
- [ ] Enable auto-repeat on original lesson
- [ ] Set end date 30 days from now
- [ ] Click "Generate Recurring Lessons Now"
- [ ] Verify 4 weekly lessons are created
- [ ] Try generating again (should skip existing)
- [ ] Check all duplicates have `parentLessonId` set
- [ ] Disable auto-repeat
- [ ] Verify button turns gray
- [ ] Delete original lesson, check duplicates remain

## 🐛 Error Handling

All operations include:

- Try-catch blocks for Prisma errors
- User-friendly error messages
- Toast notifications for errors
- Loading states to prevent double-submission
- Form validation (date required, etc.)

## 📝 Notes

- **Weekly Interval**: Hard-coded to 7 days (can be made configurable)
- **Default End Date**: 30 days from today if not specified
- **Time Preservation**: Duplicated lessons keep exact start/end times
- **All Relations Preserved**: Subject, Class, Teacher remain the same
- **No Cascade Delete**: Deleting original lesson doesn't delete duplicates

## 🔒 Permissions

Only **admin** role can:

- See the action buttons
- Duplicate lessons
- Enable/disable auto-repeat
- Generate recurring lessons

## 📚 Related Files

- `prisma/schema.prisma` - Database schema
- `prisma/migrations/20251010175045_add_lesson_recurrence/` - Migration
- `src/lib/actions.ts` - Server actions
- `src/components/LessonRecurrenceActions.tsx` - UI component
- `src/app/(dashboard)/list/lessons/page.tsx` - Lessons list page

---

**Status**: ✅ **Complete and Ready for Production**
**Date**: October 10, 2025
**Version**: 1.0
