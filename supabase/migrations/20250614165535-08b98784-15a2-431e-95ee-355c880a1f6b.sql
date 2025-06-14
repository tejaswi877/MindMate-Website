
-- Create emergency_contacts table for user's personal emergency contacts
CREATE TABLE public.emergency_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone_number text NOT NULL,
  relationship text,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own emergency contacts" 
  ON public.emergency_contacts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emergency contacts" 
  ON public.emergency_contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency contacts" 
  ON public.emergency_contacts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emergency contacts" 
  ON public.emergency_contacts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Clear all existing user data for fresh start
TRUNCATE TABLE public.chat_messages CASCADE;
TRUNCATE TABLE public.chat_sessions CASCADE;
TRUNCATE TABLE public.journal_entries CASCADE;
TRUNCATE TABLE public.mood_entries CASCADE;
TRUNCATE TABLE public.reminders CASCADE;
TRUNCATE TABLE public.user_badges CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
