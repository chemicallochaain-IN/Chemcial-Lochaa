-- ==============================================================================
-- FINAL SETUP: COMPLETE DATABASE, POLICIES, AND STORAGE CONFIGURATION
-- Run this entire script in your Supabase SQL Editor.
-- This ensures `blog_posts`, `offerings`, `party_offers`, and all storage buckets
-- are created and have the correct permissions.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. STORAGE BUCKETS
-- ------------------------------------------------------------------------------
-- Enable storage for public and authenticated users.
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('site-images', 'site-images', true),
  ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO NOTHING;

-- Site Images Policies
CREATE POLICY "Public read site images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Auth upload site images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update site images" ON storage.objects FOR UPDATE USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete site images" ON storage.objects FOR DELETE USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- Blog Media Policies
CREATE POLICY "Public read blog media" ON storage.objects FOR SELECT USING (bucket_id = 'blog-media');
CREATE POLICY "Auth upload blog media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update blog media" ON storage.objects FOR UPDATE USING (bucket_id = 'blog-media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete blog media" ON storage.objects FOR DELETE USING (bucket_id = 'blog-media' AND auth.role() = 'authenticated');


-- ------------------------------------------------------------------------------
-- 2. OFFERINGS TABLE (Replacing the old Menu)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.offerings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active offerings" ON public.offerings
  FOR SELECT USING (is_active = true OR exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

CREATE POLICY "Auth can manage offerings" ON public.offerings
  FOR ALL USING (auth.role() = 'authenticated');


-- ------------------------------------------------------------------------------
-- 3. BLOG POSTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id)
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts" ON public.blog_posts 
  FOR SELECT USING (status = 'published' OR exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

CREATE POLICY "Auth can manage posts" ON public.blog_posts 
  FOR ALL USING (auth.role() = 'authenticated');


-- ------------------------------------------------------------------------------
-- 4. PARTY OFFERS & OFFICE EVENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.party_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_info TEXT, -- E.g. "Starting at ₹500/person"
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.party_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active party offers" ON public.party_offers
  FOR SELECT USING (is_active = true OR exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

CREATE POLICY "Auth can manage party offers" ON public.party_offers
  FOR ALL USING (auth.role() = 'authenticated');
