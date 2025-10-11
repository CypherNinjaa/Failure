# 📋 Fee Assignment Guide - How to Assign Fees to Students

## Overview

The **Assign Fees** feature allows admins to quickly assign fee structures to students. You can assign fees to an entire class or select specific students.

---

## 🎯 Complete Workflow

### **Step 1: Create Fee Structures (Templates)**

📍 **Navigate to:** Finance → Fee Structures

1. Click the **+ button** to create a new fee structure
2. Fill in the details:
   - **Name**: "Class 1 Monthly Tuition" or "Class 3 Monthly Tuition"
   - **Description**: Optional details
   - **Amount**: ₹1000
   - **Frequency**: MONTHLY
   - **Fee Type**: TUITION
   - **Class**: Select specific class (1A, 3A, etc.)
   - **Grade**: Select grade (Grade 1, Grade 3, etc.)
3. Click **Create**

**Result:** You now have reusable fee templates (like the ones in your screenshot)

---

### **Step 2: Assign Fees to Students** ⭐ NEW FEATURE

📍 **Navigate to:** Finance → Assign Fees

#### **Option A: Assign to Entire Class**

1. Click the **+ button**
2. Select **Fee Structure**: "class - 1 (₹1000)" from dropdown
3. Choose **Assignment Type**: "Entire Class"
4. Select **Class**: "1A" (all students in this class will be assigned)
5. Set **Due Date**: November 30, 2025
6. Set **Month**: November
7. Set **Year**: 2025
8. Click **Assign Fees**

**Result:** All students in Class 1A get a StudentFee record for November 2025

- Total: ₹1000
- Status: PENDING (red badge)
- Due: Nov 30, 2025

#### **Option B: Assign to Specific Students**

1. Click the **+ button**
2. Select **Fee Structure**: "class - 3 (₹1000)"
3. Choose **Assignment Type**: "Specific Students"
4. Select **Class**: "3A" (optional, filters student list)
5. **Select Students**: Check the boxes for specific students
   - Use "Select All" to select all visible students
   - Use "Deselect All" to clear selection
6. Set **Due Date**, **Month**, **Year**
7. Click **Assign Fees**

**Result:** Only selected students get the fee assigned

---

### **Step 3: View Assigned Fees**

📍 **Navigate to:** Finance → Student Fees

- See all assigned fees across the school
- Color-coded status badges:
  - 🟢 **PAID**: Fully paid
  - 🟡 **PARTIAL**: Partially paid
  - 🔴 **PENDING**: Not paid yet
  - 🟥 **OVERDUE**: Past due date
- Filter by status using the tabs (All/Paid/Partial/Pending/Overdue)

---

### **Step 4: Record Payments**

📍 **Navigate to:** Finance → Record Payment

When a student pays:

1. Click **+ button**
2. Select the **Student Fee** from dropdown
3. Enter **Amount** paid (full or partial)
4. Select **Payment Method**: CASH, CHEQUE, BANK_TRANSFER, UPI, etc.
5. Add **Notes** (optional)
6. Click **Record Payment**

**Result:**

- Payment record created with receipt number
- Student fee status updated automatically
- Pending amount recalculated

---

## 💡 Quick Tips

### **For Monthly Fees:**

- Create fee structures once (monthly frequency)
- Use **Assign Fees** at the start of each month
- Set due date to end of month (e.g., Nov 30, Dec 31)

### **For Bulk Assignment:**

- Use "Entire Class" option to assign to all students quickly
- Perfect for monthly tuition fees

### **For Selective Assignment:**

- Use "Specific Students" option
- Useful for:
  - Transport fees (only students who use the bus)
  - Hostel fees (only hostel students)
  - Special fees (exam fees for specific grades)

### **For Different Classes:**

- Create separate fee structures per class (like in your screenshot)
- "class - 1" for Class 1 students
- "class - 3" for Class 3 students
- This allows different amounts for different grades

---

## 📊 Example Scenario: November 2025 Tuition

**You want to charge November tuition for all students**

1. **Fee Structures Already Created:**

   - ✅ "class - 1" - ₹1000/month (Grade 1)
   - ✅ "class - 3" - ₹1000/month (Grade 3)

2. **Assign to Class 1A:**

   - Go to: Finance → Assign Fees → Click +
   - Fee Structure: "class - 1"
   - Type: Entire Class
   - Class: 1A
   - Due Date: 2025-11-30
   - Month: November
   - Year: 2025
   - Submit ✅

3. **Assign to Class 3A:**

   - Same process, select "class - 3" and Class 3A

4. **Result:**

   - All students now have pending fees
   - Parents can see in their portal (Finance → My Fees)
   - Admin can track in Student Fees page

5. **When Students Pay:**
   - Go to: Finance → Record Payment
   - Select student's fee
   - Record amount paid
   - Status updates automatically

---

## 🔄 Automating Monthly Assignments (Future Enhancement)

For fully automatic monthly fee assignment, you can create a cron job:

```typescript
// Run this script on the 1st of every month
// It will auto-assign all MONTHLY fee structures
// to their respective classes/grades

// Location: /api/cron/assign-monthly-fees
```

This would eliminate manual monthly assignments!

---

## 🎨 Navigation

**Desktop Sidebar:**

```
FINANCE
├── Fee Structures    (Create templates)
├── Assign Fees       (⭐ NEW - Bulk assign to students)
├── Student Fees      (View all assignments)
├── Record Payment    (Record payments)
├── Salaries          (Teacher salaries)
├── Income            (Other income)
└── Expenses          (School expenses)
```

**Mobile Bottom Nav:**

```
More → Finance Section (same items)
```

---

## ✅ Summary

| Task                        | Page            | Who          |
| --------------------------- | --------------- | ------------ |
| Create fee templates        | Fee Structures  | Admin        |
| **Assign fees to students** | **Assign Fees** | **Admin** ⭐ |
| View all assigned fees      | Student Fees    | Admin        |
| Record payments             | Record Payment  | Admin        |
| View my children's fees     | My Fees         | Parent       |

---

## 🎉 You're All Set!

The complete fee management workflow is now available:

1. ✅ Create fee structures (templates)
2. ✅ **Assign fees to students (bulk or selective)**
3. ✅ View and filter assigned fees
4. ✅ Record payments when received
5. ✅ Parents can view fees and payment history

**No more missing fee assignment functionality!** 🚀
