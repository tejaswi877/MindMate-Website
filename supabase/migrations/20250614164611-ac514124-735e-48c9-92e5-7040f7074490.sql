
-- Add reminder_datetime column to reminders table for specific date and time
ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS reminder_datetime timestamp with time zone;

-- Update the reminder_time column to be nullable since we'll use reminder_datetime
ALTER TABLE public.reminders 
ALTER COLUMN reminder_time DROP NOT NULL;

-- Update existing reminders to have a default reminder_datetime
UPDATE public.reminders 
SET reminder_datetime = CURRENT_DATE + reminder_time::interval 
WHERE reminder_datetime IS NULL;
