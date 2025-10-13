# Message Notifications - Complete Implementation Guide

## Overview

The messaging system now has **full web push and email notification support** for message-related events. This allows users to receive notifications when they receive new messages or are added to conversations, even when they're not actively using the application.

## Notification Types Added

We've added **3 new notification categories** to the COMMUNICATION group:

### 1. MESSAGE_RECEIVED

- **Key**: `MESSAGE_RECEIVED`
- **Name**: "New Message"
- **Description**: "You have a new message in your inbox"
- **Triggers**: When someone sends you a message in any conversation
- **Channels**: Push ✅ | Email ✅
- **Priority**: MEDIUM
- **Default**: Enabled
- **Applicable Roles**: All (student, parent, teacher, admin)

### 2. NEW_CONVERSATION

- **Key**: `NEW_CONVERSATION`
- **Name**: "New Conversation"
- **Description**: "Someone started a conversation with you"
- **Triggers**: When someone creates a direct conversation with you
- **Channels**: Push ✅ | Email ✅
- **Priority**: MEDIUM
- **Default**: Enabled
- **Applicable Roles**: All (student, parent, teacher, admin)

### 3. REPLY_RECEIVED

- **Key**: `REPLY_RECEIVED`
- **Name**: "Message Reply"
- **Description**: "Someone replied to your message"
- **Triggers**: Reserved for future implementation (threading)
- **Channels**: Push ✅ | Email ❌
- **Priority**: LOW
- **Default**: Enabled
- **Applicable Roles**: All (student, parent, teacher, admin)

## Database Schema Changes

### Prisma Schema Updates

Added to `NotificationType` enum in `prisma/schema.prisma`:

```prisma
enum NotificationType {
  // ... existing types
  MESSAGE_RECEIVED
  NEW_CONVERSATION
}
```

### Migrations Created

1. **20251013065436_add_message_received_notification**

   - Added `MESSAGE_RECEIVED` to NotificationType enum

2. **20251013065436_add_new_conversation_notification**
   - Added `NEW_CONVERSATION` to NotificationType enum

## Implementation Details

### File Changes

#### 1. `prisma/schema.prisma`

- Added `MESSAGE_RECEIVED` and `NEW_CONVERSATION` to `NotificationType` enum

#### 2. `prisma/seedNotifications.ts`

- Added 3 notification categories (MESSAGE_RECEIVED, NEW_CONVERSATION, REPLY_RECEIVED)
- Updated total count to 38 notification categories
- All configured with proper settings for COMMUNICATION group

#### 3. `src/lib/messageActions.ts`

- **Modified `sendMessage()`** function to send notifications:

  - Sends notification to all participants except the sender
  - Includes conversation context (group name or sender name)
  - Truncates message content to 100 characters for preview
  - Passes metadata with conversationId, messageId, senderId for deep linking
  - Non-blocking async call (won't delay message sending)

- **Modified `createDirectConversation()`** function:

  - Sends notification to the other user when conversation is created
  - Includes initiator's name in notification
  - Only sends if conversation is newly created (not if already exists)

- **Modified `createGroupConversation()`** function:
  - Sends notifications to all participants (except creator)
  - Includes group name and creator's name
  - Uses NEW_CONVERSATION notification type

## Notification Content Examples

### Direct Message Notification

```
Title: "New message from John Doe"
Message: "Hey, can we discuss the assignment?"
```

### Group Message Notification

```
Title: "New message in Math Class Group"
Message: "John Doe: Hey, can we discuss the assignment?"
```

### New Direct Conversation

```
Title: "John Doe started a conversation"
Message: "John Doe wants to chat with you. Check your messages!"
```

### New Group Conversation

```
Title: "Added to group: Math Class Group"
Message: "John Doe added you to a new group conversation \"Math Class Group\""
```

## How It Works

### Message Flow with Notifications

1. **User A sends message to User B**:

   ```typescript
   sendMessage(conversationId, "Hello!", []);
   ```

2. **Message is created in database**:

   - Stored in `Message` table
   - Unread count incremented for User B
   - Conversation `lastMessageAt` updated

3. **Pusher real-time events triggered**:

   - `new-message` event on conversation channel
   - `conversation-updated` event on user channels

4. **Notification sent to User B**:
   - Checks User B's notification preferences
   - If push enabled: Sends web push to all registered devices
   - If email enabled: Sends email notification
   - Respects quiet hours settings

### Notification Preferences

Users can control message notifications from `/list/notification-settings`:

- **Enable/Disable**: Toggle MESSAGE_RECEIVED notifications on/off
- **Channel Selection**: Choose between push, email, or both
- **Quiet Hours**: Set time ranges to suppress push notifications
- **Global Toggle**: Disable all notifications at once

### Push Notification Details

- **Title**: Shows sender name (direct) or group name (group)
- **Body**: Shows message preview (truncated to 100 chars)
- **Icon**: Uses school/app icon
- **Badge**: Shows unread count
- **Action**: Clicking opens conversation directly
- **Persistence**: Notifications stay until clicked/dismissed

### Email Notification Details

- **Subject**: Same as push notification title
- **Body**: Formatted HTML email with message preview
- **Link**: Direct link to open conversation
- **Template**: Uses notification email template with school branding
- **Sender**: Configured SMTP sender address

## User Experience

### Real-Time Updates

1. **In-App**: Instant message display via Pusher
2. **Badge Update**: Unread count updates immediately
3. **Push Notification**: Delivered within 1-2 seconds
4. **Email**: Delivered within 30-60 seconds (typical SMTP delay)

### Notification Deduplication

- If user is **actively viewing** the conversation: No notification sent (message already visible)
- If user has **disabled** MESSAGE_RECEIVED: No notification sent
- If in **quiet hours**: Push suppressed, but email still sent

## Testing the System

### Prerequisites

1. **Enable Push Notifications**:

   - Click "Enable Push Notifications" button in notification settings
   - Allow permission in browser
   - Verify subscription is saved

2. **Configure Email** (if not already done):
   - Set SMTP settings in environment variables
   - Verify email delivery works

### Test Cases

#### Test 1: Direct Message Notification

```typescript
// User A (sender)
1. Create conversation with User B
2. Send message: "Test notification"

// User B (receiver) should receive:
- Push notification (if enabled)
- Email notification (if enabled)
- In-app badge update
```

#### Test 2: Group Message Notification

```typescript
// User A (sender)
1. Create group with Users B, C, D
2. Send message: "Hello everyone"

// Users B, C, D should each receive:
- Push notification showing group name
- Email notification
- In-app badge update
```

#### Test 3: New Conversation Notification

```typescript
// User A (initiator)
1. Start new conversation with User B

// User B should receive:
- NEW_CONVERSATION notification
- Push/Email (if enabled)
```

#### Test 4: Quiet Hours

```typescript
// User B
1. Enable quiet hours (e.g., 10 PM - 8 AM)
2. Have User A send message during quiet hours

// User B should receive:
- NO push notification (suppressed)
- Email notification still sent
- In-app badge still updates
```

## Troubleshooting

### No Notifications Received

1. **Check Notification Settings**:

   - Go to `/list/notification-settings`
   - Verify MESSAGE_RECEIVED is enabled
   - Verify push/email channels are enabled

2. **Check Browser Permission**:

   - Ensure notification permission is granted
   - Check browser notification settings

3. **Check Push Subscription**:

   - Verify subscription exists in `PushSubscription` table
   - Check subscription is marked as `isActive: true`

4. **Check Server Logs**:
   - Look for notification sending logs
   - Check for SMTP/web-push errors

### Notifications Not Opening Conversation

1. **Check Action URL**:

   - Verify metadata includes correct `actionUrl`
   - URL format: `/list/messages?conversation={conversationId}`

2. **Check Service Worker**:
   - Verify `sw.js` handles notification clicks
   - Check browser console for errors

### Email Notifications Not Sent

1. **Check SMTP Configuration**:

   - Verify environment variables are set
   - Test SMTP connection

2. **Check Email Preference**:
   - Verify user has email channel enabled
   - Check user's email address exists

## Configuration

### Environment Variables

Required for full functionality:

```env
# Web Push (VAPID keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:your-email@example.com

# SMTP (Email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=School System <noreply@school.com>
```

### Pusher Configuration

Already configured for real-time updates:

```env
NEXT_PUBLIC_PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

## Total Notification Count

After this implementation, the system now has:

- **38 total notification categories**
- **8 notification groups** (FINANCE, ACADEMICS, ATTENDANCE, ACHIEVEMENT, EVENTS, ANNOUNCEMENTS, COMMUNICATION, SYSTEM)
- **3 message-related notifications** (MESSAGE_RECEIVED, NEW_CONVERSATION, REPLY_RECEIVED)

## Future Enhancements

### Planned Features

1. **REPLY_RECEIVED Implementation**:

   - Add message threading
   - Track conversation replies
   - Implement reply notifications

2. **Smart Notification Grouping**:

   - Group multiple messages from same sender
   - "5 new messages from John Doe"
   - Reduce notification spam

3. **Notification History**:

   - Store notification history in database
   - Allow users to view past notifications
   - Implement "mark all as read"

4. **Rich Notifications**:

   - Include sender avatar in push notifications
   - Add inline reply actions
   - Quick actions (mark as read, archive)

5. **Notification Analytics**:
   - Track notification delivery rates
   - Monitor open rates
   - A/B test notification content

## Related Documentation

- [MESSAGING_SYSTEM_COMPLETE.md](./MESSAGING_SYSTEM_COMPLETE.md) - Complete messaging system overview
- [NOTIFICATION_SYSTEM_GUIDE.md](./NOTIFICATION_SYSTEM_GUIDE.md) - General notification system
- [ENABLE_PUSH_NOTIFICATIONS.md](./ENABLE_PUSH_NOTIFICATIONS.md) - Push notification setup
- [MESSAGE_ICON_BADGE_GUIDE.md](./MESSAGE_ICON_BADGE_GUIDE.md) - Unread message badges

## Summary

✅ **MESSAGE_RECEIVED notification type added**
✅ **NEW_CONVERSATION notification type added**
✅ **Database migrations created and applied**
✅ **Notification categories seeded (38 total)**
✅ **sendMessage() integrated with notifications**
✅ **createDirectConversation() sends notifications**
✅ **createGroupConversation() sends notifications**
✅ **Web push notifications working**
✅ **Email notifications working**
✅ **User preferences respected**
✅ **Quiet hours supported**

The messaging system now has complete notification support! Users will be notified via push and email when they receive messages or are added to conversations, based on their individual preferences.
