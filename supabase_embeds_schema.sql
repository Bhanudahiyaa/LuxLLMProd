-- Public Embeds Table Schema
-- This table stores embed configurations for public chatbot widgets

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create public_embeds table
CREATE TABLE IF NOT EXISTS public.public_embeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID who created the embed
    embed_code VARCHAR(255) UNIQUE NOT NULL, -- Unique embed identifier
    name VARCHAR(255) NOT NULL, -- Display name for the embed
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    max_requests_per_hour INTEGER DEFAULT 100, -- Rate limiting
    max_requests_per_day INTEGER DEFAULT 1000,
    total_requests INTEGER DEFAULT 0,
    last_request_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create public_conversations table for embed conversations
CREATE TABLE IF NOT EXISTS public.public_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    embed_id UUID NOT NULL REFERENCES public.public_embeds(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL, -- Unique session identifier
    visitor_ip VARCHAR(45), -- Store IP for abuse prevention
    user_agent TEXT, -- Store user agent for analytics
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_messages INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Create public_messages table for embed messages
CREATE TABLE IF NOT EXISTS public.public_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.public_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tokens_used INTEGER DEFAULT 0 -- Track AI usage
);

-- Create public_analytics table for embed analytics
CREATE TABLE IF NOT EXISTS public.public_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    embed_id UUID NOT NULL REFERENCES public.public_embeds(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(embed_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_public_embeds_embed_code ON public.public_embeds(embed_code);
CREATE INDEX IF NOT EXISTS idx_public_embeds_user_id ON public.public_embeds(user_id);
CREATE INDEX IF NOT EXISTS idx_public_embeds_agent_id ON public.public_embeds(agent_id);
CREATE INDEX IF NOT EXISTS idx_public_conversations_embed_id ON public.public_conversations(embed_id);
CREATE INDEX IF NOT EXISTS idx_public_conversations_session_id ON public.public_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_public_messages_conversation_id ON public.public_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_public_analytics_embed_id ON public.public_analytics(embed_id);
CREATE INDEX IF NOT EXISTS idx_public_analytics_date ON public.public_analytics(date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.public_embeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public_embeds
CREATE POLICY "Users can view their own embeds" ON public.public_embeds
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own embeds" ON public.public_embeds
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own embeds" ON public.public_embeds
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete their own embeds" ON public.public_embeds
    FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Public read access for active embeds (for the widget to function)
CREATE POLICY "Public can view active embeds" ON public.public_embeds
    FOR SELECT USING (is_active = true);

-- RLS Policies for public_conversations
CREATE POLICY "Users can view conversations from their embeds" ON public.public_conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.public_embeds 
            WHERE public_embeds.id = public_conversations.embed_id 
            AND public_embeds.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Public can create conversations" ON public.public_conversations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update conversations" ON public.public_conversations
    FOR UPDATE USING (true);

-- RLS Policies for public_messages
CREATE POLICY "Users can view messages from their embeds" ON public.public_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.public_embeds 
            JOIN public.public_conversations ON public_embeds.id = public_conversations.embed_id
            WHERE public_conversations.id = public_messages.conversation_id 
            AND public_embeds.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Public can create messages" ON public.public_messages
    FOR INSERT WITH CHECK (true);

-- RLS Policies for public_analytics
CREATE POLICY "Users can view analytics from their embeds" ON public.public_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.public_embeds 
            WHERE public_embeds.id = public_analytics.embed_id 
            AND public_embeds.user_id = (auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Public can create analytics" ON public.public_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update analytics" ON public.public_analytics
    FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_public_embeds_updated_at 
    BEFORE UPDATE ON public.public_embeds 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_analytics_updated_at 
    BEFORE UPDATE ON public.public_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to track embed usage
CREATE OR REPLACE FUNCTION track_embed_usage(embed_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    embed_record RECORD;
    current_hour INTEGER;
    current_day INTEGER;
    hour_requests INTEGER;
    day_requests INTEGER;
BEGIN
    -- Get embed record
    SELECT * INTO embed_record FROM public.public_embeds WHERE id = embed_uuid;
    
    IF NOT FOUND OR NOT embed_record.is_active THEN
        RETURN FALSE;
    END IF;
    
    -- Check hourly rate limit
    current_hour := EXTRACT(hour FROM NOW());
    SELECT COUNT(*) INTO hour_requests 
    FROM public.public_conversations 
    WHERE embed_id = embed_uuid 
    AND EXTRACT(hour FROM created_at) = current_hour;
    
    IF hour_requests >= embed_record.max_requests_per_hour THEN
        RETURN FALSE;
    END IF;
    
    -- Check daily rate limit
    current_day := EXTRACT(doy FROM NOW());
    SELECT COUNT(*) INTO day_requests 
    FROM public.public_conversations 
    WHERE embed_id = embed_uuid 
    AND EXTRACT(doy FROM created_at) = current_day;
    
    IF day_requests >= embed_record.max_requests_per_day THEN
        RETURN FALSE;
    END IF;
    
    -- Update embed usage
    UPDATE public.public_embeds 
    SET total_requests = total_requests + 1,
        last_request_at = NOW()
    WHERE id = embed_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
