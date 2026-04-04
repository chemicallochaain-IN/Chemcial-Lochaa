-- ==============================================================================
-- TEAM MEMBER RLS FIX
-- Run this in your Supabase SQL Editor to allow admins to manage profiles.
-- ==============================================================================

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
