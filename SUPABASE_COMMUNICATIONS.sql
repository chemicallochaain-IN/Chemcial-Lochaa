-- ==============================================================================
-- SUPABASE COMMUNICATIONS SCHEMA
-- ==============================================================================

-- 1. Create message_replies table for threading
create table if not exists public.message_replies (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  message_id uuid references public.contact_messages(id) on delete cascade,
  sender_type text check (sender_type in ('admin', 'customer')),
  message_type text check (message_type in ('email', 'whatsapp')),
  content text not null,
  metadata jsonb -- Storing subject, status, or other info
);

-- 2. Enable Row Level Security
alter table public.message_replies enable row level security;

-- 3. Set up RLS Policies
create policy "Admins can manage all replies" 
  on public.message_replies for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- Note: Inbound email handler will use service role to insert customer replies
