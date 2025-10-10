# ✅ Face Recognition System - Testing Checklist

## Pre-Testing Setup

- [ ] Development server is running (`npm run dev`)
- [ ] At least one student has a profile photo uploaded
- [ ] Camera/webcam is connected to computer
- [ ] Browser has camera permissions (will prompt on first use)

## Test Steps

### 1. Access the Feature

- [ ] Navigate to `/list/classes`
- [ ] Locate the purple camera icon 🎥 next to a class
- [ ] Click the icon
- [ ] Page loads: `/list/classes/[id]/face-attendance`

### 2. Model Loading

- [ ] Progress bar appears showing "Loading face recognition models..."
- [ ] Progress reaches 100%
- [ ] Green checkmark appears: "✓ X faces loaded"
- [ ] "Start Camera" button becomes clickable

### 3. Camera Activation

- [ ] Click "Start Camera" button
- [ ] Browser prompts for camera permission (first time)
- [ ] Grant permission
- [ ] Video feed appears showing live webcam
- [ ] Camera stream is smooth (not frozen)

### 4. Face Detection

- [ ] Student faces the camera
- [ ] Blue bounding box appears around face (detection)
- [ ] Box turns green when student is recognized
- [ ] Student name appears above the box
- [ ] Detected student appears in "Detected Students" list below

### 5. Multiple Students

- [ ] First student faces camera → detected ✅
- [ ] First student moves away
- [ ] Second student faces camera → detected ✅
- [ ] Both students appear in detected list
- [ ] Counter shows correct number: "Submit Attendance (2 students)"

### 6. Submit Attendance

- [ ] Click "Submit Attendance" button
- [ ] Loading/processing indication
- [ ] Success toast notification appears
- [ ] Redirects to attendance list page
- [ ] Attendance records are visible in the list
- [ ] Present students marked correctly
- [ ] Absent students marked correctly

### 7. Database Verification

- [ ] Navigate to `/list/attendance`
- [ ] Today's date shows new records
- [ ] Detected students show "Present" badge
- [ ] Non-detected students show "Absent" badge

### 8. Edge Cases

#### No Student Photo

- [ ] Student without photo is in the class
- [ ] Their name shows "No photo" indicator in sidebar
- [ ] They cannot be detected via face recognition
- [ ] They remain "Absent" after submission
- [ ] System doesn't crash

#### Poor Lighting

- [ ] Test in dim lighting
- [ ] Face detection may be slower but still works
- [ ] Or shows appropriate warning

#### No Face Visible

- [ ] Camera pointing at empty space
- [ ] No bounding boxes appear
- [ ] No errors occur
- [ ] System waits for faces

#### Wrong Person

- [ ] Student A's photo in system
- [ ] Student B faces camera
- [ ] Student B is NOT recognized as Student A
- [ ] Or threshold prevents false match

### 9. Stop/Restart

- [ ] Click "Stop Camera" button
- [ ] Video feed stops
- [ ] Camera light turns off
- [ ] Click "Start Camera" again
- [ ] System restarts successfully
- [ ] Previous detections are retained

### 10. Navigation

- [ ] Click "← Back to Manual Attendance"
- [ ] Navigates to manual attendance page
- [ ] Manual attendance system still works
- [ ] No conflicts between manual and face recognition

## Performance Tests

- [ ] **Model Load Time**: < 5 seconds
- [ ] **First Face Detection**: < 2 seconds
- [ ] **Recognition Speed**: < 1 second per face
- [ ] **Memory Usage**: Acceptable (< 500MB)
- [ ] **No memory leaks**: Refresh page multiple times, usage stable

## Browser Compatibility

Test on:

- [ ] Chrome/Edge (Recommended)
- [ ] Firefox
- [ ] Safari (Mac)

## Error Handling

### Expected Errors to Handle Gracefully:

- [ ] Camera permission denied → Shows error message
- [ ] No models found → Shows error message
- [ ] No student photos → Shows warning
- [ ] Network error during submission → Shows error toast
- [ ] Student photos fail to load → Logs error, continues

## Security Tests

- [ ] **As Student**: Cannot access `/list/classes/[id]/face-attendance` → Redirects
- [ ] **As Parent**: Cannot access → Redirects
- [ ] **As Teacher**: Can access ✅
- [ ] **As Admin**: Can access ✅
- [ ] **Logged Out**: Cannot access → Redirects to login

## Clean Up

- [ ] Stop camera before closing page
- [ ] No console errors remain
- [ ] All resources released properly

---

## ✅ Success Criteria

All checkboxes above should be checked for a successful implementation.

## 🐛 Found Issues?

Document any issues here:

1. **Issue**: ****************\_****************
   **Expected**: **************\_**************
   **Actual**: **************\_\_\_**************
   **Steps to Reproduce**: ********\_\_\_********

2. **Issue**: ****************\_****************
   **Expected**: **************\_**************
   **Actual**: **************\_\_\_**************
   **Steps to Reproduce**: ********\_\_\_********

---

## 📝 Test Results

**Date Tested**: ******\_\_\_******  
**Tested By**: ******\_\_\_\_******  
**Result**: ☐ Pass ☐ Fail  
**Notes**: ********\_\_\_\_********

---

**Tip**: Test with 2-3 students first before rolling out to full classes!
