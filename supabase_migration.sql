-- LuxLLM Supabase Migration
-- This migration creates the core tables for the AI chatbot SaaS platform
-- with Row Level Security (RLS) policies for Clerk authentication

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Clerk user ID (stored as text)
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    heading VARCHAR(500),
    subheading TEXT,
    system_prompt TEXT,
    chat_bg_color VARCHAR(7) DEFAULT '#ffffff',
    chat_border_color VARCHAR(7) DEFAULT '#e5e7eb',
    user_msg_color VARCHAR(7) DEFAULT '#3b82f6',
    bot_msg_color VARCHAR(7) DEFAULT '#f3f4f6',
    chat_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    bot_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON public.agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON public.conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON public.conversations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for agents table
-- Users can only see, insert, update, and delete their own agents
CREATE POLICY "Users can view their own agents" ON public.agents
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own agents" ON public.agents
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own agents" ON public.agents
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete their own agents" ON public.agents
    FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Create RLS policies for conversations table
-- Users can only see conversations for their own agents
CREATE POLICY "Users can view conversations for their agents" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE agents.id = conversations.agent_id 
            AND agents.user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can insert conversations for their agents" ON public.conversations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE agents.id = conversations.agent_id 
            AND agents.user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can update conversations for their agents" ON public.conversations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE agents.id = conversations.agent_id 
            AND agents.user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can delete conversations for their agents" ON public.conversations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.agents 
            WHERE agents.id = conversations.agent_id 
            AND agents.user_id = auth.jwt() ->> 'sub'
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on agents table
CREATE TRIGGER update_agents_updated_at 
    BEFORE UPDATE ON public.agents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.agents TO authenticated;
GRANT ALL ON public.conversations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Optional: Create a view for agent statistics
CREATE OR REPLACE VIEW public.agent_stats AS
SELECT 
    a.id,
    a.name,
    a.user_id,
    COUNT(c.id) as total_conversations,
    MAX(c.created_at) as last_conversation_at,
    a.created_at,
    a.updated_at
FROM public.agents a
LEFT JOIN public.conversations c ON a.id = c.agent_id
GROUP BY a.id, a.name, a.user_id, a.created_at, a.updated_at;

-- Grant access to the view
GRANT SELECT ON public.agent_stats TO authenticated;
