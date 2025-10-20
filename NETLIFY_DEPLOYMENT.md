# 🚀 Netlify Deployment Guide

Complete guide to deploy your Next.js School Management System on Netlify.

---

## 📋 Prerequisites

1. ✅ GitHub repository with your code
2. ✅ Netlify account (free): https://app.netlify.com/signup
3. ✅ Railway PostgreSQL database (already set up)
4. ✅ All environment variables ready

---

## 🛠️ Step 1: Install Netlify Plugin

Add the Netlify Next.js plugin to your project:

```bash
npm install -D @netlify/plugin-nextjs
```

Or update your `package.json`:

```json
"devDependencies": {
  "@netlify/plugin-nextjs": "^5.0.0",
  ...other deps
}
```

Then run:

```bash
npm install
```

---

## 🌐 Step 2: Deploy via Netlify Dashboard

### Option A: Deploy from GitHub (Recommended)

1. **Go to Netlify Dashboard**

   - Visit: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"

2. **Connect GitHub**

   - Select "Deploy with GitHub"
   - Authorize Netlify to access your repos
   - Select repository: `CypherNinjaa/Failure`
   - Branch: `Enhancement`

3. **Configure Build Settings**

   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Base directory:** (leave empty)

4. **Add Environment Variables**
   Click "Show advanced" → "New variable" and add ALL these:

   ```
   DATABASE_URL=postgresql://postgres:NizblStoeDpsjcuGYSkEmonqYXidrPcw@switchback.proxy.rlwy.net:33884/railway
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aGFybWxlc3MtYm94ZXItMi5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_CyNkWqbwKXQmy00BKBnz43EMsAvAiOdz2R9IPnzB05
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dl8ls89qe
   NEXT_PUBLIC_CLOUDINARY_API_KEY=117591588143369
   CLOUDINARY_API_SECRET=qwkmzbz6gQJytokH9MfQy0YqkMc
   GMAIL_USER=vk6938663@gmail.com
   GMAIL_APP_PASSWORD=jufu nkak txch tofl
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=BN-rH4zEymTYQJUiCmWeGrF2KnfWPIO--Dhm6do7M3P6nI-MYFDzk4B7aaK1_A5WgOf6BgdoElekd8ruvI4wPD8
   VAPID_PRIVATE_KEY=PavoC-a56yorb1pFLvXhg59n9m7QSQ2Z7fo9Y1ljfZA
   CRON_SECRET=school_cron_2025_secure_token_vikash
   PUSHER_APP_ID=2063002
   NEXT_PUBLIC_PUSHER_KEY=fe8cf8c0a243eef7926a
   PUSHER_SECRET=4bfa99169dbcc1ab9ca0
   NEXT_PUBLIC_PUSHER_CLUSTER=ap2
   ```

   **IMPORTANT:** Set `NEXT_PUBLIC_APP_URL` after you get your Netlify domain!

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (5-10 minutes)

---

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Initialize Site**

   ```bash
   netlify init
   ```

   - Choose "Create & configure a new site"
   - Select your team
   - Enter site name (or leave empty for random)

4. **Set Environment Variables**

   ```bash
   netlify env:set DATABASE_URL "postgresql://postgres:NizblStoeDpsjcuGYSkEmonqYXidrPcw@switchback.proxy.rlwy.net:33884/railway"
   netlify env:set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY "pk_test_aGFybWxlc3MtYm94ZXItMi5jbGVyay5hY2NvdW50cy5kZXYk"
   netlify env:set CLERK_SECRET_KEY "sk_test_CyNkWqbwKXQmy00BKBnz43EMsAvAiOdz2R9IPnzB05"
   # ... (add all other env vars)
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## 🔧 Step 3: Post-Deployment Configuration

### 1. Update NEXT_PUBLIC_APP_URL

After deployment, you'll get a Netlify URL like:

- `https://your-site-name.netlify.app`

Update this environment variable:

```bash
# Via CLI
netlify env:set NEXT_PUBLIC_APP_URL "https://your-site-name.netlify.app"

# Or via Dashboard:
# Site settings → Environment variables → Edit → Add
```

Then **redeploy**:

```bash
netlify deploy --prod
```

### 2. Update Clerk URLs

Go to Clerk Dashboard:

1. Select your application
2. Go to **Paths** settings
3. Add Netlify URL to allowed origins:
   - `https://your-site-name.netlify.app`

### 3. Set Custom Domain (Optional)

If you want to use `www.happychild.in`:

1. Go to Netlify Dashboard → **Domain settings**
2. Click "Add custom domain"
3. Enter: `www.happychild.in`
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_APP_URL` to `https://www.happychild.in`

---

## ⚡ Step 4: Enable Serverless Functions

Netlify automatically converts Next.js API routes to serverless functions.

**No additional configuration needed!** ✅

All your `/api/*` routes will work automatically.

---

## 🔄 Step 5: Set Up Continuous Deployment

Netlify automatically deploys when you push to GitHub!

**Auto-deploy on push:**

1. Push to `Enhancement` branch
2. Netlify detects changes
3. Automatically builds and deploys
4. Live in ~5-10 minutes

**Manual deploy:**

```bash
git add .
git commit -m "Deploy to Netlify"
git push origin Enhancement
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Fails - Prisma Error

**Solution:** Add postinstall script (already in your package.json ✅)

```json
"postinstall": "prisma generate"
```

### Issue 2: Database Connection Fails

**Solution:** Check DATABASE_URL is set correctly in Netlify environment variables.

Test connection:

```bash
netlify functions:invoke --name health
```

### Issue 3: Static Files Not Loading

**Solution:** Check `netlify.toml` publish directory is `.next`

### Issue 4: API Routes Return 404

**Solution:**

- Ensure `@netlify/plugin-nextjs` is installed
- Check `netlify.toml` has correct redirects

### Issue 5: Environment Variables Not Working

**Solution:**

- Redeploy after adding env vars
- Check variable names (case-sensitive)
- Variables starting with `NEXT_PUBLIC_` are required

---

## 📊 Monitor Your Deployment

### View Logs

```bash
netlify logs
```

### View Build Logs

```bash
netlify build:logs
```

### View Functions

```bash
netlify functions:list
```

---

## 🎯 Performance Tips

1. **Enable Caching** (already configured in `netlify.toml` ✅)
2. **Use CDN** - Netlify provides global CDN automatically
3. **Enable Image Optimization** - Use Next.js Image component
4. **Monitor Analytics** - Enable Netlify Analytics in dashboard

---

## 🔒 Security Checklist

- ✅ All secrets in environment variables (not in code)
- ✅ `.env` file in `.gitignore`
- ✅ HTTPS enabled automatically by Netlify
- ✅ Security headers configured in `netlify.toml`

---

## 📱 Testing Your Deployment

After deployment, test:

1. **Homepage:** https://your-site-name.netlify.app
2. **Sign In:** https://your-site-name.netlify.app/sign-in
3. **API Health:** https://your-site-name.netlify.app/api/health
4. **Database:** Try logging in with test account

---

## 🆘 Need Help?

- **Netlify Docs:** https://docs.netlify.com/frameworks/next-js/overview/
- **Netlify Support:** https://answers.netlify.com/
- **Build Logs:** Check dashboard for detailed error messages

---

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] `netlify.toml` file exists
- [ ] `@netlify/plugin-nextjs` installed
- [ ] All environment variables ready
- [ ] GitHub repository pushed
- [ ] Database URL is public Railway URL
- [ ] `.env` file NOT committed to git
- [ ] Build succeeds locally: `npm run build`

---

**Happy Deploying! 🚀**

Your school management system will be live on Netlify!
