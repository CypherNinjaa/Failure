# How to Add Questions to MCQ Tests

This guide explains how to add questions to your MCQ tests in the School Management System.

---

## 📋 Quick Steps

1. **Navigate to MCQ Tests**

   - Go to the sidebar menu
   - Click on "MCQ Tests"

2. **Select a Test**

   - Find the test you want to add questions to
   - Click on the test title to open the test detail page

3. **Add Questions**

   - Click the "+ Add Question" button (top right of Questions section)
   - Or if no questions exist, click "Add Your First Question"

4. **Fill in Question Details** (see form guide below)

5. **Submit**
   - Click "Create" to add the question

---

## 📝 Question Form Fields

### 1. **Question Type** (Required)

Choose from 5 types:

- **MULTIPLE_CHOICE** - Single correct answer from multiple options
- **MULTI_SELECT** - Multiple correct answers (checkboxes)
- **TRUE_FALSE** - Simple true or false question
- **FILL_BLANK** - Students type their answer
- **MATCH_FOLLOWING** - Match items from two lists

### 2. **Question Text** (Required)

The actual question you want to ask students.

**Example:**

```
What is the capital of France?
```

### 3. **Points** (Required)

Number of points awarded for correct answer.

**Example:** `5` (gives 5 points for correct answer)

### 4. **Negative Marking** (Optional)

Points deducted for wrong answer (0-4 max).

**Example:** `1` (deducts 1 point for wrong answer)

### 5. **Options** (Required for most types)

The answer choices (format varies by question type).

#### For MULTIPLE_CHOICE / MULTI_SELECT / TRUE_FALSE:

Enter options as **comma-separated values**

**Example:**

```
Paris, London, Berlin, Madrid
```

or for True/False:

```
True, False
```

#### For MATCH_FOLLOWING:

Enter pairs as **left:right, left:right**

**Example:**

```
France:Paris, Germany:Berlin, Italy:Rome, Spain:Madrid
```

#### For FILL_BLANK:

Leave empty (students will type their answer)

### 6. **Correct Answer** (Required)

The correct answer(s) in JSON format.

#### For MULTIPLE_CHOICE / TRUE_FALSE:

**Single value in array**

```json
["Paris"]
```

or

```json
["True"]
```

#### For MULTI_SELECT:

**Multiple values in array**

```json
["Paris", "Berlin"]
```

#### For FILL_BLANK:

**Expected answer(s)**

```json
["Paris"]
```

or allow variations:

```json
["Paris", "paris", "PARIS"]
```

#### For MATCH_FOLLOWING:

**Pairs in object format**

```json
{ "France": "Paris", "Germany": "Berlin", "Italy": "Rome", "Spain": "Madrid" }
```

### 7. **Explanation** (Optional)

Provide explanation shown to students after answering.

**Example:**

```
Paris has been the capital of France since 987 AD and is known as the "City of Light".
```

### 8. **Image URL** (Optional)

Cloudinary image URL if question includes an image.

**Example:**

```
https://res.cloudinary.com/your-cloud/image/upload/v1234/question-image.jpg
```

---

## 🎯 Complete Example Questions

### Example 1: Multiple Choice Question

```yaml
Question Type: MULTIPLE_CHOICE
Question Text: What is the capital of France?
Points: 5
Negative Marking: 1
Options: Paris, London, Berlin, Madrid
Correct Answer: ["Paris"]
Explanation: Paris has been the capital of France since 987 AD.
```

### Example 2: Multi-Select Question

```yaml
Question Type: MULTI_SELECT
Question Text: Which of the following are programming languages?
Points: 10
Negative Marking: 2
Options: Python, HTML, JavaScript, CSS, Java
Correct Answer: ["Python", "JavaScript", "Java"]
Explanation: HTML and CSS are markup/styling languages, not programming languages.
```

### Example 3: True/False Question

```yaml
Question Type: TRUE_FALSE
Question Text: The Earth is flat.
Points: 3
Negative Marking: 1
Options: True, False
Correct Answer: ["False"]
Explanation: The Earth is an oblate spheroid, nearly spherical in shape.
```

### Example 4: Fill in the Blank

```yaml
Question Type: FILL_BLANK
Question Text: The chemical symbol for water is ____.
Points: 5
Negative Marking: 0
Options: (leave empty)
Correct Answer: ["H2O", "h2o"]
Explanation: Water is composed of two hydrogen atoms and one oxygen atom (H₂O).
```

### Example 5: Match the Following

```yaml
Question Type: MATCH_FOLLOWING
Question Text: Match the countries with their capitals:
Points: 10
Negative Marking: 2
Options: France:Paris, Germany:Berlin, Italy:Rome, Spain:Madrid
Correct Answer: {"France": "Paris", "Germany": "Berlin", "Italy": "Rome", "Spain": "Madrid"}
Explanation: These are the capital cities of major European countries.
```

---

## 🔄 Step-by-Step: Adding Your First Question

### Step 1: Access the Test

1. Go to **MCQ Tests** from the menu
2. Find your test (e.g., "1st mcq - Computer Science")
3. Click on the test title

### Step 2: Open Question Form

1. Look for the "Questions" section
2. Click the **"+ Add Question"** button (top right)
3. A modal form will appear

### Step 3: Fill Basic Details

```
Question Type: Select "MULTIPLE_CHOICE"
Question Text: "What is 2 + 2?"
Points: 5
Negative Marking: 1
```

### Step 4: Add Options

```
Options: 2, 3, 4, 5
```

### Step 5: Set Correct Answer

```
Correct Answer: ["4"]
```

### Step 6: Add Explanation (Optional)

```
Explanation: 2 + 2 equals 4, which is a basic arithmetic operation.
```

### Step 7: Submit

Click the **"Create"** button at the bottom of the form.

---

## ✅ After Adding Questions

### What You'll See:

1. Question appears in the list with:

   - Question number (Q1, Q2, etc.)
   - Question type badge (purple)
   - Points badge (green)
   - Negative marking badge (red, if applicable)
   - Full question text
   - Preview of options

2. Action buttons for each question:
   - **Edit** (pencil icon) - Modify the question
   - **Delete** (trash icon) - Remove the question

### The test's Total Points will auto-update:

If you add:

- Q1: 5 points
- Q2: 10 points
- Q3: 5 points

Total Points will show: **20 points**

---

## 🎨 Question Display Features

### In the Test Detail Page:

- **Color-coded badges** for easy identification
- **Option preview** shows all choices inline
- **Explanation preview** (if added)
- **Edit/Delete buttons** for quick management

### For Students (during test):

- Questions appear one at a time
- Options displayed based on question type:
  - Radio buttons for Multiple Choice
  - Checkboxes for Multi-Select
  - True/False buttons
  - Text input for Fill in Blank
  - Matching pairs interface for Match Following

---

## 📊 Best Practices

### 1. **Start Simple**

Begin with Multiple Choice and True/False questions, then add complex types.

### 2. **Point Distribution**

- Easy questions: 3-5 points
- Medium questions: 5-10 points
- Hard questions: 10-15 points

### 3. **Negative Marking**

- Use 0 for practice tests
- Use 1-2 for regular tests
- Use 2-4 for competitive tests (to discourage guessing)

### 4. **Clear Question Text**

- Be specific and unambiguous
- Avoid trick questions unless intentional
- Check for grammar and spelling

### 5. **Good Options**

- Make all options plausible
- Avoid "all of the above" or "none of the above"
- Keep option length similar
- Randomize correct answer position

### 6. **Useful Explanations**

- Explain WHY the answer is correct
- Reference learning material
- Add tips for better understanding

---

## 🚫 Common Mistakes to Avoid

### ❌ Wrong Correct Answer Format

```json
"Paris" // WRONG - not an array
```

```json
["Paris"] // CORRECT - array format
```

### ❌ Mismatched Options and Answer

```
Options: Paris, London, Berlin
Correct Answer: ["Madrid"]  // WRONG - Madrid not in options!
```

### ❌ Invalid JSON Format

```json
{France: Paris}  // WRONG - missing quotes
```

```json
{ "France": "Paris" } // CORRECT - proper JSON
```

### ❌ Empty Required Fields

All questions must have:

- Question Type ✓
- Question Text ✓
- Points ✓
- Options (except FILL_BLANK) ✓
- Correct Answer ✓

---

## 🔧 Editing Questions

### To Edit an Existing Question:

1. Find the question in the list
2. Click the **pencil (Edit)** icon on the right
3. Modify any fields
4. Click **"Update"**

### To Delete a Question:

1. Find the question in the list
2. Click the **trash (Delete)** icon
3. Confirm deletion
4. Question removed, total points auto-updated

---

## 📱 Question Management Interface

```
┌─────────────────────────────────────────────────────────┐
│ Questions                          [+ Add Question]      │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐     │
│ │ Q1 [MULTIPLE_CHOICE] [5 pts] [-1 penalty]       │ ✏️ 🗑️│
│ │ What is the capital of France?                  │     │
│ │   • Paris                                       │     │
│ │   • London                                      │     │
│ │   • Berlin                                      │     │
│ │   • Madrid                                      │     │
│ │ 💡 Paris is the capital and largest city...    │     │
│ └─────────────────────────────────────────────────┘     │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐     │
│ │ Q2 [TRUE_FALSE] [3 pts]                         │ ✏️ 🗑️│
│ │ Python is a programming language.               │     │
│ │   • True                                        │     │
│ │   • False                                       │     │
│ └─────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Tips for Different Subjects

### Computer Science

- Use code snippets in question text
- Add syntax questions
- Include algorithm problems
- Test concepts, not just memorization

### Mathematics

- Use Fill in Blank for calculations
- Add step-by-step explanations
- Include formula-based questions
- Test understanding, not just answers

### Science

- Use images for diagrams
- Add True/False for concepts
- Include experiment-based questions
- Provide detailed explanations

### Languages

- Use Multi-Select for grammar
- Add Fill in Blank for vocabulary
- Include Match Following for translations
- Test comprehension with context

---

## 🎯 Quick Reference Card

| Question Type   | Options Format | Answer Format       | Best For                 |
| --------------- | -------------- | ------------------- | ------------------------ |
| MULTIPLE_CHOICE | `A, B, C, D`   | `["A"]`             | Single correct answer    |
| MULTI_SELECT    | `A, B, C, D`   | `["A", "C"]`        | Multiple correct answers |
| TRUE_FALSE      | `True, False`  | `["True"]`          | Yes/No questions         |
| FILL_BLANK      | (empty)        | `["answer"]`        | Short answers            |
| MATCH_FOLLOWING | `A:1, B:2`     | `{"A":"1","B":"2"}` | Pairing items            |

---

## ✅ Checklist Before Publishing Test

- [ ] All questions added
- [ ] All questions have correct answers set
- [ ] Points distribution is fair
- [ ] Negative marking is appropriate
- [ ] Explanations added (optional but recommended)
- [ ] Test duration is sufficient (calculate: questions × 2 minutes)
- [ ] Passing score is set
- [ ] Start time and deadline configured
- [ ] Test is published (toggle publish button)

---

## 🆘 Troubleshooting

### "Create button not working"

- Ensure all required fields are filled
- Check correct answer format (must be valid JSON)
- Verify options match the answer

### "Options not displaying"

- Check options format (comma-separated)
- Ensure no extra spaces or special characters
- Verify question type matches option format

### "Wrong answer marked as correct"

- Double-check correct answer JSON
- Ensure answer exactly matches option text
- Check for case sensitivity

---

## 📞 Need Help?

If you have questions or issues:

1. Check this guide first
2. Review the example questions
3. Verify all required fields are filled
4. Check the error messages in the form

---

**Happy Question Creating! 🎉**

Remember: Great questions make great tests. Take time to craft clear, fair, and educational questions for your students.
