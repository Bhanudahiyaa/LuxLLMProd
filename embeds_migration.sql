-- Create embeds table for storing embed configurations
CREATE TABLE IF NOT EXISTS public.embeds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    embed_code TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL, -- Clerk user ID
    name TEXT NOT NULL,
    description TEXT,
    agent_config JSONB NOT NULL, -- Store all agent configuration as JSON
    max_requests_per_hour INTEGER DEFAULT 100,
    max_requests_per_day INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_embeds_user_id ON public.embeds(user_id);
CREATE INDEX IF NOT EXISTS idx_embeds_embed_code ON public.embeds(embed_code);
CREATE INDEX IF NOT EXISTS idx_embeds_created_at ON public.embeds(created_at DESC);

-- Enable RLS
ALTER TABLE public.embeds ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own embeds" ON public.embeds
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own embeds" ON public.embeds
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own embeds" ON public.embeds
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete their own embeds" ON public.embeds
    FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Public read access for active embeds (for embed script generation)
CREATE POLICY "Public can view active embeds" ON public.embeds
    FOR SELECT USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_embeds_updated_at 
    BEFORE UPDATE ON public.embeds 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.embeds TO authenticated;
GRANT SELECT ON public.embeds TO anon; -- Allow public read access for embed scripts
