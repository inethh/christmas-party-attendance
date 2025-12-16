# 🚀 GO LIVE - Step by Step Guide

Your code is ready! Follow these steps to deploy:

## ✅ What's Done
- ✅ Git repository initialized
- ✅ All files committed
- ✅ Build tested and working

## 📋 Next Steps

### Step 1: Set Up Supabase (5 minutes)

1. **Create Supabase Account:**
   - Go to https://supabase.com
   - Sign up or log in

2. **Create New Project:**
   - Click "New Project"
   - Name: `christmas-attendance` (or any name)
   - Set a database password (save it!)
   - Choose region closest to you
   - Wait 2-3 minutes for setup

3. **Create Database Tables:**
   - In Supabase dashboard, click **SQL Editor** (left sidebar)
   - Click **New Query**
   - Open `supabase-schema.sql` from this project
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click **Run** (or press Ctrl+Enter)
   - Should see "Success. No rows returned"

4. **Get API Keys:**
   - Click **Settings** → **API** (left sidebar)
   - Copy these two values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon public** key (long string starting with `eyJ...`)

### Step 2: Push to GitHub (3 minutes)

1. **GitHub Repository:**
   - ✅ Repository created: https://github.com/inethh/christmas-party-attendance
   - ✅ Code pushed successfully!

2. **If you need to push updates later:**
   ```powershell
   git add .
   git commit -m "Your update message"
   git push
   ```

### Step 3: Deploy to Vercel (5 minutes)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click **"Add New Project"**
   - Find your `christmas-party-attendance` repository
   - Click **Import**

3. **Configure Project:**
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `.` (leave as default)
   - Build Command: `npm run build` (should be auto-filled)
   - Output Directory: `dist` (should be auto-filled)

4. **Add Environment Variables:**
   - Click **Environment Variables**
   - Add these two:
     ```
     Name: VITE_SUPABASE_URL
     Value: (paste your Supabase Project URL)
     ```
     ```
     Name: VITE_SUPABASE_ANON_KEY
     Value: (paste your Supabase anon key)
     ```
   - Make sure both are checked for **Production**, **Preview**, and **Development**

5. **Deploy:**
   - Click **Deploy**
   - Wait 2-3 minutes
   - 🎉 **You're LIVE!**

### Step 4: Test Your Live App

1. Visit your Vercel URL (shown after deployment)
2. Test QR scanner (allow camera permissions)
3. Test name registration
4. Check attendance list

## 🎯 Quick Commands Reference

```powershell
# If you need to update and redeploy:
git add .
git commit -m "Update message"
git push

# Vercel will automatically redeploy!
```

## ⚠️ Important Notes

- **HTTPS Required:** Vercel provides HTTPS automatically (needed for camera)
- **Environment Variables:** Must be set in Vercel dashboard
- **Supabase RLS:** Currently set to public access - adjust if needed for security

## 🆘 Troubleshooting

**Build fails on Vercel?**
- Check environment variables are set correctly
- Verify Supabase project is active
- Check Vercel build logs

**Camera not working?**
- Must be on HTTPS (Vercel provides this)
- Check browser permissions
- Try Chrome or Firefox

**Database errors?**
- Verify you ran the SQL schema in Supabase
- Check environment variables match your Supabase project
- Review Supabase logs in dashboard

## 🎉 You're Done!

Your app is now live! Share the Vercel URL with your team.

**Next Steps:**
1. Generate QR codes for attendees
2. Test all features
3. Monitor attendance in Supabase dashboard

