# Email Notifications with Cloudinary Icons - Implementation Guide

## ✅ What Was Implemented

### 1. Cloudinary Icon Integration

- All notification emails now use **Cloudinary-hosted PNG icons** instead of emojis
- Icons are hosted at: `https://res.cloudinary.com/dl8ls89qe/image/upload/notifications/`
- Professional, clean email appearance

### 2. Icon Mapping System

Created `src/lib/notificationIcons.ts` with:

- 37 notification types mapped to appropriate icons
- Helper functions: `getNotificationIcon()` and `getNotificationIconAlt()`
- Easy to maintain and extend

### 3. Enhanced Email Template

Updated email template in `src/lib/notificationActions.ts`:

- Beautiful gradient header with icon
- Responsive design
- Professional styling
- Clean footer with school branding

## 📋 Icon Mapping

| Notification Type           | Icon File        | Description           |
| --------------------------- | ---------------- | --------------------- |
| **Finance** (7 types)       |
| FEE_OVERDUE                 | finance.png      | Overdue payment alert |
| FEE_DUE_SOON                | finance.png      | Payment due reminder  |
| PAYMENT_APPROVED            | finance.png      | Payment approved      |
| PAYMENT_REJECTED            | close.png        | Payment rejected      |
| FEE_ASSIGNED                | finance.png      | New fee assigned      |
| **Academics** (8 types)     |
| EXAM_SCHEDULED              | exam.png         | New exam scheduled    |
| EXAM_REMINDER               | alarm.png        | Exam reminder         |
| RESULT_PUBLISHED            | result.png       | Results available     |
| ASSIGNMENT_CREATED          | assignment.png   | New assignment        |
| ASSIGNMENT_DUE_SOON         | assignment.png   | Assignment deadline   |
| MCQ_TEST_AVAILABLE          | test.png         | New MCQ test          |
| **Attendance** (5 types)    |
| ATTENDANCE_MARKED           | attendance.png   | Attendance recorded   |
| ATTENDANCE_ABSENT           | close.png        | Student absent        |
| ATTENDANCE_LATE             | alarm.png        | Late arrival          |
| TEACHER_ATTENDANCE          | teacher.png      | Teacher check-in      |
| **Achievements** (6 types)  |
| BADGE_EARNED                | test.png         | Badge unlocked        |
| LEADERBOARD_RANK_UP         | result.png       | Rank improved         |
| PERFECT_SCORE               | result.png       | 100% score            |
| **Events** (4 types)        |
| EVENT_CREATED               | calendar.png     | New event             |
| EVENT_REMINDER              | alarm.png        | Event reminder        |
| EVENT_CANCELLED             | close.png        | Event cancelled       |
| **Announcements** (3 types) |
| ANNOUNCEMENT_GENERAL        | announcement.png | School announcement   |
| ANNOUNCEMENT_URGENT         | notification.png | Urgent announcement   |
| **Communication** (2 types) |
| MESSAGE_RECEIVED            | message.png      | New message           |
| **System** (2 types)        |
| SYSTEM_MAINTENANCE          | setting.png      | Maintenance notice    |
| SYSTEM_UPDATE               | notification.png | System update         |

## 🎨 Email Template Features

### Header

- Gradient purple background
- 40x40px icon from Cloudinary
- Clean white text
- Professional typography

### Content

- White message box with purple left border
- Responsive padding
- Optional "View Details" button
- Clean, readable font

### Footer

- School name: "Happy Child School"
- System branding
- Auto-notification disclaimer

## 📝 Example Email Structure

```html
<!DOCTYPE html>
<html>
	<div class="container">
		<div class="header">
			<img
				src="https://res.cloudinary.com/dl8ls89qe/image/upload/notifications/exam.png"
				alt="Exam"
				class="header-icon"
			/>
			<h2>Exam Scheduled</h2>
		</div>
		<div class="content">
			<div class="message">
				<p>Your exam has been scheduled for tomorrow...</p>
			</div>
			<a href="..." class="button">View Details</a>
		</div>
		<div class="footer">
			<p>Happy Child School</p>
			<p>School Management System</p>
		</div>
	</div>
</html>
```

## 🚀 How It Works

1. **Trigger Function** calls `sendNotificationToUser()` with `categoryKey`
2. **sendNotificationToUser()** passes `categoryKey` to `sendEmailNotification()`
3. **sendEmailNotification()** uses `getNotificationIcon(categoryKey)` to get Cloudinary URL
4. **Email sent** with proper icon in header

## 📦 Files Modified

1. `src/lib/notificationIcons.ts` - NEW: Icon mapping and helper functions
2. `src/lib/notificationActions.ts` - Updated: Enhanced email template with Cloudinary icons
3. All trigger functions now pass `categoryKey` to email notifications

## ✨ Benefits

✅ **Professional**: Clean, branded emails instead of emojis  
✅ **Consistent**: Same icons across email and web app  
✅ **Flexible**: Easy to change icons by updating Cloudinary  
✅ **Fast**: Cloudinary CDN ensures quick image loading  
✅ **Scalable**: Add new notification types easily

## 🔧 Adding New Notification Types

1. Add icon mapping in `notificationIcons.ts`:

```typescript
NEW_NOTIFICATION: {
  icon: "youricon.png",
  cloudinaryPath: getUrl("youricon.png"),
  alt: "Description"
},
```

2. Upload `youricon.png` to Cloudinary at:
   `notifications/youricon.png`

3. Use in trigger function:

```typescript
await sendNotificationToUser(
	userId,
	"NEW_NOTIFICATION", // categoryKey
	"Title",
	"Message"
);
```

## 📧 Testing

To test email notifications:

1. Go to Admin Notifications
2. Click "Send Test"
3. Check your email inbox
4. Verify icon appears in header

---

**Implementation Complete!** 🎉  
All emails now use professional Cloudinary-hosted icons instead of emojis.
