# 🏆 Leaderboard System Setup Guide

## ✅ Issue Fixed

### Error Message:

```
Error calculating leaderboard: Error: Leaderboard configuration not found
```

### Root Cause:

The `LeaderboardConfig` table was empty. The leaderboard system requires a configuration record to function.

### Solution Applied:

Ran the leaderboard seed file to create the default configuration:

```powershell
npx ts-node prisma/seedLeaderboardData.ts
```

**Result**: ✅ Leaderboard config created with default settings

---

## 📊 What Was Created

### 1. Leaderboard Configuration

Created in `LeaderboardConfig` table with these settings:

```typescript
{
  useFirstAttemptOnly: true,        // Only count first attempt at each test
  minimumTestsRequired: 1,          // Students need at least 1 test
  showTop: 50,                      // Display top 50 students
  autoAwardBadges: true,            // Automatically award badges
  includeIncomplete: false,         // Don't count incomplete tests
  enableTimePeriod: false,          // No time period filtering
  showStudentRank: true,            // Show rank numbers
  enableClassFilter: true,          // Allow filtering by class
  enableSubjectFilter: true,        // Allow filtering by subject
  allowAnonymous: false,            // Show real names
  showFullNames: true,              // Display full names
}
```

### 2. Default Badges (8 created)

- 🥇 **Top Performer** - #1 rank (Gold)
- 🥈 **Silver Medal** - #2 rank (Silver)
- 🥉 **Bronze Medal** - #3 rank (Bronze)
- ⭐ **Excellence Award** - 90%+ average score
- 💎 **Perfect Score** - 100% on any test
- 🔥 **Active Learner** - 10+ tests completed
- 📚 **Knowledge Seeker** - 5+ tests completed
- 🎯 **Consistent Performer** - 80%+ average

---

## 🎯 How Leaderboard Works

### Calculation Logic:

1. Fetches all **completed** MCQ test attempts
2. Groups by student
3. Calculates for each student:
   - **Average Score**: Mean of all test scores
   - **Total Tests**: Number of tests taken
   - **Best Score**: Highest score achieved
4. Sorts by average score (descending)
5. Assigns ranks (1st, 2nd, 3rd, etc.)
6. Awards badges based on criteria
7. Returns top N students (configurable)

### Filters Available:

- **By Class**: Show only specific class leaderboard
- **By Subject**: Show subject-specific rankings
- **By Date Range**: Time period filtering (if enabled)

---

## 🔧 Leaderboard Configuration Options

You can update the configuration in the database or through an admin interface:

### Key Settings:

1. **`useFirstAttemptOnly`** (boolean)

   - `true`: Only count first attempt at each test
   - `false`: Count best attempt or all attempts

2. **`minimumTestsRequired`** (number)

   - Minimum tests needed to appear on leaderboard
   - Default: 1

3. **`showTop`** (number)

   - How many students to display
   - Default: 50
   - Set to `null` for unlimited

4. **`autoAwardBadges`** (boolean)

   - Automatically award badges when criteria met
   - Default: true

5. **`includeIncomplete`** (boolean)

   - Whether to count incomplete tests
   - Default: false

6. **`enableTimePeriod`** (boolean)
   - Enable filtering by date range
   - Default: false

---

## 🎖️ Badge System

### Badge Types:

1. **RANK_BASED**

   - Awarded for achieving specific ranks
   - Example: 🥇 Top Performer (Rank 1)

2. **SCORE_BASED**

   - Awarded for score achievements
   - Example: ⭐ Excellence Award (90%+ average)

3. **ACTIVITY_BASED**

   - Awarded for participation
   - Example: 📚 Knowledge Seeker (5+ tests)

4. **IMPROVEMENT**
   - Awarded for progress over time
   - Example: 📈 Most Improved

### Badge Criteria Format:

```typescript
// Rank-based
{ type: "rank", value: 1 }                    // Exactly rank 1
{ type: "rank", maxValue: 5 }                 // Top 5 ranks

// Score-based
{ type: "averageScore", min: 90 }             // 90%+ average
{ type: "bestScore", value: 100 }             // Perfect 100

// Activity-based
{ type: "testsCompleted", min: 10 }           // 10+ tests
{ type: "streak", count: 5, minScore: 90 }    // 5 consecutive 90%+

// Improvement
{ type: "improvement", method: "highest" }     // Most improved
{ type: "improvement", minPoints: 20 }         // +20 points
```

---

## 🚀 Testing the Leaderboard

### 1. View Student Leaderboard:

```
Student Dashboard → StudentLeaderboardWidget shows top students
```

### 2. Admin View:

```
Admin Dashboard → Can view full leaderboard with filters
```

### 3. Verify Data:

```powershell
npx prisma studio
```

- Check `LeaderboardConfig` table (should have 1 record)
- Check `Badge` table (should have 8+ badges)
- Check `StudentBadge` table (students awarded badges)
- Check `MCQAttempt` table (completed tests for ranking)

---

## 📝 Adding More Badges

You can add custom badges by running:

```typescript
await prisma.badge.create({
	data: {
		name: "🌟 Custom Badge",
		description: "Your custom badge description",
		icon: "🌟",
		color: "#FF6B6B",
		badgeType: "SCORE_BASED",
		criteria: { type: "averageScore", min: 95 },
		isActive: true,
		priority: 9,
	},
});
```

Or use Prisma Studio to add badges manually.

---

## 🔄 Re-running Seeds

If you need to reset the leaderboard system:

```powershell
# Reset and recreate config + badges
npx ts-node prisma/seedLeaderboardData.ts

# Add more advanced badges
npx ts-node prisma/seedLeaderboard.ts
```

**Note**: These scripts use `upsert` so they won't create duplicates.

---

## 🐛 Troubleshooting

### Error: "Leaderboard configuration not found"

**Solution**: Run `npx ts-node prisma/seedLeaderboardData.ts`

### No students appearing on leaderboard

**Check**:

1. Students have completed MCQ tests (check `MCQAttempt` table)
2. `completedAt` is not null for attempts
3. `minimumTestsRequired` setting in config

### Badges not being awarded

**Check**:

1. `autoAwardBadges` is `true` in config
2. Badge criteria matches student performance
3. Badges are `isActive: true`

### Performance issues with large datasets

**Solutions**:

1. Reduce `showTop` value (show fewer students)
2. Enable `useFirstAttemptOnly` (reduces calculations)
3. Add database indexes on frequently queried fields

---

## 📊 Database Schema

### LeaderboardConfig (1 record)

```prisma
model LeaderboardConfig {
  id                   String   @id @default(uuid())
  useFirstAttemptOnly  Boolean  @default(true)
  minimumTestsRequired Int      @default(1)
  showTop              Int?     @default(50)
  autoAwardBadges      Boolean  @default(true)
  // ... other settings
}
```

### Badge (Many records)

```prisma
model Badge {
  id          String   @id @default(uuid())
  name        String
  description String?
  icon        String?
  color       String
  badgeType   BadgeType
  criteria    Json
  isActive    Boolean  @default(true)
  priority    Int      @default(0)
  students    StudentBadge[]
}
```

### StudentBadge (Many records - awards)

```prisma
model StudentBadge {
  id        String   @id @default(uuid())
  studentId String
  badgeId   String
  awardedAt DateTime @default(now())
  student   Student  @relation(...)
  badge     Badge    @relation(...)
}
```

---

## ✅ Status

- [x] Leaderboard config created
- [x] Default badges seeded
- [x] Error fixed
- [x] System operational

The leaderboard is now **fully functional**! 🎉

Students will see their rankings, badges, and performance metrics automatically.
