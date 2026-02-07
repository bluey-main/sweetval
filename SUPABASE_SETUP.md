# Supabase Setup Guide

This guide will help you set up Supabase for the Valentine's Secret Proposal app.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Valentine's Secret Proposal (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
4. Click "Create new project" and wait for it to initialize (~2 minutes)

## Step 2: Run the SQL Setup Script

1. In your Supabase dashboard, click on the **SQL Editor** icon in the left sidebar
2. Click "New query"
3. Copy the entire contents of `supabase-setup.sql` from this project
4. Paste it into the SQL editor
5. Click **Run** or press `Cmd/Ctrl + Enter`
6. You should see a success message confirming all tables, policies, and storage buckets were created

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, click on the **Settings** icon (gear) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

## Step 4: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Verify Storage Bucket

1. In your Supabase dashboard, click on **Storage** in the left sidebar
2. You should see a bucket named `valentine-media`
3. This bucket is configured to be **public**, allowing anyone to view uploaded photos and videos

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Create a new valentine proposal and verify:
   - The code is generated successfully
   - Photos and videos upload correctly
   - You can retrieve the valentine using the code

## Database Schema Overview

### Tables Created

1. **valentines** - Stores valentine proposal data
   - `code`: Unique 6-character access code
   - `recipient_name`: Name of the recipient
   - `creator_name`: Name of the creator (optional)
   - `favorite_color`: Recipient's favorite color
   - `music_enabled`: Whether background music is enabled
   - `special_date`: JSON object with date and context
   - `memories`: Text field for special memories
   - `reasons`: Array of reasons why they love the recipient

2. **valentine_media** - Stores references to uploaded photos/videos
   - `valentine_id`: Foreign key to valentines table
   - `media_type`: Either 'photo' or 'video'
   - `file_path`: Path in storage bucket
   - `file_url`: Public URL to access the media
   - `display_order`: Order for displaying photos

### Storage Bucket

- **valentine-media**: Public bucket for storing photos and videos
  - Photos are stored as: `{valentine_id}/photo-{index}-{timestamp}.jpg`
  - Videos are stored as: `{valentine_id}/video-{timestamp}.mp4`

## Security Notes

- **Public Access**: This app is designed for public access without authentication
- **Row Level Security (RLS)**: Enabled on all tables with policies allowing public read/write
- **Storage Policies**: Anyone can upload, read, update, and delete files in the valentine-media bucket
- **No Authentication Required**: Users don't need to sign up or log in

## Troubleshooting

### "Missing Supabase environment variables" Error

- Make sure you've added `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`
- Restart your dev server after adding environment variables

### Upload Errors

- Check that the `valentine-media` bucket exists in Storage
- Verify storage policies are correctly set (run the SQL script again if needed)

### Code Not Found

- Ensure the SQL script ran successfully
- Check the valentines table in the Table Editor to see if data is being saved

## Next Steps

- Customize the app styling and content
- Add analytics to track usage
- Consider adding email notifications
- Deploy to production (Vercel, Netlify, etc.)

## Support

If you encounter any issues, check:
1. Supabase dashboard logs (Database → Logs)
2. Browser console for JavaScript errors
3. Network tab to see failed API requests
