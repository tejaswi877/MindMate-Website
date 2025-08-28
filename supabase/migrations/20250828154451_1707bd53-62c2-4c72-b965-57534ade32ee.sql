-- Clear all user data and reset authentication
-- Delete all profiles first
DELETE FROM public.profiles;

-- Delete all user-related data
DELETE FROM public.reminders;
DELETE FROM public.chat_sessions;
DELETE FROM public.emergency_contacts;
DELETE FROM public.journal_entries;
DELETE FROM public.mood_entries;
DELETE FROM public.user_badges;
DELETE FROM public.chat_messages;

-- Note: We cannot directly delete from auth.users as it's a protected schema
-- The admin will need to manually clear users from the Supabase dashboard
-- or we need to use the admin API