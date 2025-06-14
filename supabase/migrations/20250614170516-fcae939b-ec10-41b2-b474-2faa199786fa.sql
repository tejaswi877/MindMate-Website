
-- Clear all existing user data for complete reset
TRUNCATE TABLE public.emergency_contacts CASCADE;
TRUNCATE TABLE public.chat_messages CASCADE;
TRUNCATE TABLE public.chat_sessions CASCADE;
TRUNCATE TABLE public.journal_entries CASCADE;
TRUNCATE TABLE public.mood_entries CASCADE;
TRUNCATE TABLE public.reminders CASCADE;
TRUNCATE TABLE public.user_badges CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
