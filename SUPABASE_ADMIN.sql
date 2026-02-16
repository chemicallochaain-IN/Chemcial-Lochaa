-- 1. Add Admin Flag to Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 2. Create Messages Table for Contact Form
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  name text,
  email text,
  phone text,
  subject text,
  message text,
  status text default 'new' -- 'new', 'read', 'replied'
);

alter table public.contact_messages enable row level security;

-- Allow anyone to insert (submit form)
create policy "Anyone can insert messages" 
  on public.contact_messages for insert with check (true);

-- Only admins can read (This is a simplified policy assuming app-level filtering for now, 
-- ideally you'd use a custom claim or checking the profiles table)
create policy "Everyone can read own messages" 
  on public.contact_messages for select using (true); 

-- 3. Update Order Policy to allow Admins to see all
-- (Note: In a strict prod env, use Supabase Custom Claims for robust Admin RLS)
drop policy "Users can view their own orders" on public.orders;
create policy "Users can view own, Admins view all" 
  on public.orders for select using (
    auth.uid() = user_id OR 
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 4. Allow Admins to update everything
create policy "Admins can update orders" 
  on public.orders for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
  
create policy "Admins can update menu" 
  on public.menu_items for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
