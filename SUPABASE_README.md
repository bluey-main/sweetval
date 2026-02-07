# Valentine's Secret Proposal - Supabase Integration

## 🎉 What's Been Added

This project now uses **Supabase** as the backend database and storage solution, replacing the previous localStorage implementation.

## 📦 Files Created

### 1. **supabase-setup.sql**
The complete SQL script to run in your Supabase SQL Editor. This creates:
- `valentines` table - stores proposal data
- `valentine_media` table - stores photo/video metadata
- `valentine-media` storage bucket - stores actual media files
- Row Level Security (RLS) policies for public access
- Helper functions and views

### 2. **lib/supabase.ts**
Supabase client configuration that connects your app to Supabase.

### 3. **lib/database.types.ts**
TypeScript type definitions for all database tables and views.

### 4. **SUPABASE_SETUP.md**
Comprehensive step-by-step guide for setting up Supabase.

### 5. **vite-env.d.ts**
TypeScript environment variable definitions.

## 🚀 Quick Start

### Step 1: Set Up Supabase
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the entire `supabase-setup.sql` script
4. Go to Settings → API and copy your:
   - Project URL
   - anon public key

### Step 2: Configure Environment Variables
Update `.env.local` with your Supabase credentials:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

## 📝 What Changed

### Before (localStorage)
- Data stored only in browser
- Photos/videos as base64 strings
- Limited storage capacity
- Data lost when clearing browser cache

### After (Supabase)
- Data stored in cloud database
- Photos/videos in cloud storage
- Unlimited storage capacity
- Data persists across devices
- Shareable via unique codes

## 🔐 Security

- **Public Access**: No authentication required (by design)
- **RLS Policies**: Anyone can create and view valentines
- **Storage**: Public bucket for media files
- **Codes**: 6-character unique codes for access

## 📖 Full Documentation

See `SUPABASE_SETUP.md` for detailed setup instructions and troubleshooting.

## 🛠️ Technical Details

### Database Schema
```
valentines
├── id (uuid, primary key)
├── code (varchar(6), unique)
├── recipient_name (text)
├── creator_name (text, nullable)
├── favorite_color (varchar(7))
├── music_enabled (boolean)
├── special_date (jsonb, nullable)
├── memories (text, nullable)
├── reasons (text[])
├── created_at (timestamp)
└── updated_at (timestamp)

valentine_media
├── id (uuid, primary key)
├── valentine_id (uuid, foreign key)
├── media_type ('photo' | 'video')
├── file_path (text)
├── file_url (text, nullable)
├── display_order (integer)
└── created_at (timestamp)
```

### Storage Structure
```
valentine-media/
└── {valentine_id}/
    ├── photo-0-{timestamp}.jpg
    ├── photo-1-{timestamp}.jpg
    └── video-{timestamp}.mp4
```

## 🎯 Next Steps

1. Follow the setup guide in `SUPABASE_SETUP.md`
2. Test creating a valentine proposal
3. Verify media uploads work correctly
4. Deploy your app to production

Enjoy your Valentine's Secret Proposal app! 💝
