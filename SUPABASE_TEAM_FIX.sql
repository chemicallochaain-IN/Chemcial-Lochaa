-- ==============================================================================
-- TEAM MEMBER MGMT FIX (REVISED)
-- Run this in your Supabase SQL Editor to fix the schema cache and RLS policies.
-- ==============================================================================

-- 1. Ensure pgcrypto is enabled for the create_employee function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Define/Redefine the create_employee function
-- This handles user creation and profile insertion in one transaction
CREATE OR REPLACE FUNCTION public.create_employee(
  email text, 
  password text, 
  full_name text,
  is_admin_role boolean
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  encrypted_pw text;
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Access Denied: Only admins can create employees';
  END IF;

  -- Generate ID and Hash Password
  new_user_id := gen_random_uuid();
  encrypted_pw := crypt(password, gen_salt('bf'));

  -- Insert into auth.users (Manual entry for secondary auth flow)
  INSERT INTO auth.users (
    id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin
  )
  VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', email, encrypted_pw, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false
  );

  -- Insert into public.profiles
  INSERT INTO public.profiles (id, name, email, is_admin, loyalty_points)
  VALUES (new_user_id, full_name, email, is_admin_role, 0);

  RETURN new_user_id;
END;
$$;

-- 3. RLS POLICIES FOR PROFILES
-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "Admins can insert any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;

-- Allow admins to insert new profiles
CREATE POLICY "Admins can insert any profile" 
ON public.profiles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow admins to delete profiles
CREATE POLICY "Admins can delete any profile" 
ON public.profiles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- 4. FORCE REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
