-- ==============================================================================
-- REWARDS, MERCHANDISE, EVENTS, FRANCHISES TABLES
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. REWARDS
create table if not exists public.rewards (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  points_required int default 0,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.rewards enable row level security;
create policy "Public can read active rewards" on public.rewards for select using (is_active = true OR exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admins can manage rewards" on public.rewards for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 2. MERCHANDISE
create table if not exists public.merchandise (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null default 0,
  image_url text,
  stock int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.merchandise enable row level security;
create policy "Public can read active merch" on public.merchandise for select using (is_active = true OR exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admins can manage merch" on public.merchandise for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 3. EVENTS
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date timestamptz not null default now(),
  location text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.events enable row level security;
create policy "Public can read active events" on public.events for select using (is_active = true OR exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admins can manage events" on public.events for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 4. FRANCHISES
create table if not exists public.franchises (
  id uuid default gen_random_uuid() primary key,
  owner_name text not null,
  email text,
  phone text,
  location text not null,
  status text default 'inquiry' check (status in ('inquiry', 'approved', 'active', 'inactive')),
  notes text,
  created_at timestamptz default now()
);

alter table public.franchises enable row level security;
create policy "Admins can read franchises" on public.franchises for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admins can manage franchises" on public.franchises for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
-- Allow public franchise inquiries from contact form
create policy "Anyone can submit franchise inquiry" on public.franchises for insert with check (true);
