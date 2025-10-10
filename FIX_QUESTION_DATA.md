# Fix Question Data in Database

## Problem

Some questions in the database have invalid JSON in the `options` or `correctAnswer` fields, causing parsing errors.

## Solution

### Option 1: Delete all questions and start fresh

Run this in your database console or Prisma Studio:

```sql
DELETE FROM "MCQQuestion";
```

Then go back to the test detail page and add questions using the fixed form.

### Option 2: Fix existing questions manually

1. Open Prisma Studio:

```bash
npx prisma studio
```

2. Go to the `MCQQuestion` table

3. Find rows where:

   - `options` column contains invalid JSON (not wrapped in `[]` or `{}`)
   - `correctAnswer` column contains invalid JSON

4. For each broken question:
   - **MULTIPLE_CHOICE / MULTI_SELECT**: Ensure `options` is a valid JSON array like `["option1","option2","option3"]`
   - **TRUE_FALSE / FILL_BLANK**: Set `options` to `null`
   - **correctAnswer**: Must be a valid JSON array like `["answer"]`

### Option 3: Run a cleanup script

Create a script to fix all questions programmatically. Run this in a Node.js console or create a temporary API route:

```typescript
import prisma from "@/lib/prisma";

async function fixQuestions() {
	const questions = await prisma.mCQQuestion.findMany();

	for (const question of questions) {
		let needsUpdate = false;
		let updates: any = {};

		// Fix options field
		if (question.options) {
			try {
				if (typeof question.options === "string") {
					JSON.parse(question.options as any);
				}
			} catch {
				console.log(`Fixing options for question ${question.id}`);
				updates.options = null;
				needsUpdate = true;
			}
		}

		// Fix correctAnswer field
		try {
			if (typeof question.correctAnswer === "string") {
				JSON.parse(question.correctAnswer as any);
			}
		} catch {
			console.log(`Fixing correctAnswer for question ${question.id}`);
			updates.correctAnswer = [""];
			needsUpdate = true;
		}

		if (needsUpdate) {
			await prisma.mCQQuestion.update({
				where: { id: question.id },
				data: updates,
			});
		}
	}

	console.log("All questions fixed!");
}

fixQuestions();
```

## Recommended Action

**Delete all test questions and recreate them** using the fixed form. This is the simplest approach:

1. Open Prisma Studio: `npx prisma studio`
2. Go to `MCQQuestion` table
3. Select all rows and delete them
4. Go back to your test detail page
5. Add new questions using the form - they will now save correctly!

## Prevention

The question form has been fixed to ensure:

- MULTIPLE_CHOICE: Saves `options` as JSON array, `correctAnswer` as JSON array with one element
- MULTI_SELECT: Saves `options` as JSON array, `correctAnswer` as JSON array with multiple elements
- TRUE_FALSE: Saves `options` as `null`, `correctAnswer` as JSON array with "true" or "false"
- FILL_BLANK: Saves `options` as `null`, `correctAnswer` as JSON array with answer text
- MATCH_FOLLOWING: Saves both `options` and `correctAnswer` as JSON array of pair objects

All new questions created with the form will have valid JSON!
