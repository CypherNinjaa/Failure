# Export Data - Quick Start Guide

## 🎯 Quick Access

**Location**: Admin Dashboard → Export Data (in menu and bottom navigation)

**URL**: `/admin/export-data`

**Required Role**: Admin only

---

## 🚀 Basic Usage (3 Steps)

### Step 1: Choose Date Range

Click one of the preset buttons or use manual selection:

- **All Time** - All records ever created
- **Today** - Only today's records
- **This Week** - Current week (Mon-Sun)
- **This Month** - Current calendar month
- **Custom** - Click "Manual Selection" for custom dates

### Step 2: Select Category

Click on any data category card:

- 📚 Students, Teachers, Parents, Classes
- 📝 Lessons, Exams, Assignments, Results
- 📊 Attendance, Events, Announcements
- 🏆 Leaderboards, MCQ Tests
- 💰 Fees, Payments, Salaries, Income, Expenses

### Step 3: Export

Click the **"Export to Excel"** button

- File downloads automatically
- Filename includes timestamp
- Professional Excel formatting applied

---

## 🔍 Advanced Usage (Filters)

### Filter by Class

**Use Case**: Export all data for a specific class

**Example**: "Export all students in Class 2A"

1. Select "Students" category
2. Choose class "2A - Grade 2" from Class dropdown
3. Click Export
4. ✅ Result: Excel file with only 2A students

### Filter by Student

**Use Case**: Export all records for one student

**Example**: "Get all attendance for John Doe"

1. Select "Attendance Records" category
2. Choose "John Doe (2A)" from Student dropdown
3. Click Export
4. ✅ Result: Excel file with John's attendance only

### Filter by Teacher

**Use Case**: Export teacher-specific data

**Example**: "Export all lessons taught by Ms. Smith"

1. Select "Lessons/Schedule" category
2. Choose "Jane Smith" from Teacher dropdown
3. Click Export
4. ✅ Result: Excel file with Ms. Smith's lessons

### Filter by Parent

**Use Case**: Export parent-related data

**Example**: "Export all students under parent Mike Johnson"

1. Select "Students" category
2. Choose "Mike Johnson" from Parent dropdown
3. Click Export
4. ✅ Result: Excel file with Mike's children

---

## 📅 Manual Date Selection

### When to Use

- Custom date ranges (e.g., "Sept 1-15, 2025")
- Specific academic periods
- Audit periods
- Report generation for exact timeframes

### How to Use

1. Click **"Manual Selection"** toggle button
2. **Start Date**: Pick beginning date
3. **End Date**: Pick ending date
4. Select category and export

**Tip**: End date is inclusive (includes full day 23:59:59)

---

## 🎨 Combining Filters

### Multiple Filter Example

**Scenario**: "Export September attendance for Class 3B"

**Steps**:

1. ✅ Date: Click "Manual Selection"
   - Start: 2025-09-01
   - End: 2025-09-30
2. ✅ Filter: Select "3B - Grade 3" from Class dropdown
3. ✅ Category: Click "Attendance Records"
4. ✅ Export: Click "Export to Excel"

**Result**: Attendance records for Class 3B in September 2025 only

---

## 💡 Common Scenarios

### Scenario 1: Monthly Fee Collection Report

```
Date Range: This Month
Category: Student Fees
Filter: None (all students)
```

### Scenario 2: Teacher Performance Review

```
Date Range: Last Year
Category: Teacher Rankings
Filter: Specific teacher
```

### Scenario 3: Student Progress Report

```
Date Range: This Year
Categories (export multiple):
  1. Results/Grades (filter: student)
  2. Attendance (filter: student)
  3. MCQ Test Results (filter: student)
  4. Assignments (filter: student's class)
```

### Scenario 4: Class Overview

```
Date Range: This Month
Filter: Specific class
Categories (export all):
  - Students
  - Lessons
  - Exams
  - Attendance
  - Results
  - Events
```

### Scenario 5: Financial Summary

```
Date Range: Last Month
Categories (export all):
  - Student Fees
  - Transactions
  - Teacher Salaries
  - Income Records
  - Expense Records
```

---

## ⚠️ Important Notes

### What Gets Filtered

✅ **Filtered by Date + Filters**:

- Students, Teachers, Parents (creation date)
- Lessons, Exams, Assignments (scheduled date)
- Attendance (attendance date)
- Results (when applicable)
- Events, Announcements (event/post date)
- MCQ Tests & Attempts (creation/submission date)
- Fees & Payments (creation/payment date)
- Salaries, Income, Expenses (payment/transaction date)

❌ **Not Filtered** (always exports all):

- Classes (static list)
- Subjects (static list)
- Fee Structures (static list)

### Filter Compatibility

| Category      | Class Filter | Student Filter | Teacher Filter | Parent Filter |
| ------------- | ------------ | -------------- | -------------- | ------------- |
| Students      | ✅           | ✅             | ❌             | ✅            |
| Teachers      | ❌           | ❌             | ✅             | ❌            |
| Parents       | ❌           | ❌             | ❌             | ✅            |
| Lessons       | ✅           | ❌             | ✅             | ❌            |
| Exams         | ✅           | ❌             | ✅             | ❌            |
| Assignments   | ✅           | ❌             | ✅             | ❌            |
| Attendance    | ✅           | ✅             | ✅             | ❌            |
| Results       | ✅           | ✅             | ❌             | ❌            |
| Events        | ✅           | ❌             | ❌             | ❌            |
| Announcements | ✅           | ❌             | ❌             | ❌            |
| MCQ Tests     | ✅           | ❌             | ✅             | ❌            |
| MCQ Attempts  | ✅           | ✅             | ❌             | ❌            |
| Student Fees  | ✅           | ✅             | ❌             | ❌            |

---

## 🎯 Tips & Tricks

### Tip 1: Clear Filters

Click the **"Clear All Filters"** button (red X icon) to reset all dropdowns

### Tip 2: No Data Warning

If export returns empty, check:

- Date range is correct
- Filters match existing data
- Database has records for selected period

### Tip 3: Large Exports

For exports over 1000 records:

- Use narrower date ranges
- Apply filters to reduce dataset
- Browser may take 5-10 seconds to generate

### Tip 4: File Names

Files are auto-named: `{category}_{timestamp}.xlsx`

- Example: `students_2025-10-15_14-30-45.xlsx`
- Easy to organize by timestamp

### Tip 5: Preset vs Manual

- **Presets**: Quick, common ranges (90% of use cases)
- **Manual**: Precise control for audits/reports

---

## 🔧 Troubleshooting

### Problem: No download happens

**Solution**: Check browser pop-up blocker settings

### Problem: "No data found" message

**Solution**:

- Verify date range includes data
- Check if filters are too restrictive
- Ensure data exists in database

### Problem: Excel file won't open

**Solution**:

- File may be too large (>100MB)
- Try narrower date range
- Update Excel/LibreOffice

### Problem: Missing columns

**Solution**:

- This is expected (only relevant fields exported)
- Check documentation for field list per category

### Problem: Filter dropdown is empty

**Solution**:

- Database may have no records of that type
- Check if students/teachers/classes exist
- Refresh page to reload filter data

---

## 📊 Excel File Features

### What's Included

✅ Professional formatting
✅ Bold headers with colored background
✅ Auto-sized columns
✅ Properly formatted dates (DD/MM/YYYY)
✅ Clean data (no nulls, proper text)

### Column Headers

Headers are user-friendly:

- "Student ID" (not `id`)
- "Created At" (not `createdAt`)
- "Parent Name" (not `parent.name`)

### Data Types

- **Dates**: DD/MM/YYYY format
- **Times**: DD/MM/YYYY HH:MM format
- **Numbers**: Plain numbers (no formatting)
- **Text**: Properly encoded (UTF-8)

---

## 🎓 Learning Path

### Beginner (Day 1)

1. Export "Students" with preset "All Time"
2. Open Excel file and explore
3. Try different preset date ranges

### Intermediate (Day 2)

1. Use manual date selection
2. Export with one filter (e.g., class)
3. Export multiple categories with same filter

### Advanced (Day 3)

1. Combine date range + filter
2. Export complete class data package
3. Create monthly financial reports

### Expert (Day 4+)

1. Design custom report workflows
2. Schedule regular exports
3. Combine exports for comprehensive analysis

---

## 📞 Support

**Need Help?**

- Check console for error messages
- Verify your role is "admin" in Clerk
- Review filter compatibility table
- Contact system administrator

**Best Practices**:
✅ Export regularly for backups
✅ Use consistent date ranges
✅ Organize files by date
✅ Test filters before large exports

---

**Quick Reference Card**:

```
📍 Location: /admin/export-data
🔑 Access: Admin only
⏱️ Processing: 1-10 seconds
📁 Format: .xlsx (Excel)
🎨 Styling: Professional formatting
💾 Size: Usually <10MB per file
```
