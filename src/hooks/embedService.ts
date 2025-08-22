// Embed Service for managing public chatbot embeds
// This service handles creating, updating, and managing public embed configurations

import { useAuth } from "@clerk/clerk-react";
import { useClerkSupabase } from "@/lib/useClerkSupabase";

export interface EmbedConfig {
  id?: string;
  embed_code: string;
  user_id: string;
  name: string;
  description?: string;
  agent_config: {
    name: string;
    system_prompt: string;
    avatar_url?: string;
    chat_bg_color: string;
    chat_border_color: string;
    user_msg_color: string;
    bot_msg_color: string;
    welcome_message: string;
    placeholder: string;
    theme?: string;
    borderRadius?: number;
    fontSize?: number;
    fontFamily?: string;
  };
  max_requests_per_hour: number;
  max_requests_per_day: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useEmbedService() {
  const { getToken, userId } = useAuth();
  const { getSupabase } = useClerkSupabase();

  // Create a new embed
  async function createEmbed(embedConfig: Omit<EmbedConfig, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ data: EmbedConfig | null; error: string | null }> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const supabase = await getSupabase();
      
      const { data, error } = await supabase
        .from('embeds')
        .insert({
          ...embedConfig,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating embed:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error creating embed:", error);
      return { data: null, error: "Failed to create embed" };
    }
  }

  // Get embed by embed code
  async function getEmbedByCode(embedCode: string): Promise<{ data: EmbedConfig | null; error: string | null }> {
    try {
      const supabase = await getSupabase();
      
      const { data, error } = await supabase
        .from('embeds')
        .select('*')
        .eq('embed_code', embedCode)
        .eq('is_active', true)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching embed:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error fetching embed:", error);
      return { data: null, error: "Failed to fetch embed" };
    }
  }

  // Get user's embeds
  async function getUserEmbeds(): Promise<{ data: EmbedConfig[] | null; error: string | null }> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const supabase = await getSupabase();
      
      const { data, error } = await supabase
        .from('embeds')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching user embeds:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error fetching user embeds:", error);
      return { data: null, error: "Failed to fetch user embeds" };
    }
  }

  return {
    createEmbed,
    getEmbedByCode,
    getUserEmbeds,
  };
}
