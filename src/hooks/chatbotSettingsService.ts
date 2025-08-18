import { useAuth } from "@clerk/clerk-react";
import { getAuthenticatedClient } from "@/lib/supabaseClient";

// Types for chatbot settings
export interface ChatbotSettings {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  chat_bg: string;
  border_color: string;
  user_msg_color: string;
  bot_msg_color: string;
  system_prompt: string;
  created_at: string;
  updated_at: string;
}

export interface ChatbotSettingsData {
  name: string;
  avatar_url?: string;
  chat_bg: string;
  border_color: string;
  user_msg_color: string;
  bot_msg_color: string;
  system_prompt: string;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

export function useChatbotSettingsService() {
  const { getToken, userId } = useAuth();

    // Get authenticated Supabase client
  async function getAuthenticatedSupabase() {
    const token = await getToken({ template: "supabase" });
    if (!token) {
      throw new Error("No authentication token available");
    }

    // Use the shared authenticated client
    return await getAuthenticatedClient(token);
  }

  // 1. Get user's chatbot settings
  async function getChatbotSettings(): Promise<
    ServiceResponse<ChatbotSettings>
  > {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();

      const { data, error } = await authenticatedSupabase
        .from("chatbot_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error fetching chatbot settings:", error);
        return { data: null, error: error.message };
      }

      // If no settings exist, return null (let form use its own defaults)
      if (!data) {
        return { data: null, error: null };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error fetching chatbot settings:", error);
      return { data: null, error: "Failed to fetch chatbot settings" };
    }
  }

  // 2. Save chatbot settings (create or update)
  async function saveChatbotSettings(
    settings: ChatbotSettingsData
  ): Promise<ServiceResponse<ChatbotSettings>> {
    try {
      if (!userId) {
        return { data: null, error: "User not authenticated" };
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();

      // Check if settings already exist
      const { data: existingSettings } = await authenticatedSupabase
        .from("chatbot_settings")
        .select("id")
        .eq("user_id", userId)
        .single();

      let result;

      if (existingSettings) {
        // Update existing settings
        result = await authenticatedSupabase
          .from("chatbot_settings")
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .select()
          .single();
      } else {
        // Create new settings
        result = await authenticatedSupabase
          .from("chatbot_settings")
          .insert([
            {
              ...settings,
              user_id: userId,
            },
          ])
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error("Error saving chatbot settings:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error saving chatbot settings:", error);
      return { data: null, error: "Failed to save chatbot settings" };
    }
  }

  return {
    getChatbotSettings,
    saveChatbotSettings,
  };
}
