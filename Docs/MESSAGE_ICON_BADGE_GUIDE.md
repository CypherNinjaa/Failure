# Header Message Icon with Unread Count Badge

## Overview

Added a real-time unread message count badge to the message icon in the header navigation bar. The badge updates instantly when new messages arrive or are read, without requiring page refresh.

## Implementation

### New Component: `MessageIcon.tsx`

**Location:** `/src/components/MessageIcon.tsx`

A client-side component that displays the message icon with a dynamic badge showing unread message count.

**Features:**

- 🔴 Red badge with unread count
- 🔄 Real-time updates via Pusher
- ✨ Pulse animation when messages are unread
- 🔗 Clickable link to messages page
- 📊 Shows "9+" for 10 or more unread messages

**Code Structure:**

```typescript
- Fetches initial unread count from /api/conversations/unread-counts
- Subscribes to Pusher events:
  * conversation-updated: New message arrived
  * unread-count-updated: Messages marked as read
- Updates badge count in real-time
- Only displays badge when unreadCount > 0
```

### Updated Component: `Navbar.tsx`

**Location:** `/src/components/Navbar.tsx`

Modified the navbar to use the new `MessageIcon` component instead of a static image.

**Changes:**

- Imported `MessageIcon` component
- Replaced static message icon with `<MessageIcon userId={user?.id || ""} />`
- Passes current user's ID for real-time updates

## Visual Design

### Badge Styling

```css
- Position: Absolute top-right of icon
- Size: 18px height, min-width 18px
- Background: Red (#EF4444)
- Text: White, 10px, bold
- Border Radius: Full circle
- Animation: Pulse effect
- Shadow: Large shadow for prominence
```

### States

1. **No Unread Messages**: Icon only, no badge
2. **1-9 Unread**: Badge shows exact number
3. **10+ Unread**: Badge shows "9+"

## Real-Time Functionality

### Event Flow

#### When New Message Arrives:

1. Sender sends message → `sendMessage()` in messageActions.ts
2. Server triggers Pusher event: `conversation-updated`
3. MessageIcon component receives event
4. Fetches updated unread counts from API
5. Badge updates with new count
6. Pulse animation activates

#### When Messages Are Read:

1. User opens conversation → `markMessagesAsRead()` called
2. Server resets unread count to 0
3. Server triggers Pusher event: `unread-count-updated`
4. MessageIcon component receives event
5. Fetches updated counts
6. Badge updates (disappears if count = 0)

### API Endpoints Used

**`GET /api/conversations/unread-counts`**

- Returns map of conversationId → unreadCount
- Calculates total unread across all conversations
- Called on component mount and after Pusher events

## User Experience

### Before Implementation

❌ No visibility of unread messages from header
❌ Had to navigate to messages page to check
❌ No indication when new messages arrive

### After Implementation

✅ Always visible unread count in header
✅ Real-time badge updates (no refresh needed)
✅ Pulse animation draws attention
✅ Click icon to go directly to messages
✅ Works across all roles (Admin, Teacher, Student, Parent)

## Integration Points

### Pages Affected

- ✅ Admin Home Page
- ✅ Teacher Home Page
- ✅ Student Home Page
- ✅ Parent Home Page
- ✅ All other pages with header

### Related Components

- `MessageIcon.tsx` - New badge component
- `Navbar.tsx` - Header with message icon
- `ConversationList.tsx` - Messages list (uses same count API)
- `useConversations.ts` - Hook for conversation updates

### API Dependencies

- `/api/conversations/unread-counts` - Fetches unread counts
- Pusher events: `conversation-updated`, `unread-count-updated`
- Server actions: `markMessagesAsRead()`, `sendMessage()`

## Technical Details

### State Management

```typescript
const [unreadCount, setUnreadCount] = useState<number>(0);
```

### Pusher Subscription

```typescript
const pusher = getPusherClient();
const channel = pusher.subscribe(`user-${userId}`);
```

### Count Calculation

```typescript
const total = Object.values(unreadCounts).reduce(
	(sum: number, count) => sum + (count as number),
	0
);
```

## Performance Optimizations

1. **Efficient API Calls**: Only fetches count map, not full conversation data
2. **Conditional Rendering**: Badge only renders when count > 0
3. **Singleton Pusher**: Reuses same Pusher connection across app
4. **Debounced Updates**: Only updates on actual count changes
5. **Lazy Loading**: Component only loads when navbar renders

## Testing Checklist

- [x] Badge appears when unread messages exist
- [x] Badge disappears when all messages read
- [x] Count updates in real-time when new message arrives
- [x] Count updates when opening conversation
- [x] Shows "9+" for 10+ messages
- [x] Pulse animation works
- [x] Click navigates to messages page
- [x] Works on mobile view
- [x] Works on desktop view
- [x] Works for all user roles

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

## Accessibility

- Alt text: "Messages" on image
- Color contrast: Red badge on white background meets WCAG AA
- Keyboard navigation: Link is keyboard accessible
- Screen readers: Count announced as part of link

## Future Enhancements

1. **Sound Notification**: Add optional sound when badge updates
2. **Desktop Notifications**: Browser notifications for new messages
3. **Hover Preview**: Show conversation preview on hover
4. **Per-Conversation Badges**: Show which conversations have unread
5. **Message Priority**: Different colors for urgent messages

## Troubleshooting

### Badge Not Showing

**Solution:** Check Pusher connection in Network tab → WS

### Count Not Updating

**Solution:** Verify Pusher events are being triggered in server logs

### Wrong Count Displayed

**Solution:** Clear cache and hard refresh (Ctrl+Shift+R)

### Badge Stays After Reading

**Solution:** Verify `markMessagesAsRead()` is being called

## Code References

- **MessageIcon Component:** `/src/components/MessageIcon.tsx`
- **Navbar Integration:** `/src/components/Navbar.tsx`
- **Unread Counts API:** `/src/app/api/conversations/unread-counts/route.ts`
- **Pusher Setup:** `/src/lib/pusher.ts`
- **Server Actions:** `/src/lib/messageActions.ts`

## Summary

This implementation adds a professional, real-time unread message counter to the header, similar to popular messaging apps like WhatsApp, Facebook Messenger, and Slack. Users can now see at a glance if they have unread messages without navigating away from their current page. The feature uses Pusher WebSockets for instant updates and provides clear visual feedback through the pulsing red badge.
