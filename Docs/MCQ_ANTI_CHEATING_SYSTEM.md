# 🛡️ MCQ Test Anti-Cheating System - Complete Implementation Guide

## Overview

This comprehensive anti-cheating system protects MCQ tests from cheaters with progressive penalties, automatic suspension, and leaderboard removal.

## 🎯 Features Implemented

### 1. **Detection Methods**

- ✅ **Tab Switching** - Visibility API detection
- ✅ **Window Blur/Minimize** - Focus event tracking
- ✅ **Right-Click Prevention** - Context menu blocking
- ✅ **Copy/Paste Prevention** - Clipboard event blocking
- ✅ **DevTools Detection** - Window size monitoring
- ✅ **Fullscreen Enforcement** - Mandatory fullscreen with auto-re-entry
- ✅ **Browser Back Button** - Navigation prevention

### 2. **Progressive Penalty System**

| Violation #        | Penalty                | Action           | Effect                              |
| ------------------ | ---------------------- | ---------------- | ----------------------------------- |
| **1st**            | ⚠️ -10%                | Warning          | Score reduced by 10%                |
| **2nd**            | 🚫 -25%                | Major Penalty    | Score reduced by 25%                |
| **3rd**            | ❌ -50% + Auto-Submit  | Test Terminated  | Test force-submitted, max score 50% |
| **4+ Total**       | 🔒 7-Day Ban           | Suspension       | Cannot take any tests for 7 days    |
| **Multiple Tests** | 💀 Leaderboard Removal | Permanent Record | Removed from rankings               |

### 3. **Database Schema**

#### New Fields in `MCQAttempt`:

```prisma
model MCQAttempt {
  // ... existing fields ...

  // Anti-Cheating System
  cheatingViolations      Int       @default(0)
  violationDetails        Json?     // Array of violation events
  isTerminatedForCheating Boolean   @default(false)
  finalPenaltyPercentage  Float     @default(0)
}
```

#### New Model `CheatingSuspension`:

```prisma
model CheatingSuspension {
  id             String   @id @default(cuid())
  studentId      String
  reason         String   @db.Text
  violationCount Int      // Total lifetime violations
  suspendedAt    DateTime @default(now())
  suspendedUntil DateTime
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())

  student Student @relation(...)

  @@index([studentId])
  @@index([isActive])
  @@index([suspendedUntil])
}
```

## 📋 Implementation Steps

### Step 1: Apply Database Migration

```bash
# Run Prisma migration
npx prisma migrate dev --name add_anti_cheating_system

# Generate Prisma client
npx prisma generate
```

### Step 2: Files Created/Modified

#### ✅ Created Files:

1. **`src/components/AntiCheatingTestClient.tsx`**

   - Enhanced test client with all security features
   - Real-time violation tracking
   - Fullscreen enforcement
   - Auto-termination on 3rd violation

2. **`prisma/migrations/20251012_add_anti_cheating_system/migration.sql`**
   - Database schema changes
   - New table and columns

#### ✅ Modified Files:

1. **`prisma/schema.prisma`**

   - Added anti-cheating fields to `MCQAttempt`
   - Added `CheatingSuspension` model
   - Added relation to `Student` model

2. **`src/lib/actions.ts`**

   - Added `recordCheatingViolation()` - Records violations
   - Added `checkStudentSuspension()` - Checks if student is banned
   - Modified `completeMCQAttempt()` - Applies penalties to final score

3. **`src/app/(dashboard)/student/mcq-tests/[id]/take/page.tsx`**
   - Added suspension check before allowing test
   - Shows suspension notice if banned
   - Passes current violation count to client

### Step 3: How It Works

#### **During Test:**

1. **Student enters fullscreen** (enforced automatically)
2. **Security monitoring activates:**
   - Tab visibility tracking
   - Window focus tracking
   - Right-click/copy prevention
   - DevTools size detection (every 3 seconds)
3. **Violation detected:**

   ```
   1. Client-side: Instant UI warning
   2. Server action: recordCheatingViolation()
   3. Database: Update violation count + details
   4. UI: Show penalty notification
   ```

4. **Progressive response:**
   - **Violation 1:** Yellow warning banner, -10% penalty
   - **Violation 2:** Red alert banner, -25% penalty
   - **Violation 3:** Critical warning, auto-submit in 3 seconds, -50% penalty

#### **After 3rd Violation:**

```typescript
// Auto-terminate test
1. Show termination screen (3 seconds)
2. Redirect to results page with ?terminated=true
3. completeMCQAttempt() applies penalties:
   - Base score calculated
   - Apply penalty: score - (score * 50%)
   - Cap maximum at 50%
```

#### **After 4+ Total Violations:**

```typescript
// Check across all tests
const totalViolations = sum of all attempts.cheatingViolations

if (totalViolations >= 4) {
  // Create 7-day suspension
  await prisma.cheatingSuspension.create({
    studentId,
    suspendedUntil: new Date(+7 days),
    violationCount: totalViolations
  })

  // Remove from leaderboard
  await prisma.leaderboardSnapshot.deleteMany({
    where: { studentId }
  })
}
```

## 🔧 Configuration

### Violation Thresholds (Edit in `AntiCheatingTestClient.tsx`):

```typescript
const PENALTY_CONFIG = {
	1: { penalty: 10, message: "1st Warning: -10% score penalty" },
	2: { penalty: 25, message: "2nd Violation: -25% score penalty" },
	3: { penalty: 50, message: "FINAL WARNING: -50% penalty" },
};
```

### Suspension Duration (Edit in `actions.ts`):

```typescript
// Change days from 7 to desired value
suspendedUntil.setDate(suspendedUntil.getDate() + 7);
```

### Violation Cooldown (Edit in `AntiCheatingTestClient.tsx`):

```typescript
// Minimum time between violations (prevent spam)
if (now - lastViolationTimeRef.current < 2000) return; // 2 seconds
```

## 🎨 User Experience

### Security Status Bar

```
🔒 Fullscreen: ✓ | Proctored Mode Active | Violations: 1/3 | Penalty: -10%
```

### Violation Warning (Animated)

```
⚠️ Tab switching detected!
Violation #1 - Current Penalty: -10%
```

### Test Termination Screen

```
🚫 Test Terminated
This test has been terminated due to repeated cheating violations.
Your test will be auto-submitted with a 50% score penalty.
Total Violations: 3
Redirecting to results...
```

### Suspension Notice

```
🚫 Account Suspended
Reason: Multiple tab switches during MCQ Test
Total Violations: 5
Suspended Until: October 19, 2025
7 days remaining

You cannot take tests during this suspension period.
[Back to Dashboard]
```

## 📊 Violation Tracking

### Stored in `violationDetails` JSON:

```json
[
	{
		"type": "TAB_SWITCH",
		"timestamp": "2025-10-12T14:30:00Z",
		"violationNumber": 1
	},
	{
		"type": "WINDOW_BLUR",
		"timestamp": "2025-10-12T14:32:15Z",
		"violationNumber": 2
	},
	{
		"type": "EXIT_FULLSCREEN",
		"timestamp": "2025-10-12T14:35:00Z",
		"violationNumber": 3
	}
]
```

## 🔍 Admin/Teacher View

### Viewing Violations (Add to results page):

```typescript
// In results page, show violation details
const attempt = await prisma.mCQAttempt.findUnique({
	where: { id },
	select: {
		cheatingViolations: true,
		violationDetails: true,
		isTerminatedForCheating: true,
		finalPenaltyPercentage: true,
	},
});

// Display:
if (attempt.cheatingViolations > 0) {
	// Show warning badge
	// List violation types and times
	// Display final penalty applied
}
```

### Checking Suspended Students:

```typescript
// Admin dashboard query
const suspendedStudents = await prisma.cheatingSuspension.findMany({
	where: { isActive: true },
	include: { student: true },
	orderBy: { suspendedAt: "desc" },
});
```

## 🛠️ Testing the System

### Manual Testing:

1. **Start a test**

   - Notice fullscreen enforcement
   - See security status bar

2. **Trigger violations:**

   - Press `Alt+Tab` to switch tabs (TAB_SWITCH)
   - Press `Windows+D` to minimize (WINDOW_BLUR)
   - Right-click on page (RIGHT_CLICK)
   - Try `Ctrl+C` to copy (COPY_PASTE)
   - Press `F11` to exit fullscreen (EXIT_FULLSCREEN)
   - Open DevTools `F12` (DEVTOOLS)

3. **Verify penalties:**

   - Check warning appears
   - Check violation count increments
   - Check penalty percentage updates

4. **Trigger termination:**

   - Get 3 violations
   - Verify auto-submit after 3 seconds
   - Check results page shows penalty

5. **Test suspension:**
   - Complete 2+ tests with 2 violations each
   - Try to access test page
   - Verify suspension notice appears

### Database Verification:

```sql
-- Check attempt violations
SELECT
  id,
  cheatingViolations,
  violationDetails,
  finalPenaltyPercentage,
  isTerminatedForCheating
FROM "MCQAttempt"
WHERE cheatingViolations > 0;

-- Check suspensions
SELECT * FROM "CheatingSuspension" WHERE isActive = true;

-- Student violation history
SELECT
  s.name,
  s.surname,
  COUNT(a.id) as total_attempts,
  SUM(a.cheatingViolations) as total_violations
FROM "Student" s
LEFT JOIN "MCQAttempt" a ON a.studentId = s.id
GROUP BY s.id
HAVING SUM(a.cheatingViolations) > 0;
```

## ⚖️ Score Calculation Examples

### Example 1: No Violations

```
Correct: 8/10 = 80%
Penalty: 0%
Final Score: 80%
```

### Example 2: 1 Violation

```
Correct: 8/10 = 80%
Penalty: 10% of 80 = 8%
Final Score: 80 - 8 = 72%
```

### Example 3: 2 Violations

```
Correct: 9/10 = 90%
Penalty: 25% of 90 = 22.5%
Final Score: 90 - 22.5 = 67.5%
```

### Example 4: 3 Violations (Terminated)

```
Correct: 10/10 = 100%
Penalty: 50% of 100 = 50%
Terminated: Max capped at 50%
Final Score: min(100 - 50, 50) = 50%
```

## 🚀 Advanced Features (Optional)

### 1. **Negative Scores** (If requested):

```typescript
// In completeMCQAttempt, remove Math.max(0, ...)
score = score - penaltyAmount; // Allow negative
```

### 2. **Email Notifications**:

```typescript
// In recordCheatingViolation
if (newViolationCount >= 3) {
	await sendEmail({
		to: student.email,
		subject: "Test Violation Warning",
		body: "You have been flagged for cheating...",
	});
}
```

### 3. **Permanent Ban** (5+ violations):

```typescript
if (totalLifetimeViolations >= 5) {
	await prisma.student.update({
		where: { id: studentId },
		data: {
			isBanned: true, // Add field to schema
			bannedReason: "Repeated cheating violations",
		},
	});
}
```

### 4. **Violation Report for Teachers**:

Create a page at `/teacher/violation-reports` showing:

- Students with violations
- Test-by-test breakdown
- Violation types histogram
- Suspension list

### 5. **Webcam Proctoring** (Future):

- Capture photo every 30 seconds
- Face detection to ensure student present
- Multiple faces = violation
- Looking away = warning

## 📝 Important Notes

### Browser Compatibility:

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Fullscreen API may need user permission
- ⚠️ Mobile browsers: Fullscreen may not work (consider disabling tests on mobile)

### Limitations:

- **Virtual Machines**: Students can use VMs to bypass
- **Second Device**: Cannot detect phones/tablets
- **Screen Recording**: Cannot prevent recording tools
- **Extension Blocking**: Students might use tools to block detection

### Recommendations:

1. **Combine with**:

   - Time pressure (short duration per question)
   - Question randomization
   - Answer shuffling
   - Unique questions per student

2. **For High-Stakes Tests**:

   - Require in-person proctoring
   - Use lockdown browser software
   - Enable webcam monitoring

3. **Privacy Considerations**:
   - Inform students about monitoring
   - Don't record screens/webcams without consent
   - Store violation data securely

## 🎓 Summary

This anti-cheating system provides:

✅ **Detection**: 7 different violation types tracked in real-time
✅ **Progressive Penalties**: Warnings → Deductions → Termination → Ban
✅ **Enforcement**: Fullscreen mode, copy/paste blocking, navigation prevention
✅ **Tracking**: Detailed violation logs with timestamps
✅ **Consequences**: Score penalties, test termination, 7-day suspensions, leaderboard removal
✅ **Student Experience**: Clear warnings, visible penalty counter, educational approach
✅ **Teacher Insights**: Violation history visible in results (to be added to UI)

The system balances strict security with user experience, giving students clear warnings before severe penalties.

## 📞 Support

For issues or questions:

- Check browser console for errors
- Verify Prisma schema is up to date
- Ensure migration was applied
- Check student suspension status in database
- Review violation logs in `violationDetails` JSON

---

**Created**: October 12, 2025
**Version**: 1.0
**Status**: Ready for Production
