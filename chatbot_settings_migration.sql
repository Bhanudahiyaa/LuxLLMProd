-- Create chatbot_settings table for UI customization
CREATE TABLE IF NOT EXISTS public.chatbot_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID
    name TEXT DEFAULT 'My Chatbot',
    avatar_url TEXT,
    chat_bg TEXT DEFAULT '#ffffff',
    border_color TEXT DEFAULT '#000000',
    user_msg_color TEXT DEFAULT '#3b82f6',
    bot_msg_color TEXT DEFAULT '#f3f4f6',
    system_prompt TEXT DEFAULT 'You are a helpful assistant.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_chatbot_settings_user_id ON public.chatbot_settings(user_id);

-- Enable RLS
ALTER TABLE public.chatbot_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own chatbot settings" ON public.chatbot_settings
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own chatbot settings" ON public.chatbot_settings
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own chatbot settings" ON public.chatbot_settings
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete their own chatbot settings" ON public.chatbot_settings
    FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_chatbot_settings_updated_at 
    BEFORE UPDATE ON public.chatbot_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.chatbot_settings TO authenticated;
