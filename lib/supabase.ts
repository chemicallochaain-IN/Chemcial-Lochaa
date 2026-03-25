import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's import.meta.env
// We check for both VITE_ and NEXT_PUBLIC_ prefixes to be compatible with Vercel's auto-generated env vars
// We add a fallback '|| {}' because in some runtime environments import.meta.env might be undefined initially
const env = (import.meta as any).env || {};

export const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase Environment Variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Provide fallbacks to prevent the app from crashing completely if variables are missing
// Requests will fail gracefully instead of a blank screen
export const supabase = createClient(
  supabaseUrl || 'https://mrphakgvwefkknalkalj.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycGhha2d2d2Vma2tuYWxrYWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNTU4NDgsImV4cCI6MjA4NjczMTg0OH0._AmkNzbZj8yHPYPj4HJaRD0pshyBEibsf3V1VPR_Ad4'
);