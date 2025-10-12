# 📢 Notification System - Complete Guide

## Overview

The HCS School Management System now has a **comprehensive notification system** that supports:

- ✅ **Email notifications** via Gmail SMTP
- ✅ **Web push notifications** (browser push)
- ✅ **37 dynamic notification categories**
- ✅ **User preference management**
- ✅ **Admin override capability**
- ✅ **Quiet hours support**
- ✅ **Digest mode** (coming soon)

---

## 🚀 Quick Start for Admins

### 1. Access Admin Notification Center

1. Login as **Admin**
2. Go to **"Send Notifications"** in the sidebar menu
3. Or navigate to: `/admin-notifications`

### 2. Test Email Configuration

1. Click the **"🧪 Test Email"** button in the top-right
2. Enter **your email address** (recipient)
3. Click "Send Test Email 📨"
4. Check your inbox - you should receive email from `vk6938663@gmail.com`
5. If not received, check:
   - `.env` file has correct Gmail credentials
   - Gmail app password is valid
   - No firewall blocking SMTP
   - Check spam/junk folder

**Note**: Email will be **sent FROM** `vk6938663@gmail.com` (Gmail SMTP) **TO** your entered email address.

### 3. Send a Notification

1. **Select Recipients**: Choose who receives (All Users, Students, Parents, Teachers, Admins)
2. **Pick Notification Type**: Select from 37 categories (Fee Overdue, Exam Scheduled, etc.)
3. **Choose Channels**: Enable Web Push 🔔 and/or Email 📧
4. **Write Title**: Clear, concise title (max 100 chars)
5. **Write Message**: Detailed message (max 500 chars)
6. **Click "Send Notification 📨"**

---

## 📧 Gmail SMTP Configuration

### Current Setup (in `.env`):

```env
GMAIL_USER=vk6938663@gmail.com
GMAIL_APP_PASSWORD=jufu nkak txch tofl
```

### How Email Delivery Works:

**Sender (FROM)**: `vk6938663@gmail.com` (configured in Gmail SMTP)

**Recipient (TO)**: Users' email addresses from Clerk (Students, Parents, Teachers, Admins)

**Flow**:

1. Admin sends notification from dashboard
2. System fetches user emails from Clerk
3. Gmail SMTP sends email using `vk6938663@gmail.com` as sender
4. Recipients receive email in their inbox
5. Reply-to remains `vk6938663@gmail.com`

**Example**:

- Admin sends "Fee Overdue" notification to all Parents
- System finds all Parent users from Clerk
- Gets their email addresses (e.g., `parent1@gmail.com`, `parent2@yahoo.com`)
- Sends individual emails FROM `vk6938663@gmail.com` TO each parent
- Parents receive personalized notifications

### How to Generate Gmail App Password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Go to **App Passwords**
4. Select "Mail" and "Other (Custom name)"
5. Name it "HCS School"
6. Copy the 16-character password
7. Update `.env` file with the password (no spaces)

### Troubleshooting Email Issues:

- **"Invalid login"**: Check app password is correct
- **"Less secure app"**: Use app password, not main password
- **"Daily limit exceeded"**: Gmail has 500 emails/day limit
- **Emails in spam**: Add sender to contacts or whitelist

---

## 🔔 Web Push Notifications

### VAPID Keys (Already Generated):

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BN-rH4zEymTYQJUiCmWeGrF2KnfWPIO--Dhm6do7M3P6nI-MYFDzk4B7aaK1_A5WgOf6BgdoElekd8ruvI4wPD8
VAPID_PRIVATE_KEY=PavoC-a56yorb1pFLvXhg59n9m7QSQ2Z7fo9Y1ljfZA
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### How Web Push Works:

1. User visits site and grants notification permission
2. Browser creates subscription with unique endpoint
3. System stores subscription in database
4. When notification sent, web-push library delivers to browser
5. Service worker (`/sw.js`) displays the notification

### Testing Web Push:

1. Open browser console
2. Check for service worker registration
3. Grant notification permission when prompted
4. Subscribe to push notifications via Settings
5. Send test notification from Admin Center

---

## 📂 Notification Categories (37 Total)

### 💰 FINANCE (7 categories):

- `FEE_OVERDUE` - Fee payment overdue
- `FEE_DUE_SOON` - Fee payment due soon
- `PAYMENT_RECEIVED` - Payment received
- `PAYMENT_APPROVED` - Payment approved
- `SALARY_PROCESSED` - Salary processed
- `EXPENSE_APPROVED` - Expense approved
- `INCOME_RECORDED` - Income recorded

### 📚 ACADEMICS (8 categories):

- `EXAM_SCHEDULED` - Exam scheduled
- `EXAM_REMINDER` - Exam reminder
- `RESULT_PUBLISHED` - Result published
- `ASSIGNMENT_POSTED` - Assignment posted
- `ASSIGNMENT_DUE` - Assignment due
- `ASSIGNMENT_GRADED` - Assignment graded
- `CLASS_CANCELLED` - Class cancelled
- `CLASS_RESCHEDULED` - Class rescheduled

### 📊 ATTENDANCE (5 categories):

- `ATTENDANCE_ABSENT` - Student absent
- `ATTENDANCE_LATE` - Student late
- `ATTENDANCE_PATTERN` - Attendance pattern alert
- `TEACHER_ATTENDANCE_MARKED` - Teacher attendance marked
- `ATTENDANCE_SUMMARY` - Attendance summary

### 🏆 ACHIEVEMENT (6 categories):

- `BADGE_EARNED` - Badge earned
- `LEADERBOARD_POSITION` - Leaderboard position update
- `ACHIEVEMENT_UNLOCKED` - Achievement unlocked
- `TEACHER_RATING_RECEIVED` - Teacher rating received
- `TEACHER_RANK_CHANGED` - Teacher rank changed
- `MILESTONE_REACHED` - Milestone reached

### 📅 EVENTS (4 categories):

- `EVENT_CREATED` - Event created
- `EVENT_REMINDER` - Event reminder
- `EVENT_CANCELLED` - Event cancelled
- `EVENT_UPDATED` - Event updated

### 📣 ANNOUNCEMENTS (3 categories):

- `ANNOUNCEMENT_GENERAL` - General announcement
- `ANNOUNCEMENT_URGENT` - Urgent announcement
- `ANNOUNCEMENT_CLASS` - Class announcement

### 💬 COMMUNICATION (2 categories):

- `MESSAGE_RECEIVED` - Message received
- `REPLY_RECEIVED` - Reply received

### 🔧 SYSTEM (2 categories):

- `SYSTEM_MAINTENANCE` - System maintenance
- `SYSTEM_UPDATE` - System update

---

## ⚙️ User Settings (for Students, Parents, Teachers)

### Access Settings:

1. Click **"Settings"** in sidebar
2. Go to **"Notifications"** tab

### What Users Can Control:

- **Master Switch**: Enable/disable all notifications
- **Quiet Hours**: Set time range (e.g., 10 PM - 8 AM)
- **Per-Category Toggle**: Turn on/off specific notification types
- **Channel Selection**: Choose Push and/or Email per category
- **Frequency**: Real-time or Digest (coming soon)

### Default Settings:

- ✅ All categories ON by default
- ✅ Both Push and Email enabled
- ❌ Quiet hours disabled
- ⚡ Real-time frequency

---

## 🔥 Admin Override

### When to Use:

- 🚨 **Critical announcements** (school closure, emergency)
- ⚠️ **Urgent fee reminders** (deadline tomorrow)
- 🎯 **Important exam updates** (schedule change)
- 📢 **Mandatory communications** (parent meeting)

### How It Works:

- Admin notifications **bypass all user preferences**
- Ignores quiet hours
- Ignores channel preferences (sends to all enabled channels)
- Respects only email availability (can't send if no email)

### Warning:

⚠️ Use responsibly! Users trust this feature for emergencies only.

---

## 🤖 Automatic Triggers (Coming Soon)

### Already Implemented (functions ready):

1. **`triggerFeeOverdueNotification`** - Auto-send when fee overdue
2. **`triggerPaymentApprovedNotification`** - Auto-send on payment approval
3. **`triggerExamScheduledNotification`** - Auto-send when exam created

### How to Enable:

1. Find the action (e.g., fee creation in `src/lib/actions.ts`)
2. Import trigger function:
   ```typescript
   import { triggerFeeOverdueNotification } from "@/lib/notificationActions";
   ```
3. Call after successful action:
   ```typescript
   if (feeIsOverdue) {
   	await triggerFeeOverdueNotification(studentFeeId);
   }
   ```

### Future Triggers to Add:

- Assignment due reminders (1 day before)
- Exam reminders (3 days, 1 day before)
- Attendance summaries (weekly)
- Badge earned celebrations
- Teacher rating notifications
- Event reminders (1 hour before)

---

## 🔧 Quick Send Buttons (Context-Specific)

### What Are They?

Buttons on specific pages (e.g., Fee Management, Attendance) that let admins quickly send relevant notifications without going to Admin Center.

### Example Usage:

```tsx
import QuickSendNotificationButton from "@/components/QuickSendNotificationButton";

<QuickSendNotificationButton
	categoryKey="FEE_OVERDUE"
	defaultTitle="Fee Payment Reminder"
	defaultMessage="Your fee payment is overdue. Please pay immediately."
	recipientType="PARENT"
	buttonText="Notify Parents"
	buttonIcon="💰"
/>;
```

### Where to Add:

- **Fee Management Page**: "Send Fee Reminder" button
- **Attendance Page**: "Notify Absent Students" button
- **Exam Creation**: "Announce Exam" button
- **Assignment Post**: "Notify Students" button
- **Event Creation**: "Announce Event" button

---

## 📊 Monitoring & Logs

### Database Tables:

1. **`Notification`** - All sent notifications
2. **`NotificationLog`** - Delivery status logs
3. **`NotificationCategory`** - 37 category definitions
4. **`UserNotificationPreference`** - User settings
5. **`PushSubscription`** - Web push endpoints

### Check Logs:

```sql
-- See recent notifications
SELECT * FROM "Notification" ORDER BY "sentAt" DESC LIMIT 10;

-- Check delivery status
SELECT * FROM "NotificationLog" WHERE "deliveryStatus" = 'FAILED';

-- Count by category
SELECT "categoryKey", COUNT(*) FROM "Notification" GROUP BY "categoryKey";
```

### Console Logs:

All operations log to console with emojis:

- 🚀 Admin notification request
- 📤 Sending to users
- 👥 Found X users
- ✅ Successfully sent
- ❌ Failed to send
- 📧 Email details
- 🔔 Push details

---

## 🐛 Troubleshooting

### Notifications Not Sending:

#### Check 1: Environment Variables

```bash
# Verify .env file
cat .env | grep -E "(GMAIL|VAPID)"
```

#### Check 2: Test Email

1. Go to Admin Notification Center
2. Click "🧪 Test Email"
3. Check console for errors

#### Check 3: Category Exists

```sql
SELECT * FROM "NotificationCategory" WHERE "key" = 'YOUR_CATEGORY_KEY';
```

#### Check 4: Users Have Emails

```typescript
// In Clerk dashboard, verify users have email addresses
```

#### Check 5: Check Logs

```bash
# Terminal where dev server runs
# Look for 📧 and 🔔 emoji logs
```

### Common Errors:

**"Category not found"**

- Run: `npx prisma db seed` to seed categories
- Or create category manually in database

**"Invalid login credentials"**

- Check Gmail app password in `.env`
- Ensure no extra spaces
- Verify 2-factor auth enabled

**"No users found"**

- Check Clerk dashboard for users
- Verify `publicMetadata.role` is set
- Check role filter in code

**"Push subscription not found"**

- User hasn't subscribed yet
- Add subscription flow in UI
- Service worker not registered

---

## 🎯 Best Practices

### For Admins:

1. **Test first**: Always use "Test Email" before mass send
2. **Clear titles**: Keep under 50 chars for push
3. **Concise messages**: 150-200 chars ideal for push
4. **Right category**: Choose appropriate type
5. **Respect quiet hours**: Unless truly urgent
6. **Monitor logs**: Check delivery success rates

### For Developers:

1. **Use triggers**: Automate common notifications
2. **Add quick-send buttons**: Context-specific pages
3. **Log everything**: Console logs for debugging
4. **Handle errors**: Graceful fallbacks
5. **Test channels**: Verify both email and push
6. **Update categories**: Add new types as needed

---

## 📚 API Reference

### Server Actions:

```typescript
// Get user preferences
await getUserNotificationPreferences();

// Update single preference
await updateNotificationPreference(categoryKey, enabled, channels);

// Bulk update
await bulkUpdateNotificationPreferences(updates, settings);

// Send to user
await sendNotificationToUser(
	userId,
	categoryKey,
	title,
	message,
	metadata,
	forceAdmin
);

// Send to role
await sendNotificationToRole(
	role,
	categoryKey,
	title,
	message,
	metadata,
	forceAdmin
);

// Admin send
await adminSendNotification(
	recipientType,
	categoryKey,
	title,
	message,
	recipientId,
	metadata
);

// Triggers
await triggerFeeOverdueNotification(studentFeeId);
await triggerPaymentApprovedNotification(paymentId);
await triggerExamScheduledNotification(examId);
```

### API Endpoints:

```typescript
// Send notification
POST / api / admin / send - notification;
Body: {
	recipientType, categoryKey, title, message, channels;
}

// Test notification
POST / api / admin / test - notification;
Body: {
	email;
}
```

---

## 🔮 Future Enhancements

### Planned Features:

- [ ] SMS notifications (Twilio integration)
- [ ] WhatsApp notifications
- [ ] In-app notification bell with unread count
- [ ] Notification history page for users
- [ ] Analytics dashboard (delivery rates, open rates)
- [ ] Scheduled notifications (send later)
- [ ] Template system (predefined messages)
- [ ] Rich media support (images, buttons)
- [ ] Multi-language support
- [ ] A/B testing for message effectiveness

---

## 💡 Tips & Tricks

1. **Batch sending**: Use "Send to Role" for efficiency
2. **Preview mode**: Add preview before sending (future)
3. **Scheduling**: Schedule non-urgent notifications for business hours
4. **Personalization**: Use metadata to customize messages
5. **Tracking**: Monitor delivery status in logs
6. **Testing**: Always test with small group first
7. **Templates**: Create templates for common messages (future)

---

## 📞 Support

### Need Help?

- Check console logs for errors
- Review this guide
- Test with "🧪 Test Email" button
- Check database for notification records
- Verify environment variables

### Report Issues:

- Include error message
- Provide console logs
- Share notification details
- Mention affected users

---

**Last Updated**: October 12, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready (Email ✅ | Push ⏳ Needs subscription flow)
