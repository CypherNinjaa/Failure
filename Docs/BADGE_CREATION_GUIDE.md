# 🏅 Badge Creation Guide - Complete Tutorial

## Table of Contents

1. [Introduction](#introduction)
2. [Accessing Badge Management](#accessing-badge-management)
3. [Understanding Badge Components](#understanding-badge-components)
4. [Step-by-Step Badge Creation](#step-by-step-badge-creation)
5. [Badge Criteria Examples](#badge-criteria-examples)
6. [Badge Types Explained](#badge-types-explained)
7. [Advanced Examples](#advanced-examples)
8. [Best Practices](#best-practices)
9. [Common Mistakes](#common-mistakes)
10. [Testing Your Badges](#testing-your-badges)

---

## Introduction

Badges are digital awards given to students based on their performance in MCQ tests. They serve to:

- 🎯 Motivate students through gamification
- 🏆 Recognize achievements and milestones
- 📊 Provide visual feedback on progress
- 🤝 Encourage healthy competition

This guide will walk you through creating effective badges for your school management system.

---

## Accessing Badge Management

### Prerequisites

- You must be logged in as an **Admin**
- Badge management is only accessible to admin users

### Navigation Steps

1. Log in to the system as admin
2. Click on **Menu** (☰) in the sidebar
3. Scroll to find **"Badges"** option
4. Click to navigate to `/list/badges`

You'll see a table displaying:

- Icon
- Badge Name
- Description
- Color
- Number of students who earned it
- Status (Active/Inactive)
- Action buttons (Edit/Delete)

---

## Understanding Badge Components

Before creating a badge, let's understand each component:

### 1. **Badge Name** (Required)

- **Purpose**: Display name shown to students
- **Character Limit**: 1-50 characters recommended
- **Examples**:
  - ✅ "Top Performer"
  - ✅ "Perfect Score Champion"
  - ✅ "Knowledge Seeker"
  - ❌ "Badge1" (too generic)

### 2. **Icon** (Optional)

- **Purpose**: Visual representation of the badge
- **Format**: Single emoji character
- **How to Add**:
  - Windows: Press `Win + .` (period)
  - Mac: Press `Cmd + Ctrl + Space`
  - Copy from emojipedia.org
- **Examples**:
  - 🥇 (1st place medal)
  - ⭐ (star)
  - 🔥 (fire)
  - 💎 (gem)
  - 📚 (books)
  - 🎯 (target)
  - 🏆 (trophy)
  - 🚀 (rocket)

### 3. **Description** (Optional)

- **Purpose**: Explains what the badge represents
- **Character Limit**: 1-500 characters recommended
- **Example**: "Awarded to students who maintain an average score of 90% or higher across all MCQ tests"

### 4. **Color** (Required)

- **Purpose**: Badge background color for visual distinction
- **Format**: Hex color code (e.g., #FF5733)
- **How to Choose**:
  - Click the color picker square
  - Or enter hex code directly
- **Recommended Colors**:
  - Gold: `#FFD700` (for top achievements)
  - Silver: `#C0C0C0` (for 2nd place)
  - Bronze: `#CD7F32` (for 3rd place)
  - Purple: `#8B5CF6` (for excellence)
  - Blue: `#3B82F6` (for perfect scores)
  - Red: `#EF4444` (for activity)
  - Green: `#10B981` (for learning)
  - Orange: `#F59E0B` (for consistency)

### 5. **Criteria** (Optional but Recommended)

- **Purpose**: JSON rules for automatic badge assignment
- **Format**: JSON object
- **When Empty**: Badge must be assigned manually (not recommended)

### 6. **Active Status** (Checkbox)

- **Checked**: Badge is visible and can be awarded
- **Unchecked**: Badge is hidden (useful for seasonal badges)

### 7. **Display Order** (Required)

- **Purpose**: Controls badge appearance order
- **Format**: Integer (0-1000)
- **Logic**: Lower number = higher priority
- **Example**:
  - 1st place badge: `1`
  - 2nd place badge: `2`
  - General badges: `10`, `20`, `30`

---

## Step-by-Step Badge Creation

### Example 1: Creating a "Gold Medal" Badge for 1st Place

#### Step 1: Click Create Button

Navigate to `/list/badges` and click the yellow **+** button in the top-right corner.

#### Step 2: Fill Basic Information

```
Badge Name: Gold Medal Winner
Icon: 🥇
Description: Awarded to the student who achieves 1st rank on the leaderboard
```

#### Step 3: Choose Color

```
Color: #FFD700
```

- Click the color picker
- Select a bright gold/yellow color
- Or paste the hex code directly

#### Step 4: Set Display Order

```
Display Order: 1
```

This ensures it appears first in badge lists.

#### Step 5: Define Criteria (JSON)

```json
{
	"type": "rank",
	"value": 1
}
```

**Explanation**:

- `"type": "rank"` - This badge is based on leaderboard rank
- `"value": 1` - Awarded when student is #1

#### Step 6: Check Active Status

✅ Ensure "Badge is active" is **checked**

#### Step 7: Preview

Look at the preview at the bottom of the form. It should show:

- Gold background with your emoji
- Badge name

#### Step 8: Submit

Click the blue **"Create"** button.

✅ **Success!** Your badge will now automatically be awarded to the 1st place student on the leaderboard.

---

### Example 2: Creating an "Excellence Award" Badge for High Achievers

#### Complete Form:

```
Badge Name: Excellence Award
Icon: ⭐
Description: Awarded to students who maintain an average score of 90% or higher
Color: #8B5CF6
Display Order: 10
Active: ✅ Checked
```

#### Criteria (JSON):

```json
{
	"type": "averageScore",
	"min": 90
}
```

**Explanation**:

- `"type": "averageScore"` - Based on average of all test scores
- `"min": 90` - Student must have ≥90% average

**Result**: Any student with 90%+ average gets this badge automatically!

---

### Example 3: Creating an "Active Learner" Badge

#### Complete Form:

```
Badge Name: Active Learner
Icon: 🔥
Description: Awarded for completing 10 or more MCQ tests
Color: #EF4444
Display Order: 20
Active: ✅ Checked
```

#### Criteria (JSON):

```json
{
	"type": "testsCompleted",
	"min": 10
}
```

**Explanation**:

- `"type": "testsCompleted"` - Based on number of completed tests
- `"min": 10` - Student must complete at least 10 tests

---

## Badge Criteria Examples

### Rank-Based Badges

#### Top 3 Badge (Awarded to 1st, 2nd, or 3rd)

```json
{
	"type": "rank",
	"maxValue": 3
}
```

#### Exactly 2nd Place

```json
{
	"type": "rank",
	"value": 2
}
```

#### Top 10 Badge

```json
{
	"type": "rank",
	"maxValue": 10
}
```

---

### Score-Based Badges

#### Perfect Score Badge (100%)

```json
{
	"type": "bestScore",
	"value": 100
}
```

#### High Achiever (95%+ average)

```json
{
	"type": "averageScore",
	"min": 95
}
```

#### Good Performance (80%+ average)

```json
{
	"type": "averageScore",
	"min": 80
}
```

#### Score Range Badge (80-89%)

```json
{
	"type": "averageScore",
	"min": 80,
	"max": 89
}
```

---

### Activity-Based Badges

#### Beginner Badge (Complete 1 test)

```json
{
	"type": "testsCompleted",
	"min": 1
}
```

#### Dedicated Learner (20+ tests)

```json
{
	"type": "testsCompleted",
	"min": 20
}
```

#### Super Active (50+ tests)

```json
{
	"type": "testsCompleted",
	"min": 50
}
```

---

### Improvement-Based Badges (Future Implementation)

#### Most Improved Student

```json
{
	"type": "improvement",
	"percentIncrease": 20
}
```

_Note: This requires historical tracking - coming soon!_

#### Comeback Kid

```json
{
	"type": "improvement",
	"fromBelow": 60,
	"toAbove": 80
}
```

_Note: Future feature_

---

### Streak-Based Badges (Future Implementation)

#### 7-Day Streak

```json
{
	"type": "streak",
	"days": 7
}
```

_Note: Requires daily activity tracking - coming soon!_

---

## Badge Types Explained

### RANK_BASED

Awards badges based on position in leaderboard.

**Use Cases**:

- 1st, 2nd, 3rd place medals
- Top 10 achievers
- Top 25% of class

**Criteria Fields**:

- `value`: Exact rank (e.g., 1 for first place)
- `maxValue`: Maximum rank (e.g., 3 for top 3)

---

### SCORE_BASED

Awards badges based on test scores.

**Use Cases**:

- Perfect scores
- High averages
- Score milestones

**Criteria Fields**:

- `min`: Minimum score threshold
- `max`: Maximum score threshold (optional)
- `value`: Exact score match

---

### ACTIVITY_BASED

Awards badges based on engagement.

**Use Cases**:

- Test completion count
- Participation milestones
- Engagement rewards

**Criteria Fields**:

- `min`: Minimum activity count
- `testsCompleted`: Number of tests

---

### IMPROVEMENT

Awards badges for progress over time.

**Use Cases**:

- Most improved student
- Comeback achievements
- Growth milestones

**Status**: 🚧 Coming Soon

---

### CUSTOM

Awards badges manually by admin.

**Use Cases**:

- Special achievements
- Event-specific awards
- Teacher nominations

**Criteria**: Leave empty or `{}`

---

## Advanced Examples

### Example 4: Multi-Criteria Badge (Conceptual)

For future implementation, you might want badges with multiple requirements:

```json
{
	"conditions": [
		{
			"type": "averageScore",
			"min": 85
		},
		{
			"type": "testsCompleted",
			"min": 5
		}
	],
	"operator": "AND"
}
```

**Meaning**: Student needs 85%+ average AND 5+ completed tests.

_Note: Current implementation evaluates single criteria. Multi-criteria support planned._

---

### Example 5: Subject-Specific Badge (Conceptual)

```json
{
	"type": "averageScore",
	"min": 95,
	"subjectId": "123",
	"subjectName": "Mathematics"
}
```

**Meaning**: 95%+ average specifically in Mathematics tests.

_Note: Subject filtering not yet implemented but planned._

---

### Example 6: Time-Limited Badge (Conceptual)

```json
{
	"type": "averageScore",
	"min": 90,
	"validFrom": "2025-10-01",
	"validUntil": "2025-12-31"
}
```

**Meaning**: Badge available only during Q4 2025.

_Note: Temporal badges planned for seasonal events._

---

## Best Practices

### 1. **Create a Badge Hierarchy**

Start with foundational badges, then add specialized ones:

**Tier 1: Rank Badges**

- 🥇 Gold Medal (rank 1)
- 🥈 Silver Medal (rank 2)
- 🥉 Bronze Medal (rank 3)

**Tier 2: Score Badges**

- ⭐ Excellence (90%+)
- 🎯 Consistent (80%+)
- 📈 Achiever (70%+)

**Tier 3: Activity Badges**

- 🔥 Super Active (20+ tests)
- 📚 Active Learner (10+ tests)
- 🌱 Beginner (1+ test)

### 2. **Use Meaningful Icons**

Choose icons that relate to the achievement:

- 🏆 Trophy: For winners
- ⭐ Star: For excellence
- 🔥 Fire: For activity/streak
- 💎 Diamond: For rare achievements
- 📚 Books: For learning milestones
- 🎯 Target: For consistency
- 🚀 Rocket: For improvement

### 3. **Color Psychology**

- **Gold/Yellow**: Premium, top achievements
- **Purple**: Excellence, special awards
- **Blue**: Trust, perfect scores
- **Green**: Growth, learning
- **Red**: Energy, activity
- **Orange**: Warmth, consistency

### 4. **Write Clear Descriptions**

Good descriptions:

- ✅ "Awarded to students who maintain an average score of 90% or higher"
- ✅ "Earned by completing 10 or more MCQ tests"
- ✅ "Given to the top-ranked student on the leaderboard"

Poor descriptions:

- ❌ "For good students"
- ❌ "Badge"
- ❌ "" (empty)

### 5. **Set Logical Display Orders**

```
1-9:    Top rank badges
10-19:  High achievement badges
20-29:  Activity badges
30-39:  Milestone badges
40+:    Special/custom badges
```

### 6. **Start Simple**

Begin with these 5 essential badges:

1. 🥇 1st Place (rank: 1)
2. ⭐ Excellence (avg: 90%)
3. 🎯 Good Performance (avg: 80%)
4. 🔥 Active (10+ tests)
5. 🌱 Beginner (1+ test)

Then expand based on student feedback!

---

## Common Mistakes

### ❌ Mistake 1: Invalid JSON Syntax

```json
{
	"type": "rank", // ❌ Missing quotes around key
	"value": 1
}
```

**Correct:**

```json
{
	"type": "rank", // ✅ Keys must be in quotes
	"value": 1
}
```

---

### ❌ Mistake 2: Using Unsupported Criteria Types

```json
{
	"type": "grade", // ❌ Not a valid type
	"value": "A"
}
```

**Valid Types**:

- `"rank"`
- `"averageScore"`
- `"bestScore"`
- `"testsCompleted"`

---

### ❌ Mistake 3: Incorrect Value Types

```json
{
	"type": "averageScore",
	"min": "90" // ❌ Should be number, not string
}
```

**Correct:**

```json
{
	"type": "averageScore",
	"min": 90 // ✅ Number without quotes
}
```

---

### ❌ Mistake 4: Missing Required Fields

```json
{
	"type": "rank" // ❌ Missing value or maxValue
}
```

**Correct:**

```json
{
	"type": "rank",
	"value": 1 // ✅ Added value
}
```

---

### ❌ Mistake 5: Trailing Commas

```json
{
	"type": "rank",
	"value": 1 // ❌ Trailing comma
}
```

**Correct:**

```json
{
	"type": "rank",
	"value": 1 // ✅ No comma after last property
}
```

---

## Testing Your Badges

### Step 1: Create Test Badge

Create a badge with easy criteria:

```json
{
	"type": "testsCompleted",
	"min": 1
}
```

### Step 2: Complete a Test

- Log in as a student
- Navigate to MCQ Tests
- Complete any test
- View results

### Step 3: Check Leaderboard

- Navigate to Leaderboard
- Look for your badge in the "Badges" column
- It should appear next to your name

### Step 4: Verify in Badge List (Admin)

- Go to `/list/badges`
- Check "Students" column
- Should show "1 student" (or more)

---

## Quick Reference Table

| Badge Goal    | Type             | Example Criteria                     |
| ------------- | ---------------- | ------------------------------------ |
| 1st Place     | `rank`           | `{"type":"rank","value":1}`          |
| Top 3         | `rank`           | `{"type":"rank","maxValue":3}`       |
| 90%+ Average  | `averageScore`   | `{"type":"averageScore","min":90}`   |
| Perfect Score | `bestScore`      | `{"type":"bestScore","value":100}`   |
| 10+ Tests     | `testsCompleted` | `{"type":"testsCompleted","min":10}` |

---

## Badge Creation Checklist

Before clicking "Create", verify:

- [ ] Badge name is descriptive and student-friendly
- [ ] Icon emoji is appropriate and visible
- [ ] Description explains what the badge represents
- [ ] Color is visually distinct from other badges
- [ ] Display order follows your hierarchy
- [ ] Criteria JSON is valid (no syntax errors)
- [ ] Criteria logic matches your intention
- [ ] "Active" checkbox is checked (if ready to use)
- [ ] Preview looks good at the bottom of form

---

## Example Badge Set for a New School

Here's a complete starter set of 10 badges:

### 1. Gold Medal 🥇

```
Name: Gold Medal Winner
Icon: 🥇
Description: Awarded to the #1 ranked student
Color: #FFD700
Order: 1
Criteria: {"type":"rank","value":1}
```

### 2. Silver Medal 🥈

```
Name: Silver Medal
Icon: 🥈
Description: Awarded to the #2 ranked student
Color: #C0C0C0
Order: 2
Criteria: {"type":"rank","value":2}
```

### 3. Bronze Medal 🥉

```
Name: Bronze Medal
Icon: 🥉
Description: Awarded to the #3 ranked student
Color: #CD7F32
Order: 3
Criteria: {"type":"rank","value":3}
```

### 4. Excellence Award ⭐

```
Name: Excellence Award
Icon: ⭐
Description: For maintaining 90%+ average score
Color: #8B5CF6
Order: 10
Criteria: {"type":"averageScore","min":90}
```

### 5. Perfect Score 💎

```
Name: Perfect Score
Icon: 💎
Description: For achieving 100% on any test
Color: #3B82F6
Order: 11
Criteria: {"type":"bestScore","value":100}
```

### 6. High Achiever 🌟

```
Name: High Achiever
Icon: 🌟
Description: For maintaining 85%+ average
Color: #A78BFA
Order: 12
Criteria: {"type":"averageScore","min":85}
```

### 7. Consistent Performer 🎯

```
Name: Consistent Performer
Icon: 🎯
Description: For maintaining 80%+ average
Color: #F59E0B
Order: 13
Criteria: {"type":"averageScore","min":80}
```

### 8. Super Active 🔥

```
Name: Super Active
Icon: 🔥
Description: For completing 20+ tests
Color: #EF4444
Order: 20
Criteria: {"type":"testsCompleted","min":20}
```

### 9. Active Learner 📚

```
Name: Active Learner
Icon: 📚
Description: For completing 10+ tests
Color: #10B981
Order: 21
Criteria: {"type":"testsCompleted","min":10}
```

### 10. First Steps 🌱

```
Name: First Steps
Icon: 🌱
Description: Welcome badge for completing first test
Color: #84CC16
Order: 22
Criteria: {"type":"testsCompleted","min":1}
```

---

## Troubleshooting

### Badge Not Appearing on Leaderboard

**Check**:

1. Is badge marked as "Active"? ✅
2. Does student meet criteria?
3. Has leaderboard been refreshed? (Reload page)
4. Are there any JSON syntax errors?

### JSON Validation Error

**Solution**:

1. Copy your JSON
2. Visit jsonlint.com
3. Paste and validate
4. Fix errors highlighted
5. Copy corrected JSON back

### Badge Awarded to Wrong Students

**Check**:

1. Review criteria logic
2. Test with lower threshold first
3. Verify `min` vs `max` vs `value` fields
4. Check if `operator` is needed (future feature)

### Color Not Showing

**Solution**:

1. Ensure hex code starts with `#`
2. Use 6-character hex (e.g., #FF5733)
3. Avoid 3-character shorthand
4. Don't use color names (use hex instead)

---

## Conclusion

You now have everything needed to create effective badges! Remember:

1. **Start Simple**: Create basic rank and score badges first
2. **Test Often**: Create a test badge to verify functionality
3. **Get Feedback**: Ask students which badges motivate them
4. **Iterate**: Add more badges based on engagement data
5. **Be Creative**: Use fun icons and colors to make badges exciting!

Happy badge creating! 🎉

---

## Additional Resources

- **Main Leaderboard Guide**: See `LEADERBOARD_GUIDE.md` for system overview
- **JSON Validator**: https://jsonlint.com
- **Emoji Reference**: https://emojipedia.org
- **Color Picker**: https://htmlcolorcodes.com
- **Hex Color Guide**: https://www.color-hex.com

---

_Last Updated: October 11, 2025_
_Version: 1.0.0_
