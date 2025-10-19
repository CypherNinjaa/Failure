# PWA Features - User Guide

## 🚀 Quick Start for Users

### Installing the App

#### On Android/Chrome Desktop:

1. Look for the install prompt at the bottom of the screen
2. Click "Install" to add to home screen
3. App opens in full-screen mode like a native app

#### On iPhone/iPad:

1. Tap the Share button (square with arrow)
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm

### What You Get When Installed

✅ **2-3x Faster Loading** - Pages load instantly from cache  
✅ **Works Offline** - Access students, classes, and more without internet  
✅ **Push Notifications** - Get instant alerts for important updates  
✅ **Home Screen Icon** - Launch with one tap, no browser needed  
✅ **Full Screen** - Immersive experience without browser bars

---

## 📱 PWA Features Overview

### 1. Offline Mode 🔌

**What it does:** Use the app even without internet connection

**How to use:**

- Go offline - the app continues to work
- A banner appears showing what's cached
- Click "Details" to see available data
- Changes sync automatically when back online

**What's cached:**

- Student lists
- Teacher information
- Class schedules
- Attendance records
- Exam details

### 2. Background Sync 🔄

**What it does:** Saves your work offline and syncs when online

**How to use:**

- Make changes while offline (mark attendance, send messages)
- A badge shows pending items (e.g., "3 pending")
- When online, changes sync automatically
- Get notified when sync completes

**Location:** Bottom left corner (above bottom nav on mobile)

### 3. Offline Queue Viewer 📊

**What it does:** See all items waiting to sync

**How to use:**

1. Click the database icon (bottom right on mobile)
2. View all pending attendance/messages
3. See timestamps and retry counts
4. Clear queue if needed

**Features:**

- Color-coded by type (blue=attendance, purple=messages)
- Shows how long items have been pending
- "Clear All" button for manual cleanup

### 4. Cache Settings ⚙️

**What it does:** Manage offline data storage

**How to use:**

1. Click the gear icon (above queue viewer)
2. View storage usage and cache size
3. Clean old cache entries
4. Clear all cached data

**Storage Display:**

- Shows MB used vs available
- Percentage bar visualization
- List of all cached items
- Item count per cache

### 5. App Updates 🆕

**What it does:** Notifies you when updates are available

**How to use:**

1. Banner appears at top when update available
2. Click "What's New" to see changelog
3. Click "Update Now" to install
4. App reloads with new version

**Features:**

- Version number displayed
- Release date shown
- List of new features
- One-click update

### 6. Smart Install Prompt 💡

**What it does:** Suggests installation at the right time

**Triggers:**

- After viewing 3 pages
- On your 2nd visit to the app
- After 15 seconds of engagement

**Dismiss options:**

- "Later" - Don't show for 24 hours
- "Never" - Don't show again

### 7. Share Features 📤

**What it does:** Share content from the app

**How to use:**

1. Find a share button (varies by page)
2. Click to open native share dialog
3. Choose app to share to

**Fallback:** Automatically copies to clipboard if sharing unavailable

### 8. App Shortcuts 🔗

**What it does:** Quick access to common features

**How to use:**

1. Long-press app icon (Android)
2. Right-click icon (Desktop)
3. See shortcuts menu

**Available Shortcuts:**

- Mark Attendance
- View Students
- Messages
- Exams

---

## 🎯 For Different Roles

### Admin

**Pre-cached:** Students, teachers, parents, classes, exams (1000 items)  
**TTL:** 30 minutes  
**Shortcuts:** All features

### Teacher

**Pre-cached:** Students, classes, exams, attendances (500 items)  
**TTL:** 1 hour  
**Shortcuts:** Attendance, students, messages

### Student

**Pre-cached:** Exams, grades, attendances (100 items)  
**TTL:** 2 hours  
**Shortcuts:** Exams, grades

### Parent

**Pre-cached:** Students, attendances, exams (200 items)  
**TTL:** 1 hour  
**Shortcuts:** Students, attendance

---

## 🔧 Troubleshooting

### App not installing?

- **Chrome/Edge:** Check if install prompt is blocked in browser settings
- **Safari:** Must use "Add to Home Screen" from share menu
- **Firefox:** Manually add to home screen (no automatic prompt)

### Offline mode not working?

1. Check if service worker is registered (check browser console)
2. Clear cache in Cache Settings
3. Reload the page
4. Try visiting pages while online first (to cache them)

### Data not syncing?

1. Check internet connection
2. Open Queue Viewer to see pending items
3. Wait a few seconds - sync happens automatically
4. Check Background Sync Indicator for status

### App running slow?

1. Open Cache Settings
2. Click "Clean Old Cache" to remove expired data
3. If still slow, click "Clear All Cache" (app will reload)
4. Note: Clearing cache removes offline data

### Storage full?

1. Check Cache Settings for usage percentage
2. Click "Clean Old Cache" to free space
3. Check queue viewer for pending items (they use space)
4. Consider clearing cache if usage > 90%

---

## 📈 Performance Tips

### For Best Performance:

1. **Install the app** - Runs faster than browser
2. **Visit pages while online** - Caches for offline use
3. **Keep cache clean** - Use Cache Settings monthly
4. **Update regularly** - New versions have improvements
5. **Use app shortcuts** - Faster than navigating

### Data Usage Tips:

- Pre-caching happens once (2 seconds after login)
- Uses ~2-5MB of storage (depends on role)
- Cache refreshes based on TTL (30 min - 2 hours)
- Clear cache if storage low

### Battery Tips:

- Background sync pauses when screen off
- Performance monitoring is lightweight
- Offline mode uses no data/battery
- Push notifications are optional

---

## 🆘 Getting Help

### Check Performance:

1. Open browser console (F12)
2. Look for "[PWA Performance]" logs
3. Metrics shown with color coding:
   - 🟢 Green = Good
   - 🟠 Orange = Needs Improvement
   - 🔴 Red = Poor

### View Metrics:

- Open browser console
- Type: `localStorage.getItem('pwa-performance-metrics')`
- See FCP, LCP, FID, CLS, TTFB values

### Debug Mode:

1. Open browser DevTools (F12)
2. Go to Application tab
3. Check:
   - Service Workers (should show "activated")
   - Cache Storage (see cached items)
   - IndexedDB (see pending queue)
   - Local Storage (see settings)

---

## 🎉 Pro Tips

### Productivity Hacks:

- Use app shortcuts for 1-tap access to common tasks
- Work offline during commute, sync when connected
- Enable notifications for important updates
- Bookmark frequently used pages (they cache automatically)

### Advanced Features:

- Share student reports directly from app
- Mark attendance offline, syncs when online
- Send messages in bulk, queue handles sync
- Export data works offline (processes when online)

### Customization:

- Dismiss install prompt if already using browser
- Adjust notification settings per role
- Clear cache to free up space
- Update immediately or wait until convenient

---

## 📊 Feature Availability Matrix

| Feature            | Chrome | Safari     | Firefox    | Edge |
| ------------------ | ------ | ---------- | ---------- | ---- |
| Install Prompt     | ✅     | ⚠️ Manual  | ⚠️ Manual  | ✅   |
| Offline Mode       | ✅     | ✅         | ✅         | ✅   |
| Push Notifications | ✅     | ✅         | ✅         | ✅   |
| Background Sync    | ✅     | ⚠️ Limited | ✅         | ✅   |
| App Shortcuts      | ✅     | ❌         | ✅         | ✅   |
| Web Share          | ✅     | ✅         | ⚠️ Limited | ✅   |
| Cache API          | ✅     | ✅         | ✅         | ✅   |
| Performance API    | ✅     | ✅         | ✅         | ✅   |

✅ Full Support | ⚠️ Partial Support | ❌ Not Available

---

**Need more help?** Contact your system administrator or check the technical documentation.
