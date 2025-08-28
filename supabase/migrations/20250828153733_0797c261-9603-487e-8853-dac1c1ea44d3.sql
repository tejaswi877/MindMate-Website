-- Disable email confirmation requirement for new signups
-- This will allow users to sign up and immediately access the application
-- without needing to confirm their email address

-- Note: This setting needs to be changed in the Supabase dashboard
-- Go to Authentication > Settings and disable "Confirm email"
-- But we can also handle this in the application logic

SELECT 1; -- Placeholder query since auth settings are managed via dashboard