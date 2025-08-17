-- Add UI customization columns to existing agents table
-- Run this migration to add the missing UI customization fields

ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS chat_bg_color VARCHAR(7) DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS chat_border_color VARCHAR(7) DEFAULT '#e5e7eb',
ADD COLUMN IF NOT EXISTS user_msg_color VARCHAR(7) DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS bot_msg_color VARCHAR(7) DEFAULT '#f3f4f6',
ADD COLUMN IF NOT EXISTS chat_name VARCHAR(255);
