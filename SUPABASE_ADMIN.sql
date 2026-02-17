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

-- Only admins can read
create policy "Admins can read messages" 
  on public.contact_messages for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  ); 

-- 3. Update Order Policy to allow Admins to see all
drop policy if exists "Users can view their own orders" on public.orders;
drop policy if exists "Users can view own, Admins view all" on public.orders;

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

create policy "Admins can insert menu" 
  on public.menu_items for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can delete menu" 
  on public.menu_items for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 5. RPC Function to Create Employees (Admin Only)
-- This allows an admin to create a user without logging themselves out
create or replace function public.create_employee(
  email text, 
  password text, 
  full_name text,
  is_admin_role boolean
)
returns uuid
language plpgsql
security definer
as $$
declare
  new_user_id uuid;
  encrypted_pw text;
begin
  -- Check if caller is admin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) then
    raise exception 'Access Denied: Only admins can create employees';
  end if;

  -- Generate ID and Hash Password
  new_user_id := gen_random_uuid();
  encrypted_pw := crypt(password, gen_salt('bf'));

  -- Insert into auth.users
  insert into auth.users (
    id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin
  )
  values (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', email, encrypted_pw, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false
  );

  -- Insert into public.profiles
  insert into public.profiles (id, name, email, is_admin, loyalty_points)
  values (new_user_id, full_name, email, is_admin_role, 0);

  return new_user_id;
end;
$$;


-- 6. SEED DATA (Only run if empty)
-- This ensures the refactored menu has data to display
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.categories) THEN
    -- Categories
    INSERT INTO public.categories (id, title, note, sort_order) VALUES
    ('burgers', 'Burgers', '(Served with fries)', 1),
    ('sandwiches', 'Sandwich', '(Served with fries)', 2),
    ('pasta', 'Pasta', NULL, 3),
    ('house-specials', 'House Specials', NULL, 4),
    ('wraps', 'Wraps', '(Served with fries)', 5),
    ('momos', 'Momo', NULL, 6),
    ('fried-chicken', 'Fried Chicken', NULL, 7),
    ('fries', 'Fries', NULL, 8),
    ('beverages', 'Beverages', NULL, 9);

    -- Items (Sample subset, populating referenced IDs)
    INSERT INTO public.menu_items (id, category_id, name, price, type, icons) VALUES
    ('b1', 'burgers', 'Mix Veggie Burger', '110', 'veg', ARRAY['wheat']),
    ('b2', 'burgers', 'Paneer Burger', '170', 'veg', ARRAY['wheat', 'dairy']),
    ('b3', 'burgers', 'Classic Fried Chicken Burger', '200', 'non-veg', ARRAY['wheat']),
    ('s1', 'sandwiches', 'Masala Sandwich', '130', 'veg', ARRAY['wheat']),
    ('p1', 'pasta', 'Arrabiata Pasta (Red Sauce)', '210', 'veg', ARRAY['wheat', 'chilli']),
    ('hs1', 'house-specials', 'Ramen Khow Suey', '250 / 270', 'both', ARRAY['wheat', 'dairy', 'egg']),
    ('m1', 'momos', 'Steamed Momo', '110 / 130', 'both', ARRAY['wheat']),
    ('fc1', 'fried-chicken', 'Classic Fried Chicken', '210', 'non-veg', ARRAY['wheat']),
    ('f1', 'fries', 'Classic Salted', '100 / 120', 'veg', NULL),
    ('bev1', 'beverages', 'Masala Chai', '150', 'veg', NULL);
  END IF;
END $$;
