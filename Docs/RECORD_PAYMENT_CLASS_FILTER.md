# Record Payment - Class Filter Enhancement

## Feature Added

Added **class-wise filtering** and **search functionality** to the Record Offline Payment form to help schools with many students easily find the right student fee to record payment for.

## Problem Solved

In schools with hundreds or thousands of students, the dropdown list of pending fees was overwhelming and difficult to navigate. Admins struggled to find specific students when recording payments.

## Solution Implemented

### 1. Class Filter Dropdown

- **Filter by Class**: Dropdown showing all classes (e.g., "1A - Grade 1", "3A - Grade 3")
- **"All Classes" option**: View all students across all classes
- Automatically extracts unique classes from students with pending fees

### 2. Search Filter

- **Real-time search**: Type to filter by:
  - Student first name
  - Student surname
  - Fee structure name
- Case-insensitive search
- Instant results as you type

### 3. Results Counter

- Shows "Showing X of Y student fees"
- Helps track how many results match your filters

### 4. Enhanced Student Fee Display

Each option in the dropdown now shows:

```
[Student Name] [Surname] | [Class] | [Fee Name] | ₹[Amount] pending
```

**Example:**

```
John Doe | 1A | Monthly Tuition Fee | ₹5000.00 pending
Jane Smith | 3A | Transport Fee | ₹1500.00 pending
```

## How to Use

### Step 1: Open Record Payment Form

Navigate to **Admin → Record Payment** and click the **+ button**

### Step 2: Filter Students

1. **By Class**: Select a class from "Filter by Class" dropdown

   - Choose "All Classes" to see everyone
   - Or select specific class (e.g., "1A - Grade 1")

2. **By Search**: Type in the search box
   - Student name: "john"
   - Fee type: "tuition"
   - Works with class filter (both filters applied together)

### Step 3: Select Student Fee

The dropdown will show only matching student fees based on your filters

### Step 4: Record Payment

- Enter the amount being paid
- Select payment method (Cash, Card, Bank Transfer, Cheque, Other)
- Add optional notes
- Click "Record Payment"

## Technical Implementation

### Files Modified

#### 1. `OfflinePaymentForm.tsx`

**Added State:**

```tsx
const [selectedClass, setSelectedClass] = useState<string>("all");
const [searchQuery, setSearchQuery] = useState<string>("");
```

**Added Filtering Logic:**

```tsx
// Extract unique classes
const classes = Array.from(
	new Set(
		studentFees?.map((fee: any) => fee.student.class).filter((cls: any) => cls)
	)
);

// Filter by class and search query
const filteredStudentFees = studentFees?.filter((fee: any) => {
	const matchesClass =
		selectedClass === "all" || fee.student.class?.name === selectedClass;
	const matchesSearch =
		searchQuery === "" ||
		fee.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		fee.student.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
		fee.feeStructure.name.toLowerCase().includes(searchQuery.toLowerCase());
	return matchesClass && matchesSearch;
});
```

**Added Filter UI:**

- Class dropdown (controlled by `selectedClass` state)
- Search input (controlled by `searchQuery` state)
- Results counter
- Styled filter section with gray background

#### 2. `FormContainer.tsx`

**Updated Query:**

```tsx
case "offlinePayment":
  const studentFees = await prisma.studentFee.findMany({
    where: {
      status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          surname: true,
          class: {                    // ← Added class relation
            select: {
              id: true,
              name: true,
              grade: {                // ← Added grade relation
                select: {
                  id: true,
                  level: true,
                },
              },
            },
          },
        },
      },
      feeStructure: { select: { id: true, name: true } },
    },
    orderBy: { dueDate: "asc" },
  });
```

## UI Design

### Filter Section (New)

```
┌─────────────────────────────────────────────────────────┐
│ Filter Students                                          │
├─────────────────────────────────────────────────────────┤
│ Filter by Class: [All Classes ▼]  Search: [_______]    │
│ Showing 15 of 150 student fees                          │
└─────────────────────────────────────────────────────────┘
```

### Student Fee Dropdown (Enhanced)

```
Select Student Fee
[Select Student Fee                                    ▼]
  John Doe | 1A | Monthly Tuition Fee | ₹5000.00 pending
  Jane Smith | 1A | Transport Fee | ₹1500.00 pending
  Mike Johnson | 3A | Monthly Tuition Fee | ₹5000.00 pending
  ...
```

## Benefits

### 1. Scalability

- Works efficiently with 10 students or 10,000 students
- Instant filtering (client-side, no API calls)

### 2. User Experience

- Quick navigation with class filter
- Flexible search for any student
- Clear display of all relevant information
- Visual feedback with results counter

### 3. Error Prevention

- Easier to find the correct student
- Full names and class information prevent confusion
- Clear pending amount display

### 4. Performance

- Filtering happens in browser (no server load)
- Data fetched once at form open
- Responsive UI updates

## Data Flow

```
1. Admin opens Record Payment form
   ↓
2. FormContainer fetches student fees with:
   - Student (name, surname, class, grade)
   - Fee structure (name)
   - Pending amount, due date, status
   ↓
3. OfflinePaymentForm receives data
   ↓
4. Extracts unique classes from data
   ↓
5. Admin selects class/searches
   ↓
6. Filters applied (client-side)
   ↓
7. Dropdown shows only matching students
   ↓
8. Admin selects student and records payment
```

## Example Scenarios

### Scenario 1: Large School (1000+ students)

**Without Filter:**

- Dropdown has 1000+ options
- Must scroll extensively
- Hard to find specific student

**With Filter:**

- Select "Grade 10A"
- Dropdown shows only 30-40 students
- Easy to find student

### Scenario 2: Monthly Fee Collection Day

**Without Search:**

- Students pay in random order
- Must scroll to find each student

**With Search:**

- Type "John"
- Instantly see all Johns
- Quick payment recording

### Scenario 3: Specific Fee Type

**Search by Fee:**

- Type "transport"
- See only transport fees
- Helps segregate payments by type

## Testing Checklist

- [x] Class filter shows all unique classes
- [x] "All Classes" option works
- [x] Search filters by student name
- [x] Search filters by surname
- [x] Search filters by fee structure name
- [x] Class filter + search work together
- [x] Results counter updates correctly
- [x] Dropdown shows "No students found" when no match
- [x] Enhanced dropdown format displays correctly
- [x] Payment recording still works
- [x] Form resets after successful payment

## Future Enhancements (Optional)

1. **Status Badge**: Show color-coded status (Pending/Partial/Overdue) in dropdown
2. **Multi-Select**: Record payment for multiple students at once
3. **Sorting**: Sort by name, amount, or due date
4. **Grade Filter**: Add separate grade-level filter
5. **Recent Students**: Show recently recorded payments at top
6. **Bulk Import**: Upload CSV of payments for bulk processing

## Notes

- Filter is **client-side** (fast, no server calls)
- Only shows fees with status: PENDING, PARTIAL, or OVERDUE (paid fees excluded)
- Class relation is optional (handles students without class assignment)
- Search is case-insensitive for better UX
- Results update instantly as you type or change filters
