-- AI Chatbot System Database Schema
-- For lux-llm-prod.vercel.app
-- This schema is designed to work with existing tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Agents table - stores chatbot configurations
-- Note: This may already exist, so we use IF NOT EXISTS
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    system_prompt TEXT NOT NULL,
    theme_config JSONB NOT NULL DEFAULT '{}', -- Theme configuration
    welcome_message TEXT,
    position VARCHAR(50) DEFAULT 'bottom-right', -- bottom-right, bottom-left, inline
    chat_bubble_style VARCHAR(50) DEFAULT 'rounded', -- rounded, square
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Conversations table - tracks chat sessions
-- Note: This table already exists, so we'll add missing columns if needed
DO $$ 
BEGIN
    -- Add columns that might not exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'session_id') THEN
        ALTER TABLE conversations ADD COLUMN session_id VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'user_identifier') THEN
        ALTER TABLE conversations ADD COLUMN user_identifier VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'started_at') THEN
        ALTER TABLE conversations ADD COLUMN started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'ended_at') THEN
        ALTER TABLE conversations ADD COLUMN ended_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'total_messages') THEN
        ALTER TABLE conversations ADD COLUMN total_messages INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'session_duration_seconds') THEN
        ALTER TABLE conversations ADD COLUMN session_duration_seconds INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'metadata') THEN
        ALTER TABLE conversations ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
    
    -- Make session_id unique if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'session_id') THEN
        -- Try to add unique constraint, ignore if it fails
        BEGIN
            ALTER TABLE conversations ADD CONSTRAINT conversations_session_id_unique UNIQUE (session_id);
        EXCEPTION
            WHEN duplicate_object THEN
                -- Constraint already exists, ignore
                NULL;
        END;
    END IF;
END $$;

-- 3. Messages table - stores individual chat messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL, -- We'll add the foreign key constraint later if needed
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}' -- Message-specific data (e.g., query type, sentiment)
);

-- 4. Analytics table - aggregated statistics
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL, -- We'll add the foreign key constraint later if needed
    date DATE NOT NULL,
    conversations_count INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    avg_session_length_seconds INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    top_queries JSONB DEFAULT '[]', -- Array of {query: string, count: number}
    conversion_events INTEGER DEFAULT 0, -- CTA clicks, form submissions, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(agent_id, date)
);

-- 5. Conversion events table - tracks user actions
CREATE TABLE IF NOT EXISTS conversion_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL, -- We'll add the foreign key constraint later if needed
    agent_id UUID NOT NULL, -- We'll add the foreign key constraint later if needed
    event_type VARCHAR(100) NOT NULL, -- 'cta_click', 'form_submit', 'purchase', etc.
    event_data JSONB DEFAULT '{}', -- Event-specific data
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_agent_date ON analytics(agent_id, date);
CREATE INDEX IF NOT EXISTS idx_conversion_events_agent_id ON conversion_events(agent_id);

-- Full-text search on messages for query analysis
CREATE INDEX IF NOT EXISTS idx_messages_content_fts ON messages USING gin(to_tsvector('english', content));

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to agents table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_agents_updated_at') THEN
        CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Function to update analytics when conversations end
CREATE OR REPLACE FUNCTION update_analytics_on_conversation_end()
RETURNS TRIGGER AS $$
DECLARE
    session_duration INTEGER;
    total_messages INTEGER;
    top_queries JSONB;
BEGIN
    -- Calculate session duration
    session_duration := EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
    
    -- Get total messages for this conversation
    SELECT COUNT(*) INTO total_messages 
    FROM messages 
    WHERE conversation_id = NEW.id;
    
    -- Get top queries (simplified - you might want more sophisticated analysis)
    SELECT jsonb_agg(
        jsonb_build_object(
            'query', LEFT(content, 100),
            'count', 1
        )
    ) INTO top_queries
    FROM messages 
    WHERE conversation_id = NEW.id
    AND role = 'user';
    
    -- Insert or update analytics
    INSERT INTO analytics (agent_id, date, conversations_count, total_messages, avg_session_length_seconds, top_queries)
    VALUES (NEW.agent_id, DATE(NEW.ended_at), 1, total_messages, session_duration, top_queries)
    ON CONFLICT (agent_id, date) 
    DO UPDATE SET
        conversations_count = analytics.conversations_count + 1,
        total_messages = analytics.total_messages + total_messages,
        avg_session_length_seconds = (
            (analytics.avg_session_length_seconds * (analytics.conversations_count - 1) + session_duration) / 
            analytics.conversations_count
        ),
        top_queries = analytics.top_queries || top_queries;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to conversations table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_update_analytics') THEN
        CREATE TRIGGER trigger_update_analytics 
            AFTER UPDATE OF ended_at ON conversations 
            FOR EACH ROW 
            WHEN (OLD.ended_at IS NULL AND NEW.ended_at IS NOT NULL)
            EXECUTE FUNCTION update_analytics_on_conversation_end();
    END IF;
END $$;

-- Row Level Security (RLS) policies
-- Enable RLS on tables that support it
DO $$
BEGIN
    -- Enable RLS on agents if not already enabled
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agents' AND row_security = 'YES') THEN
        ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on conversations if not already enabled
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversations' AND row_security = 'YES') THEN
        ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on messages if not already enabled
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages' AND row_security = 'YES') THEN
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on analytics if not already enabled
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics' AND row_security = 'YES') THEN
        ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on conversion_events if not already enabled
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversion_events' AND row_security = 'YES') THEN
        ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
    -- Drop existing policies on agents
    DROP POLICY IF EXISTS "Users can view own agents" ON agents;
    DROP POLICY IF EXISTS "Users can insert own agents" ON agents;
    DROP POLICY IF EXISTS "Users can update own agents" ON agents;
    DROP POLICY IF EXISTS "Users can delete own agents" ON agents;
    
    -- Drop existing policies on conversations
    DROP POLICY IF EXISTS "Users can view conversations for own agents" ON conversations;
    DROP POLICY IF EXISTS "Users can insert conversations for own agents" ON conversations;
    
    -- Drop existing policies on messages
    DROP POLICY IF EXISTS "Users can view messages for own agents" ON messages;
    DROP POLICY IF EXISTS "Users can insert messages for own agents" ON messages;
    
    -- Drop existing policies on analytics
    DROP POLICY IF EXISTS "Users can view analytics for own agents" ON analytics;
    
    -- Drop existing policies on conversion_events
    DROP POLICY IF EXISTS "Users can view conversion events for own agents" ON conversion_events;
    
    -- Drop existing public policies
    DROP POLICY IF EXISTS "Public can view conversations for active agents" ON conversations;
    DROP POLICY IF EXISTS "Public can view messages for active agents" ON messages;
END $$;

-- Create new RLS policies
-- Agents: Users can only see their own agents
CREATE POLICY "Users can view own agents" ON agents
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own agents" ON agents
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own agents" ON agents
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete own agents" ON agents
    FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Conversations: Users can only see conversations for their agents
CREATE POLICY "Users can view conversations for own agents" ON conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = conversations.agent_id 
            AND agents.user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can insert conversations for own agents" ON conversations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = conversations.agent_id 
            AND agents.user_id = auth.jwt() ->> 'sub'
        )
    );

-- Messages: Users can only see messages for their agents' conversations
CREATE POLICY "Users can view messages for own agents" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations c
            JOIN agents a ON c.agent_id = a.id
            WHERE c.id = messages.conversation_id
            AND a.user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can insert messages for own agents" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM conversations c
            JOIN agents a ON c.agent_id = a.id
            WHERE c.id = messages.conversation_id
            AND a.user_id = auth.jwt() ->> 'sub'
        )
    );

-- Analytics: Users can only see analytics for their agents
CREATE POLICY "Users can view analytics for own agents" ON analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = analytics.agent_id 
            AND agents.user_id = auth.jwt() ->> 'sub'
        )
    );

-- Conversion events: Users can only see events for their agents
CREATE POLICY "Users can view conversion events for own agents" ON conversion_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = conversion_events.agent_id 
            AND agents.user_id = auth.jwt() ->> 'sub'
        )
    );

-- Public access for widget.js and embed routes (read-only for conversations and messages)
CREATE POLICY "Public can view conversations for active agents" ON conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agents 
            WHERE agents.id = conversations.agent_id 
            AND agents.is_active = true
        )
    );

CREATE POLICY "Public can view messages for active agents" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations c
            JOIN agents a ON c.agent_id = a.id
            WHERE c.id = messages.conversation_id
            AND a.is_active = true
        )
    );

-- Insert sample data for testing (only if agents table is empty)
INSERT INTO agents (id, user_id, name, description, system_prompt, theme_config, welcome_message, position, chat_bubble_style)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    'user_30shPWf4HvFww46eVFzpRn3usU0',
    'Customer Support Bot',
    'AI-powered customer support chatbot',
    'You are a helpful customer support assistant. Help users with their questions and provide excellent service.',
    '{"primaryColor": "#00ff00", "backgroundColor": "#1a1a1a", "textColor": "#ffffff", "borderRadius": "rounded-2xl"}',
    'Hello! How can I help you today?',
    'bottom-right',
    'rounded'
WHERE NOT EXISTS (SELECT 1 FROM agents LIMIT 1);
