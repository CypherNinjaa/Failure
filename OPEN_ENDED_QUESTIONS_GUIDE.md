# Open-Ended Questions - Complete Guide

## Overview

Open-ended questions allow students to type their own answers (essay-style, free text) instead of selecting from multiple choice options. These answers require **manual grading** by teachers.

---

## For Teachers: Creating Open-Ended Questions

### Step 1: Create an MCQ Test

1. Navigate to **MCQ Tests** in the sidebar
2. Click **Create** button
3. Fill in test details:
   - Title (required)
   - Description (optional)
   - Subject (optional)
   - Class (required)
   - Teacher (required)
4. Click **Create**

### Step 2: Add Open-Ended Questions

1. Click **View** on your test to open the details page
2. Click **Add Question** button
3. In the question form:
   - **Question**: Enter your question text
     - Example: "Explain the process of photosynthesis in plants."
     - Example: "What are the main causes of World War II?"
   - **Question Type**: Select **"Open Ended"** from dropdown
   - **Notice**: You'll see a blue info box explaining:
     > "Open Ended: Student will type their answer in a text box. This requires manual grading by the teacher. Options and correct answer are optional - use them as reference if needed."

### Step 3: Configure Open-Ended Question

**Key Differences from Multiple Choice:**

- ✅ **Options field is HIDDEN** - Not needed for open-ended
- ✅ **Correct Answer becomes "Reference Answer"** - Optional field for your grading reference
- ✅ **No validation** on options or answer for open-ended type

**Fields for Open-Ended:**

1. **Question** (required): The question text
2. **Question Type** (required): Select "Open Ended"
3. **Reference Answer** (optional):
   - Provide a sample answer
   - This will be shown to you when grading
   - Helps maintain consistency in grading
   - Example: "Photosynthesis is the process by which plants convert light energy into chemical energy..."
4. **Explanation** (optional):
   - Additional notes or grading rubric
   - Example: "Award full marks if student mentions: light energy, chlorophyll, CO2, H2O, glucose, oxygen"
5. **Question Order** (required): Position in the test

### Step 4: Click Create

- Question is saved with type "OPEN_ENDED"
- Options array is empty: `[]`
- Answer field stores your reference answer (if provided)

---

## For Students: Answering Open-Ended Questions

### Step 1: Take the Test

1. Navigate to **MCQ Tests** in sidebar (student menu)
2. Click **Start Test** button on any test

### Step 2: Encounter Open-Ended Question

**What Students See:**

- Question text with badge: **"OPEN ENDED"**
- Large textarea input (5-6 rows)
- Placeholder: "Type your answer here..."
- Character counter (optional feature)
- NO multiple choice options shown

**How to Answer:**

1. Read the question carefully
2. Type your answer in the textarea
3. You can type as much as needed (no character limit)
4. Click **"Submit Answer"** when done

### Step 3: After Submission

**Immediate Feedback:**

- Answer is saved to database
- Status shows: **"PENDING GRADING"** (yellow badge)
- NO instant correct/incorrect feedback (unlike Multiple Choice)
- You can review your submitted answer
- You CANNOT edit after submission

**Example Flow:**

```
Question: "Explain the process of photosynthesis."

[Large Textarea]
Student types: "Photosynthesis is a process used by plants
to convert light energy into chemical energy. Plants absorb
sunlight through chlorophyll in their leaves. They take in
carbon dioxide from the air and water from the soil. Through
a series of reactions, they produce glucose (sugar) and
release oxygen as a byproduct. This process is essential
for life on Earth."

[Submit Answer] ← Click here

✓ Answer saved!
Status: ⏳ Pending Grading
```

### Step 4: Navigation

- Click **"Next Question"** to move on
- You can navigate back to view your answer
- Answer remains in "Pending" state until teacher grades it

---

## For Teachers: Grading Open-Ended Answers

### Step 1: View Pending Answers

**Option A: From Test Detail Page**

1. Go to **MCQ Tests** → Click **View** on a test
2. Look at the statistics card on the right
3. See **"Pending Grades"** card showing count
4. Click **"Grade Answers"** button in the header

**Option B: Direct Link**

- Navigate to: `/list/mcq-tests/[testId]/grade`

### Step 2: Grading Interface

You'll see a list of all pending open-ended answers for this test:

**Each Answer Card Shows:**

- **Student Name**: e.g., "John Doe"
- **Question**: The full question text
- **Student's Answer**: Their typed response
- **Reference Answer**: Your sample answer (if provided)
- **Explanation/Rubric**: Any notes you added (if provided)
- **Grading Form**:
  - Score input (0-100 or custom scale)
  - Feedback textarea
  - Mark as Correct checkbox
  - Submit Grade button

**Example Grading Card:**

```
┌─────────────────────────────────────────────────┐
│ Student: Sarah Johnson                          │
│                                                 │
│ Question: "Explain photosynthesis"              │
│                                                 │
│ Student's Answer:                               │
│ "Plants use sunlight to make food. They take   │
│ in CO2 and release O2. Chlorophyll helps in    │
│ this process."                                  │
│                                                 │
│ Reference Answer:                               │
│ "Photosynthesis is the process by which        │
│ plants convert light energy into chemical      │
│ energy through chlorophyll, using CO2 and      │
│ H2O to produce glucose and oxygen."            │
│                                                 │
│ Explanation/Rubric:                             │
│ "Award full marks if mentions: light energy,   │
│ chlorophyll, CO2, H2O, glucose, oxygen"        │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ Score: [75]  /100                        │   │
│ │                                          │   │
│ │ Feedback:                                │   │
│ │ [Good understanding of basics. Include   │   │
│ │  glucose production for full marks.]     │   │
│ │                                          │   │
│ │ ☑ Mark as Correct                        │   │
│ │                                          │   │
│ │ [Submit Grade]                           │   │
│ └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Step 3: Submit Grade

After clicking **"Submit Grade"**:

- Score and feedback are saved to `StudentAnswer` table
- `isCorrect` flag is set based on checkbox
- `gradedBy` records your teacher ID
- `gradedAt` timestamp is set
- Answer status changes from "Pending" to "Graded"

### Step 4: Student Sees Results

When student views results:

- **Graded Badge** (green if correct, red if incorrect)
- **Score**: e.g., "75/100"
- **Teacher Feedback**: Your comments
- **Their Answer**: What they submitted
- **Reference Answer**: Your sample answer (for learning)

---

## Database Schema

### StudentAnswer Model (Updated)

```prisma
model StudentAnswer {
  id         String   @id @default(cuid())
  attemptId  String
  questionId String
  userAnswer String   @db.Text  // Stores typed answer
  isCorrect  Boolean  @default(false)
  answeredAt DateTime @default(now())

  // Manual grading fields
  score      Float?           // 0-100 or custom scale
  feedback   String?  @db.Text // Teacher's comments
  gradedBy   String?          // Teacher ID who graded
  gradedAt   DateTime?        // Timestamp of grading

  attempt  MCQAttempt  @relation(...)
  question MCQQuestion @relation(...)
  grader   Teacher?    @relation(...) // New relation

  @@unique([attemptId, questionId])
}
```

### MCQQuestion Model

```prisma
model MCQQuestion {
  id           String       @id @default(cuid())
  question     String       @db.Text
  answer       String       // For OPEN_ENDED: Reference answer
  options      Json         // For OPEN_ENDED: Empty array []
  questionType QuestionType // MULTIPLE_CHOICE | TRUE_FALSE | OPEN_ENDED
  explanation  String?      @db.Text // Grading rubric for OPEN_ENDED
  ...
}
```

---

## Answer Submission Flow

### Multiple Choice / True False:

1. Student selects option
2. Clicks "Submit Answer"
3. **Auto-grading happens instantly**:
   ```typescript
   const isCorrect =
   	data.userAnswer.trim().toLowerCase() ===
   	question.answer.trim().toLowerCase();
   ```
4. Score updated immediately
5. Feedback shown (correct/incorrect)

### Open Ended:

1. Student types answer in textarea
2. Clicks "Submit Answer"
3. **No auto-grading**:
   ```typescript
   if (question.questionType === "OPEN_ENDED") {
   	// Save answer without grading
   	await prisma.studentAnswer.create({
   		data: {
   			attemptId: data.attemptId,
   			questionId: data.questionId,
   			userAnswer: data.userAnswer,
   			isCorrect: false, // Default, will be updated by teacher
   		},
   	});
   	return { success: true, error: false };
   }
   ```
4. Status: "Pending Grading"
5. Teacher grades later
6. Score updated when graded

---

## Score Calculation

### Test Completion

When student finishes test:

```typescript
// Calculate score considering grading status
const attempt = await prisma.mCQAttempt.findUnique({
	where: { id: attemptId },
	include: {
		answers: {
			include: {
				question: { select: { questionType: true } },
			},
		},
	},
});

const totalQuestions = attempt.answers.length;
let gradedQuestions = 0;
let correctAnswers = 0;

for (const answer of attempt.answers) {
	if (answer.question.questionType === "OPEN_ENDED") {
		// Only count if graded
		if (answer.gradedAt !== null) {
			gradedQuestions++;
			if (answer.isCorrect) correctAnswers++;
		}
	} else {
		// Auto-graded questions always count
		gradedQuestions++;
		if (answer.isCorrect) correctAnswers++;
	}
}

// Calculate partial score if some open-ended are pending
const score = (correctAnswers / gradedQuestions) * 100;
```

### Score Display

**If all questions graded:**

- "Final Score: 85%"

**If some open-ended pending:**

- "Partial Score: 75% (7/10 questions graded)"
- "⏳ 3 answers pending teacher review"

---

## UI States

### For Students

| State           | Badge           | Description                        |
| --------------- | --------------- | ---------------------------------- |
| Not Answered    | Gray            | Question not attempted yet         |
| Answered (Auto) | Green/Red       | Multiple choice - instant feedback |
| Pending Grading | Yellow ⏳       | Open-ended - waiting for teacher   |
| Graded          | Green ✓ / Red ✗ | Open-ended - teacher graded        |

### For Teachers

| State   | Action Available       |
| ------- | ---------------------- |
| Pending | Grade Answer button    |
| Graded  | View/Edit Grade button |

---

## Best Practices

### For Teachers Creating Questions:

✅ **DO:**

- Provide clear, specific questions
- Add reference answers for consistency
- Include grading rubric in explanation field
- Set realistic point values
- Grade promptly to give students feedback

❌ **DON'T:**

- Make questions too vague
- Forget to add reference answers
- Mix multiple questions in one
- Delay grading for too long

### For Students Answering:

✅ **DO:**

- Read question carefully
- Answer all parts of the question
- Use proper grammar and spelling
- Provide detailed explanations
- Review before submitting

❌ **DON'T:**

- Submit one-word answers
- Leave questions blank
- Copy from external sources
- Expect instant feedback (it's manual grading)

---

## Example Use Cases

### 1. Essay Questions

```
Question: "Discuss the impact of social media on modern communication."
Type: Open Ended
Reference Answer: "Social media has revolutionized communication by..."
Students type: 200-500 word essays
Teacher grades: Using rubric in explanation field
```

### 2. Short Answer Questions

```
Question: "What is the capital of France?"
Type: Open Ended (but could use Multiple Choice)
Reference Answer: "Paris"
Students type: "Paris"
Teacher grades: Quick yes/no based on match
```

### 3. Problem Solving

```
Question: "Show your work: Calculate the area of a circle with radius 5cm."
Type: Open Ended
Reference Answer: "A = πr² = π(5)² = 78.54 cm²"
Students type: Step-by-step solution
Teacher grades: Partial credit for correct methodology
```

### 4. Critical Thinking

```
Question: "Analyze the pros and cons of renewable energy."
Type: Open Ended
Reference Answer: [Detailed analysis with multiple points]
Students type: Structured analysis
Teacher grades: Based on depth, accuracy, reasoning
```

---

## Technical Implementation Summary

### Validation Changes:

- **Before**: Options and answer required for all types
- **After**: Options and answer optional for OPEN_ENDED

### Form Changes:

- **Before**: Always shows options and answer fields
- **After**: Conditionally shows based on question type
  - OPEN_ENDED: Only question, reference answer (optional), explanation
  - Others: Question, options, correct answer, explanation

### Submission Changes:

- **Before**: All questions auto-graded
- **After**:
  - MULTIPLE_CHOICE / TRUE_FALSE: Auto-graded
  - OPEN_ENDED: Saved as pending, requires manual grading

### Grading Interface:

- **New Route**: `/list/mcq-tests/[id]/grade`
- **New Component**: `GradeAnswerForm.tsx`
- **New Action**: `gradeStudentAnswer`

---

## Summary

**Open-Ended Questions Flow:**

1. **Teacher Creates** → No options required, optional reference answer
2. **Student Answers** → Types in textarea, submits
3. **Status: Pending** → Answer saved, awaits grading
4. **Teacher Grades** → Reviews answer, assigns score, provides feedback
5. **Status: Graded** → Student sees score and feedback
6. **Score Calculated** → Only graded questions count toward final score

This system allows for **flexible assessment** beyond multiple choice, enabling teachers to evaluate critical thinking, writing skills, and deeper understanding through essay-style questions! 📝
