# 🔔 Web Push Notification Debug Guide

## ✅ What's Working

- ✅ Email notifications working 100%
- ✅ Gmail SMTP sending correctly
- ✅ Users receiving emails from vk6938663@gmail.com

## ⚠️ Issue: Web Push Not Working

### Current Setup:

- **Desktop**: localhost:3000 (HTTP)
- **Mobile**: https://hgv24btw-3000.inc1.devtunnels.ms/ (HTTPS via dev tunnels)

---

## 🔍 Root Causes & Solutions

### Issue 1: HTTPS Required for Push Notifications ⚠️

**Problem**:

- Push notifications require **HTTPS** in production
- `localhost` works in development (Chrome exception)
- Dev tunnels provide HTTPS ✅

**Current .env**:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000  ❌ Wrong for mobile
```

**Solution**:
Update your `.env` file:

```properties
# For dev tunnels (mobile testing)
NEXT_PUBLIC_APP_URL=https://hgv24btw-3000.inc1.devtunnels.ms

# OR for localhost (desktop only)
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**After changing, restart your dev server!**

---

### Issue 2: Service Worker Scope

**Problem**: Service worker might not be registered correctly for dev tunnels

**Check**:

1. Open DevTools (F12) → Application → Service Workers
2. Should see `/sw.js` registered
3. Status should be "activated and is running"

**If not working**:

```javascript
// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(function (registrations) {
	for (let registration of registrations) {
		registration.unregister();
	}
});

// Refresh page and try again
```

---

### Issue 3: VAPID Keys Mismatch

**Current VAPID Keys** (from .env):

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BN-rH4zEymTYQJUiCmWeGrF2KnfWPIO--Dhm6do7M3P6nI-MYFDzk4B7aaK1_A5WgOf6BgdoElekd8ruvI4wPD8
VAPID_PRIVATE_KEY=PavoC-a56yorb1pFLvXhg59n9m7QSQ2Z7fo9Y1ljfZA
```

**Verify** these match on both:

- Client (EnableNotifications.tsx) ✅
- Server (notificationActions.ts) ✅

---

## 🧪 Step-by-Step Testing

### Step 1: Update Environment

```powershell
# Edit .env file
# Change NEXT_PUBLIC_APP_URL to your dev tunnel URL
# Save file

# Restart dev server
# Press Ctrl+C
npm run dev
```

### Step 2: Clear Browser Cache (IMPORTANT!)

**Desktop (Chrome)**:

1. F12 → Application → Storage
2. Click "Clear site data"
3. Refresh page (Ctrl+R)

**Mobile (Chrome)**:

1. Settings → Privacy → Clear browsing data
2. Select "Cached images and files"
3. Clear data

### Step 3: Test on Desktop (localhost)

1. **Go to Notification Settings**:

   ```
   http://localhost:3000/list/notification-settings
   ```

2. **Click "Enable Notifications"**

3. **Watch Browser Console** (F12):

   ```
   Expected logs:
   🚀 Starting notification setup...
   👤 User ID: user_xxxxx
   🌐 Current URL: http://localhost:3000/...
   🔑 VAPID Key (first 20 chars): BN-rH4zEymTYQJUiCmWe
   🔔 Requesting notification permission...
   📋 Permission result: granted
   ✅ Notification permission granted
   📝 Registering service worker...
   ✅ Service Worker registered
   📍 SW scope: http://localhost:3000/
   📍 SW state: activated
   ⏳ Waiting for service worker to be ready...
   ✅ Service Worker ready
   📡 Subscribing to push notifications...
   🔑 Using VAPID key: BN-rH4zEym...
   ✅ Push subscription created
   📍 Endpoint: https://fcm.googleapis.com/...
   📦 Subscription JSON: {...}
   💾 Saving subscription to database...
   📨 Server response: {success: true, message: "..."}
   ✅ Subscription saved successfully
   🧪 Sending test notification...
   ```

4. **You should see**:
   - Browser notification permission dialog
   - Test notification: "🎉 Notifications Enabled!"
   - Green success message in UI
   - Debug info dropdown

### Step 4: Test on Mobile (Dev Tunnels)

1. **Open Dev Tunnel URL**:

   ```
   https://hgv24btw-3000.inc1.devtunnels.ms/list/notification-settings
   ```

2. **Follow same steps as desktop**

3. **Expected behavior**:
   - ✅ HTTPS verified (🔐 in browser)
   - ✅ Browser asks for permission
   - ✅ Test notification appears
   - ✅ Subscription saved to database

### Step 5: Send Push Notification from Admin

1. **Open Admin Panel**:

   ```
   http://localhost:3000/admin-notifications  (desktop)
   https://hgv24btw-3000.inc1.devtunnels.ms/admin-notifications  (mobile)
   ```

2. **Send Test Notification**:

   - Recipient: "STUDENT"
   - Category: "PAYMENT_REMINDER"
   - Title: "Push Test"
   - Message: "Testing push notification"
   - Channels: Check "Push" ✅

3. **Watch Server Console**:

   ```
   Expected logs:
   🚀 Admin Notification Request: {...}
   📤 Sending to role: STUDENT
   👥 Found 1 users with role: student
   📧 Sending notification to user user_xxx: {...}
   🔔 Push notification: ENABLED
   📱 Found 1 active push subscriptions  ✅ KEY!
   🚀 Sending push notification:
     📍 Endpoint: https://fcm.googleapis.com/...
     📝 Title: Push Test
     💬 Message: Testing push notification
     🔗 URL: /
   📦 Payload: {...}
   ✅ Push notification sent successfully  ✅ SUCCESS!
   ✅ Push sent to 1/1 devices
   ```

4. **You should receive**:
   - Browser notification on both desktop and mobile
   - Title: "Push Test"
   - Body: "Testing push notification"
   - Click opens app

---

## 🐛 Troubleshooting

### Issue: "No push subscriptions found"

**Check Database**:

```powershell
npx prisma studio
```

- Open `PushSubscription` table
- Should have entries with:
  - `userId`: Student/Parent Clerk ID
  - `endpoint`: FCM URL
  - `keys`: JSON with p256dh and auth
  - `isActive`: true

**If empty**:

- User didn't enable notifications
- Subscription failed to save
- Check API response in Network tab

---

### Issue: "Failed to send push notification"

**Common Errors**:

1. **UnauthorizedRegistration** (400/401):

   ```
   ❌ Error code: 400
   ❌ Error message: UnauthorizedRegistration
   ```

   **Cause**: VAPID keys mismatch
   **Fix**: Verify keys in .env match subscription

2. **Gone** (410):

   ```
   ❌ Error code: 410
   ❌ Error message: Gone
   ```

   **Cause**: Subscription expired
   **Fix**: User needs to re-enable notifications

3. **InvalidSubscription**:
   ```
   ❌ Error message: Invalid subscription
   ```
   **Cause**: Malformed endpoint or keys
   **Fix**: Check subscription format in database

---

### Issue: Browser Not Asking for Permission

**Check**:

1. **Permission already set**:

   - Chrome: `chrome://settings/content/notifications`
   - Check if site is blocked
   - Remove and try again

2. **HTTPS requirement**:

   - Mobile must use HTTPS (dev tunnels) ✅
   - Desktop can use localhost ✅

3. **Browser support**:
   - Chrome/Edge: ✅ Supported
   - Firefox: ✅ Supported
   - Safari: ⚠️ Limited support (iOS 16.4+)

---

### Issue: Service Worker Not Registering

**Check Console**:

```javascript
// Check if SW is registered
navigator.serviceWorker
	.getRegistration("/sw.js")
	.then((reg) => console.log("SW Registration:", reg))
	.catch((err) => console.error("SW Error:", err));
```

**Common fixes**:

1. Clear service worker cache
2. Hard refresh (Ctrl+Shift+R)
3. Check `/sw.js` is accessible (visit directly)
4. Check for JavaScript errors in console

---

### Issue: Notification Shows But Doesn't Open URL

**Check Service Worker** (public/sw.js):

- `notificationclick` event listener should be present
- `clients.openWindow()` should be called
- Check console in SW context (DevTools → Application → Service Workers → "inspect")

---

## 📱 Mobile-Specific Issues

### Android Chrome:

- ✅ Full support for push notifications
- ✅ Works with dev tunnels
- ⚠️ Must be HTTPS

### iOS Safari:

- ⚠️ Push notifications require iOS 16.4+
- ⚠️ Must add to home screen first
- ⚠️ Limited support

### iOS Chrome:

- ❌ Uses Safari engine, same limitations
- ⚠️ Add to home screen required

---

## ✅ Verification Checklist

Before testing, verify:

- [ ] `.env` updated with correct `NEXT_PUBLIC_APP_URL`
- [ ] Dev server restarted after .env change
- [ ] Browser cache cleared
- [ ] Service worker unregistered and re-registered
- [ ] VAPID keys correct in .env
- [ ] Using HTTPS on mobile (dev tunnels)
- [ ] Browser supports notifications
- [ ] Site permissions allow notifications

---

## 🎯 Expected Working Flow

### User Enables Notifications:

1. User clicks "Enable Notifications"
2. Browser asks for permission → User allows
3. Service worker registers
4. Push manager creates subscription
5. Subscription saved to database
6. Test notification appears: "🎉 Notifications Enabled!"
7. UI shows "✅ Enabled" with green message

### Admin Sends Notification:

1. Admin selects recipient (Student/Parent/Teacher)
2. Chooses category (Payment, Attendance, etc.)
3. Writes title and message
4. Checks "Push" channel
5. Clicks "Send Notification"
6. Server finds active subscriptions
7. Sends push via web-push library
8. User receives notification
9. Click opens app

---

## 🔧 Enhanced Debugging

### Component now includes:

- ✅ Detailed console logs with emojis
- ✅ Step-by-step progress tracking
- ✅ Error messages with explanations
- ✅ Debug info dropdown
- ✅ Browser compatibility check
- ✅ Developer info panel
- ✅ Test notification on enable
- ✅ Reset button

### Server now includes:

- ✅ Push sending logs with emojis
- ✅ Subscription endpoint logging
- ✅ Error code and message logging
- ✅ Payload logging

### Service Worker now includes:

- ✅ Event logging (install, activate, push)
- ✅ Data parsing with error handling
- ✅ Notification action buttons
- ✅ Better URL handling

---

## 📊 Database Verification

After enabling notifications, check Prisma Studio:

```powershell
npx prisma studio
```

### PushSubscription table should have:

```json
{
	"id": "uuid",
	"userId": "user_xxxxx",
	"endpoint": "https://fcm.googleapis.com/fcm/send/...",
	"keys": {
		"p256dh": "BASE64_STRING",
		"auth": "BASE64_STRING"
	},
	"isActive": true,
	"createdAt": "2025-10-12T..."
}
```

### If missing or `isActive: false`:

- Subscription failed
- Check console logs
- Check API response in Network tab

---

## 🚀 Quick Fix Commands

```powershell
# 1. Update .env (edit file manually)
# Change NEXT_PUBLIC_APP_URL to dev tunnel URL

# 2. Restart server
npm run dev

# 3. In browser console, clear everything:
localStorage.clear();
sessionStorage.clear();
navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()));

# 4. Hard refresh
# Ctrl+Shift+R (Windows)
# Cmd+Shift+R (Mac)

# 5. Test again
```

---

## 📞 Still Not Working?

### Share these logs:

1. **Browser console** (full output)
2. **Server console** (notification sending logs)
3. **Service Worker console** (DevTools → Application → SW → inspect)
4. **Network tab** (API requests to `/api/push/subscribe` and `/api/admin/send-notification`)
5. **Prisma Studio** screenshot of PushSubscription table

### Check these:

- [ ] What browser and version?
- [ ] Desktop or mobile?
- [ ] Using localhost or dev tunnels?
- [ ] HTTPS verified on mobile?
- [ ] Permission granted in browser?
- [ ] Service worker registered?
- [ ] Subscription in database?
- [ ] Error messages in console?

---

## 🎉 Success Indicators

### You know it's working when:

1. ✅ Test notification appears immediately after enabling
2. ✅ Green "✅ Notifications Enabled!" message
3. ✅ Debug info shows endpoint and userId
4. ✅ Prisma Studio shows active subscription
5. ✅ Admin sends notification → Browser shows it
6. ✅ Server logs show "✅ Push sent to 1/1 devices"
7. ✅ Click notification opens correct page

---

## 📝 Next Steps After Fix

Once working:

1. Test all notification categories
2. Test on multiple devices
3. Test with multiple users
4. Integrate automatic triggers
5. Add quick-send buttons
6. Monitor delivery rates
7. Handle subscription renewals

---

**The system is now fully instrumented for debugging. Follow the steps above and share the console logs if issues persist!** 🔧
