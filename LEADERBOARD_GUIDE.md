# 🏆 Leaderboard System - Complete Guide

## Overview

The School Management System now includes a comprehensive leaderboard system that ranks students based on their MCQ test performance. The system supports dynamic badge management, configurable ranking criteria, and automatic badge awards.

## Key Features

### 1. **Student Rankings**

- ✅ Ranks students by average MCQ test scores
- ✅ First attempt only scoring (configurable)
- ✅ Tie-breaker: Total tests completed
- ✅ Minimum tests required threshold (default: 1)
- ✅ Filters by class, subject, and time period

### 2. **Badge System**

- ✅ Admin can create/edit/delete badges dynamically
- ✅ Custom icons (emojis), colors, and descriptions
- ✅ JSON-based criteria for automatic assignment
- ✅ Badge types: RANK_BASED, SCORE_BASED, ACTIVITY_BASED, IMPROVEMENT, CUSTOM
- ✅ Display priority/ordering
- ✅ Active/inactive toggle

### 3. **Leaderboard Display**

- ✅ Medal icons for top 3 (🥇🥈🥉)
- ✅ Student photo, name, class
- ✅ Average score, total tests, best score
- ✅ Earned badges display
- ✅ Responsive design (mobile-friendly)
- ✅ Statistics summary (top score, average, participant count)

## Database Schema

### Models Added

#### **LeaderboardConfig**

```prisma
model LeaderboardConfig {
  id                    Int      @id @default(autoincrement())
  useFirstAttemptOnly   Boolean  @default(true)
  minimumTestsRequired  Int      @default(1)
  includeIncomplete     Boolean  @default(false)
  enableTimePeriod      Boolean  @default(false)
  periodDays            Int?
  showTop               Int      @default(10)
  showStudentRank       Boolean  @default(true)
  enableClassFilter     Boolean  @default(true)
  enableSubjectFilter   Boolean  @default(true)
  allowAnonymous        Boolean  @default(false)
  showFullNames         Boolean  @default(true)
  autoAwardBadges       Boolean  @default(true)
}
```

#### **Badge**

```prisma
model Badge {
  id              String    @id @default(cuid())
  name            String
  description     String    @db.Text
  icon            String?
  color           String    @default("#FFD700")
  badgeType       BadgeType @default(CUSTOM)
  criteria        Json
  isActive        Boolean   @default(true)
  priority        Int       @default(0)
  studentBadges   StudentBadge[]
}
```

#### **StudentBadge**

```prisma
model StudentBadge {
  id          String   @id @default(cuid())
  studentId   String
  badgeId     String
  earnedAt    DateTime @default(now())
  metadata    Json?
  student     Student  @relation(...)
  badge       Badge    @relation(...)
}
```

#### **LeaderboardSnapshot** (for historical tracking)

```prisma
model LeaderboardSnapshot {
  id          String   @id @default(cuid())
  snapshotDate DateTime
  data        Json
}
```

## Badge Criteria Examples

Badges use JSON criteria for automatic assignment. Here are examples:

### Rank-Based Badges

```json
{
	"type": "rank",
	"value": 1
}
```

Awards badge to 1st place student.

```json
{
	"type": "rank",
	"maxValue": 3
}
```

Awards badge to top 3 students.

### Score-Based Badges

```json
{
	"type": "averageScore",
	"min": 90
}
```

Awards badge when average score ≥ 90%.

```json
{
	"type": "bestScore",
	"value": 100
}
```

Awards badge for achieving perfect score on any test.

### Activity-Based Badges

```json
{
	"type": "testsCompleted",
	"min": 10
}
```

Awards badge after completing 10+ tests.

```json
{
	"type": "streak",
	"days": 7
}
```

Awards badge for 7-day learning streak (implementation pending).

### Improvement-Based Badges

```json
{
	"type": "improvement",
	"percentIncrease": 20
}
```

Awards badge for 20%+ improvement over time (implementation pending).

## Default Badges Created by Seed

The system comes with 8 pre-configured badges:

1. **🥇 Top Performer** - #1 ranked student
2. **🥈 Silver Medal** - #2 ranked student
3. **🥉 Bronze Medal** - #3 ranked student
4. **⭐ Excellence Award** - 90%+ average
5. **💎 Perfect Score** - 100% on any test
6. **🔥 Active Learner** - 10+ tests completed
7. **📚 Knowledge Seeker** - 5+ tests completed
8. **🎯 Consistent Performer** - 80%+ average

## Admin Operations

### Creating a Badge

1. Navigate to `/list/badges`
2. Click **+ Create Badge**
3. Fill in form:
   - **Name**: Badge display name
   - **Icon**: Emoji (e.g., 🏆)
   - **Description**: What the badge represents
   - **Color**: Hex code (e.g., #FFD700)
   - **Criteria**: JSON criteria (see examples above)
   - **Active**: Check to enable
   - **Display Order**: Priority for display (lower = higher priority)
4. Preview badge appearance
5. Click **Create**

### Editing a Badge

1. Go to `/list/badges`
2. Click **Edit** icon next to badge
3. Modify fields
4. Click **Update**

### Deleting a Badge

1. Go to `/list/badges`
2. Click **Delete** icon next to badge
3. Confirm deletion
4. All student associations will be removed

## Student View

Students can view the leaderboard at `/list/leaderboard`:

- See their rank and stats
- Compare with peers
- View earned badges
- Filter by class/subject/time period
- Motivates healthy competition

## Teacher View

Teachers can access leaderboard at `/list/leaderboard`:

- Monitor student performance
- Identify top performers
- Track badge achievements
- Filter by class/subject for targeted insights

## Technical Implementation

### Key Actions (src/lib/actions.ts)

#### `calculateLeaderboard()`

```typescript
export const calculateLeaderboard = async (filters?: {
  classId?: string;
  subjectId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<LeaderboardEntry[]>
```

**Logic:**

1. Fetch all completed MCQ attempts with filters
2. Group attempts by student and test
3. Sort by startedAt to identify first attempt
4. Calculate average score per student
5. Filter by minimum tests required
6. Assign badges based on criteria
7. Sort by average (DESC), then total tests (DESC)
8. Assign ranks with tie-breaker

#### `autoAwardBadges()`

```typescript
export const autoAwardBadges = async (): Promise<{
  success: boolean;
  awardedCount: number;
}>
```

**Logic:**

1. Get full leaderboard
2. Get all active badges
3. For each student-badge pair:
   - Check if criteria met
   - Award if eligible and not already earned
4. Return count of new badges awarded

### Badge CRUD Actions

- `createBadge(currentState, data)`: Create new badge
- `updateBadge(currentState, data)`: Update existing badge
- `deleteBadge(currentState, data)`: Delete badge and associations

## Routing Configuration

Added to `src/lib/settings.ts`:

```typescript
"/list/leaderboard": ["admin", "teacher", "student"],
"/list/badges": ["admin"],
```

## Menu Items

Added to `src/components/Menu.tsx`:

- **Leaderboard** (visible to admin, teacher, student)
- **Badges** (visible to admin only)

## Files Added/Modified

### New Files

- ✅ `src/app/(dashboard)/list/leaderboard/page.tsx` - Leaderboard display
- ✅ `src/app/(dashboard)/list/badges/page.tsx` - Badge management list
- ✅ `src/components/forms/BadgeForm.tsx` - Badge create/edit form
- ✅ `prisma/seedLeaderboardData.ts` - Sample badge seed script
- ✅ `LEADERBOARD_GUIDE.md` - This guide

### Modified Files

- ✅ `prisma/schema.prisma` - Added 4 new models
- ✅ `src/lib/actions.ts` - Added leaderboard and badge actions (~400 lines)
- ✅ `src/lib/settings.ts` - Added route access
- ✅ `src/components/Menu.tsx` - Added menu items
- ✅ `src/components/FormModal.tsx` - Added badge form support
- ✅ `src/components/FormContainer.tsx` - Added badge type

### Migration

- ✅ `prisma/migrations/20241011135741_add_leaderboard_system/migration.sql`

## Configuration Options

Edit `LeaderboardConfig` to customize behavior:

- `useFirstAttemptOnly`: Use first attempt score vs best score
- `minimumTestsRequired`: Require N tests to appear on leaderboard
- `includeIncomplete`: Include incomplete attempts in calculations
- `enableTimePeriod`: Only count tests from last N days
- `showTop`: Limit leaderboard to top N students
- `showStudentRank`: Display student's own rank
- `enableClassFilter`: Allow filtering by class
- `enableSubjectFilter`: Allow filtering by subject
- `allowAnonymous`: Hide student names
- `showFullNames`: Show full names vs initials
- `autoAwardBadges`: Automatically award badges based on criteria

## Future Enhancements (TODO)

1. **Leaderboard Configuration UI**: Admin page to edit LeaderboardConfig without database access
2. **Historical Snapshots**: Track leaderboard changes over time
3. **Badge Notifications**: Alert students when they earn new badges
4. **Student Badge Profile**: Display earned badges on student profile page
5. **Streak Tracking**: Implement consecutive day attendance/test completion tracking
6. **Improvement Badges**: Calculate and award badges for improvement over time
7. **Class-Specific Leaderboards**: Dedicated leaderboards per class
8. **Subject-Specific Leaderboards**: Dedicated leaderboards per subject
9. **Export Functionality**: Export leaderboard to CSV/PDF
10. **Real-time Updates**: WebSocket updates when rankings change
11. **Badge Rarity System**: Common, Rare, Epic, Legendary badge tiers
12. **Badge Expiration**: Time-limited badges that expire

## API Endpoints (Future)

Consider adding REST API endpoints:

```
GET /api/leaderboard?classId=X&subjectId=Y&period=month
GET /api/badges
POST /api/badges
PATCH /api/badges/:id
DELETE /api/badges/:id
GET /api/student/:id/badges
POST /api/badges/auto-award
```

## Testing Checklist

- [ ] Create badge with valid criteria
- [ ] Edit badge and verify changes
- [ ] Delete badge and verify student associations removed
- [ ] View leaderboard with no data
- [ ] View leaderboard with multiple students
- [ ] Verify first attempt scoring logic
- [ ] Verify average score calculations
- [ ] Verify tie-breaker logic (total tests)
- [ ] Test class filter
- [ ] Test subject filter
- [ ] Test time period filter
- [ ] Verify badge assignment based on rank
- [ ] Verify badge assignment based on score
- [ ] Verify badge assignment based on activity
- [ ] Test responsive layout on mobile
- [ ] Verify permissions (admin, teacher, student)

## Common Issues & Solutions

### Issue: Badges not auto-awarding

**Solution**: Check that `autoAwardBadges` is enabled in LeaderboardConfig. Badges are awarded when `calculateLeaderboard()` is called, which happens on page load.

### Issue: Student not appearing on leaderboard

**Solution**: Check that student has completed at least `minimumTestsRequired` tests. Verify tests have been graded (score is not null).

### Issue: Invalid JSON in badge criteria

**Solution**: Use online JSON validator. Common mistake: missing quotes around keys/values. Example: `{"type":"rank","value":1}`

### Issue: Incorrect ranking

**Solution**: Verify `useFirstAttemptOnly` setting matches desired behavior. Check that all tests have been graded properly.

## Performance Considerations

- Leaderboard calculation can be expensive with many students/tests
- Consider caching leaderboard results (Redis/in-memory)
- Implement pagination for large leaderboards
- Use database indexes on `MCQAttempt.studentId`, `MCQAttempt.testId`, `MCQAttempt.startedAt`
- Consider background job for badge auto-award instead of on-page-load

## Conclusion

The leaderboard system is fully functional and provides a solid foundation for gamification in the School Management System. It encourages student engagement through friendly competition and recognition of achievements.

For questions or issues, refer to the code in:

- `src/lib/actions.ts` (leaderboard logic)
- `src/app/(dashboard)/list/leaderboard/page.tsx` (UI)
- `prisma/schema.prisma` (database schema)
