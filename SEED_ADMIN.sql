-- ==============================================================================
-- SEED ADMIN USER SCRIPT
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. Enable pgcrypto for password hashing (required for manual auth inserts)
create extension if not exists pgcrypto;

-- 2. Insert or Update the User
DO $$
DECLARE
  target_user_id uuid;
  target_email text := 'khannapranav0902@gmail.com';
  target_password text := 'Pass@123';
  target_name text := 'Pranav Khanna';
  encrypted_pw text;
BEGIN
  -- A. Check if user already exists in auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;

  -- B. If user does not exist, create in auth.users
  IF target_user_id IS NULL THEN
    target_user_id := gen_random_uuid();
    encrypted_pw := crypt(target_password, gen_salt('bf'));
    
    INSERT INTO auth.users (
      id, 
      instance_id, 
      role, 
      aud, 
      email, 
      encrypted_password, 
      email_confirmed_at, 
      created_at, 
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin
    )
    VALUES (
      target_user_id, 
      '00000000-0000-0000-0000-000000000000', 
      'authenticated', 
      'authenticated', 
      target_email, 
      encrypted_pw, 
      now(), -- Auto-confirm email for immediate login
      now(), 
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      false
    );
  END IF;

  -- C. Create or Update entry in public.profiles
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    is_admin, 
    loyalty_points
  )
  VALUES (
    target_user_id, 
    target_name, 
    target_email, 
    true, 
    100
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    is_admin = true,
    name = target_name;

END $$;
