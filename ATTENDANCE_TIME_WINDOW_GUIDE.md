# Teacher Attendance Time Window - User Guide

## Overview

The attendance time window feature allows administrators to control when teachers can mark their attendance. This ensures teachers only mark attendance during specific hours (e.g., morning reporting time).

## How to Set Up Time Window

### Step 1: Navigate to Locations Page

1. Log in as **Admin**
2. Click on **"Locations"** in the sidebar menu
3. You'll see the **"Attendance Time Window"** section at the top

### Step 2: Click "Set Time Window" Button

- If no time is set, you'll see: "No time window set. Teachers can mark attendance anytime."
- Click the purple **"Set Time Window"** button on the right

### Step 3: Configure Time Settings

You'll be taken to the **Attendance Time Settings** page where you can:

1. **Start Time**: Set when teachers can START marking attendance
   - Example: `08:00` (8:00 AM)
   - Click the time input and select hours and minutes
2. **End Time**: Set when the attendance system closes

   - Example: `08:45` (8:45 AM)
   - This gives teachers a 45-minute window

3. **Enable/Disable Time Restriction**:

   - Check the box to enable time window restriction
   - Uncheck to allow teachers to mark attendance anytime

4. **Preview**: See how your settings will work before saving

### Step 4: Save Settings

- Click the **"Save Settings"** button at the bottom
- You'll see a success message
- Settings are applied immediately

## Example Scenarios

### Scenario 1: Morning Reporting (8:00 AM - 8:45 AM)

```
Start Time: 08:00
End Time: 08:45
Enable restriction: ✓ Checked
```

**Result**: Teachers can only mark attendance between 8:00 AM and 8:45 AM

### Scenario 2: Extended Window (7:00 AM - 10:00 AM)

```
Start Time: 07:00
End Time: 10:00
Enable restriction: ✓ Checked
```

**Result**: Teachers have 3 hours to mark attendance

### Scenario 3: No Restriction

```
Enable restriction: ✗ Unchecked
```

**Result**: Teachers can mark attendance at any time

## Important Rules

### For Teachers:

1. **Date Restriction**: Can only mark attendance for TODAY
   - Cannot mark for past dates
   - Cannot mark for future dates
2. **Time Window**: Must be within admin-set time window
   - Before start time: System shows "Too early" message
   - After end time: System shows "Time window closed" message
   - During window: Can proceed with attendance
3. **One Attendance Per Day**: Can only mark attendance once per day
   - If already marked, it will update the existing record

### For Admins:

1. **Can update settings anytime**: Changes apply immediately
2. **Can view current settings**: On locations page
3. **Can disable restriction**: If you need flexibility

## How Teachers See It

When a teacher tries to mark attendance:

1. **Outside Time Window**:

   ```
   ⚠️ Attendance system is currently closed
   Time window: 08:00 - 08:45
   Current time: 09:30
   Please mark attendance during the allowed time window.
   ```

2. **Within Time Window**:
   ```
   ✓ You can mark attendance now
   Time window: 08:00 - 08:45
   Current time: 08:20
   Remaining time: 25 minutes
   ```

## Time Format

- Use 24-hour format: `HH:MM`
- Examples:
  - 8:00 AM = `08:00`
  - 8:45 AM = `08:45`
  - 12:00 PM = `12:00`
  - 5:00 PM = `17:00`
  - 11:59 PM = `23:59`

## Tips

1. **Set realistic windows**: Give teachers enough time (30-60 minutes)
2. **Consider time zones**: Server time is used for checking
3. **Test first**: Try with a wider window initially
4. **Monitor usage**: Check attendance records to see if teachers are marking on time

## Troubleshooting

### Button Not Working?

- Refresh the page
- Check if you're logged in as admin
- Clear browser cache

### Teachers Can't Mark Attendance?

- Check if current time is within the window
- Verify the time window is active (checkbox enabled)
- Ensure locations are set up correctly

### Wrong Time Showing?

- Check server timezone settings
- Verify your time inputs are correct (24-hour format)

## Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Verify database migration was successful
3. Ensure Prisma client was regenerated
4. Contact technical support
