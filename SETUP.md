# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `christmas-attendance` (or any name)
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. Wait for project to be created (2-3 minutes)

### 3. Set Up Database Tables

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### 4. Get API Credentials

1. In Supabase, go to **Settings** → **API** (left sidebar)
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### 5. Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   # Windows
   copy env.example .env

   # Mac/Linux
   cp env.example .env
   ```

2. Open `.env` and replace the values:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 6. Run Locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 7. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click "Deploy"

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redeploy
vercel --prod
```

## Testing

1. Start the scanner and scan a QR code
2. Or search for a name and register
3. Check the attendance list to see registered attendees

## Troubleshooting

**Camera not working?**
- Make sure you're using HTTPS (required for camera)
- Check browser permissions
- Try Chrome or Firefox

**Database errors?**
- Verify you ran the SQL schema script
- Check your environment variables are correct
- Ensure your Supabase project is active

**Build errors?**
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check Node.js version (18+ required)


