-- =============================================
-- SITE IMAGES & OFFERINGS TABLES
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Site Images table (for logo, favicon, about photo, gallery images)
CREATE TABLE IF NOT EXISTS site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key TEXT NOT NULL,          -- e.g. 'logo', 'favicon', 'about_photo', 'gallery_1'
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Everyone can read site images
CREATE POLICY "Public read site_images" ON site_images
  FOR SELECT USING (true);

-- Only authenticated users (admins) can insert/update/delete
CREATE POLICY "Auth insert site_images" ON site_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update site_images" ON site_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete site_images" ON site_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- 2. Offerings table (replaces the menu section)
CREATE TABLE IF NOT EXISTS offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE offerings ENABLE ROW LEVEL SECURITY;

-- Everyone can read active offerings
CREATE POLICY "Public read offerings" ON offerings
  FOR SELECT USING (true);

-- Only authenticated users (admins) can insert/update/delete
CREATE POLICY "Auth insert offerings" ON offerings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update offerings" ON offerings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete offerings" ON offerings
  FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Storage bucket for image uploads
-- NOTE: You may need to create this bucket via the Supabase Dashboard UI
-- Go to Storage > New Bucket > Name: "site-images" > Public: ON
-- Then add these policies in the SQL editor:

-- Allow public read access to site-images bucket
CREATE POLICY "Public read site-images bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-images');

-- Allow authenticated users to upload to site-images bucket
CREATE POLICY "Auth upload site-images bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update objects in site-images bucket
CREATE POLICY "Auth update site-images bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete objects in site-images bucket
CREATE POLICY "Auth delete site-images bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');
