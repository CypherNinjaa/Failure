# Advanced Export Features Implementation

## Overview

Added manual date selection and specific filtering features to the export system, allowing admins to export precise data based on custom date ranges and specific students, teachers, parents, or classes.

## Features Implemented

### 1. **Manual Date Selection**

- ✅ Toggle between preset date ranges and manual date picker
- ✅ Start date and end date inputs
- ✅ Visual toggle button with calendar icon
- ✅ Seamless switching between modes

**UI Location**: Export Data page - Date Range section

**Usage**:

- Click "Manual Selection" button to enable custom date picker
- Select start date and end date
- Click "Use Presets" to return to preset options

### 2. **Specific Filtering**

- ✅ Filter by specific Class
- ✅ Filter by specific Student
- ✅ Filter by specific Teacher
- ✅ Filter by specific Parent
- ✅ Combine multiple filters
- ✅ Clear all filters button

**UI Location**: Export Data page - Filters section

**Filter Options**:

- **Class**: Dropdown showing all classes with grade level
- **Student**: Dropdown showing all students with their class name
- **Teacher**: Dropdown showing all teachers
- **Parent**: Dropdown showing all parents

### 3. **API Route for Filter Options**

**File**: `src/app/api/export-filters/route.ts`

**Endpoints**:

- `GET /api/export-filters` - Returns all filter options

**Response Format**:

```json
{
	"classes": [{ "id": 1, "name": "1A", "grade": { "level": 1 } }],
	"students": [
		{
			"id": "abc123",
			"name": "John",
			"surname": "Doe",
			"class": { "name": "1A" }
		}
	],
	"teachers": [{ "id": "def456", "name": "Jane", "surname": "Smith" }],
	"parents": [{ "id": "ghi789", "name": "Mike", "surname": "Johnson" }]
}
```

### 4. **Updated Export Actions**

**File**: `src/lib/exportActions.ts`

All 22 export functions now accept a third parameter `filters`:

```typescript
export const exportStudents = async (
  startDate?: Date,
  endDate?: Date,
  filters?: {
    classId?: number;
    studentId?: string;
    teacherId?: string;
    parentId?: string;
  }
): Promise<any[]>
```

**Functions with Filter Support**:

1. ✅ `exportStudents` - Filter by class, student ID, parent ID
2. ✅ `exportTeachers` - Filter by teacher ID
3. ✅ `exportParents` - Filter by parent ID
4. ✅ `exportLessons` - Filter by class, teacher
5. ✅ `exportExams` - Filter by class, teacher
6. ✅ `exportAssignments` - Filter by class, teacher
7. ✅ `exportAttendance` - Filter by class, student, teacher
8. ✅ `exportResults` - Filter by class, student
9. ✅ `exportEvents` - Filter by class
10. ✅ `exportAnnouncements` - Filter by class
11. ✅ `exportStudentLeaderboard` - Filter by class
12. ✅ `exportMCQTests` - Filter by class, teacher
13. ✅ `exportMCQTestAttempts` - Filter by class, student
14. ✅ `exportStudentFees` - Filter by class, student

**Functions without Filters** (all data exported):

- Classes, Subjects, Fee Structures, Teacher Leaderboard, Salaries, Income, Expenses, Transactions

## Usage Examples

### Example 1: Export Students from Specific Class

1. Select "Students" category
2. Choose date range (e.g., "This Month")
3. Select class from "Class" dropdown (e.g., "1A - Grade 1")
4. Click "Export to Excel"
5. Result: Excel file with only students from class 1A created this month

### Example 2: Export Specific Student's Attendance

1. Select "Attendance Records" category
2. Choose date range (e.g., "Last Month")
3. Select student from "Student" dropdown
4. Click "Export to Excel"
5. Result: Excel file with attendance records for that specific student last month

### Example 3: Export Teacher's Lessons with Custom Date

1. Select "Lessons/Schedule" category
2. Click "Manual Selection"
3. Set start date: 2025-09-01
4. Set end date: 2025-09-30
5. Select teacher from "Teacher" dropdown
6. Click "Export to Excel"
7. Result: Excel file with all lessons taught by that teacher in September 2025

### Example 4: Export All Data from Specific Class (Multiple Exports)

1. Select class filter (e.g., "2B - Grade 2")
2. Export "Students" → All students in class 2B
3. Export "Lessons/Schedule" → All lessons for class 2B
4. Export "Exams" → All exams for class 2B
5. Export "Attendance" → All attendance for class 2B
6. Export "Results" → All results for class 2B
7. Result: Comprehensive data package for class 2B

## Technical Implementation

### Filter Application Logic

**Prisma Query Building**:

```typescript
const where: any = {};

// Date filter
if (startDate && endDate) {
  where.createdAt = { gte: startDate, lte: endDate };
}

// Apply specific filters
if (filters?.classId) where.classId = filters.classId;
if (filters?.studentId) where.id = filters.studentId;
if (filters?.teacherId) where.teacherId = filters.teacherId;

const data = await prisma.model.findMany({ where, include: {...} });
```

### Nested Relation Filters

For models with nested relations:

```typescript
// Filter lessons by class (through relation)
if (filters?.classId) {
	where.class = { id: filters.classId };
}

// Filter attendance by student (through relation)
if (filters?.studentId) {
	where.student = { id: filters.studentId };
}
```

## UI Components

### Date Range Selector

- **Preset Buttons**: 9 preset options (All Time, Today, Yesterday, This/Last Week, This/Last Month, This/Last Year)
- **Manual Picker**: Two date inputs (start/end) with validation
- **Toggle**: Switch between modes with visual feedback

### Filter Section

- **4 Dropdown Selects**: Class, Student, Teacher, Parent
- **Smart Options**: Shows relevant info (e.g., student's class, class grade)
- **Clear Button**: Appears when any filter is active
- **Visual Feedback**: Purple theme for filter section

### Export Button

- **State Management**: Disabled when no category selected
- **Loading State**: Shows spinner and "Exporting..." text
- **Success Feedback**: Toast notification with record count
- **Error Handling**: Toast notification for failures

## Data Flow

1. **User selects filters** → State updates in React component
2. **User clicks Export** → handleExport() function triggered
3. **Date range calculated** → Manual dates or preset range
4. **Filters object built** → { classId, studentId, teacherId, parentId }
5. **Server action called** → exportFunction(startDate, endDate, filters)
6. **Prisma query executed** → Filtered data fetched from database
7. **Data processed** → Mapped to Excel-friendly format
8. **Excel generated** → Using xlsx library with styling
9. **File downloaded** → Browser download with timestamped filename
10. **Feedback shown** → Toast notification confirms success

## Files Modified

### Created Files

- `src/app/api/export-filters/route.ts` - API endpoint for filter options

### Updated Files

- `src/app/(dashboard)/admin/export-data/page.tsx` - Added UI components for filters
- `src/lib/exportActions.ts` - Added filter parameters to all export functions

## Performance Considerations

- ✅ Filter options loaded once on page mount (useEffect)
- ✅ Parallel fetching of filter data (Promise.all)
- ✅ Minimal re-renders (selective state updates)
- ✅ Efficient Prisma queries (indexed fields)
- ✅ Lazy loading of student/teacher/parent lists (only when needed)

## Security

- ✅ Admin-only access (checkAdminAccess in all functions)
- ✅ Server-side validation (filters applied in server actions)
- ✅ SQL injection protection (Prisma parameterized queries)
- ✅ Input sanitization (React form controls)

## Future Enhancements

### Potential Features

1. **Export Templates**: Save common filter combinations
2. **Scheduled Exports**: Auto-export weekly/monthly reports
3. **Email Delivery**: Send exports to admin email
4. **Multi-Category Export**: Export multiple categories at once
5. **Custom Columns**: Let admins choose which fields to export
6. **Export History**: Track all exports with timestamps
7. **Comparison Exports**: Side-by-side data from different periods
8. **Chart Exports**: Include visualizations in Excel

## Testing Checklist

- [ ] Test manual date selection
- [ ] Test all preset date ranges
- [ ] Test class filter
- [ ] Test student filter
- [ ] Test teacher filter
- [ ] Test parent filter
- [ ] Test combined filters (class + date)
- [ ] Test clear filters button
- [ ] Test export with no data (empty result)
- [ ] Test export with large dataset (1000+ records)
- [ ] Test Excel file formatting
- [ ] Test filename generation
- [ ] Test error handling (network failure)
- [ ] Test admin access restriction

## Support

For issues or questions about the export system:

1. Check the browser console for error messages
2. Verify admin role in Clerk
3. Check date range validity (end date after start date)
4. Ensure database has data for selected filters
5. Check network tab for API failures

---

**Last Updated**: October 15, 2025
**Version**: 2.0.0
**Author**: CypherNinjaa
