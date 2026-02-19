-- ==============================================================================
-- Admin Write Policies for Categories Table
-- ==============================================================================
-- The existing SUPABASE_ADMIN.sql only added write policies for menu_items.
-- This migration adds insert/update/delete policies for categories so that
-- admin users can manage categories from the dashboard.

-- Allow admins to insert new categories
CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Allow admins to update existing categories
CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Allow admins to delete categories
CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
