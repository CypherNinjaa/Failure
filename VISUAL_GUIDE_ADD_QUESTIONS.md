# Visual Guide: Adding Questions to MCQ Tests

## 🎯 Step-by-Step Visual Guide

---

## Step 1: Navigate to MCQ Tests List

**What you see:**

- Sidebar menu on the left
- "MCQ Tests" option in the menu
- List of all created tests

**What to do:**

1. Click "**MCQ Tests**" in the sidebar menu
2. You'll see a table with columns: Title, Subject, Class, Duration, Deadline, Status, Actions

---

## Step 2: Open a Test Detail Page

**What you see:**

- List of tests with titles like "1st mcq", "Computer Science Test", etc.
- Each test row shows:
  - Test title
  - Subject (e.g., Computer Science)
  - Class (e.g., 1A)
  - Duration (e.g., 10 min)
  - Deadline date
  - Published/Draft status

**What to do:**

1. **Click on the test title** (the blue/colored text in the first column)
2. This opens the Test Detail Page

---

## Step 3: Test Detail Page Overview

**What you see on this page:**

### Header Section:

```
← Back to Tests

[Test Title: "1st mcq"]
[Description: "computer test description"]

[🔒 Unpublish] or [🚀 Publish]  [✏️ Edit Test]
```

### Info Cards (4 cards across):

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Subject     │ │    Class     │ │  Duration    │ │ Total Points │
│ Computer Sci.│ │     1A       │ │   10 min     │ │     0        │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Statistics Cards (3 cards):

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Questions   │ │   Attempts   │ │   Status     │
│      0       │ │      0       │ │    Draft     │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Settings Section:

Shows deadline, passing score, shuffle settings

### **Questions Section** ← This is where you add questions!

```
┌─────────────────────────────────────────────────────┐
│ Questions                        [+ Add Question]    │
├─────────────────────────────────────────────────────┤
│                                                      │
│         No questions added yet.                      │
│                                                      │
│           [Add Your First Question]                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Step 4: Click "Add Question" Button

**Where to find it:**

- Look for the "Questions" section (bottom half of the page)
- You'll see either:
  - "**+ Add Question**" button (top right of Questions section)
  - "**Add Your First Question**" button (center, if no questions exist)

**What to do:**

1. Click either button
2. A **modal (popup window)** will appear

---

## Step 5: Question Form Modal

**The modal shows a form with these fields:**

```
╔══════════════════════════════════════════════════════╗
║  Create a new MCQ Question                      [X]  ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Question Type*                                      ║
║  [Dropdown ▼]                                        ║
║  • Multiple Choice (Single Answer)                   ║
║  • Multiple Select (Multiple Answers)                ║
║  • True/False                                        ║
║  • Fill in the Blank                                 ║
║  • Match the Following                               ║
║                                                      ║
║  Question Text*                                      ║
║  [Text area: Type your question here...]            ║
║                                                      ║
║  Points*              Negative Marking              ║
║  [5]                  [1]                           ║
║                                                      ║
║  Options* (comma-separated)                         ║
║  [Paris, London, Berlin, Madrid]                    ║
║                                                      ║
║  Correct Answer* (JSON format)                      ║
║  [["Paris"]]                                        ║
║                                                      ║
║  Explanation (Optional)                             ║
║  [Type explanation here...]                         ║
║                                                      ║
║  Image URL (Optional)                               ║
║  [https://...]                                      ║
║                                                      ║
║              [Create] or [Update]                   ║
╚══════════════════════════════════════════════════════╝
```

---

## Step 6: Fill in the Form - Example

Let me show you how to fill this for a simple question:

### Example: "What is the capital of France?"

**1. Question Type:**

```
Select: Multiple Choice (Single Answer)
```

**2. Question Text:**

```
What is the capital of France?
```

**3. Points:**

```
5
```

**4. Negative Marking:**

```
1
```

**5. Options:**

```
Paris, London, Berlin, Madrid
```

_(Separate each option with a comma)_

**6. Correct Answer:**

```
["Paris"]
```

_(Must be in this format - array with quotes)_

**7. Explanation (Optional):**

```
Paris has been the capital of France since 987 AD and is known as the "City of Light".
```

**8. Image URL (Optional):**

```
(leave blank unless you have an image)
```

---

## Step 7: Click "Create" Button

**What happens:**

1. Form validates your input
2. Question is saved to database
3. Modal closes automatically
4. Success message appears: "MCQ Question has been created!"
5. Page refreshes and shows your new question

---

## Step 8: View Your Added Question

**After adding, you'll see:**

```
┌─────────────────────────────────────────────────────────┐
│ Questions                          [+ Add Question]      │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐     │
│ │ [Q1] [MULTIPLE CHOICE] [5 pts] [-1 penalty]     │ ✏️ 🗑️│
│ │                                                 │     │
│ │ What is the capital of France?                  │     │
│ │                                                 │     │
│ │ Options:                                        │     │
│ │   • Paris                                       │     │
│ │   • London                                      │     │
│ │   • Berlin                                      │     │
│ │   • Madrid                                      │     │
│ │                                                 │     │
│ │ 💡 Paris has been the capital of France...     │     │
│ └─────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

**Notice:**

- **Q1** = Question number (automatically assigned)
- **[MULTIPLE CHOICE]** = Purple badge showing question type
- **[5 pts]** = Green badge showing points
- **[-1 penalty]** = Red badge showing negative marking
- **✏️** = Edit button (click to modify question)
- **🗑️** = Delete button (click to remove question)

---

## Step 9: Add More Questions

**To add another question:**

1. Click "**+ Add Question**" again (top right)
2. Fill in the form for your second question
3. Click "Create"
4. Repeat for as many questions as needed

**Your questions will be numbered automatically:**

- Q1, Q2, Q3, Q4, etc.

---

## Step 10: Edit or Delete Questions

### To Edit:

1. Click the **✏️ (pencil)** icon next to any question
2. Modal opens with existing data pre-filled
3. Modify any fields
4. Click "**Update**"

### To Delete:

1. Click the **🗑️ (trash)** icon next to any question
2. Confirm deletion
3. Question is removed
4. Question numbers automatically renumber (Q1, Q2, Q3...)

---

## 📊 Real-Time Updates

As you add questions, watch these areas update automatically:

### 1. Question Count

```
┌──────────────┐
│  Questions   │
│      5       │  ← Updates each time you add/delete
└──────────────┘
```

### 2. Total Points

```
┌──────────────┐
│ Total Points │
│     25       │  ← Sum of all question points
└──────────────┘
```

### 3. Question List

- Shows all questions in order
- Q1, Q2, Q3, Q4, Q5...
- Each with full details

---

## 🎨 Question Type Visual Guide

### 1️⃣ Multiple Choice (Single Answer)

**What students see:**

```
○ Option A
○ Option B
○ Option C
○ Option D
```

(Radio buttons - can select only ONE)

**Form setup:**

- Question Type: `Multiple Choice (Single Answer)`
- Options: `A, B, C, D`
- Correct Answer: `["B"]` (only one answer)

---

### 2️⃣ Multiple Select (Multiple Answers)

**What students see:**

```
☐ Option A
☑ Option B
☑ Option C
☐ Option D
```

(Checkboxes - can select MULTIPLE)

**Form setup:**

- Question Type: `Multiple Select (Multiple Answers)`
- Options: `A, B, C, D`
- Correct Answer: `["B", "C"]` (multiple answers)

---

### 3️⃣ True/False

**What students see:**

```
○ True
○ False
```

(Two options only)

**Form setup:**

- Question Type: `True/False`
- Options: `True, False`
- Correct Answer: `["True"]` or `["False"]`

---

### 4️⃣ Fill in the Blank

**What students see:**

```
[Text input box: Type your answer here...]
```

**Form setup:**

- Question Type: `Fill in the Blank`
- Options: (leave blank)
- Correct Answer: `["answer"]` or `["answer1", "answer2"]` for variations

---

### 5️⃣ Match the Following

**What students see:**

```
Match items:
France      →  [dropdown: Paris, Berlin, Rome, Madrid]
Germany     →  [dropdown: Paris, Berlin, Rome, Madrid]
Italy       →  [dropdown: Paris, Berlin, Rome, Madrid]
Spain       →  [dropdown: Paris, Berlin, Rome, Madrid]
```

**Form setup:**

- Question Type: `Match the Following`
- Options: `France:Paris, Germany:Berlin, Italy:Rome, Spain:Madrid`
- Correct Answer: `{"France":"Paris", "Germany":"Berlin", "Italy":"Rome", "Spain":"Madrid"}`

---

## ✅ Checklist for Each Question

Before clicking "Create", make sure:

- [ ] Question type selected
- [ ] Question text is clear and complete
- [ ] Points assigned (typically 3-10)
- [ ] Negative marking set (0-4)
- [ ] Options added (comma-separated)
- [ ] Correct answer in proper JSON format
- [ ] Correct answer matches one (or more) of the options
- [ ] Explanation added (optional but recommended)
- [ ] No spelling/grammar errors

---

## 🚀 Quick Tips

### For Faster Question Entry:

1. **Copy-Paste from Document**

   - Prepare questions in Word/Google Docs first
   - Copy-paste text into form
   - Saves time for multiple questions

2. **Use Templates**

   - Keep a note with common formats:
     - MCQ: `["option"]`
     - Multi-select: `["opt1", "opt2"]`
     - Match: `{"A":"1", "B":"2"}`

3. **Standard Point Values**

   - Easy: 3-5 points
   - Medium: 5-8 points
   - Hard: 8-10 points

4. **Keyboard Shortcuts**
   - Tab: Move between fields
   - Enter: Submit form (when ready)
   - Esc: Close modal

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Create button not working"

**Solution:** Check that correct answer format is valid JSON

- ✅ `["Paris"]` - Correct
- ❌ `Paris` - Wrong (no array or quotes)

### Issue 2: "Options not showing in question"

**Solution:** Use comma-separated format

- ✅ `Paris, London, Berlin` - Correct
- ❌ `Paris; London; Berlin` - Wrong (semicolons)

### Issue 3: "Wrong answer marked as correct"

**Solution:** Answer must exactly match option text

- Options: `Paris, London`
- ✅ `["Paris"]` - Correct (exact match)
- ❌ `["paris"]` - Wrong (case doesn't match)

### Issue 4: "Can't see question after adding"

**Solution:**

- Scroll down to Questions section
- Page should auto-refresh
- If not, manually refresh (F5)

---

## 📱 Mobile View Notes

On mobile/tablet:

- Fields stack vertically
- Modal is full-screen
- Scroll to see all fields
- All functionality same as desktop

---

## 🎯 Next Steps After Adding Questions

Once you've added all questions:

1. **Review Total Points**

   - Check if total points match your desired test difficulty
   - Adjust individual question points if needed

2. **Set Test Duration**

   - Rule of thumb: 2 minutes per question
   - 10 questions = 20 minutes duration

3. **Set Passing Score**

   - Typically 60-70% of total points
   - Adjust based on difficulty

4. **Publish Test**

   - Click the "🚀 Publish" button (top right)
   - Students can now see and take the test

5. **Test It Yourself** (Recommended)
   - Log in as a student (if possible)
   - Take the test to verify everything works
   - Check if all questions display correctly

---

## 🎉 Congratulations!

You now know how to:

- ✅ Navigate to test detail page
- ✅ Open the question form
- ✅ Fill in all question fields
- ✅ Add different question types
- ✅ Edit and delete questions
- ✅ Verify your questions display correctly

**Start creating awesome tests for your students!** 🚀

---

**Need the full detailed guide? See: `HOW_TO_ADD_QUESTIONS.md`**
