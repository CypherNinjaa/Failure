# Error Handling Improvements - Foreign Key Constraints

## Problem

When trying to delete records that have related data (foreign key relationships), the application would crash with a Prisma error like:

```
ConnectorError: update or delete on table "Lesson" violates RESTRICT setting of foreign key constraint "Exam_lessonId_fkey" on table "Exam"
```

This error was not user-friendly and didn't explain what the user needed to do.

## Solution Implemented

### 1. Updated Delete Actions

Modified the server actions in `src/lib/actions.ts` to catch foreign key constraint errors and return user-friendly messages:

**Updated Functions:**

- ✅ `deleteLesson` - Now shows: "Cannot delete this lesson because it has related exams, assignments, or attendance records. Please delete those first."
- ✅ `deleteClass` - Now shows: "Cannot delete this class because it has related students, lessons, events, or announcements. Please delete or reassign those first."

**Pattern Used:**

```typescript
try {
	await prisma.lesson.delete({ where: { id: parseInt(id) } });
	return { success: true, error: false };
} catch (err: any) {
	console.log(err);

	// Check if it's a foreign key constraint error
	if (err.code === "P2003" || err.message?.includes("foreign key constraint")) {
		return {
			success: false,
			error: true,
			message: "User-friendly error message explaining the problem",
		};
	}

	return {
		success: false,
		error: true,
		message: "Generic error message",
	};
}
```

### 2. Updated FormModal Component

Modified `src/components/FormModal.tsx` to:

- Display error toast notifications with the custom message
- Show error message in the delete confirmation modal
- Use `toast.error()` to show user-friendly notifications

**Changes:**

```typescript
// Added new useEffect to handle errors
useEffect(() => {
	if (state.error) {
		const errorMessage =
			(state as any).message ||
			`Failed to delete ${table}. It may have related data.`;
		toast.error(errorMessage);
	}
}, [state]);

// Added error display in the form
{
	state.error && (state as any).message && (
		<div className="bg-red-50 border border-red-200 rounded-lg p-3">
			<p className="text-sm text-red-800 text-center">
				{(state as any).message}
			</p>
		</div>
	);
}
```

## How It Works Now

### Before (Bad UX):

1. User clicks delete on a lesson that has exams
2. Application crashes with Prisma error in console
3. User sees generic "Something went wrong" or the page breaks
4. User doesn't know what to do

### After (Good UX):

1. User clicks delete on a lesson that has exams
2. Toast notification appears: "Cannot delete this lesson because it has related exams, assignments, or attendance records. Please delete those first."
3. Error message also shows in the delete modal
4. User knows exactly what to do (delete related records first)

## Common Foreign Key Relationships

### Lesson

- **Related to:** Exams, Assignments, Attendance records
- **Message:** "Cannot delete this lesson because it has related exams, assignments, or attendance records. Please delete those first."

### Class

- **Related to:** Students, Lessons, Events, Announcements
- **Message:** "Cannot delete this class because it has related students, lessons, events, or announcements. Please delete or reassign those first."

### Teacher (Future)

- **Related to:** Lessons, Classes (supervisor), Teacher Attendance
- **Suggested Message:** "Cannot delete this teacher because they have related lessons or are supervising classes. Please reassign those first."

### Student (Future)

- **Related to:** Attendance, Results
- **Suggested Message:** "Cannot delete this student because they have attendance records or results. Please delete those first."

## For Developers: How to Add This to Other Delete Actions

1. **Find the delete action** in `src/lib/actions.ts`
2. **Replace the catch block:**

```typescript
// Old way:
catch (err) {
  console.log(err);
  return { success: false, error: true };
}

// New way:
catch (err: any) {
  console.log(err);

  if (err.code === 'P2003' || err.message?.includes('foreign key constraint')) {
    return {
      success: false,
      error: true,
      message: "Explain what related data exists and what to do"
    };
  }

  return {
    success: false,
    error: true,
    message: "Generic error message"
  };
}
```

3. **The FormModal component will automatically show the error message!**

## Testing

### To Test:

1. Create a lesson
2. Create an exam for that lesson
3. Try to delete the lesson
4. You should see the error toast and message in the modal

### Expected Behavior:

- ✅ Toast notification appears with error message
- ✅ Error message shows in the delete modal
- ✅ User understands what to do
- ✅ No application crash

## Related Files

- `src/lib/actions.ts` - Server actions with error handling
- `src/components/FormModal.tsx` - UI component showing errors
- All delete functions can use this pattern

## Future Improvements

1. Add this error handling to all remaining delete actions
2. Consider cascade delete for some relationships (be careful!)
3. Add "View Related Records" button in error message
4. Show count of related records (e.g., "5 exams, 3 assignments")
