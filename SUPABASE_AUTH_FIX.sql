-- ==============================================================================
-- 1. Automate Profile Creation on Sign Up
-- ==============================================================================

-- Create a function that inserts a row into public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, loyalty_points)
  values (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.email, 
    0
  );
  return new;
end;
$$;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==============================================================================
-- 2. Optional: Relax RLS for direct inserts (Plan B)
-- ==============================================================================
-- If you prefer NOT to use a trigger, you can allow anyone to insert a profile
-- if their ID matches the one being inserted (but this still requires some auth context).
-- The trigger above is the recommended "one-and-done" fix!
