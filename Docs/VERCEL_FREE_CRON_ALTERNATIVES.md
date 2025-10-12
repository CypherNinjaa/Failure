# Vercel Free Plan - Cron Job Alternatives

## Problem

Vercel Free (Hobby) plan does NOT support cron jobs. You have 3 cron jobs configured:

1. `mark-absent-teachers` (9 AM daily)
2. `process-badges` (2 AM daily)
3. `expire-suspensions` (Every 6 hours)

## ✅ Solution Options

---

## **Option 1: External Cron Service (RECOMMENDED - FREE)**

Use a free external service to trigger your API endpoints:

### **A. cron-job.org (FREE Forever)**

1. **Sign up:** https://cron-job.org/en/
2. **Create Jobs:**

   **Job 1: Mark Absent Teachers**

   ```
   Title: Mark Absent Teachers
   URL: https://your-vercel-domain.vercel.app/api/cron/mark-absent-teachers
   Schedule: Every day at 9:00 AM
   Headers:
     - Authorization: Bearer YOUR_CRON_SECRET
   ```

   **Job 2: Process Badges**

   ```
   Title: Process Badges
   URL: https://your-vercel-domain.vercel.app/api/cron/process-badges
   Schedule: Every day at 2:00 AM
   Headers:
     - Authorization: Bearer YOUR_CRON_SECRET
   ```

   **Job 3: Expire Suspensions**

   ```
   Title: Expire Suspensions
   URL: https://your-vercel-domain.vercel.app/api/cron/expire-suspensions
   Schedule: Every 6 hours (0,6,12,18)
   Headers:
     - Authorization: Bearer YOUR_CRON_SECRET
   ```

3. **Free Plan Limits:**
   - Unlimited jobs
   - 1-minute minimum interval
   - SSL support
   - Email notifications

---

### **B. EasyCron (FREE)**

1. **Sign up:** https://www.easycron.com/
2. **Free Plan:** 100 cron jobs/month (plenty for 3 jobs)
3. **Same setup as cron-job.org**

---

### **C. Pipedream (FREE - Most Powerful)**

1. **Sign up:** https://pipedream.com/
2. **Create Scheduled Workflows:**

```javascript
// Workflow 1: Mark Absent Teachers
export default defineComponent({
	async run({ steps, $ }) {
		await require("@pipedream/platform").axios($, {
			url: "https://your-domain.vercel.app/api/cron/mark-absent-teachers",
			headers: {
				Authorization: "Bearer YOUR_CRON_SECRET",
			},
		});
	},
});

// Schedule: Daily at 9 AM
```

3. **Free Plan:**
   - Unlimited workflows
   - 333 daily invocations
   - Built-in logging

---

## **Option 2: GitHub Actions (FREE)**

Use GitHub Actions for scheduled tasks:

### Create `.github/workflows/cron-jobs.yml`:

```yaml
name: Scheduled Cron Jobs

on:
  schedule:
    # Mark absent teachers - 9 AM daily (UTC)
    - cron: "0 9 * * *"
    # Process badges - 2 AM daily (UTC)
    - cron: "0 2 * * *"
    # Expire suspensions - Every 6 hours
    - cron: "0 */6 * * *"
  workflow_dispatch: # Allow manual trigger

jobs:
  mark-absent-teachers:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 9 * * *'
    steps:
      - name: Call Absent Teachers API
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.vercel.app/api/cron/mark-absent-teachers

  process-badges:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 2 * * *'
    steps:
      - name: Call Badge Processing API
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.vercel.app/api/cron/process-badges

  expire-suspensions:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 */6 * * *'
    steps:
      - name: Call Suspension Expiry API
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.vercel.app/api/cron/expire-suspensions
```

### Add Secret to GitHub:

1. Go to: **Settings** → **Secrets and variables** → **Actions**
2. Add: `CRON_SECRET` = `school_cron_2025_secure_token_vikash`

**Free Plan:** 2,000 minutes/month (way more than needed)

---

## **Option 3: Railway.app Cron (FREE Tier)**

1. **Sign up:** https://railway.app/
2. **Deploy a simple cron service:**

```javascript
// server.js
const cron = require("node-cron");
const axios = require("axios");

const VERCEL_URL = "https://your-domain.vercel.app";
const CRON_SECRET = process.env.CRON_SECRET;

// Mark absent teachers - 9 AM daily
cron.schedule("0 9 * * *", async () => {
	await axios.get(`${VERCEL_URL}/api/cron/mark-absent-teachers`, {
		headers: { Authorization: `Bearer ${CRON_SECRET}` },
	});
});

// Process badges - 2 AM daily
cron.schedule("0 2 * * *", async () => {
	await axios.get(`${VERCEL_URL}/api/cron/process-badges`, {
		headers: { Authorization: `Bearer ${CRON_SECRET}` },
	});
});

// Expire suspensions - Every 6 hours
cron.schedule("0 */6 * * *", async () => {
	await axios.get(`${VERCEL_URL}/api/cron/expire-suspensions`, {
		headers: { Authorization: `Bearer ${CRON_SECRET}` },
	});
});

// Keep server alive
const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Cron service running"));
app.listen(3000);
```

**Free Plan:** $5 credit/month (enough for small service)

---

## **Option 4: Manual Triggers (Temporary)**

Add manual trigger buttons to admin dashboard:

### Create `src/components/ManualCronTriggers.tsx`:

```typescript
"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ManualCronTriggers() {
	const [loading, setLoading] = useState<string | null>(null);

	const trigger = async (endpoint: string, name: string) => {
		setLoading(endpoint);
		try {
			const res = await fetch(`/api/cron/${endpoint}`, {
				headers: {
					Authorization: `Bearer ${
						process.env.NEXT_PUBLIC_CRON_SECRET ||
						"school_cron_2025_secure_token_vikash"
					}`,
				},
			});
			const data = await res.json();

			if (data.success) {
				toast.success(`${name} completed!`);
			} else {
				toast.error(`${name} failed!`);
			}
		} catch (error) {
			toast.error(`Error triggering ${name}`);
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-lg font-semibold mb-4">Manual Cron Triggers</h3>
			<div className="flex gap-3 flex-wrap">
				<button
					onClick={() =>
						trigger("mark-absent-teachers", "Mark Absent Teachers")
					}
					disabled={loading === "mark-absent-teachers"}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
				>
					{loading === "mark-absent-teachers" ? "Running..." : "👨‍🏫 Mark Absent"}
				</button>

				<button
					onClick={() => trigger("process-badges", "Process Badges")}
					disabled={loading === "process-badges"}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
				>
					{loading === "process-badges" ? "Running..." : "🎖️ Process Badges"}
				</button>

				<button
					onClick={() => trigger("expire-suspensions", "Expire Suspensions")}
					disabled={loading === "expire-suspensions"}
					className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300"
				>
					{loading === "expire-suspensions"
						? "Running..."
						: "🔓 Expire Suspensions"}
				</button>
			</div>
		</div>
	);
}
```

Add to admin dashboard at `/admin/page.tsx`

---

## **Option 5: Upgrade to Vercel Pro**

**Cost:** $20/month  
**Benefits:**

- Native cron jobs (works seamlessly)
- Better performance
- More build minutes
- Priority support

---

## 🎯 **RECOMMENDED APPROACH**

### **For Production:**

Use **cron-job.org** (FREE forever)

- ✅ No code changes needed
- ✅ Reliable and stable
- ✅ Easy to set up
- ✅ Email notifications on failure

### **For Development:**

Use **Manual Triggers** (Option 4)

- ✅ Easy to test
- ✅ No external dependencies
- ✅ Works immediately

### **For Advanced Users:**

Use **GitHub Actions** (Option 2)

- ✅ Part of your repo
- ✅ Version controlled
- ✅ Free and reliable

---

## 📋 **What to Do Right Now**

### **Step 1: Remove Vercel Cron Config**

Edit `vercel.json` to remove crons (they'll cause deployment to fail)

### **Step 2: Choose Your Solution**

I recommend **cron-job.org** for simplicity

### **Step 3: Set Up External Cron**

Follow the guide above for your chosen solution

### **Step 4: Test**

Manually trigger each endpoint to ensure they work

---

## 🔧 **Quick Fix Commands**

### Remove vercel.json crons (if needed):

```bash
# Option A: Delete vercel.json entirely (if not used for anything else)
Remove-Item vercel.json

# Option B: Keep file but remove crons section
# I can help you edit it
```

### Test endpoints manually:

```powershell
# Test mark-absent-teachers
curl -H "Authorization: Bearer school_cron_2025_secure_token_vikash" https://your-domain.vercel.app/api/cron/mark-absent-teachers

# Test process-badges
curl -H "Authorization: Bearer school_cron_2025_secure_token_vikash" https://your-domain.vercel.app/api/cron/process-badges

# Test expire-suspensions
curl -H "Authorization: Bearer school_cron_2025_secure_token_vikash" https://your-domain.vercel.app/api/cron/expire-suspensions
```

---

**Would you like me to:**

1. ✅ Remove cron config from vercel.json (fix deployment)
2. ✅ Create manual trigger component for admin dashboard
3. ✅ Set up GitHub Actions workflow
4. ✅ All of the above

Let me know which solution you prefer! 🚀
