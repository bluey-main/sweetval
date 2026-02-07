-- =====================================================
-- Valentine's Secret Proposal - Supabase Setup Script
-- =====================================================
-- Run this script in your Supabase SQL Editor to set up
-- all required tables, storage buckets, and policies
-- =====================================================

-- Create valentines table
CREATE TABLE IF NOT EXISTS public.valentines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(6) UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  creator_name TEXT,
  favorite_color VARCHAR(7) NOT NULL,
  music_enabled BOOLEAN DEFAULT true,
  special_date JSONB,
  memories TEXT,
  reasons TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_valentines_code ON public.valentines(code);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_valentines_created_at ON public.valentines(created_at DESC);

-- Create media files table (for photos and videos)
CREATE TABLE IF NOT EXISTS public.valentine_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  valentine_id UUID NOT NULL REFERENCES public.valentines(id) ON DELETE CASCADE,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
  file_path TEXT NOT NULL,
  file_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on valentine_id for faster joins
CREATE INDEX IF NOT EXISTS idx_valentine_media_valentine_id ON public.valentine_media(valentine_id);

-- Create index on media_type for filtering
CREATE INDEX IF NOT EXISTS idx_valentine_media_type ON public.valentine_media(media_type);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on tables
ALTER TABLE public.valentines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valentine_media ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read valentines (public access via code)
CREATE POLICY "Anyone can read valentines"
  ON public.valentines
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert valentines (no auth required for creation)
CREATE POLICY "Anyone can insert valentines"
  ON public.valentines
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can read valentine media
CREATE POLICY "Anyone can read valentine media"
  ON public.valentine_media
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert valentine media
CREATE POLICY "Anyone can insert valentine media"
  ON public.valentine_media
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- Storage Bucket Setup
-- =====================================================

-- Create storage bucket for valentine media (photos and videos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('valentine-media', 'valentine-media', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Storage Policies
-- =====================================================

-- Policy: Anyone can upload to valentine-media bucket
CREATE POLICY "Anyone can upload valentine media"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'valentine-media');

-- Policy: Anyone can read from valentine-media bucket (public access)
CREATE POLICY "Anyone can read valentine media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'valentine-media');

-- Policy: Anyone can update their uploads
CREATE POLICY "Anyone can update valentine media"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'valentine-media')
  WITH CHECK (bucket_id = 'valentine-media');

-- Policy: Anyone can delete their uploads
CREATE POLICY "Anyone can delete valentine media"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'valentine-media');

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on valentines table
DROP TRIGGER IF EXISTS update_valentines_updated_at ON public.valentines;
CREATE TRIGGER update_valentines_updated_at
  BEFORE UPDATE ON public.valentines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Utility Views (Optional - for admin/debugging)
-- =====================================================

-- View to see valentines with their media count
CREATE OR REPLACE VIEW valentine_summary AS
SELECT 
  v.id,
  v.code,
  v.recipient_name,
  v.creator_name,
  v.created_at,
  COUNT(DISTINCT CASE WHEN vm.media_type = 'photo' THEN vm.id END) as photo_count,
  COUNT(DISTINCT CASE WHEN vm.media_type = 'video' THEN vm.id END) as video_count
FROM public.valentines v
LEFT JOIN public.valentine_media vm ON v.id = vm.valentine_id
GROUP BY v.id, v.code, v.recipient_name, v.creator_name, v.created_at
ORDER BY v.created_at DESC;

-- =====================================================
-- Setup Complete!
-- =====================================================
-- Next steps:
-- 1. Copy your Supabase URL and anon key
-- 2. Add them to your .env.local file:
--    VITE_SUPABASE_URL=your_supabase_url
--    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
-- 3. Update your application code to use Supabase client
-- =====================================================
