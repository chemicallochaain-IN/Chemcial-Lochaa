-- ==============================================================================
-- REVIEWS TABLE
-- ==============================================================================

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  user_id uuid references auth.users(id), -- Null if unregistered
  guest_name text, -- Populated if user_id is null
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  image_url text,
  is_approved boolean default false -- For moderation
);

alter table public.reviews enable row level security;

-- Allow anyone to insert reviews
create policy "Anyone can insert reviews" 
  on public.reviews for insert with check (true);

-- Allow everyone to read reviews (only approved ones ideally, but for now all)
create policy "Public can read reviews" 
  on public.reviews for select using (true);

-- ==============================================================================
-- STORAGE FOR REVIEW IMAGES
-- ==============================================================================
-- Note: You must create a bucket named 'review-images' in your Supabase Storage dashboard manually if this script fails due to permissions.
-- Make the bucket public.

insert into storage.buckets (id, name, public) 
values ('review-images', 'review-images', true)
on conflict (id) do nothing;

create policy "Public Access" 
  on storage.objects for select 
  using ( bucket_id = 'review-images' );

create policy "Public Upload" 
  on storage.objects for insert 
  with check ( bucket_id = 'review-images' );
