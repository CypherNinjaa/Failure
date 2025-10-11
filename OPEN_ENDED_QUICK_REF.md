# Open-Ended Questions - Quick Reference

## 🎯 Summary

Open-ended questions now support **manual grading** by teachers. No options or correct answer required!

---

## 📝 For Teachers: Creating Open-Ended Questions

### When you select "Open Ended" type:

**✅ HIDDEN:**

- Options field (no longer visible)
- "Correct Answer" field (replaced)

**✅ SHOWN:**

- Question text (required)
- Question Type = "Open Ended"
- **Reference Answer** (optional) - Your sample answer for grading reference
- Explanation (optional) - Use for grading rubric
- Question Order (required)

### Example:

```
Question: "Explain the process of photosynthesis in plants."

Reference Answer (Optional):
"Photosynthesis is the process by which plants convert light
energy into chemical energy through chlorophyll, using CO2
and H2O to produce glucose and oxygen."

Explanation (Optional - Grading Rubric):
"Award full marks if student mentions: light energy,
chlorophyll, CO2, H2O, glucose, oxygen"
```

---

## ✍️ For Students: Answering Open-Ended Questions

### What you see:

1. Question with **"OPEN ENDED"** badge
2. **Large textarea** (5-6 rows) to type your answer
3. **No multiple choice options**
4. Placeholder: "Type your answer here..."

### How to submit:

1. Type your answer (no character limit)
2. Click **"Submit Answer"**
3. Status shows: **"⏳ PENDING GRADING"** (yellow badge)
4. **No instant feedback** - teacher will grade it later

### After submission:

- ✅ Answer is saved
- ⏳ Status: "Pending Grading"
- 🔒 You cannot edit after submitting
- 📝 You can view your submitted answer
- ⏭️ Click "Next" to continue

---

## 👨‍🏫 For Teachers: Grading Answers

### Access grading interface:

**Option 1:** From test detail page

- Click **"Grade Answers"** button in header
- Shows count of pending answers

**Option 2:** Direct link

- Navigate to: `/list/mcq-tests/[testId]/grade`

### Grading form shows:

- 👤 Student name
- ❓ Question text
- ✍️ Student's answer
- 📚 Your reference answer
- 📋 Grading rubric (explanation)

### Grade the answer:

1. **Score**: Enter points (e.g., 75/100)
2. **Feedback**: Write comments for student
3. **Mark as Correct**: Check if answer is correct
4. **Submit Grade**

### After grading:

- ✅ Status changes to "Graded"
- 📊 Score added to student's results
- 💬 Feedback visible to student

---

## 🔄 Complete Workflow

```
TEACHER CREATES QUESTION
   ↓
Select "Open Ended" type
   ↓
Fill question text + optional reference answer
   ↓
Submit (no options required!)
   ↓
STUDENT TAKES TEST
   ↓
Sees textarea input for open-ended
   ↓
Types answer → Submit
   ↓
Status: ⏳ Pending Grading
   ↓
TEACHER GRADES
   ↓
Reviews answer → Assigns score → Provides feedback
   ↓
Status: ✅ Graded
   ↓
STUDENT VIEWS RESULTS
   ↓
Sees score, feedback, reference answer
```

---

## 📊 Score Calculation

### If test has mixed question types:

**Auto-graded (Multiple Choice/True-False):**

- Counted immediately toward score

**Manual graded (Open-Ended):**

- Only counted after teacher grades
- Shows "Partial Score" if some pending

**Example:**

- Test has 10 questions
- 7 multiple choice (auto-graded)
- 3 open-ended (pending grading)
- Student sees: "Partial Score: 70% (7/10 graded)"
- After all graded: "Final Score: 85% (10/10 graded)"

---

## ⚠️ Important Notes

### For Teachers:

- ✅ Reference answer is **optional** but recommended
- ✅ Use explanation field for **grading rubric**
- ✅ Grade promptly to give students feedback
- ⚠️ Open-ended questions **require manual grading**

### For Students:

- ⏳ Expect **delayed feedback** (teacher must grade)
- 📝 Write **detailed, clear answers**
- 🔒 **Cannot edit** after submission
- 📊 Score updates **after teacher grades**

---

## 🎨 Visual Indicators

| Status                        | Badge | Color  | Meaning                  |
| ----------------------------- | ----- | ------ | ------------------------ |
| Not Answered                  | -     | Gray   | Not attempted            |
| Multiple Choice (Correct)     | ✓     | Green  | Auto-graded correct      |
| Multiple Choice (Wrong)       | ✗     | Red    | Auto-graded incorrect    |
| Open-Ended (Pending)          | ⏳    | Yellow | Awaiting teacher         |
| Open-Ended (Graded Correct)   | ✓     | Green  | Teacher marked correct   |
| Open-Ended (Graded Incorrect) | ✗     | Red    | Teacher marked incorrect |

---

## 🚀 Quick Start

### Create your first open-ended question:

1. Go to MCQ Tests → View a test
2. Click "Add Question"
3. Select "Open Ended" from dropdown
4. **Notice:** Options field disappears!
5. Fill in question and optional reference answer
6. Click "Create"
7. Done! ✅

### Student takes the test:

1. Sees large textarea
2. Types answer
3. Submits
4. Gets "Pending" status

### Grade the answers:

1. Click "Grade Answers" button
2. Review each answer
3. Assign score and feedback
4. Submit grade

That's it! 🎉

---

For detailed information, see: **OPEN_ENDED_QUESTIONS_GUIDE.md**
