-- ==============================================================================
-- TEAM MEMBER MGMT FIX
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Ensure pgcrypto is enabled for the create_employee function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. RLS POLICIES FOR PROFILES
-- Allow admins to insert new profiles (if not using RPC)
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
