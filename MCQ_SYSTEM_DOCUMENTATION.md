# MCQ System Implementation - Phase 2 Complete ✅

## 🎯 Overview

This document outlines the comprehensive Multiple Choice Question (MCQ) system implemented in the School Management Dashboard. The system includes full CRUD operations, anti-cheating measures, scoring with negative marking, leaderboards, and adaptive learning features.

---

## ✅ Phase 1: Database Schema (COMPLETE)

### Models Created:

1. **MCQTest** - Test container with settings

   - Fields: title, description, subject, class, teacher, duration, deadline, totalPoints
   - Features: shuffle questions/options, passing score, publish/draft status

2. **MCQQuestion** - Individual questions

   - Fields: questionType, text, options (JSON), correctAnswer (JSON), points, negativeMarking (max 4)
   - Types: MULTIPLE_CHOICE, MULTI_SELECT, TRUE_FALSE, FILL_BLANK, MATCH_FOLLOWING

3. **MCQAttempt** - Student test submissions

   - Fields: score, correctAnswers, wrongAnswers, unanswered, timeSpent, answers (JSON)
   - Anti-cheat: tabSwitches, copyPasteAttempts, isFlagged

4. **WrongAnswer** - Adaptive learning tracker

   - Fields: studentId, questionId, attemptCount, lastAttempted, isResolved

5. **StudentPoints** - Leaderboard and points

   - Fields: totalPoints, rank, testsCompleted, averageScore

6. **QuestionType** Enum
   - Values: MULTIPLE_CHOICE, MULTI_SELECT, TRUE_FALSE, FILL_BLANK, MATCH_FOLLOWING

### Database Migration:

- Migration Name: `20251010191452_add_mcq_system`
- Status: ✅ Successfully applied
- Prisma Client: ✅ Regenerated

---

## ✅ Phase 2: Server Actions & Business Logic (COMPLETE)

### Test Management Actions:

1. **createMCQTest**

   - Creates new test with validation
   - Validates: subject, class, teacher, duration > 0
   - Returns: success/error state

2. **updateMCQTest**

   - Updates test settings
   - Validates: same rules as create
   - Returns: success/error state

3. **deleteMCQTest**

   - Cascading delete: removes test + questions + attempts
   - Uses Prisma transaction for atomicity
   - Returns: success/error state

4. **publishMCQTest**
   - Toggles `isPublished` boolean
   - Controls student visibility
   - Returns: success/error state

### Question Management Actions:

5. **createMCQQuestion**

   - Adds question to test
   - Auto-calculates test totalPoints
   - Validates: questionType, points >= 1, negativeMarking 0-4
   - Returns: success/error state

6. **updateMCQQuestion**

   - Updates question content
   - Recalculates test totalPoints
   - Validates: same rules as create
   - Returns: success/error state

7. **deleteMCQQuestion**
   - Removes question from test
   - Recalculates test totalPoints
   - Returns: success/error state

### Test Taking Actions:

8. **startMCQAttempt**

   - Validates:
     - Test exists and is published
     - Deadline not passed
     - No existing attempt
   - Creates attempt record with empty answers
   - Returns: attemptId

9. **submitMCQAttempt** (⭐ Core scoring engine)
   - Parses student answers from JSON
   - Calculates score:
     ```typescript
     correctAnswer: points += question.points;
     wrongAnswer: points -= question.negativeMarking(max - 4);
     unanswered: points += 0;
     totalScore = Math.max(0, score); // Can't go negative
     percentageScore = (score / totalPoints) * 100;
     ```
   - Saves wrong answers to WrongAnswer table
   - Updates StudentPoints (increments totalPoints and testsCompleted)
   - Flags suspicious attempts:
     - `isFlagged = true` if tabSwitches > 5 OR copyPasteAttempts > 3
   - Triggers leaderboard rank recalculation
   - Returns: score, totalPoints, percentageScore, correctAnswers, wrongAnswers, unanswered

### Leaderboard Actions:

10. **updateLeaderboardRanks**
    - Orders all students by totalPoints (descending)
    - Assigns ranks: 1st place, 2nd place, etc.
    - Calculates average score across all completed tests
    - Returns: success/error state

### Penalty Actions:

11. **applyMissedTestPenalties**
    - Finds all published tests past deadline
    - Checks each student in the class
    - Deducts test totalPoints from students who didn't attempt
    - Updates leaderboard after penalties
    - Returns: success/error state
    - **Usage**: Run as cron job (daily at midnight)

---

## ✅ Phase 3: UI Components (IN PROGRESS)

### Forms Created:

1. **MCQTestForm.tsx** ✅

   - Purpose: Create/Update MCQ tests
   - Fields:
     - Title (text)
     - Description (textarea)
     - Subject (dropdown)
     - Class (dropdown)
     - Teacher (dropdown)
     - Duration (number, minutes)
     - Deadline (datetime-local)
     - Passing Score (number, percentage)
     - Shuffle Questions (checkbox)
     - Shuffle Options (checkbox)
   - Validation: Zod schema with mcqTestSchema
   - State management: useFormState hook
   - Toast notifications: Success/error feedback

2. **MCQQuestionForm.tsx** ✅

   - Purpose: Add/Update questions to tests
   - Fields:
     - Question Type (dropdown with 5 types)
     - Question Text (textarea)
     - Points (number, min 1)
     - Negative Marking (number, 0-4, step 0.25)
     - Explanation (textarea, optional)
     - Image URL (text, optional)
   - Dynamic UI based on question type:

     **MULTIPLE_CHOICE:**

     - Options list with add/remove
     - Radio buttons for correct answer

     **MULTI_SELECT:**

     - Options list with add/remove
     - Checkboxes for multiple correct answers

     **TRUE_FALSE:**

     - Fixed "True" / "False" radio buttons

     **FILL_BLANK:**

     - Single text input for correct answer

     **MATCH_FOLLOWING:**

     - Pairs of inputs (left ↔ right)
     - Add/remove pairs dynamically

   - State management: useState for options/pairs, useFormState for submission
   - Validation: Zod schema with mcqQuestionSchema

### Pages Created:

3. **MCQ Tests List Page** ✅
   - Path: `/list/mcq-tests`
   - Features:
     - Role-based filtering:
       - Admin: See all tests
       - Teacher: See own tests
       - Student: See published tests for their class
       - Parent: See published tests for children's classes
     - Search by title
     - Filter by class, subject, teacher
     - Columns: Title, Subject, Class, Teacher, Questions Count, Attempts Count, Duration, Deadline, Status (Published/Draft)
     - Actions: Create, Update, Delete (admin/teacher only)
     - Pagination: 10 items per page

### Navigation Updates:

4. **Menu.tsx** ✅
   - Added "MCQ Tests" menu item
   - Icon: exam.png
   - Visible to: admin, teacher, student, parent
   - Position: Between "Assignments" and "Results"

### Modal & Form Integration:

5. **FormModal.tsx** ✅

   - Added dynamic imports:
     - MCQTestForm (lazy loaded)
     - MCQQuestionForm (lazy loaded)
   - Added delete actions:
     - deleteMCQTest
     - deleteMCQQuestion
   - Registered forms in forms object:
     - `mcqTest` → MCQTestForm
     - `mcqQuestion` → MCQQuestionForm

6. **FormContainer.tsx** ✅
   - Added table types: "mcqTest", "mcqQuestion"
   - Added related data fetching for mcqTest:
     - Subjects list
     - Classes list
     - Teachers list
   - mcqQuestion relatedData passed from parent (testId)

---

## 🎮 How to Use (Teacher Workflow)

### Step 1: Create a Test

1. Navigate to `/list/mcq-tests`
2. Click the yellow "+" button (top right)
3. Fill in test details:
   - Title: "Math Quiz - Chapter 5"
   - Description: "Covers algebra and geometry"
   - Subject: Mathematics
   - Class: 10-A
   - Teacher: Select yourself
   - Duration: 30 minutes
   - Deadline: Tomorrow 11:59 PM
   - Passing Score: 70%
   - Shuffle Questions: ✓ (recommended)
   - Shuffle Options: ✓ (recommended)
4. Click "Create"
5. Test created in DRAFT mode (not visible to students yet)

### Step 2: Add Questions

1. On test list, click blue "pencil" icon to update test
2. _(Future: Will have "Manage Questions" button inside test detail page)_
3. For now, questions need to be added via direct API or future UI
4. Question types available:
   - Multiple Choice (single correct answer)
   - Multi-Select (multiple correct answers)
   - True/False
   - Fill in the Blank
   - Match the Following

### Step 3: Publish Test

1. Click "Update" on test
2. _(Future: Toggle "Published" status)_
3. Once published, students in the assigned class can see and attempt the test

### Step 4: Review Attempts

1. Navigate to test attempts page _(Future UI)_
2. See student scores, flagged attempts
3. Review wrong answers for adaptive learning

---

## 🎓 How to Use (Student Workflow)

### Step 1: View Available Tests

1. Navigate to `/list/mcq-tests`
2. See only published tests for your class
3. Check deadline and duration

### Step 2: Start Test _(Future UI)_

1. Click "Start Test" button
2. System validates:
   - Deadline not passed ✓
   - No existing attempt ✓
3. Test loads with:
   - Timer countdown
   - Questions (shuffled if enabled)
   - Options (shuffled if enabled)
   - Navigation panel

### Step 3: Take Test _(Future UI)_

1. Answer questions
2. Anti-cheat measures active:
   - Tab switches counted
   - Copy-paste blocked
   - Right-click disabled
   - Fullscreen recommended
3. Submit before time runs out

### Step 4: View Results _(Future UI)_

1. Immediate score display
2. Points earned
3. Percentage score
4. Correct/Wrong/Unanswered breakdown
5. Celebration animation if passed! 🎉

### Step 5: Check Leaderboard _(Future UI)_

1. Navigate to `/student/leaderboard`
2. See your rank
3. View total points
4. Compare with classmates

---

## 🔒 Anti-Cheating Features (Planned)

### Frontend Detection (Phase 4):

1. **Tab Switch Detection**

   - useEffect with `document.visibilitychange` event
   - Count stored in MCQAttempt.tabSwitches
   - Flag if > 5 switches

2. **Copy-Paste Blocking**

   - onCopy, onPaste, onCut event preventDefault
   - Count attempts in MCQAttempt.copyPasteAttempts
   - Flag if > 3 attempts

3. **Right-Click Disabled**

   - onContextMenu preventDefault
   - Prevents inspect element

4. **Fullscreen Enforcement**

   - Request Fullscreen API
   - Warn if exited

5. **Time Tracking**

   - Log time per question
   - Detect suspiciously fast answers (< 5 seconds)

6. **Question Randomization**

   - Server-side shuffle based on shuffleQuestions setting
   - Different order per student

7. **Option Randomization**
   - Server-side shuffle based on shuffleOptions setting
   - Different order per student

---

## 📊 Scoring System Details

### Point Calculation:

```typescript
// For each question:
if (studentAnswer === correctAnswer) {
	score += question.points; // e.g., +2
} else if (studentAnswer !== null) {
	score -= question.negativeMarking; // e.g., -0.5 (max -4)
} else {
	// unanswered: no change
}

// Final score:
score = Math.max(0, score); // Can't go negative
percentageScore = (score / test.totalPoints) * 100;
```

### Example Test:

- 10 questions × 2 points each = 20 total points
- Student answers:
  - 7 correct: +14 points
  - 2 wrong (negative marking -0.5): -1 point
  - 1 unanswered: 0 points
- Final score: 14 - 1 = 13 points
- Percentage: (13 / 20) × 100 = 65%
- Pass/Fail: 65% < 70% passing score → FAIL

### Leaderboard Calculation:

- Student A: Test 1 (15 pts) + Test 2 (18 pts) = 33 total → Rank #1
- Student B: Test 1 (20 pts) + Test 2 (10 pts) = 30 total → Rank #2
- Student C: Test 1 (12 pts) + Test 2 (16 pts) = 28 total → Rank #3

---

## 🔄 Adaptive Learning System

### Wrong Answer Tracking:

1. After each test submission, wrong answers saved to `WrongAnswer` table
2. Track: studentId, questionId, attemptCount, lastAttempted
3. isResolved = false (until answered correctly 3 times)

### Repetition Strategy:

1. When creating new test, include unresolved wrong questions
2. Student sees questions they struggled with
3. After 3 correct attempts, mark isResolved = true
4. Remove from future repetition pool

### Example:

- Student answers Question #5 wrong in Test A
- WrongAnswer created: { studentId: "123", questionId: 5, attemptCount: 1 }
- Test B includes Question #5 again (from wrong pool)
- Student answers correctly
- WrongAnswer updated: { attemptCount: 2 }
- After 3rd correct attempt: { isResolved: true }

---

## ⏱️ Deadline Penalty System

### How It Works:

1. Run `applyMissedTestPenalties()` daily at midnight (cron job)
2. Find all tests where deadline < now AND isPublished = true
3. For each test, check each student in the class
4. If no MCQAttempt found:
   - Deduct test.totalPoints from StudentPoints.totalPoints
   - Example: Test worth 20 points → Student loses 20 points
5. Recalculate leaderboard ranks

### Setup Cron Job:

```typescript
// pages/api/cron/penalties.ts
import { applyMissedTestPenalties } from "@/lib/actions";

export default async function handler(req, res) {
	if (req.method === "POST") {
		// Verify cron secret for security
		if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const result = await applyMissedTestPenalties();
		return res.status(200).json(result);
	}

	return res.status(405).json({ error: "Method not allowed" });
}
```

### Vercel Cron (vercel.json):

```json
{
	"crons": [
		{
			"path": "/api/cron/penalties",
			"schedule": "0 0 * * *"
		}
	]
}
```

---

## 🚀 Next Steps (Phase 4 - UI Completion)

### Priority 1: Test Taking Interface

- [ ] Student test attempt page (`/student/test/[testId]`)
- [ ] Question display component (handles all 5 types)
- [ ] Answer input components (radio, checkbox, text, match)
- [ ] Timer component with auto-submit
- [ ] Navigation panel (question list)
- [ ] Anti-cheat implementation (frontend)
- [ ] Submit confirmation modal

### Priority 2: Test Management Details

- [ ] Test detail page (`/list/mcq-tests/[testId]`)
- [ ] Question list with inline editing
- [ ] Drag-drop question reordering
- [ ] Bulk question import (CSV)
- [ ] Test preview (teacher view)
- [ ] Publish/unpublish toggle button

### Priority 3: Results & Analytics

- [ ] Test results page (`/list/mcq-tests/[testId]/results`)
- [ ] Student attempt detail view
- [ ] Flagged attempts review
- [ ] Export results to Excel
- [ ] Charts: score distribution, average by question

### Priority 4: Leaderboard

- [ ] Student leaderboard page (`/student/leaderboard`)
- [ ] Top 10 students display
- [ ] Student rank card with avatar
- [ ] Points history timeline
- [ ] Filter by date range

### Priority 5: Gamification

- [ ] Confetti animation on test completion
- [ ] Achievement badges system
- [ ] Points gained modal with animation
- [ ] Streak tracker
- [ ] Progress bars
- [ ] Sound effects (optional)

### Priority 6: Advanced Features

- [ ] Question bank system (reuse questions)
- [ ] Test templates
- [ ] Scheduled test publishing
- [ ] Email notifications for deadlines
- [ ] Mobile app optimization
- [ ] Offline test taking (PWA)
- [ ] AI-powered question generation

---

## 📁 File Structure

```
src/
├── app/
│   └── (dashboard)/
│       └── list/
│           └── mcq-tests/
│               └── page.tsx (MCQ Tests List) ✅
├── components/
│   ├── forms/
│   │   ├── MCQTestForm.tsx ✅
│   │   └── MCQQuestionForm.tsx ✅
│   ├── FormContainer.tsx (updated) ✅
│   ├── FormModal.tsx (updated) ✅
│   └── Menu.tsx (updated) ✅
├── lib/
│   ├── actions.ts (11 MCQ actions) ✅
│   └── formValidationSchemas.ts (3 MCQ schemas) ✅
└── prisma/
    ├── schema.prisma (6 MCQ models) ✅
    └── migrations/
        └── 20251010191452_add_mcq_system/ ✅
```

---

## 🧪 Testing Checklist

### Backend Testing:

- [ ] Create MCQ test via form
- [ ] Update MCQ test
- [ ] Delete MCQ test (cascading)
- [ ] Create questions (all 5 types)
- [ ] Update questions
- [ ] Delete questions (totalPoints recalculation)
- [ ] Start test attempt (validation)
- [ ] Submit test attempt (scoring logic)
- [ ] Verify wrong answers saved
- [ ] Check StudentPoints updated
- [ ] Verify leaderboard ranks
- [ ] Test missed deadline penalties

### Frontend Testing:

- [x] MCQ Tests menu item appears
- [x] List page loads for all roles
- [x] Create test form opens
- [x] Update test form pre-fills data
- [x] Delete test confirmation works
- [ ] Test detail page loads
- [ ] Questions management works
- [ ] Test taking interface functions
- [ ] Timer counts down correctly
- [ ] Anti-cheat detection works
- [ ] Results page displays correctly
- [ ] Leaderboard shows rankings
- [ ] Celebrations trigger on pass

### Edge Cases:

- [ ] What if student submits after deadline? (Block submission)
- [ ] What if negative marking makes score negative? (Floor at 0)
- [ ] What if student attempts test twice? (Block in startMCQAttempt)
- [ ] What if test has no questions? (Don't allow publish)
- [ ] What if all answers are unanswered? (Score = 0)
- [ ] What if teacher deletes test mid-attempt? (Cascading delete removes attempts)

---

## 🐛 Known Issues & TODOs

1. **Missing UI Components** (Phase 4)

   - Test taking interface not built yet
   - Leaderboard page not built yet
   - Results/analytics not built yet

2. **Question Form Improvements**

   - Need image upload integration (Cloudinary)
   - Need rich text editor for question text (markdown/WYSIWYG)
   - Need drag-drop for option reordering

3. **Validation Enhancements**

   - Prevent publishing test with 0 questions
   - Validate deadline is in future
   - Validate duration >= 1 minute

4. **Performance Optimizations**

   - Cache leaderboard ranks (Redis)
   - Batch wrong answer inserts
   - Optimize large test queries

5. **Security Enhancements**
   - Rate limiting on test submissions
   - CSRF protection for forms
   - Input sanitization for JSON fields

---

## 📚 API Reference

### Server Actions:

#### createMCQTest(currentState, data: MCQTestSchema)

- **Purpose**: Create new MCQ test
- **Returns**: `{ success: boolean, error: boolean, message?: string }`

#### updateMCQTest(currentState, data: MCQTestSchema)

- **Purpose**: Update existing test
- **Returns**: `{ success: boolean, error: boolean, message?: string }`

#### deleteMCQTest(currentState, data: FormData)

- **Purpose**: Delete test and all related data
- **Returns**: `{ success: boolean, error: boolean, message?: string }`

#### publishMCQTest(currentState, data: { id: number, isPublished: boolean })

- **Purpose**: Toggle test visibility
- **Returns**: `{ success: boolean, error: boolean, message?: string }`

#### createMCQQuestion(currentState, data: MCQQuestionSchema)

- **Purpose**: Add question to test
- **Returns**: `{ success: boolean, error: boolean, message?: string }`

#### updateMCQQuestion(currentState, data: MCQQuestionSchema)

- **Purpose**: Update question
- **Returns**: `{ success: boolean, error: boolean, message?: string }`

#### deleteMCQQuestion(currentState, data: FormData)

- **Purpose**: Remove question from test
- **Returns**: `{ success: boolean, error: boolean, message?: string }`

#### startMCQAttempt(currentState, data: { testId: number, studentId: string })

- **Purpose**: Validate and start test
- **Returns**: `{ success: boolean, error: boolean, message?: string, data?: { attemptId: number } }`

#### submitMCQAttempt(currentState, data: MCQAttemptSchema)

- **Purpose**: Calculate score and save results
- **Returns**:

```typescript
{
  success: boolean,
  error: boolean,
  message?: string,
  data?: {
    score: number,
    totalPoints: number,
    percentageScore: number,
    correctAnswers: number,
    wrongAnswers: number,
    unanswered: number
  }
}
```

#### updateLeaderboardRanks()

- **Purpose**: Recalculate all student ranks
- **Returns**: `{ success: boolean }`

#### applyMissedTestPenalties()

- **Purpose**: Deduct points for missed tests
- **Returns**: `{ success: boolean, error: boolean }`

---

## 🎉 Success Metrics

Once complete, the MCQ system will provide:

1. ✅ Comprehensive test creation for teachers
2. ✅ Fair scoring with negative marking (max -4 penalty)
3. ✅ Anti-cheating detection and flagging
4. ✅ Automatic leaderboard updates
5. ✅ Deadline enforcement with penalties
6. ✅ Adaptive learning via wrong answer repetition
7. ✅ Mobile-friendly responsive design
8. ✅ Engaging gamification (celebrations, badges)
9. ✅ Detailed analytics and reporting
10. ✅ Role-based access control

---

**Last Updated**: Phase 2 Complete - Server Actions & Basic UI
**Next Phase**: Test Taking Interface & Anti-Cheating Frontend
**Estimated Completion**: Phase 4 (UI) - 2-3 days of development
