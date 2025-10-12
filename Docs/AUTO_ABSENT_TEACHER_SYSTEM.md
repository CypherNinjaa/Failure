# Auto-Absent Teacher Attendance System

## Overview

This system automatically marks teachers as absent if they fail to mark their attendance within the configured time window.

## How It Works

### 1. **Attendance Window**

- Configured in `AttendanceSettings` table
- Has a `startTime` and `endTime` (e.g., "08:00" to "08:45")
- Teachers must mark attendance within this window

### 2. **Automatic Detection**

- After the attendance window closes, the system identifies teachers who haven't marked attendance
- These teachers are automatically marked as `present: false` (absent)
- This happens either via:
  - **Automated cron job** (runs daily at 9:00 AM)
  - **Manual trigger** by admin

### 3. **Database Logic**

- Checks all teachers in the system
- Queries `TeacherAttendance` table for today's date
- Finds teachers without a record for today
- Creates absent records for those teachers

## Architecture

### API Endpoints

#### 1. `/api/auto-mark-absent` (GET)

**Purpose:** Check attendance status without marking anyone absent

**Response:**

```json
{
	"success": true,
	"data": {
		"currentTime": "2025-10-12T10:30:00Z",
		"attendanceWindow": {
			"startTime": "08:00",
			"endTime": "08:45",
			"isOpen": false
		},
		"totalTeachers": 15,
		"presentCount": 12,
		"absentCount": 1,
		"notMarkedYet": 2,
		"teachersNotMarked": [
			{ "id": "teacher_123", "name": "John Doe" },
			{ "id": "teacher_456", "name": "Jane Smith" }
		]
	}
}
```

#### 2. `/api/auto-mark-absent` (POST)

**Purpose:** Manually trigger absent marking

**Conditions:**

- Only marks absent if current time is past the `endTime`
- Will not mark teachers who already have attendance records (present or absent)
- Creates absent records with `present: false`

**Response:**

```json
{
	"success": true,
	"message": "Absent teachers marked successfully",
	"data": {
		"totalTeachers": 15,
		"presentCount": 12,
		"absentCount": 3,
		"absentTeachers": [{ "id": "teacher_123", "name": "John Doe" }],
		"markedAt": "2025-10-12T10:30:00Z"
	}
}
```

#### 3. `/api/cron/mark-absent-teachers` (GET)

**Purpose:** Cron job endpoint for automatic scheduling

**Security:**

- Requires `Authorization: Bearer <CRON_SECRET>` header
- Set `CRON_SECRET` environment variable

**Schedule:**

- Configured in `vercel.json`
- Runs daily at 9:00 AM UTC
- Automatically marks absent teachers after attendance window closes

## Setup Instructions

### 1. **Environment Variables**

Add to `.env` or Vercel environment variables:

```env
CRON_SECRET=your_secure_random_string_here
```

### 2. **Vercel Deployment**

The `vercel.json` file is already configured:

```json
{
	"crons": [
		{
			"path": "/api/cron/mark-absent-teachers",
			"schedule": "0 9 * * *"
		}
	]
}
```

**Schedule Format:** `minute hour day month dayOfWeek`

- `0 9 * * *` = Every day at 9:00 AM UTC

**To change schedule:**

- Modify the `schedule` field
- Examples:
  - `0 10 * * *` = 10:00 AM daily
  - `30 8 * * 1-5` = 8:30 AM Monday-Friday
  - `0 */2 * * *` = Every 2 hours

### 3. **Alternative: External Cron Services**

If not using Vercel, you can use external cron services:

**EasyCron / Cron-Job.org:**

```
URL: https://your-domain.com/api/cron/mark-absent-teachers
Method: GET
Header: Authorization: Bearer YOUR_CRON_SECRET
Schedule: Daily at desired time
```

**GitHub Actions:**

```yaml
name: Mark Absent Teachers
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  mark-absent:
    runs-on: ubuntu-latest
    steps:
      - name: Call API
        run: |
          curl -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
               https://your-domain.com/api/cron/mark-absent-teachers
```

## Admin Dashboard

### Location

`/admin/auto-absent`

### Features

1. **Check Status Button**

   - View current attendance statistics
   - See who hasn't marked yet
   - Check if window is open/closed
   - No changes to database

2. **Mark Absent Now Button**

   - Manually trigger absent marking
   - Useful for testing or immediate action
   - Requires confirmation
   - Only works after window closes

3. **Statistics Display**

   - Total teachers
   - Present count
   - Absent count
   - Not marked yet count
   - List of teachers not marked

4. **Results Display**
   - Shows successful operations
   - Lists newly marked absent teachers
   - Displays timestamp

## Database Schema

### TeacherAttendance Model

```prisma
model TeacherAttendance {
  id               Int       @id @default(autoincrement())
  date             DateTime
  present          Boolean   @default(true)  // FALSE for absent
  checkInTime      DateTime  @default(now())
  teacherId        String
  teacher          Teacher   @relation(...)
  locationId       Int?      // NULL for absent
  location         Location? @relation(...)
  livenessVerified Boolean   @default(false) // FALSE for absent
  latitude         Float?    // NULL for absent
  longitude        Float?    // NULL for absent

  @@unique([teacherId, date])
}
```

### AttendanceSettings Model

```prisma
model AttendanceSettings {
  id        Int      @id @default(autoincrement())
  startTime String   // "HH:MM"
  endTime   String   // "HH:MM"
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Workflow Diagram

```
09:00 - Cron Job Triggers
   ↓
Check AttendanceSettings (isActive = true)
   ↓
Get endTime (e.g., "08:45")
   ↓
Current time > endTime?
   ↓ YES
Query all Teachers
   ↓
Query TeacherAttendance (today's date)
   ↓
Find teachers NOT in attendance records
   ↓
Create absent records:
- present: false
- checkInTime: endTime
- livenessVerified: false
- locationId: null
   ↓
Log results
```

## Business Logic

### Marking Criteria

✅ **Will be marked absent if:**

- Teacher exists in database
- No attendance record for today
- Current time is past endTime
- Attendance window is active

❌ **Will NOT be marked absent if:**

- Teacher already has attendance record (present OR absent)
- Current time is before endTime
- No active attendance settings
- Attendance window is still open

### Duplicate Prevention

- Uses `@@unique([teacherId, date])` constraint
- `createMany` with `skipDuplicates: true`
- Multiple runs won't create duplicate records

## Testing

### Manual Testing

1. **Setup:**

   ```
   - Configure attendance window: 08:00 - 08:45
   - Create test teachers
   - Have some teachers mark attendance
   ```

2. **Before Window Closes (e.g., 08:30):**

   ```
   - Click "Check Status" → Shows unmarked teachers
   - Click "Mark Absent Now" → Should fail (window still open)
   ```

3. **After Window Closes (e.g., 09:00):**
   ```
   - Click "Check Status" → Shows unmarked teachers
   - Click "Mark Absent Now" → Marks them absent
   - Check database → Absent records created
   ```

### API Testing

```bash
# Check status
curl https://your-domain.com/api/auto-mark-absent

# Mark absent (manual trigger)
curl -X POST https://your-domain.com/api/auto-mark-absent

# Cron endpoint (with auth)
curl -H "Authorization: Bearer YOUR_SECRET" \
     https://your-domain.com/api/cron/mark-absent-teachers
```

### Database Verification

```sql
-- Check today's attendance
SELECT
  ta.*,
  t.name,
  t.surname
FROM TeacherAttendance ta
JOIN Teacher t ON ta.teacherId = t.id
WHERE ta.date >= CURRENT_DATE
ORDER BY ta.present DESC, t.name;

-- Count present vs absent
SELECT
  present,
  COUNT(*) as count
FROM TeacherAttendance
WHERE date >= CURRENT_DATE
GROUP BY present;
```

## Monitoring & Logs

### Server Logs

Check console output for:

```
[CRON] Marked 3 teachers as absent for Sat Oct 12 2025
```

### Error Handling

All endpoints return structured errors:

```json
{
	"success": false,
	"message": "Failed to mark absent teachers",
	"error": "Detailed error message"
}
```

## Security Considerations

1. **Cron Endpoint Protection**

   - Requires `CRON_SECRET` in headers
   - Prevents unauthorized triggering
   - Secret should be complex and secure

2. **Admin-Only Access**

   - Manual trigger page requires admin role
   - Checked via Clerk authentication
   - Redirects non-admins

3. **Data Integrity**
   - Unique constraint prevents duplicates
   - Transaction safety with Prisma
   - Validation before marking

## Troubleshooting

### Cron Job Not Running

**Check:**

- Vercel cron is enabled for your project
- `vercel.json` is deployed
- Environment variables are set
- Check Vercel logs

**Solution:**

- Redeploy after adding `vercel.json`
- Verify cron syntax
- Check Vercel dashboard → Cron Jobs

### Teachers Not Being Marked

**Check:**

- Attendance window configuration
- Current time vs endTime
- AttendanceSettings.isActive = true
- Teachers exist in database

**Solution:**

- Use "Check Status" to debug
- Verify time zones (UTC vs local)
- Check database records manually

### Duplicate Records Error

**Check:**

- Database constraint exists
- Using `skipDuplicates: true`

**Solution:**

- Migration should create unique constraint
- Manual cleanup if needed

## Future Enhancements

1. **Notifications**

   - Send notification to absent teachers
   - Daily summary to admin
   - SMS/Email alerts

2. **Grace Period**

   - Allow late marking with approval
   - Configurable grace minutes
   - Mark as "late" instead of absent

3. **Weekend/Holiday Handling**

   - Skip marking on weekends
   - Check holiday calendar
   - Configurable working days

4. **Reports**

   - Weekly absence summary
   - Teacher absence trends
   - Export to CSV/PDF

5. **Multiple Time Windows**
   - Morning and afternoon sessions
   - Different windows per department
   - Flexible scheduling

## Related Files

- **API Routes:**

  - `src/app/api/auto-mark-absent/route.ts`
  - `src/app/api/cron/mark-absent-teachers/route.ts`

- **Admin Page:**

  - `src/app/(dashboard)/admin/auto-absent/page.tsx`

- **Components:**

  - `src/components/AutoAbsentManagement.tsx`

- **Configuration:**

  - `vercel.json`
  - `prisma/schema.prisma`

- **Menu:**
  - `src/components/Menu.tsx` (Auto-Absent menu item)

## Summary

This auto-absent system ensures accurate teacher attendance tracking by:

1. ✅ Automatically marking absent teachers after the window closes
2. ✅ Providing admin control and visibility
3. ✅ Running on a scheduled basis without manual intervention
4. ✅ Maintaining data integrity and preventing duplicates
5. ✅ Offering both automated and manual triggers

The system is production-ready, secure, and fully integrated with your existing attendance infrastructure.
