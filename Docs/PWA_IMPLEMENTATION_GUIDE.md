# PWA Implementation Guide

## 🎉 PWA Features Implemented

Your school management system is now a **Progressive Web App** with the following features:

### ✅ Core Features

- **📱 Installable**: Users can install the app on their devices
- **🔄 Offline Support**: Works without internet connection with cached data
- **🔔 Push Notifications**: Send notifications to users (backend integration needed)
- **⚡ Fast Loading**: Service worker caching for instant page loads
- **🌐 Background Sync**: Automatically syncs data when connection is restored
- **📊 App Updates**: Automatic update detection with user prompt

### 🎨 User Experience Enhancements

- **Install Prompt**: Beautiful banner prompting users to install the app (shows on 2nd visit)
- **Offline Indicator**: Shows connection status with auto-sync notification
- **Update Banner**: Notifies users when a new version is available
- **Offline Fallback**: Beautiful offline page with auto-reload functionality

---

## 📦 Files Created

### 1. **public/manifest.json**

PWA manifest defining app metadata, icons, shortcuts, and share target.

**Key Features:**

- App name, description, theme colors
- 8 icon sizes (72px to 512px)
- 3 shortcuts: Mark Attendance, View Students, Messages
- Share target for receiving shared content
- Standalone display mode

### 2. **public/service-worker.js**

Service worker handling offline functionality, caching, and background sync.

**Key Features:**

- **Caching Strategies:**
  - Network First for API requests (fallback to cache when offline)
  - Cache First for static assets (faster loading)
- **Background Sync:**
  - Attendance data syncs when back online
  - Messages queue and send automatically
- **Push Notifications:**
  - Handles push events from server
  - Shows notifications with actions
- **IndexedDB Integration:**
  - Stores pending data offline
  - Auto-syncs when connection restored

### 3. **public/offline.html**

Beautiful offline fallback page shown when user is offline.

**Key Features:**

- Gradient design with school branding
- Connection status indicator
- Auto-reload when connection restored
- Features showcase (cached data, offline attendance, draft messages)

### 4. **src/components/PWAInstallPrompt.tsx**

Install prompt component with smart triggering logic.

**Key Features:**

- Detects beforeinstallprompt event
- Shows on 2nd visit or after 30 seconds
- 7-day dismissal cooldown
- Beautiful gradient UI with feature badges
- "Not Now" and "Install App" actions

### 5. **src/components/UpdatePrompt.tsx**

Update notification banner when new version is available.

**Key Features:**

- Auto-detects new service worker versions
- "Update Now" button to apply update
- "Later" button to dismiss
- Gradient design matching app branding

### 6. **src/components/OfflineIndicator.tsx**

Connection status indicator showing online/offline state.

**Key Features:**

- Auto-shows when connection lost
- Auto-hides 3 seconds after connection restored
- Shows sync status
- Different colors for online/offline states

### 7. **src/hooks/usePWA.ts**

Collection of custom React hooks for PWA functionality.

**Hooks Available:**

- `useIsPWA()`: Check if app is installed as PWA
- `useOnlineStatus()`: Monitor online/offline status
- `useServiceWorker()`: Register and manage service worker
- `usePushNotifications()`: Handle push notification subscription
- `useBackgroundSync()`: Trigger background sync
- `useInstallPrompt()`: Detect and trigger install prompt
- `useDeviceType()`: Detect device type (mobile/tablet/desktop)
- `useAppUpdate()`: Handle app updates

### 8. **src/app/layout.tsx** (Modified)

Root layout updated with PWA integration.

**Changes:**

- Added manifest link and PWA meta tags
- Service worker registration script
- PWA components imported and rendered
- Apple-specific meta tags for iOS support

---

## 🚀 Setup Instructions

### Step 1: Generate PWA Icons

You need to create icons for all sizes. Use one of these methods:

**Option A: Using Online Tool (Recommended)**

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your school logo (512x512 or higher)
3. Download generated icons
4. Extract to `public/icons/` folder

**Option B: Using ImageMagick (Command Line)**

```bash
# Install ImageMagick first (https://imagemagick.org/)
magick convert logo.png -resize 72x72 public/icons/icon-72x72.png
magick convert logo.png -resize 96x96 public/icons/icon-96x96.png
magick convert logo.png -resize 128x128 public/icons/icon-128x128.png
magick convert logo.png -resize 144x144 public/icons/icon-144x144.png
magick convert logo.png -resize 152x152 public/icons/icon-152x152.png
magick convert logo.png -resize 192x192 public/icons/icon-192x192.png
magick convert logo.png -resize 384x384 public/icons/icon-384x384.png
magick convert logo.png -resize 512x512 public/icons/icon-512x512.png
```

**Required Icon Sizes:**

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Icon Requirements:**

- PNG format
- Square ratio
- Transparent or solid background
- School logo/branding

### Step 2: Test PWA Locally

```bash
# Build the production version
npm run build

# Start production server
npm start

# Open in Chrome
# Go to http://localhost:3000
```

### Step 3: Verify PWA

1. **Open Chrome DevTools** (F12)
2. Go to **Application** tab
3. Check **Manifest** section:
   - Should show app name, icons, shortcuts
   - No errors should be displayed
4. Check **Service Workers** section:
   - Should show "activated and is running"
   - Status should be green
5. **Test Install:**
   - Click three dots in Chrome
   - Click "Install Happy Child School"
   - App should install and open in standalone window

### Step 4: Test Offline Functionality

1. Open Chrome DevTools
2. Go to **Network** tab
3. Select **Offline** from throttling dropdown
4. Refresh the page
5. Should see offline.html page
6. Navigate to cached pages (should work)
7. Try marking attendance (should queue for sync)

---

## 🔔 Push Notifications Setup (Optional)

To enable push notifications, you need to set up a backend:

### Step 1: Install web-push Package

```bash
npm install web-push
```

### Step 2: Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

**Save the output:**

- Public Key → Add to `.env.local` as `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- Private Key → Add to `.env.local` as `VAPID_PRIVATE_KEY`

### Step 3: Create Subscription API Route

**File:** `src/app/api/push-subscription/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
	"mailto:your-email@example.com",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

// Store subscriptions in database (Prisma example)
export async function POST(req: NextRequest) {
	const subscription = await req.json();

	// Save subscription to database
	// await prisma.pushSubscription.create({ data: subscription });

	return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
	const subscription = await req.json();

	// Remove subscription from database
	// await prisma.pushSubscription.delete({ where: { endpoint: subscription.endpoint } });

	return NextResponse.json({ success: true });
}
```

### Step 4: Create Send Notification API Route

**File:** `src/app/api/send-notification/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
	"mailto:your-email@example.com",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
	const { title, body, userId } = await req.json();

	// Get user subscriptions from database
	// const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });

	const payload = JSON.stringify({
		title,
		body,
		icon: "/icons/icon-192x192.png",
		badge: "/icons/icon-72x72.png",
		data: { url: "/" },
	});

	// Send to all user subscriptions
	// await Promise.all(
	// 	subscriptions.map(sub =>
	// 		webpush.sendNotification(sub, payload).catch(console.error)
	// 	)
	// );

	return NextResponse.json({ success: true });
}
```

### Step 5: Update Database Schema

**Add to `prisma/schema.prisma`:**

```prisma
model PushSubscription {
  id        String   @id @default(cuid())
  userId    String
  endpoint  String   @unique
  keys      Json
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Step 6: Use Push Notifications

**Example: Send notification when attendance is marked**

```typescript
// In your attendance marking action
await fetch("/api/send-notification", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		userId: teacherId,
		title: "Attendance Marked",
		body: "Attendance successfully marked for Class 10-A",
	}),
});
```

---

## 📊 Monitoring & Analytics

### View Service Worker Status

```javascript
// Check registration
navigator.serviceWorker.getRegistration().then((reg) => {
	console.log("SW State:", reg.active.state);
	console.log("SW Scope:", reg.scope);
});

// Check cache
caches.keys().then((names) => {
	console.log("Cache Names:", names);
});
```

### Monitor Cache Size

```javascript
navigator.storage.estimate().then((estimate) => {
	console.log("Usage:", estimate.usage);
	console.log("Quota:", estimate.quota);
	console.log(
		"Percentage:",
		((estimate.usage / estimate.quota) * 100).toFixed(2) + "%"
	);
});
```

---

## 🐛 Troubleshooting

### Issue: Service Worker Not Registering

**Solution:**

- Ensure HTTPS (required for PWA, except localhost)
- Check browser console for errors
- Clear browser cache and reload
- Verify service-worker.js is accessible at `/service-worker.js`

### Issue: Install Prompt Not Showing

**Solution:**

- PWA criteria must be met (manifest, service worker, HTTPS)
- Chrome shows prompt after 2nd visit or 30 seconds
- Check if already installed (won't show again)
- Try in Incognito mode

### Issue: Offline Page Not Showing

**Solution:**

- Ensure offline.html is cached in service worker
- Check CACHE_NAME matches in activate event
- Clear caches and re-register service worker
- Verify network tab shows offline.html in cache

### Issue: Push Notifications Not Working

**Solution:**

- Request permission first (`Notification.requestPermission()`)
- Ensure VAPID keys are set correctly
- Check if browser supports push (not on iOS Safari)
- Verify subscription endpoint in database

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel --prod

# Vercel automatically serves files from public/ folder
# Service worker will be available at /service-worker.js
```

### Manual Deployment

Ensure your hosting serves:

- `/manifest.json`
- `/service-worker.js`
- `/offline.html`
- `/icons/*`

**Important:** PWA requires HTTPS in production!

---

## 📱 Platform-Specific Features

### iOS (Safari)

- ✅ Add to Home Screen
- ✅ Standalone mode
- ✅ Status bar styling
- ❌ Push notifications (not supported yet)
- ❌ Background sync (not supported yet)

### Android (Chrome)

- ✅ Add to Home Screen
- ✅ Standalone mode
- ✅ Push notifications
- ✅ Background sync
- ✅ Install banner

### Desktop (Chrome/Edge)

- ✅ Install as desktop app
- ✅ Push notifications
- ✅ Background sync
- ✅ Shortcuts in app menu

---

## 🎯 Next Steps

1. **Generate Icons**: Create all required icon sizes
2. **Test Installation**: Install on mobile device and test
3. **Enable Push Notifications**: Follow push notifications setup guide
4. **Add Analytics**: Track PWA installs and usage
5. **Optimize Caching**: Adjust cache strategies based on usage patterns
6. **Test Offline**: Verify all critical features work offline

---

## 📚 Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox (Google's PWA Library)](https://developers.google.com/web/tools/workbox)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web Push Book](https://web-push-book.gauntface.com/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**🎉 Congratulations! Your school management system is now a Progressive Web App!**
