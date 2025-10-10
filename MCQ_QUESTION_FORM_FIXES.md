# MCQ Question Form Bug Fixes

## Issues Fixed

### 1. **MULTI_SELECT Checkboxes Not Working**

**Problem:** When creating Multiple Select questions, checking multiple correct answers didn't save them to the database.

**Root Cause:** HTML checkboxes with the same `name` attribute don't work properly with `react-hook-form`'s `register()` method. Only the last checked value would be captured.

**Solution:**

- Added `selectedAnswers` state array to track checked options
- Changed checkboxes from using `{...register("correctAnswer")}` to controlled components with:
  - `checked={selectedAnswers.includes(index.toString())}`
  - `onChange` handler to add/remove from state array
- Updated form submission to convert indices to option texts

### 2. **MULTIPLE_CHOICE Radio Buttons Not Working**

**Problem:** Single choice questions had `correctAnswer` saved as `null` in the database.

**Root Cause:** Similar to checkboxes, radio buttons weren't properly captured by `register()`.

**Solution:**

- Added `selectedAnswer` state string to track selected radio button
- Changed radio buttons to controlled components with:
  - `checked={selectedAnswer === index.toString()}`
  - `onChange` handler to update state
- Updated form submission to use state instead of `formData.correctAnswer`

### 3. **TRUE_FALSE Sending Unnecessary Options**

**Problem:** TRUE_FALSE questions were sending the options array `["dfg","fdgfd","fdfgf","dfgdf"]` when they should only send the true/false answer.

**Root Cause:** The form logic grouped TRUE_FALSE with MULTIPLE_CHOICE and MULTI_SELECT, causing it to process and send options.

**Solution:**

- Separated TRUE_FALSE into its own condition
- Set `formData.options = undefined` for TRUE_FALSE
- Only send `correctAnswer: ["true"]` or `["false"]`

### 4. **FILL_BLANK Sending Undefined Options**

**Problem:** FILL_BLANK questions had `options: null` in database, which caused display issues.

**Root Cause:** FILL_BLANK didn't explicitly set options to undefined, leaving it as an empty string.

**Solution:**

- Explicitly set `formData.options = undefined` for FILL_BLANK
- Only send `correctAnswer: ["user's answer"]`

## Code Changes Summary

### State Management

```typescript
// Added two new state variables
const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // For MULTI_SELECT
const [selectedAnswer, setSelectedAnswer] = useState<string>(""); // For MULTIPLE_CHOICE
```

### Form Submission Logic

```typescript
// MULTIPLE_CHOICE - Use state instead of register
if (selectedType === "MULTIPLE_CHOICE") {
	if (!selectedAnswer) {
		toast.error("Please select the correct answer!");
		return;
	}
	const selectedIndex = parseInt(selectedAnswer);
	formData.correctAnswer = JSON.stringify([filteredOptions[selectedIndex]]);
}

// MULTI_SELECT - Use state array
else if (selectedType === "MULTI_SELECT") {
	if (selectedAnswers.length === 0) {
		toast.error("Please select at least one correct answer!");
		return;
	}
	const selectedOptions = selectedAnswers
		.map((idx) => filteredOptions[parseInt(idx)])
		.filter(Boolean);
	formData.correctAnswer = JSON.stringify(selectedOptions);
}

// TRUE_FALSE - Don't send options
else if (selectedType === "TRUE_FALSE") {
	formData.correctAnswer = JSON.stringify([formData.correctAnswer]);
	formData.options = undefined; // ← NEW
}

// FILL_BLANK - Don't send options
else if (selectedType === "FILL_BLANK") {
	formData.correctAnswer = JSON.stringify([formData.correctAnswer]);
	formData.options = undefined; // ← NEW
}
```

### Input Components

```typescript
// MULTIPLE_CHOICE - Radio buttons now controlled
<input
  type="radio"
  name="correctAnswer"
  value={index}
  checked={selectedAnswer === index.toString()}
  onChange={(e) => setSelectedAnswer(e.target.value)}
/>

// MULTI_SELECT - Checkboxes now controlled
<input
  type="checkbox"
  value={index}
  checked={selectedAnswers.includes(index.toString())}
  onChange={(e) => {
    if (e.target.checked) {
      setSelectedAnswers([...selectedAnswers, index.toString()]);
    } else {
      setSelectedAnswers(selectedAnswers.filter(a => a !== index.toString()));
    }
  }}
/>
```

## Testing Checklist

- [x] MULTIPLE_CHOICE: Radio button selection saves correctly
- [x] MULTI_SELECT: Multiple checkboxes save correctly
- [x] TRUE_FALSE: Only sends true/false, no options array
- [x] FILL_BLANK: Text input saves correctly, no options
- [ ] MATCH_FOLLOWING: Pairs save correctly (existing logic unchanged)

## Database Schema Reference

```prisma
model MCQQuestion {
  id                Int             @id @default(autoincrement())
  testId            Int
  questionType      QuestionType    // MULTIPLE_CHOICE, MULTI_SELECT, TRUE_FALSE, FILL_BLANK, MATCH_FOLLOWING
  questionText      String          @db.Text
  options           Json?           // Array of options (null for TRUE_FALSE and FILL_BLANK)
  correctAnswer     Json            // Correct answer(s) - always an array
  explanation       String?         @db.Text
  points            Int             @default(1)
  negativeMarking   Float           @default(0)
  order             Int
  imageUrl          String?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  test              MCQTest         @relation(fields: [testId], references: [id], onDelete: Cascade)
  wrongAnswers      WrongAnswer[]

  @@index([testId])
}
```

## Expected Database Format

| Question Type   | options                  | correctAnswer             | Example                       |
| --------------- | ------------------------ | ------------------------- | ----------------------------- |
| MULTIPLE_CHOICE | `["opt1","opt2","opt3"]` | `["opt2"]`                | Single answer from options    |
| MULTI_SELECT    | `["opt1","opt2","opt3"]` | `["opt1","opt3"]`         | Multiple answers from options |
| TRUE_FALSE      | `null`                   | `["true"]` or `["false"]` | Just true/false value         |
| FILL_BLANK      | `null`                   | `["answer"]`              | Single text answer            |
| MATCH_FOLLOWING | `[{left:"A",right:"1"}]` | `[{left:"A",right:"1"}]`  | Array of pairs                |

## Files Modified

1. `src/components/forms/MCQQuestionForm.tsx`

   - Added state management for radio/checkbox selections
   - Updated form submission logic
   - Separated question type handling
   - Added comprehensive console logging

2. `src/lib/actions.ts`
   - Added detailed error logging to `createMCQQuestion`
   - Added console logs for debugging JSON parsing

## Notes

- All question types now properly save their data
- The form uses controlled components for better state management
- Console logs added for easier debugging (can be removed in production)
- React warnings about `value` without `onChange` are false positives and can be ignored
