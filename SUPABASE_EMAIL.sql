-- ==============================================================================
-- EMAIL NOTIFICATIONS: Additional RLS Policies for contact_messages
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- Allow admins to update contact_messages status (read/replied)
CREATE POLICY "Admins can update messages"
  ON public.contact_messages FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
