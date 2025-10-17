# Railway Deployment - Quick Reference Checklist

## ✅ Pre-Deployment Checklist

### Files Created/Modified

- [x] `railway.json` - Railway configuration
- [x] `Procfile` - Process definition
- [x] `.env.railway` - Environment variables template
- [x] `RAILWAY_DEPLOYMENT.md` - Full deployment guide
- [x] `src/app/api/health/route.ts` - Health check endpoint
- [x] `Dockerfile` - Optimized for Railway
- [x] `next.config.mjs` - Added Railway domains
- [x] `package.json` - Added Railway scripts

### Required Services & Accounts

1. **Railway** (https://railway.app)

   - [ ] Account created
   - [ ] GitHub connected

2. **Clerk** (https://clerk.com)

   - [ ] Account created
   - [ ] Application created
   - [ ] API keys copied
   - [ ] Railway URLs added to allowed origins

3. **Cloudinary** (https://cloudinary.com)

   - [ ] Account created
   - [ ] Upload preset "school" created
   - [ ] API keys copied

4. **Pusher** (https://pusher.com)

   - [ ] Account created
   - [ ] Channels app created
   - [ ] API keys copied
   - [ ] Railway domain added to allowed origins

5. **Gmail SMTP** (optional)

   - [ ] App password generated

6. **Web Push** (optional)
   - [ ] VAPID keys generated (`npx web-push generate-vapid-keys`)

---

## 🚀 Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create Railway Project

1. Go to Railway → New Project
2. Deploy from GitHub repo
3. Select your repository

### 3. Add PostgreSQL

1. New → Database → Add PostgreSQL
2. Wait for provisioning

### 4. Set Environment Variables

Copy all variables from `.env.railway` to Railway dashboard:

**Critical Variables** (Must have):

- `DATABASE_URL` (auto-generated)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PUSHER_APP_ID`
- `NEXT_PUBLIC_PUSHER_KEY`
- `PUSHER_SECRET`
- `NEXT_PUBLIC_PUSHER_CLUSTER`
- `CRON_SECRET`
- `NODE_ENV=production`

**Optional Variables**:

- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

### 5. Run Migrations

Install Railway CLI:

```bash
npm install -g @railway/cli
```

Link and run migrations:

```bash
railway login
railway link
railway run npm run railway:migrate
```

Optional - seed database:

```bash
railway run npm run railway:seed
```

### 6. Update Clerk URLs

Add to Clerk dashboard → Paths:

- `https://your-app.up.railway.app/*`

### 7. Verify Deployment

- [ ] Visit app URL
- [ ] Test `/api/health` endpoint
- [ ] Login as admin
- [ ] Test core features

---

## 🔧 Post-Deployment

### Create Admin User

In Clerk dashboard:

1. Users → Create User
2. Add to Public Metadata:

```json
{
	"role": "admin"
}
```

### Setup Cron Jobs

Use cron-job.org or similar:

- `/api/cron/process-badges` - Daily 00:00
- `/api/cron/update-teacher-leaderboard` - Every 6 hours
- `/api/cron/mark-absent-teachers` - Daily 09:00
- `/api/cron/expire-suspensions` - Hourly

Add header: `Authorization: Bearer YOUR_CRON_SECRET`

---

## 🐛 Common Issues & Solutions

### Build Fails

```bash
# Clear build cache in Railway settings
# Or redeploy
railway up --detach
```

### Database Not Connected

```bash
# Check DATABASE_URL is set
railway variables
# Run migrations
railway run npm run railway:migrate
```

### Images Not Uploading

- Verify Cloudinary preset "school" exists
- Check CLOUDINARY_API_SECRET is correct
- Verify upload preset is unsigned

### Real-time Not Working

- Check Pusher credentials
- Verify cluster is correct
- Add Railway domain to Pusher allowed origins

---

## 📊 Monitoring

### View Logs

```bash
railway logs
```

### Database Metrics

Railway Dashboard → PostgreSQL → Metrics

### Health Check

```bash
curl https://your-app.up.railway.app/api/health
```

Expected response:

```json
{
	"status": "healthy",
	"database": "connected"
}
```

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Health endpoint returns 200
- ✅ Login works
- ✅ Dashboard loads for all roles
- ✅ Can create/edit students, teachers
- ✅ Image uploads work
- ✅ Real-time messaging works
- ✅ Email notifications work (if configured)

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Full Guide: See `RAILWAY_DEPLOYMENT.md`
- Codebase Docs: See `.github/copilot-instructions.md`

---

**Last Updated**: 2025-01-17
**Status**: ✅ Ready for deployment
