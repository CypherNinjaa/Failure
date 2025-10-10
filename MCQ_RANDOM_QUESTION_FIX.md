# MCQ Random Question Display Fix

## Problem

Questions and options were changing randomly during the test, making it impossible for students to answer correctly. The issue was that shuffling was happening on **every component re-render** instead of just once at the start.

## Root Cause

The `shuffledQuestions` and option shuffling logic were being recalculated on every render:

```typescript
// OLD CODE - WRONG ❌
const shuffledQuestions = test.shuffleQuestions
	? [...test.questions].sort(() => Math.random() - 0.5)
	: test.questions;
```

Every time the component re-rendered (which happens frequently - on timer updates, state changes, etc.), the questions would shuffle again.

## Solution

### 1. Shuffle Questions Once on Mount

Use `useState` with a function initializer to shuffle questions only once when the component mounts:

```typescript
// NEW CODE - CORRECT ✅
const [shuffledQuestions] = useState(() => {
	return test.shuffleQuestions
		? [...test.questions].sort(() => Math.random() - 0.5)
		: test.questions;
});
```

### 2. Cache Shuffled Options

Create a cache of shuffled options for all questions on mount, so each question's options remain consistent:

```typescript
const [shuffledOptionsCache] = useState<{ [key: number]: any }>(() => {
	const cache: { [key: number]: any } = {};
	if (test.shuffleOptions) {
		shuffledQuestions.forEach((question: any) => {
			if (question.options) {
				try {
					const options = JSON.parse(question.options);
					cache[question.id] = options.sort(() => Math.random() - 0.5);
				} catch (error) {
					console.error("Error parsing question options:", error);
					cache[question.id] = question.options;
				}
			}
		});
	}
	return cache;
});
```

### 3. Updated getShuffledOptions Function

Look up options from the cache instead of shuffling every time:

```typescript
const getShuffledOptions = (question: any) => {
	if (!test.shuffleOptions || !question.options) {
		try {
			return typeof question.options === "string"
				? JSON.parse(question.options)
				: question.options;
		} catch {
			return question.options;
		}
	}
	return shuffledOptionsCache[question.id] || question.options;
};
```

## Key Changes

| Aspect          | Before (❌ Broken)           | After (✅ Fixed)               |
| --------------- | ---------------------------- | ------------------------------ |
| Question Order  | Shuffled on every render     | Shuffled once on mount         |
| Option Order    | Shuffled on every render     | Shuffled once on mount, cached |
| Performance     | Poor (unnecessary shuffling) | Good (shuffle only once)       |
| User Experience | Questions jumping around     | Stable question display        |

## Benefits

1. **Stable Display**: Questions and options stay in the same order throughout the test
2. **Better UX**: Students can navigate back/forth without confusion
3. **Performance**: No unnecessary re-shuffling on every render
4. **Correct Shuffling**: Still randomizes when `shuffleQuestions` or `shuffleOptions` is enabled
5. **Error Handling**: Gracefully handles JSON parsing errors

## Testing

To verify the fix:

1. ✅ Start a test with `shuffleQuestions: true`
2. ✅ Check that questions appear in random order
3. ✅ Click "Next" and "Previous" buttons
4. ✅ Verify questions stay in the same order
5. ✅ Check that options within each question don't change
6. ✅ Complete the test and verify answers are recorded correctly

## Files Modified

- `src/components/TestAttemptClient.tsx`
  - Added `shuffledQuestions` state with initializer function
  - Added `shuffledOptionsCache` state with memo
  - Updated `getShuffledOptions` to use cache
  - Removed dynamic shuffling logic

## Related Issues Fixed

This also resolves:

- ✅ Wrong answers being recorded (due to option indices changing)
- ✅ Student confusion about question content
- ✅ Timer causing questions to re-shuffle
- ✅ Tab switching detection causing re-renders and re-shuffles
