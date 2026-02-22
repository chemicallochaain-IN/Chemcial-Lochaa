-- ==============================================================================
-- BLOG POSTS TABLE
-- Run this in your Supabase SQL Editor
-- ==============================================================================

create table if not exists public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  slug text unique,
  content text not null default '',
  cover_image_url text,
  status text default 'draft' check (status in ('draft', 'published')),
  author_id uuid references auth.users(id)
);

alter table public.blog_posts enable row level security;

-- Everyone can read published posts
create policy "Public can read published posts"
  on public.blog_posts for select using (
    status = 'published' OR
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Admins can do everything
create policy "Admins can manage posts"
  on public.blog_posts for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Create storage bucket for blog media
-- Run separately: INSERT INTO storage.buckets (id, name, public) VALUES ('blog-media', 'blog-media', true);
