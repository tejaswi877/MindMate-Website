-- Clear all user data in correct order to avoid foreign key violations
-- Delete chat_messages first (child table)
DELETE FROM public.chat_messages;

-- Delete other dependent tables
DELETE FROM public.reminders;
DELETE FROM public.emergency_contacts;
DELETE FROM public.journal_entries;
DELETE FROM public.mood_entries;
DELETE FROM public.user_badges;

-- Delete chat_sessions (parent table)
DELETE FROM public.chat_sessions;

-- Delete profiles last
DELETE FROM public.profiles;