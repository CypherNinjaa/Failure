# GitHub Actions Cron Setup Guide

## ✅ You've Got the Workflow File!

The workflow file is ready at: `.github/workflows/cron-jobs.yml`

Now you just need to add the secrets to GitHub.

---

## 📋 Step-by-Step Setup

### Step 1: Go to Your GitHub Repository

1. Navigate to: https://github.com/CypherNinjaa/Failure
2. Click on **Settings** tab (top right)

### Step 2: Add Repository Secrets

1. In the left sidebar, click **Secrets and variables** → **Actions**
2. Click **New repository secret** button

### Step 3: Add CRON_SECRET

```
Name: CRON_SECRET
Value: school_cron_2025_secure_token_vikash
```

Click **Add secret**

### Step 4: Add VERCEL_URL

```
Name: VERCEL_URL
Value: https://your-actual-vercel-domain.vercel.app
```

Replace with your actual Vercel URL (find it in Vercel dashboard)

Click **Add secret**

---

## ✅ That's It!

GitHub Actions will now automatically run your cron jobs:

- **Mark Absent Teachers**: Daily at 9 AM UTC
- **Process Badges**: Daily at 2 AM UTC
- **Expire Suspensions**: Every 6 hours

---

## 🧪 Testing

### Manual Test (Before Secrets Are Set):

You can test manually from the GitHub Actions tab:

1. Go to: **Actions** tab in your repository
2. Click on **Scheduled Cron Jobs** workflow (left sidebar)
3. Click **Run workflow** dropdown (right side)
4. Click **Run workflow** button

This will run all three jobs immediately.

### After Secrets Are Set:

Wait for the scheduled time, or run manually as above.

---

## 📊 Monitoring

### View Logs:

1. Go to **Actions** tab
2. Click on any workflow run
3. Click on the job name (e.g., "mark-absent-teachers")
4. Expand the steps to see logs

### Success Indicators:

```
✅ Mark Absent Teachers completed successfully
✅ Badge Processing completed successfully
✅ Suspension Expiry completed successfully
```

### Failure Indicators:

```
❌ Failed with status code: 401  (Wrong CRON_SECRET)
❌ Failed with status code: 404  (Wrong URL)
❌ Failed with status code: 500  (Server error)
```

---

## 🔧 Troubleshooting

### Problem: Workflow not running

**Check:**

1. Are you on the `main` or `penaltyInMcqTest` branch?
2. Is the workflow file committed and pushed?
3. Go to **Actions** tab → Check if workflows are enabled

### Problem: 401 Unauthorized

**Fix:**

- CRON_SECRET is wrong or not set
- Go to Settings → Secrets → Check CRON_SECRET value

### Problem: 404 Not Found

**Fix:**

- VERCEL_URL is wrong
- Make sure it's your actual deployment URL
- Format: `https://your-app.vercel.app` (no trailing slash)

### Problem: Jobs running but nothing happening

**Check:**

- Look at the API endpoint logs in Vercel
- Verify the endpoints work by calling them manually:
  ```bash
  curl -H "Authorization: Bearer school_cron_2025_secure_token_vikash" \
       https://your-app.vercel.app/api/cron/mark-absent-teachers
  ```

---

## 💡 Alternative: cron-job.org (Even Easier!)

If you don't want to deal with GitHub Actions, use **cron-job.org**:

1. Sign up at: https://cron-job.org/en/
2. Create 3 jobs with your Vercel URLs
3. Add Authorization header: `Bearer school_cron_2025_secure_token_vikash`
4. Done!

**Comparison:**

| Feature          | GitHub Actions | cron-job.org  |
| ---------------- | -------------- | ------------- |
| Setup Complexity | Medium         | Easy          |
| Cost             | Free           | Free          |
| Reliability      | High           | Very High     |
| Monitoring       | Built-in       | Email alerts  |
| Logs             | GitHub UI      | Web dashboard |

Both are excellent choices! 🚀

---

## 📱 Get Notified on Failure

### GitHub Actions Email Notifications:

GitHub automatically emails you if a workflow fails.

### Slack/Discord Notifications (Optional):

Add this step to each job in the workflow:

```yaml
- name: Notify on Failure
  if: failure()
  run: |
    curl -X POST YOUR_WEBHOOK_URL \
      -H 'Content-Type: application/json' \
      -d '{"text":"Cron job failed: ${{ github.job }}"}'
```

---

**You're All Set!** 🎉

The cron jobs will run automatically, and you can still use the manual triggers in the admin dashboard for immediate execution.
