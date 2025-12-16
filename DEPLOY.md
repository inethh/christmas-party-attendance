# 🚀 Deployment Guide - Go Live!

Your app is ready to deploy! Follow these steps:

## Prerequisites Checklist

- ✅ Dependencies installed
- ✅ Build tested and working
- ⚠️ **Need**: Supabase project set up
- ⚠️ **Need**: Environment variables configured

## Step 1: Set Up Supabase (If Not Done)

1. Go to https://supabase.com and create/login to your account
2. Create a new project
3. Go to **SQL Editor** → Run the SQL from `supabase-schema.sql`
4. Go to **Settings** → **API** → Copy:
   - Project URL
   - anon public key

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Christmas Attendance System"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: **Vite**
     - Root Directory: `.` (default)
   - Add Environment Variables:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
   - Click **Deploy**

3. **Done!** Your app will be live in ~2 minutes

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

## Step 3: Verify Deployment

1. Visit your Vercel deployment URL
2. Test QR scanner (requires HTTPS - Vercel provides this)
3. Test name registration
4. Check attendance list

## Important Notes

- ⚠️ **Camera access requires HTTPS** - Vercel provides this automatically
- ⚠️ **Environment variables** must be set in Vercel dashboard
- ⚠️ **Supabase RLS policies** are set to public access - adjust for production if needed

## Troubleshooting

**Build fails?**
- Check environment variables are set in Vercel
- Verify Supabase project is active
- Check build logs in Vercel dashboard

**Camera not working?**
- Ensure you're on HTTPS (Vercel provides this)
- Check browser permissions
- Try different browser

**Database errors?**
- Verify Supabase schema is created
- Check environment variables match Supabase project
- Review Supabase logs

## Next Steps After Deployment

1. Test all features
2. Share the URL with your team
3. Generate QR codes for attendees
4. Monitor attendance in Supabase dashboard

🎉 **You're live!**

