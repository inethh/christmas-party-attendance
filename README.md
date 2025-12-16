# Christmas Party Attendance System

A modern web-based attendance system for Christmas parties that uses QR code scanning for quick registration. Built with React.js, Supabase, and deployed on Vercel.

## Features

- 🎄 **QR Code Scanning**: Quick and easy registration by scanning QR codes using your device's camera
- 📝 **Name Selection**: Choose from a pre-loaded list of names with search functionality
- ➕ **Add New Names**: Option to add names that aren't in the list
- 📊 **Attendance Tracking**: View all registered attendees with timestamps
- 💾 **Supabase Database**: Cloud-hosted database for persistent attendance records
- 🎨 **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- ☁️ **Vercel Deployment**: Ready for deployment on Vercel

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- A Vercel account (free tier works)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once your project is created, go to **SQL Editor**
3. Run the SQL script from `supabase-schema.sql` to create the necessary tables
4. Go to **Settings** → **API** to get your project URL and anon key

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to **Environment Variables**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository

2. Go to [Vercel](https://vercel.com) and import your repository

3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Deploy!

## Usage

1. **To register attendance:**
   - Click "Start Scanner" to begin QR code scanning
   - Allow camera permissions when prompted
   - Scan a QR code containing a person's name
   - If the name is in the list, it will be automatically registered
   - If the name is not in the list, you can add it using the "Add & Register" button

2. **Alternative registration:**
   - Use the search box to find a name
   - Click on a name to select it
   - Click "Register Attendance"
   - Or double-click a name to register immediately

3. **View attendance:**
   - The "Registered Attendees" section shows all registered attendees
   - Click "Refresh List" to update the display

## Managing Names List

Names are stored in the Supabase `names_list` table. You can:
- Add names through the application UI
- Manually add names via Supabase dashboard
- Use SQL to bulk insert names

## QR Code Generation

To generate QR codes for names, you can use any QR code generator. The QR code should contain the person's name as plain text.

Example online QR code generators:
- https://www.qr-code-generator.com/
- https://qrcode.tec-it.com/

Simply enter the person's name and generate the QR code.

## Database Schema

The system uses two main tables:

- **names_list**: Stores the list of available names
- **attendance**: Stores attendance records with timestamps

See `supabase-schema.sql` for the complete schema.

## Security Notes

- The current setup uses public read/write access policies
- For production use, consider implementing authentication
- Review and adjust Row Level Security (RLS) policies in Supabase based on your needs

## Troubleshooting

### Camera not working
- Ensure you're using HTTPS (required for camera access)
- Check browser permissions for camera access
- Try a different browser if issues persist

### Supabase connection errors
- Verify your environment variables are set correctly
- Check that your Supabase project is active
- Ensure the database schema has been created

### Build errors
- Make sure all dependencies are installed: `npm install`
- Check Node.js version (18+ required)
- Clear node_modules and reinstall if needed

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend and database
- **html5-qrcode** - QR code scanning
- **Vercel** - Hosting

## License

MIT
